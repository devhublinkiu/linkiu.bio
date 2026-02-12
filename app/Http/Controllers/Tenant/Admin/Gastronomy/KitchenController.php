<?php

namespace App\Http\Controllers\Tenant\Admin\Gastronomy;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Gastronomy\Order;
use App\Models\Tenant\Gastronomy\OrderItem;
use App\Models\Tenant\Gastronomy\OrderStatusHistory;
use App\Http\Requests\Tenant\Admin\Gastronomy\UpdateKitchenOrderStatusRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class KitchenController extends Controller
{
    public function index(Request $request, $tenant)
    {
        Gate::authorize('kitchen.view');
        $tenantModel = app('currentTenant');
        $user = auth()->user();
        
        // Correct way to get location_id from pivot
        $pivot = $user->tenants->find($tenantModel->id)?->pivot;
        $locationId = $request->input('location_id') ?? ($pivot ? $pivot->location_id : null);

        // Fetch orders ready for kitchen or already being prepared
        // Sorted by oldest first (FIFO)
        $orders = Order::with(['items.product', 'table', 'creator'])
            ->where('tenant_id', $tenantModel->id)
            ->whereIn('status', ['confirmed', 'preparing'])
            ->orderBy('created_at', 'asc')
            ->when($locationId, fn($q) => $q->where('location_id', $locationId))
            ->get();

        return Inertia::render('Tenant/Admin/Gastronomy/Kitchen/Index', [
            'orders' => $orders,
            'tenant' => $tenantModel,
            'currentLocationId' => $locationId ? (int)$locationId : null,
        ]);
    }

    public function getOrders(Request $request, $tenant)
    {
        Gate::authorize('kitchen.view');
        $tenantModel = app('currentTenant');
        $user = auth()->user();
        
        $pivot = $user->tenants->find($tenantModel->id)?->pivot;
        $locationId = $request->input('location_id') ?? ($pivot ? $pivot->location_id : null);

        $orders = Order::with(['items.product', 'table', 'creator'])
            ->where('tenant_id', $tenantModel->id)
            ->whereIn('status', ['confirmed', 'preparing'])
            ->orderBy('created_at', 'asc')
            ->when($locationId, fn($q) => $q->where('location_id', $locationId))
            ->get();

        return response()->json($orders);
    }

    /**
     * Actualiza el estado de un pedido desde el monitor de cocina.
     * Utiliza validación estricta mediante FormRequest.
     */
    public function markAsReady(UpdateKitchenOrderStatusRequest $request, $tenant, $orderId)
    {
        $tenantModel = app('currentTenant');
        
        $order = Order::where('id', $orderId)
            ->where('tenant_id', $tenantModel->id)
            ->firstOrFail();

        try {
            DB::beginTransaction();

            $newStatus = $request->input('status', 'ready');

            if ($order->status !== $newStatus) {
                $oldStatus = $order->status;
                $order->update(['status' => $newStatus]);

                OrderStatusHistory::create([
                    'gastronomy_order_id' => $order->id,
                    'user_id' => auth()->id(),
                    'from_status' => $oldStatus,
                    'to_status' => $newStatus,
                    'notes' => 'Actualizado desde monitor de cocina',
                ]);

                // Dispatch event for real-time customer updates
                \App\Events\OrderStatusUpdated::dispatch($order, 'Tu pedido ha sido actualizado en cocina.');
            }

            DB::commit();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el estado del pedido: ' . $e->getMessage()
            ], 500);
        }
    }
}