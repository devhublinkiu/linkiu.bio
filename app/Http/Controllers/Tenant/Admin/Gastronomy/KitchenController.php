<?php

namespace App\Http\Controllers\Tenant\Admin\Gastronomy;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Gastronomy\Order;
use App\Models\Tenant\Gastronomy\OrderItem;
use App\Models\Tenant\Gastronomy\OrderStatusHistory;
use App\Models\Tenant\Locations\Location;
use App\Http\Requests\Tenant\Admin\Gastronomy\UpdateKitchenOrderStatusRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class KitchenController extends Controller
{
    /**
     * Transiciones de estado válidas para el KDS.
     */
    private const VALID_TRANSITIONS = [
        'confirmed' => ['preparing', 'ready'],
        'preparing' => ['ready'],
    ];

    /**
     * Resuelve y valida el location_id contra el tenant actual.
     */
    private function resolveLocationId(Request $request): ?int
    {
        /** @var \App\Models\Tenant $tenant */
        $tenant = app('currentTenant');
        $user = auth()->user();

        $pivot = $user->tenants->find($tenant->id)?->pivot;
        $locationId = $request->input('location_id') ?? ($pivot ? $pivot->location_id : null);

        // Validar que la sede pertenece al tenant
        if ($locationId) {
            $exists = Location::where('id', $locationId)->where('tenant_id', $tenant->id)->exists();
            if (!$exists) {
                $locationId = null;
            }
        }

        return $locationId ? (int) $locationId : null;
    }

    /**
     * Query compartida para obtener órdenes de cocina.
     */
    private function getKitchenOrders(?int $locationId, ?string $statusFilter = null): Collection
    {
        /** @var \App\Models\Tenant $tenant */
        $tenant = app('currentTenant');

        return Order::with(['items.product', 'table', 'creator'])
            ->where('tenant_id', $tenant->id)
            ->when($statusFilter, function ($q) use ($statusFilter) {
                $q->where('status', $statusFilter);
            }, function ($q) {
                $q->whereIn('status', ['confirmed', 'preparing']);
            })
            ->orderBy('created_at', 'asc')
            ->when($locationId, fn($q) => $q->where('location_id', $locationId))
            ->get();
    }

    /**
     * Muestra el monitor de cocina (KDS).
     */
    public function index(Request $request, string $tenant): InertiaResponse
    {
        Gate::authorize('kitchen.view');

        $tenantModel = app('currentTenant');
        $locationId = $this->resolveLocationId($request);
        $orders = $this->getKitchenOrders($locationId);

        $locations = Location::where('tenant_id', $tenantModel->id)->select('id', 'name')->get();

        return Inertia::render('Tenant/Admin/Gastronomy/Kitchen/Index', [
            'orders' => $orders,
            'tenant' => $tenantModel,
            'currentLocationId' => $locationId,
            'locations' => $locations,
        ]);
    }

    /**
     * Retorna órdenes de cocina en JSON (para polling fallback).
     */
    public function getOrders(Request $request, string $tenant): JsonResponse
    {
        Gate::authorize('kitchen.view');

        $validated = $request->validate([
            'status' => 'nullable|string|in:confirmed,preparing,ready',
        ]);

        $locationId = $this->resolveLocationId($request);
        $statusFilter = $validated['status'] ?? null;
        $orders = $this->getKitchenOrders($locationId, $statusFilter);

        return response()->json($orders);
    }

    /**
     * Actualiza el estado de un pedido desde el monitor de cocina.
     * Valida transición de estado y utiliza FormRequest.
     */
    public function markAsReady(UpdateKitchenOrderStatusRequest $request, string $tenant, int $orderId): JsonResponse
    {
        Gate::authorize('kitchen.update');

        /** @var \App\Models\Tenant $tenantModel */
        $tenantModel = app('currentTenant');

        $order = Order::where('id', $orderId)
            ->where('tenant_id', $tenantModel->id)
            ->firstOrFail();

        $newStatus = $request->validated()['status'];

        // Validar transición de estado
        $allowedTransitions = self::VALID_TRANSITIONS[$order->status] ?? [];
        if (!in_array($newStatus, $allowedTransitions)) {
            return response()->json([
                'success' => false,
                'message' => "Transición no válida: {$order->status} → {$newStatus}",
            ], 422);
        }

        try {
            DB::beginTransaction();

            $oldStatus = $order->status;
            $order->update(['status' => $newStatus]);

            OrderStatusHistory::create([
                'gastronomy_order_id' => $order->id,
                'user_id' => auth()->id(),
                'from_status' => $oldStatus,
                'to_status' => $newStatus,
                'notes' => 'Actualizado desde monitor de cocina',
            ]);

            // Dispatch event for real-time updates (POS badge + customer)
            \App\Events\OrderStatusUpdated::dispatch($order, 'Tu pedido ha sido actualizado en cocina.');

            DB::commit();

            return response()->json([
                'success' => true,
                'new_status' => $newStatus,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el estado del pedido: ' . $e->getMessage()
            ], 500);
        }
    }
}