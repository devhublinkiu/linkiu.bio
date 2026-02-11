<?php

namespace App\Http\Controllers\Tenant\Admin\Gastronomy;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Gastronomy\Order;
use App\Traits\ProcessesGastronomyOrders;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Zone;
use Illuminate\Support\Facades\Gate;

class WaiterController extends Controller
{
    use ProcessesGastronomyOrders;

    /**
     * Display the waiter panel.
     */
    public function index()
    {
        Gate::authorize('waiters.view');

        $tenant = app('currentTenant');

        // Fetch Categories and Products for order taking
        $categories = Category::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->with(['products' => function ($q) {
            $q->where('is_available', true)
                ->where('status', 'active')
                ->with(['variantGroups.options']);
        }])
            ->get();

        // Fetch Zones and Tables to select where to serve
        $zones = Zone::where('tenant_id', $tenant->id)
            ->with(['tables' => function ($q) {
            $q->with(['activeOrder' => function ($q) {
                    $q->select('gastronomy_orders.id', 'gastronomy_orders.table_id', 'gastronomy_orders.status');
                }
                    ]);
            }])
            ->get();

        return Inertia::render('Tenant/Admin/Gastronomy/Waiters/Index', [
            'categories' => $categories,
            'zones' => $zones,
            'tenant' => $tenant,
            'taxSettings' => [
                'tax_name' => $tenant->settings['tax_name'] ?? 'Impuesto',
                'tax_rate' => $tenant->settings['tax_rate'] ?? 0,
                'price_includes_tax' => $tenant->settings['price_includes_tax'] ?? false,
            ]
        ]);
    }

    /**
     * Store a waiter order.
     */
    public function storeOrder(Request $request)
    {
        Gate::authorize('waiters.order');

        try {
            // Waiter orders go directly to 'confirmed' (ready for kitchen)
            $order = $this->storeGastronomyOrder($request, 'confirmed', 'Panel de Meseros');

            return response()->json([
                'success' => true,
                'message' => 'Pedido enviado a cocina correctamente',
                'order_id' => $order->id,
            ], 201);

        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        }
        catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el pedido: ' . $e->getMessage(),
            ], 500);
        }
    }
}
