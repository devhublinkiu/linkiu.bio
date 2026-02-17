<?php

namespace App\Http\Controllers\Tenant\Admin\Gastronomy;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\Gastronomy\UpdateOrderStatusRequest;
use App\Models\Tenant\Gastronomy\Order;
use App\Models\Tenant\Gastronomy\OrderStatusHistory;
use App\Models\Tenant\Locations\Location;
use App\Services\InfobipService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class OrderController extends Controller
{
    /**
     * Listado de pedidos (Kanban o Historial).
     */
    public function index(Request $request): InertiaResponse
    {
        Gate::authorize('orders.view');

        /** @var \App\Models\Tenant $tenant */
        $tenant = app('currentTenant');
        $isHistory = $request->boolean('history');
        $locationId = $request->integer('location_id') ?: null;

        // Validar que la sede pertenezca al tenant
        if ($locationId) {
            $validLocation = Location::where('id', $locationId)
                ->where('tenant_id', $tenant->id)
                ->exists();
            if (!$validLocation) {
                $locationId = null;
            }
        }

        $query = Order::with(['items.product', 'table', 'location', 'creator'])
            ->where('tenant_id', $tenant->id)
            ->when($locationId, fn ($q) => $q->where('location_id', $locationId))
            ->orderBy('created_at', 'desc');

        if ($isHistory) {
            $query->whereIn('status', ['completed', 'cancelled']);
            $orders = $query->paginate(20)->withQueryString();
        } else {
            // Vista activa: paginar para evitar cargar 100+ pedidos
            $orders = (clone $query)
                ->whereIn('status', ['pending', 'confirmed', 'preparing', 'ready', 'completed'])
                ->paginate(60)
                ->withQueryString();
        }

        $locations = Location::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Tenant/Admin/Gastronomy/Orders/Index', [
            'orders'            => $orders,
            'tenant'            => $tenant,
            'isHistory'         => $isHistory,
            'locations'         => $locations,
            'currentLocationId' => $locationId,
        ]);
    }

    /**
     * Detalle de un pedido (JSON) — para el modal de detalle.
     */
    public function show(string $tenant, int $order): JsonResponse
    {
        Gate::authorize('orders.view');

        /** @var \App\Models\Tenant $tenantModel */
        $tenantModel = app('currentTenant');

        $orderModel = Order::where('id', $order)
            ->where('tenant_id', $tenantModel->id)
            ->firstOrFail();

        $orderModel->load(['items.product', 'table', 'location', 'creator', 'statusHistory.user']);

        return response()->json($orderModel);
    }

    /**
     * Actualiza el estado de un pedido (con validación de transiciones).
     */
    public function updateStatus(UpdateOrderStatusRequest $request, string $tenant, int $order, InfobipService $infobip): RedirectResponse
    {
        Gate::authorize('orders.update');

        /** @var \App\Models\Tenant $tenantModel */
        $tenantModel = app('currentTenant');

        $orderModel = Order::where('id', $order)
            ->where('tenant_id', $tenantModel->id)
            ->firstOrFail();

        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $oldStatus = $orderModel->status;
            $newStatus = $validated['status'];

            $orderModel->update(['status' => $newStatus]);

            OrderStatusHistory::create([
                'gastronomy_order_id' => $orderModel->id,
                'user_id'            => auth()->id(),
                'from_status'        => $oldStatus,
                'to_status'          => $newStatus,
                'notes'              => $validated['comment'] ?? null,
            ]);

            // Liberar mesa si la orden se completa o cancela
            if (in_array($newStatus, ['completed', 'cancelled']) && $orderModel->table_id) {
                $orderModel->table?->update(['status' => 'available']);
            }

            \App\Events\OrderStatusUpdated::dispatch($orderModel->fresh(), $validated['comment'] ?? null);

            DB::commit();

            // WhatsApp al cliente por cambio de estado
            $customerPhone = $orderModel->customer_phone ? trim((string) $orderModel->customer_phone) : null;
            if ($customerPhone && $tenantModel->hasFeature('whatsapp') && $oldStatus !== $newStatus) {
                $placeholders = [
                    $orderModel->customer_name ?? 'Cliente',
                    (string) $orderModel->id,
                    $tenantModel->name,
                ];
                $buttonParam = "{$tenantModel->slug}/sedes";

                if ($newStatus === 'confirmed' || $newStatus === 'preparing') {
                    $infobip->sendTemplate($customerPhone, 'linkiu_order_confirmed_v1', $placeholders, $buttonParam);
                } elseif ($newStatus === 'ready') {
                    $infobip->sendTemplate($customerPhone, 'linkiu_order_ready_v1', $placeholders, $buttonParam);
                } elseif ($newStatus === 'completed') {
                    $infobip->sendTemplate($customerPhone, 'linkiu_order_completed_v1', $placeholders, null);
                } elseif ($newStatus === 'cancelled') {
                    $infobip->sendTemplate($customerPhone, 'linkiu_order_cancelled_v1', $placeholders, null);
                }
            }

            return redirect()->back()->with('success', 'Estado actualizado correctamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error al actualizar estado: ' . $e->getMessage());
        }
    }
}
