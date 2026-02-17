<?php

namespace App\Http\Controllers\Tenant\Admin\Gastronomy;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\Gastronomy\StoreWaiterOrderRequest;
use App\Models\Category;
use App\Models\Zone;
use App\Models\Tenant\Locations\Location;
use App\Models\Tenant\Payments\PaymentMethod;
use App\Models\Tenant\Payments\BankAccount;
use App\Models\Tenant\Gastronomy\OrderStatusHistory;
use App\Traits\ProcessesGastronomyOrders;
use App\Traits\StoresImageAsWebp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class WaiterController extends Controller
{
    use ProcessesGastronomyOrders, StoresImageAsWebp;

    /**
     * Display the waiter panel.
     */
    public function index(Request $request): InertiaResponse
    {
        Gate::authorize('waiters.view');

        /** @var \App\Models\Tenant $tenant */
        $tenant = app('currentTenant');

        // Resolver location_id
        $user = auth()->user();
        $pivot = $user->tenants->find($tenant->id)?->pivot;
        $locationId = $request->input('location_id') ?? ($pivot ? $pivot->location_id : null);

        if (!$locationId) {
            $mainLocation = Location::where('tenant_id', $tenant->id)->where('is_main', true)->first();
            $locationId = $mainLocation?->id ?? Location::where('tenant_id', $tenant->id)->first()?->id;
        }

        // Validar sede vs tenant
        if ($locationId) {
            $exists = Location::where('id', $locationId)->where('tenant_id', $tenant->id)->exists();
            if (!$exists) {
                $locationId = Location::where('tenant_id', $tenant->id)->first()?->id;
            }
        }

        $categories = Category::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->with(['products' => function ($q) use ($tenant) {
                $q->where('tenant_id', $tenant->id)
                    ->where('is_available', true)
                    ->where('status', 'active')
                    ->with(['variantGroups.options']);
            }])
            ->get();

        $zones = Zone::where('tenant_id', $tenant->id)
            ->when($locationId, fn($q) => $q->where('location_id', $locationId))
            ->with(['tables' => function ($q) {
                $q->with(['activeOrder' => function ($q) {
                    $q->with('items')->select(
                        'gastronomy_orders.id',
                        'gastronomy_orders.table_id',
                        'gastronomy_orders.customer_name',
                        'gastronomy_orders.total',
                        'gastronomy_orders.status',
                        'gastronomy_orders.created_at'
                    );
                }]);
            }])
            ->get();

        $locations = Location::where('tenant_id', $tenant->id)->select('id', 'name')->get();

        // Métodos de pago activos (para pre-cuenta del mesero)
        $paymentMethods = PaymentMethod::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->when($locationId, fn($q) => $q->where(function($q) use ($locationId) {
                $q->whereNull('location_id')->orWhere('location_id', $locationId);
            }))
            ->get();

        $bankAccounts = BankAccount::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->when($locationId, fn($q) => $q->where(function($q) use ($locationId) {
                $q->whereNull('location_id')->orWhere('location_id', $locationId);
            }))
            ->get();

        return Inertia::render('Tenant/Admin/Gastronomy/Waiters/Index', [
            'categories' => $categories,
            'zones' => $zones,
            'tenant' => $tenant,
            'locations' => $locations,
            'currentLocationId' => $locationId ? (int) $locationId : null,
            'taxSettings' => [
                'tax_name' => $tenant->settings['tax_name'] ?? 'Impuesto',
                'tax_rate' => $tenant->settings['tax_rate'] ?? 0,
                'price_includes_tax' => $tenant->settings['price_includes_tax'] ?? false,
            ],
            'paymentMethods' => $paymentMethods,
            'bankAccounts' => $bankAccounts,
        ]);
    }

    /**
     * Waiter submits payment proof for an order (pre-cuenta flow).
     */
    public function submitPaymentProof(Request $request): JsonResponse
    {
        Gate::authorize('waiters.order');

        $tenant = app('currentTenant');

        $validated = $request->validate([
            'order_id' => 'required|integer',
            'payment_method' => 'required|string|in:cash,bank_transfer,dataphone',
            'payment_reference' => 'nullable|string|max:255',
            'payment_proof' => 'nullable|file|image|max:5120', // max 5MB
        ]);

        $order = \App\Models\Tenant\Gastronomy\Order::where('tenant_id', $tenant->id)
            ->findOrFail($validated['order_id']);

        try {
            $proofPath = null;
            if ($request->hasFile('payment_proof')) {
                $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenant->slug ?? ''));
                $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenant->id) . '/payment-proofs';
                $proofPath = $this->storeImageAsWebp($request->file('payment_proof'), $basePath);
                $this->registerMedia($proofPath, 'bunny');
            }

            $order->update([
                'payment_method' => $validated['payment_method'],
                'payment_reference' => $validated['payment_reference'] ?? null,
                'payment_proof' => $proofPath,
                'waiter_collected' => true,
            ]);

            OrderStatusHistory::create([
                'gastronomy_order_id' => $order->id,
                'user_id' => auth()->id(),
                'from_status' => $order->status,
                'to_status' => $order->status,
                'notes' => "Pago registrado por mesero — método: {$validated['payment_method']}",
            ]);

            // Notificar al POS en tiempo real que el mesero cobró
            \App\Events\OrderStatusUpdated::dispatch($order->fresh(), 'waiter_collected');

            return response()->json([
                'success' => true,
                'message' => 'Pago registrado. Caja lo verificará.',
            ]);
        } catch (\Exception $e) {
            if (isset($proofPath)) {
                Storage::disk('bunny')->delete($proofPath);
            }
            return response()->json([
                'message' => 'Error al registrar el pago: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a waiter order (validated via FormRequest).
     */
    public function storeOrder(StoreWaiterOrderRequest $request): JsonResponse
    {
        try {
            // Waiter orders go directly to 'confirmed' (ready for kitchen)
            $order = $this->storeGastronomyOrder($request, 'confirmed', 'Panel de Meseros');

            return response()->json([
                'success' => true,
                'message' => 'Pedido enviado a cocina correctamente',
                'order_id' => $order->id,
                'total' => $order->total,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el pedido: ' . $e->getMessage(),
            ], 500);
        }
    }
}
