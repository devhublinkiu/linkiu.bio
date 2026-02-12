<?php

namespace App\Http\Controllers\Tenant\Gastronomy;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Gastronomy\Order;
use App\Models\Tenant\Gastronomy\OrderItem;
use App\Models\Tenant\Gastronomy\OrderStatusHistory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Table;
use App\Models\Zone;
use App\Models\Location;
use App\Http\Requests\Tenant\Gastronomy\StoreOrderRequest;
use App\Traits\ProcessesGastronomyOrders;

class POSController extends Controller
{
    use ProcessesGastronomyOrders;

    public function index(Request $request)
    {
        $tenant = app('currentTenant');

        $locationId = $request->input('location_id');
        if (!$locationId) {
            $mainLocation = Location::where('tenant_id', $tenant->id)->where('is_main', true)->first();
            $locationId = $mainLocation ? $mainLocation->id : Location::where('tenant_id', $tenant->id)->first()?->id;
        }

        $categories = Category::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->with(['products' => function ($q) {
                $q->with(['variantGroups.options']);
            }])
            ->get();

        $zones = Zone::where('tenant_id', $tenant->id)
            ->where('location_id', $locationId)
            ->with(['tables' => function ($q) {
                $q->with(['activeOrder' => function ($q) {
                    $q->select(
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
            'currentLocationId' => (int)$locationId,
            'taxSettings' => [
                'tax_name' => $tenant->settings['tax_name'] ?? 'Impuesto',
                'tax_rate' => $tenant->settings['tax_rate'] ?? 0,
                'price_includes_tax' => $tenant->settings['price_includes_tax'] ?? false,
            ]
        ]);
    }

    public function store(StoreOrderRequest $request)
    {
        try {
            $order = $this->storeGastronomyOrder($request, 'pending', 'POS');

            return response()->json([
                'success' => true,
                'message' => 'Pedido creado exitosamente',
                'order_id' => $order->id,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el pedido: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function freeTable(Request $request, Table $table)
    {
        $tenant = app('currentTenant');
        
        if ($table->tenant_id !== $tenant->id) {
            abort(403);
        }

        $table->update(['status' => 'available']);

        return back()->with('success', 'Mesa liberada correctamente');
    }
}