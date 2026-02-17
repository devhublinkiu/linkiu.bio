<?php

namespace App\Http\Controllers\Tenant\Gastronomy;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Gastronomy\Order;
use App\Models\Tenant\Gastronomy\OrderItem;
use App\Models\Category;
use App\Models\Table;
use App\Models\Zone;
use App\Models\Tenant\Locations\Location;
use App\Http\Requests\Tenant\Gastronomy\StoreOrderRequest;
use App\Traits\ProcessesGastronomyOrders;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class POSController extends Controller
{
    use ProcessesGastronomyOrders;

    /**
     * Muestra la vista principal del POS (mapa de mesas).
     */
    public function index(Request $request): InertiaResponse
    {
        Gate::authorize('pos.view');

        /** @var \App\Models\Tenant $tenant */
        $tenant = app('currentTenant');

        $locationId = $request->input('location_id');
        if (!$locationId) {
            $mainLocation = Location::where('tenant_id', $tenant->id)->where('is_main', true)->first();
            $locationId = $mainLocation ? $mainLocation->id : Location::where('tenant_id', $tenant->id)->first()?->id;
        }

        // Verificar que la sede pertenece al tenant
        if ($locationId) {
            $locationExists = Location::where('id', $locationId)->where('tenant_id', $tenant->id)->exists();
            if (!$locationExists) {
                abort(403, 'Sede no pertenece a este negocio.');
            }
        }

        $categories = Category::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->with(['products' => function ($q) use ($tenant) {
                $q->where('tenant_id', $tenant->id)
                  ->where('is_available', true)
                  ->with(['variantGroups.options']);
            }])
            ->get();

        $zones = Zone::where('tenant_id', $tenant->id)
            ->where('location_id', $locationId)
            ->with(['tables' => function ($q) {
                $q->with(['activeOrder' => function ($q) {
                    $q->with('items')->select(
                        'gastronomy_orders.id',
                        'gastronomy_orders.table_id',
                        'gastronomy_orders.customer_name',
                        'gastronomy_orders.customer_id',
                        'gastronomy_orders.customer_phone',
                        'gastronomy_orders.total',
                        'gastronomy_orders.status',
                        'gastronomy_orders.created_at',
                        'gastronomy_orders.waiter_collected',
                        'gastronomy_orders.payment_method',
                        'gastronomy_orders.payment_proof',
                        'gastronomy_orders.payment_reference'
                    );
                }]);
            }])
            ->get();

        $today = now()->setTimezone('America/Bogota')->toDateString();
        $reservations = \App\Models\Tenant\Gastronomy\Reservation::where('tenant_id', $tenant->id)
            ->whereDate('reservation_date', $today)
            ->whereIn('status', ['pending', 'confirmed', 'seated'])
            ->with('table')
            ->get();

        return Inertia::render('Tenant/Admin/Gastronomy/POS/Index', [
            'categories' => $categories,
            'zones' => $zones,
            'reservations' => $reservations,
            'tenant' => $tenant,
            'locations' => Location::where('tenant_id', $tenant->id)->get(),
            'currentLocationId' => (int) $locationId,
            'taxSettings' => [
                'tax_name' => $tenant->settings['tax_name'] ?? 'Impuesto',
                'tax_rate' => $tenant->settings['tax_rate'] ?? 0,
                'price_includes_tax' => $tenant->settings['price_includes_tax'] ?? false,
            ],
        ]);
    }

    /**
     * Crea/actualiza un pedido desde el POS.
     */
    public function store(StoreOrderRequest $request): RedirectResponse
    {
        Gate::authorize('pos.create');

        try {
            $order = $this->storeGastronomyOrder($request, 'pending', 'POS');

            return back()->with([
                'success' => 'Pedido creado exitosamente',
                'order_id' => $order->id,
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => 'Error al procesar el pedido: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Libera una mesa manualmente (solo si no tiene orden activa pendiente de pago).
     */
    public function freeTable(Request $request, string $tenant, Table $table): RedirectResponse
    {
        Gate::authorize('pos.manage');

        /** @var \App\Models\Tenant $tenantModel */
        $tenantModel = app('currentTenant');

        if ((int) $table->tenant_id !== (int) $tenantModel->id) {
            abort(403, 'Mesa no pertenece a este negocio.');
        }

        // Seguridad: Si la mesa tiene una orden activa, cancelarla primero
        $activeOrder = $table->activeOrder;
        if ($activeOrder) {
            $activeOrder->update(['status' => 'cancelled']);
            \App\Models\Tenant\Gastronomy\OrderStatusHistory::create([
                'gastronomy_order_id' => $activeOrder->id,
                'user_id' => auth()->id(),
                'from_status' => $activeOrder->getOriginal('status'),
                'to_status' => 'cancelled',
                'notes' => 'Mesa liberada manualmente desde POS',
            ]);
        }

        $table->update(['status' => 'available']);

        return back()->with('success', 'Mesa liberada correctamente');
    }

    /**
     * Anula un item ya enviado a cocina.
     * El total de la orden se recalcula inmediatamente.
     */
    public function cancelItem(Request $request, string $tenant, int $itemId): JsonResponse
    {
        Gate::authorize('pos.manage');

        /** @var \App\Models\Tenant $tenantModel */
        $tenantModel = app('currentTenant');

        $item = OrderItem::where('id', $itemId)
            ->whereHas('order', function ($q) use ($tenantModel) {
                $q->where('tenant_id', $tenantModel->id);
            })
            ->firstOrFail();

        $order = $item->order;

        // Solo se pueden anular items de órdenes activas
        if (!in_array($order->status, ['pending', 'confirmed', 'preparing'])) {
            return response()->json(['message' => 'No se puede anular items de una orden completada o cancelada.'], 422);
        }

        try {
            DB::beginTransaction();

            // Marcar item como cancelado
            $item->update([
                'status' => 'cancelled',
                'cancelled_by' => auth()->id(),
                'cancelled_at' => now(),
            ]);

            // Recalcular totales de la orden (excluir items cancelados)
            $activeItems = $order->items()->where('status', '!=', 'cancelled')->get();
            $newSubtotal = $activeItems->sum('total');

            $taxRate = $tenantModel->settings['tax_rate'] ?? 0;
            $includesTax = $tenantModel->settings['price_includes_tax'] ?? false;

            if ($includesTax) {
                $newTotal = $newSubtotal;
            } else {
                $newTotal = $newSubtotal * (1 + $taxRate / 100);
            }

            $order->update([
                'subtotal' => $newSubtotal,
                'total' => $newTotal,
            ]);

            // Notificar cocina del cambio
            \App\Events\OrderStatusUpdated::dispatch($order->fresh(), "Item '{$item->product_name}' fue anulado.");

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Item '{$item->product_name}' anulado correctamente.",
                'new_total' => $newTotal,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al anular item: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Verifica y completa un pago registrado por el mesero.
     */
    public function verifyWaiterPayment(Request $request, string $tenant, int $order): JsonResponse
    {
        Gate::authorize('pos.manage');

        /** @var \App\Models\Tenant $tenantModel */
        $tenantModel = app('currentTenant');

        $orderModel = Order::where('id', $order)
            ->where('tenant_id', $tenantModel->id)
            ->where('waiter_collected', true)
            ->firstOrFail();

        try {
            DB::beginTransaction();

            $oldStatus = $orderModel->status;
            $orderModel->update(['status' => 'completed']);

            // Liberar mesa
            if ($orderModel->table_id) {
                Table::where('id', $orderModel->table_id)->update(['status' => 'available']);
            }

            \App\Models\Tenant\Gastronomy\OrderStatusHistory::create([
                'gastronomy_order_id' => $orderModel->id,
                'user_id' => auth()->id(),
                'from_status' => $oldStatus,
                'to_status' => 'completed',
                'notes' => 'Pago verificado por caja (cobrado por mesero)',
            ]);

            DB::commit();

            // Notificar al mesero vía Echo que el pago fue verificado
            \App\Events\OrderStatusUpdated::dispatch($orderModel->fresh(), 'payment_verified');

            return response()->json([
                'success' => true,
                'message' => 'Pago verificado y orden completada.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}