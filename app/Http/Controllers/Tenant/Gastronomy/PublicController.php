<?php

namespace App\Http\Controllers\Tenant\Gastronomy;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function index(Request $request)
    {
        $tenant = app('currentTenant');

        // The table should have been set in the session by the detectTable method
        // or if the 'm' parameter is still used for direct access.
        $selectedTable = null;
        if ($request->has('m')) {
            $selectedTable = \App\Models\Table::where('tenant_id', $tenant->id)
                ->where('token', $request->query('m'))
                ->with('zone')
                ->first();

            if ($selectedTable) {
                session(['selected_table' => $selectedTable]);
            }
        }
        else {
            $selectedTable = session('selected_table');
        }

        $sliders = \App\Models\Slider::where('tenant_id', $tenant->id)
            ->visible()
            ->get();

        $categories = \App\Models\Category::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->with(['icon', 'products'])
            ->get()
            ->filter(function ($category) {
            return $category->products->count() > 0;
        })
            ->values();

        $products = \App\Models\Product::where('tenant_id', $tenant->id)
            ->where('is_available', true)
            ->where('status', 'active')
            ->with(['variantGroups.options'])
            ->orderBy('sort_order', 'asc')
            ->get();

        $tickers = \App\Models\Ticker::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->latest()
            ->get();

        return Inertia::render('Tenant/Gastronomy/Public/Home', [
            'tenant' => $tenant,
            'sliders' => $sliders,
            'categories' => $categories,
            'products' => $products,
            'tickers' => $tickers
        ]);
    }

    public function detectTable(Request $request, $tenantSlug, $token)
    {
        $tenant = app('currentTenant');

        $table = \App\Models\Table::where('tenant_id', $tenant->id)
            ->where('token', $token)
            ->with('zone')
            ->first();

        if ($table) {
            session(['selected_table' => $table]);
            return redirect()->route('tenant.home', $tenantSlug)->with('success', 'Mesa detectada: ' . $table->name);
        }

        return redirect()->route('tenant.home', $tenantSlug)->with('error', 'Mesa no encontrada o inválida');
    }

    public function menu(Request $request)
    {
        $tenant = app('currentTenant');

        $categories = \App\Models\Category::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->with(['icon', 'products' => function ($query) {
            $query->with(['variantGroups.options']);
        }])
            ->get()
            ->filter(function ($category) {
            return $category->products->count() > 0;
        })
            ->values();

        return Inertia::render('Tenant/Gastronomy/Public/Menu/Index', [
            'tenant' => $tenant,
            'categories' => $categories,
        ]);
    }

    public function category(Request $request, $tenantSlug, $categorySlug)
    {
        $tenant = app('currentTenant');

        $category = \App\Models\Category::where('tenant_id', $tenant->id)
            ->where('slug', $categorySlug)
            ->where('is_active', true)
            ->with(['icon', 'products' => function ($query) {
            $query->where('is_available', true)
                ->where('status', 'active')
                ->with(['variantGroups.options'])
                ->orderBy('sort_order', 'asc');
        }])
            ->firstOrFail();

        $categories = \App\Models\Category::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->with(['icon', 'products'])
            ->get()
            ->filter(function ($cat) {
            return $cat->products->count() > 0;
        })
            ->values();

        return Inertia::render('Tenant/Gastronomy/Public/Menu/CategoryShow', [
            'tenant' => $tenant,
            'category' => $category,
            'categories' => $categories,
        ]);
    }

    public function favorites(Request $request)
    {
        $tenant = app('currentTenant');

        return Inertia::render('Tenant/Gastronomy/Public/Favorites/Index', [
            'tenant' => $tenant,
        ]);
    }

    public function cart(Request $request)
    {
        $tenant = app('currentTenant');

        return Inertia::render('Tenant/Gastronomy/Public/Cart/Index', [
            'tenant' => $tenant,
        ]);
    }

    public function batchProducts(Request $request)
    {
        $tenant = app('currentTenant');
        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return response()->json([]);
        }

        $products = \App\Models\Product::where('tenant_id', $tenant->id)
            ->whereIn('id', $ids)
            ->where('is_available', true)
            ->where('status', 'active')
            ->with(['variantGroups.options'])
            ->get();

        return response()->json($products);
    }

    public function checkout(Request $request)
    {
        $tenant = app('currentTenant');

        $shippingMethod = \App\Models\TenantShippingMethod::where('tenant_id', $tenant->id)
            ->where('type', 'local')
            ->where('is_active', true)
            ->with(['zones' => function ($q) {
            $q->orderBy('price', 'asc');
        }])
            ->first();

        $bankAccounts = \App\Models\TenantBankAccount::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Tenant/Gastronomy/Public/Checkout/Index', [
            'tenant' => $tenant,
            'shippingMethod' => $shippingMethod,
            'bankAccounts' => $bankAccounts,
        ]);
    }

    public function processCheckout(Request $request)
    {
    // ... handled in POSController for now or shared logic
    }

    public function success(Request $request, $tenant, $orderId)
    {
        $order = \App\Models\Tenant\Gastronomy\Order::findOrFail($orderId);
        $tenant = app('currentTenant');

        if ($order->tenant_id !== $tenant->id) {
            abort(404);
        }

        $order->load(['items.product', 'table', 'statusHistory']);

        return Inertia::render('Tenant/Gastronomy/Public/Checkout/Success', [
            'tenant' => $tenant,
            'order' => $order,
        ]);
    }
}
