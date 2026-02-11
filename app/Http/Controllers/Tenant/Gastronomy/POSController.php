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

use App\Traits\ProcessesGastronomyOrders;

class POSController extends Controller
{
    use ProcessesGastronomyOrders;

    public function index()
    {
        $tenant = app('currentTenant');

        // Fetch Categories with Products and Variants
        // Optimized eager loading for POS
        $categories = Category::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->with(['products' => function ($q) {
            $q->with(['variantGroups.options']);
        }])
            ->get();

        // Fetch Zones with Tables and Active Orders for POS Map
        $zones = Zone::where('tenant_id', $tenant->id)
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
                }
                    ]);
            }])
            ->get();

        // Fetch Today's Reservations (Correcting for Timezone mismatch UTC vs America/Bogota)
        $today = now()->setTimezone('America/Bogota')->toDateString();
        $reservations = \App\Models\Tenant\Gastronomy\Reservation::where('tenant_id', $tenant->id)
            ->whereDate('reservation_date', $today)
            ->whereIn('status', ['pending', 'confirmed', 'seated'])
            ->with('table')
            ->get();

        return Inertia::render('Tenant/Admin/Gastronomy/POS/Index', [
            'categories' => $categories,
            'zones' => $zones, // Send zones instead of flat tables list
            'reservations' => $reservations,
            'tenant' => $tenant,
            'taxSettings' => [
                'tax_name' => $tenant->settings['tax_name'] ?? 'Impuesto',
                'tax_rate' => $tenant->settings['tax_rate'] ?? 0,
                'price_includes_tax' => $tenant->settings['price_includes_tax'] ?? false,
            ]
        ]);
    }

    public function store(Request $request)
    {
        try {
            // POS orders use the default status (pending) or confirmed if paid?
            // Actually, keep it 'pending' as per original POS logic
            $order = $this->storeGastronomyOrder($request, 'pending', 'POS');

            return response()->json([
                'success' => true,
                'message' => 'Pedido creado exitosamente',
                'order_id' => $order->id,
                'redirect_url' => route('tenant.checkout.success', ['tenant' => app('currentTenant')->slug, 'order' => $order->id]),
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
