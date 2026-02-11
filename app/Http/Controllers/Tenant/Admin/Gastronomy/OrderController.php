<?php

namespace App\Http\Controllers\Tenant\Admin\Gastronomy;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Gastronomy\Order;
use App\Models\Tenant\Gastronomy\OrderStatusHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource (Kanban Board).
     */
    public function index()
    {
        $tenant = app('currentTenant');

        // Fetch recent orders for Kanban
        // We might want to filter by date or status eventually
        // Filter by status based on 'history' param
        $isHistory = request()->boolean('history');

        $query = Order::with(['items.product', 'table'])
            ->where('tenant_id', $tenant->id)
            ->orderBy('created_at', 'desc');

        if ($isHistory) {
            $query->whereIn('status', ['completed', 'cancelled']);
            $orders = $query->paginate(15)->withQueryString();
        }
        else {
            // Active orders for Kanban
            $activeOrders = (clone $query)
                ->whereIn('status', ['pending', 'confirmed', 'preparing', 'ready'])
                ->take(50)
                ->get();

            // Recent completed orders (Last 5)
            $completedOrders = (clone $query)
                ->where('status', 'completed')
                ->take(5)
                ->get();

            $orders = $activeOrders->merge($completedOrders);
        }

        return Inertia::render('Tenant/Admin/Gastronomy/Orders/Index', [
            'orders' => $orders,
            'tenant' => $tenant,
            'isHistory' => $isHistory,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($tenant, $orderId)
    {
        $tenantModel = app('currentTenant');
        // Verify that the route parameter matches the current resolved tenant if needed, 
        // but mainly we just need to shift arguments correctly.

        $order = Order::where('id', $orderId)->where('tenant_id', $tenantModel->id)->firstOrFail();

        $order->load(['items.product', 'table', 'statusHistory.user']);

        return response()->json($order);
    }

    /**
     * Update the status of the specified order.
     */
    public function updateStatus(Request $request, $tenant, $orderId)
    {
        $tenantModel = app('currentTenant');
        $order = Order::where('id', $orderId)->where('tenant_id', $tenantModel->id)->firstOrFail();

        $validated = $request->validate([
            'status' => 'required|string|in:pending,confirmed,preparing,ready,completed,cancelled',
            'comment' => 'nullable|string|max:255',
        ]);

        try {
            DB::beginTransaction();

            $oldStatus = $order->status;
            $newStatus = $validated['status'];

            if ($oldStatus !== $newStatus) {
                // Update Order Status
                $order->update(['status' => $newStatus]);

                // Log History
                OrderStatusHistory::create([
                    'gastronomy_order_id' => $order->id,
                    'user_id' => auth()->id(),
                    'from_status' => $oldStatus,
                    'to_status' => $newStatus,
                    'notes' => $validated['comment'] ?? null,
                ]);

                // Dispatch Real-Time Event to Customer (Public Channel)
                \App\Events\OrderStatusUpdated::dispatch($order, $validated['comment'] ?? null);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Estado actualizado correctamente.');

        }
        catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error al actualizar estado: ' . $e->getMessage());
        }
    }
}
