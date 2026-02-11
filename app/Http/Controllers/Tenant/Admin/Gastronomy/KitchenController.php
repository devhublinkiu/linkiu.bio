<?php

namespace App\Http\Controllers\Tenant\Admin\Gastronomy;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Gastronomy\Order;
use App\Models\Tenant\Gastronomy\OrderStatusHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class KitchenController extends Controller
{
    /**
     * Display the Kitchen Display System (KDS).
     */
    public function index()
    {
        Gate::authorize('kitchen.view');

        $tenant = app('currentTenant');

        // Fetch orders ready for kitchen or already being prepared
        // Sorted by oldest first (FIFO)
        $orders = Order::with(['items.product', 'table', 'creator'])
            ->where('tenant_id', $tenant->id)
            ->whereIn('status', ['confirmed', 'preparing'])
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Tenant/Admin/Gastronomy/Kitchen/Index', [
            'orders' => $orders,
            'tenant' => $tenant,
        ]);
    }

    /**
     * Get active kitchen orders (JSON for polling/updates).
     */
    public function getOrders()
    {
        Gate::authorize('kitchen.view');

        $tenant = app('currentTenant');

        $orders = Order::with(['items.product', 'table', 'creator'])
            ->where('tenant_id', $tenant->id)
            ->whereIn('status', ['confirmed', 'preparing'])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Mark an order as ready.
     */
    public function markAsReady(Request $request, $orderId)
    {
        Gate::authorize('kitchen.update');

        $tenant = app('currentTenant');
        $order = Order::where('id', $orderId)->where('tenant_id', $tenant->id)->firstOrFail();

        try {
            DB::beginTransaction();

            $oldStatus = $order->status;
            $newStatus = 'ready';

            if ($oldStatus !== $newStatus) {
                $order->update(['status' => $newStatus]);

                OrderStatusHistory::create([
                    'gastronomy_order_id' => $order->id,
                    'user_id' => auth()->id(),
                    'from_status' => $oldStatus,
                    'to_status' => $newStatus,
                    'notes' => 'Completado en cocina',
                ]);

                // Dispatch event (Real-time update for waiters and admin)
                \App\Events\OrderStatusUpdated::dispatch($order, 'El pedido está listo para ser servido.');
            }

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Pedido marcado como listo']);

        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
