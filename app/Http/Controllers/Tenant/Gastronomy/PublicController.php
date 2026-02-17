<?php

namespace App\Http\Controllers\Tenant\Gastronomy;

use App\Http\Controllers\Controller;
use App\Models\Table;
use App\Models\Tenant\All\Short;
use App\Models\Tenant\Locations\Location;
use App\Http\Requests\Tenant\Gastronomy\StorePublicOrderRequest;
use App\Traits\ProcessesGastronomyOrders;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    use ProcessesGastronomyOrders;
    /**
     * Vista Shorts:
     * - Más de 1 sede: slides de SEDES (elegir sede + INGRESAR) + slides de PROMOS. Barra = "Sede actual. Toca para cambiar."
     * - 1 sola sede: solo slides de PROMOS + botón "Ingresar a la tienda".
     */
    public function shorts(Request $request)
    {
        $tenant = app('currentTenant');
        $locationsCount = Location::where('tenant_id', $tenant->id)->where('is_active', true)->count();
        $hasMultipleLocations = $locationsCount > 1;

        // 1. Slides de sedes: solo si hay MÁS DE UNA sede (para que el usuario elija)
        $locationSlides = [];
        if ($hasMultipleLocations) {
            $locationSlides = Location::where('tenant_id', $tenant->id)
                ->where('is_active', true)
                ->whereNotNull('short_video_id')
                ->orderByRaw('is_main DESC')
                ->orderBy('name')
                ->get(['id', 'name', 'short_video_id'])
                ->map(function (Location $loc) {
                    $embedUrl = $loc->short_embed_url;
                    return [
                        'type' => 'location',
                        'location_id' => $loc->id,
                        'location_name' => $loc->name,
                        'short_embed_url' => $embedUrl,
                    ];
                })
                ->filter(fn ($s) => !empty($s['short_embed_url']))
                ->values()
                ->all();
        }

        // 2. Promos (modelo Short): título, descripción, badges, Ver más
        $promoSlides = Short::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->with([
                'location:id,name',
                'linkable' => function (\Illuminate\Database\Eloquent\Relations\MorphTo $morphTo) {
                    $morphTo->morphWith([
                        \App\Models\Product::class => ['category'],
                        \App\Models\Category::class => [],
                    ]);
                },
            ])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(function (Short $short) use ($tenant) {
                $actionUrl = $short->external_url ?? '#';
                if ($short->link_type === 'category' && $short->linkable) {
                    $actionUrl = route('tenant.menu.category', ['tenant' => $tenant->slug, 'slug' => $short->linkable->slug]);
                }
                if ($short->link_type === 'product' && $short->linkable) {
                    $category = $short->linkable->category ?? null;
                    if ($category) {
                        $baseUrl = route('tenant.menu.category', ['tenant' => $tenant->slug, 'slug' => $category->slug]);
                        $actionUrl = $baseUrl . '?product=' . rawurlencode($short->linkable->slug);
                    }
                }
                return [
                    'type' => 'promo',
                    'id' => $short->id,
                    'name' => $short->name,
                    'description' => $short->description,
                    'short_embed_url' => $short->short_embed_url,
                    'link_type' => $short->link_type,
                    'action_url' => $actionUrl,
                    'location_name' => $short->location?->name ?? '',
                ];
            })
            ->filter(fn ($s) => !empty($s['short_embed_url']))
            ->values()
            ->all();

        $items = array_merge($locationSlides, $promoSlides);

        return Inertia::render('Tenant/Gastronomy/Public/Shorts/Index', [
            'tenant' => $tenant,
            'items' => $items,
            'has_multiple_locations' => $hasMultipleLocations,
        ]);
    }

    /**
     * Elegir sede e ir al home (guarda en sesión y redirige).
     */
    public function enterLocation(Request $request): RedirectResponse
    {
        $tenant = app('currentTenant');

        $request->validate([
            'location_id' => 'required|integer|exists:locations,id',
        ]);

        $location = Location::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->findOrFail($request->location_id);

        session(['selected_location_id' => $location->id]);

        return redirect()->route('tenant.home', ['tenant' => $tenant->slug]);
    }

    public function index(Request $request)
    {
        $tenant = app('currentTenant');

        $selectedTable = null;
        if ($request->has('m')) {
            $selectedTable = \App\Models\Table::where('tenant_id', $tenant->id)
                ->where('token', $request->query('m'))
                ->with('zone')
                ->first();
            if ($selectedTable) {
                session(['selected_table' => $selectedTable]);
            }
        } else {
            $selectedTable = session('selected_table');
        }

        $sliderQuery = \App\Models\Tenant\All\Slider::visible();
        if ($selectedTable && $selectedTable->location_id) {
            $sliderQuery->where('location_id', $selectedTable->location_id);
        }
        $sliders = $sliderQuery->get(['id', 'name', 'image_path', 'image_path_desktop', 'storage_disk', 'link_type', 'external_url', 'linkable_type', 'linkable_id', 'sort_order']);

        $categories = \App\Models\Category::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->with(['icon', 'products'])
            ->get()
            ->filter(fn ($category) => $category->products->count() > 0)
            ->values();

        $products = \App\Models\Product::where('tenant_id', $tenant->id)
            ->where('is_available', true)
            ->where('status', 'active')
            ->with(['variantGroups.options'])
            ->orderBy('sort_order', 'asc')
            ->get();

        $featuredProducts = \App\Models\Product::where('tenant_id', $tenant->id)
            ->where('is_available', true)
            ->where('status', 'active')
            ->where('is_featured', true)
            ->with(['variantGroups.options'])
            ->orderBy('sort_order', 'asc')
            ->limit(8)
            ->get();

        $topSellingIds = \App\Models\Tenant\Gastronomy\OrderItem::query()
            ->join('gastronomy_orders', 'gastronomy_order_items.gastronomy_order_id', '=', 'gastronomy_orders.id')
            ->where('gastronomy_orders.tenant_id', $tenant->id)
            ->whereNotIn('gastronomy_orders.status', ['cancelled'])
            ->selectRaw('gastronomy_order_items.product_id, sum(gastronomy_order_items.quantity) as total')
            ->groupBy('gastronomy_order_items.product_id')
            ->orderByDesc('total')
            ->limit(3)
            ->pluck('product_id')
            ->toArray();

        $topSellingProducts = empty($topSellingIds)
            ? collect()
            : \App\Models\Product::where('tenant_id', $tenant->id)
                ->where('is_available', true)
                ->where('status', 'active')
                ->whereIn('id', $topSellingIds)
                ->with(['variantGroups.options'])
                ->get()
                ->sortBy(fn ($p) => array_search($p->id, $topSellingIds))
                ->values();

        $locationStatusMessage = $this->getLocationStatusMessage($tenant);

        $tickers = \App\Models\Tenant\All\Ticker::select(['id', 'content', 'link', 'background_color', 'text_color', 'order'])
            ->where('is_active', true)
            ->orderBy('order', 'asc')
            ->get();

        // Top 3 categorías por unidades vendidas (movimiento)
        $topCategoryIds = \App\Models\Tenant\Gastronomy\OrderItem::query()
            ->join('gastronomy_orders', 'gastronomy_order_items.gastronomy_order_id', '=', 'gastronomy_orders.id')
            ->join('products', 'gastronomy_order_items.product_id', '=', 'products.id')
            ->where('gastronomy_orders.tenant_id', $tenant->id)
            ->whereNotIn('gastronomy_orders.status', ['cancelled'])
            ->whereNotNull('products.category_id')
            ->selectRaw('products.category_id, sum(gastronomy_order_items.quantity) as total')
            ->groupBy('products.category_id')
            ->orderByDesc('total')
            ->limit(3)
            ->pluck('category_id')
            ->toArray();

        $topCategoriesByMovement = collect();
        if (! empty($topCategoryIds)) {
            $topCategoriesByMovement = \App\Models\Category::where('tenant_id', $tenant->id)
                ->where('is_active', true)
                ->whereIn('id', $topCategoryIds)
                ->with(['products' => function ($q) {
                    $q->where('is_available', true)->where('status', 'active')
                        ->with(['variantGroups.options'])->orderBy('sort_order');
                }])
                ->get()
                ->sortBy(fn ($c) => array_search($c->id, $topCategoryIds))
                ->values()
                ->filter(fn ($c) => $c->products->isNotEmpty())
                ->take(3)
                ->values();
        }
        if ($topCategoriesByMovement->count() < 3) {
            $idsHave = $topCategoriesByMovement->pluck('id')->toArray();
            $extra = \App\Models\Category::where('tenant_id', $tenant->id)
                ->where('is_active', true)
                ->when($idsHave !== [], fn ($q) => $q->whereNotIn('id', $idsHave))
                ->with(['products' => function ($q) {
                    $q->where('is_available', true)->where('status', 'active')
                        ->with(['variantGroups.options'])->orderBy('sort_order');
                }])
                ->orderBy('name')
                ->get()
                ->filter(fn ($c) => $c->products->isNotEmpty())
                ->take(3 - $topCategoriesByMovement->count())
                ->values();
            $topCategoriesByMovement = $topCategoriesByMovement->concat($extra)->take(3)->values();
        }

        $promoShorts = Short::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->with([
                'linkable' => function (\Illuminate\Database\Eloquent\Relations\MorphTo $morphTo) {
                    $morphTo->morphWith([
                        \App\Models\Product::class => ['category'],
                        \App\Models\Category::class => [],
                    ]);
                },
            ])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(function (Short $short) use ($tenant) {
                $actionUrl = $short->external_url ?? '#';
                if ($short->link_type === 'category' && $short->linkable) {
                    $actionUrl = route('tenant.menu.category', ['tenant' => $tenant->slug, 'slug' => $short->linkable->slug]);
                }
                if ($short->link_type === 'product' && $short->linkable) {
                    $category = $short->linkable->category ?? null;
                    if ($category) {
                        $baseUrl = route('tenant.menu.category', ['tenant' => $tenant->slug, 'slug' => $category->slug]);
                        $actionUrl = $baseUrl . '?product=' . rawurlencode($short->linkable->slug);
                    }
                }
                return [
                    'id' => $short->id,
                    'name' => $short->name,
                    'description' => $short->description ?? '',
                    'short_embed_url' => $short->short_embed_url,
                    'link_type' => $short->link_type,
                    'action_url' => $actionUrl,
                ];
            })
            ->filter(fn ($s) => ! empty($s['short_embed_url']))
            ->values()
            ->all();

        $topCategoriesForHome = $topCategoriesByMovement->map(fn ($cat) => [
            'id' => $cat->id,
            'name' => $cat->name,
            'slug' => $cat->slug,
            'products' => $cat->products->values()->all(),
        ])->all();

        return Inertia::render('Tenant/Gastronomy/Public/Home', [
            'tenant' => $tenant,
            'sliders' => $sliders,
            'categories' => $categories,
            'featured_products' => $featuredProducts,
            'top_selling_products' => $topSellingProducts,
            'top_categories' => $topCategoriesForHome,
            'location_status_message' => $locationStatusMessage,
            'tickers' => $tickers,
            'promo_shorts' => $promoShorts,
        ]);
    }

    private function getLocationStatusMessage($tenant): ?string
    {
        $locationId = session('selected_location_id');
        if (!$locationId) {
            return null;
        }
        $location = Location::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->find($locationId);
        if (!$location || !$location->opening_hours) {
            return null;
        }
        $now = \Carbon\Carbon::now(config('app.timezone'));
        $dayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][$now->dayOfWeek];
        $todayHours = $location->opening_hours[$dayKey] ?? [];
        if (empty($todayHours)) {
            return 'Cerrado hoy';
        }
        $currentMinutes = $now->hour * 60 + $now->minute;
        foreach ($todayHours as $slot) {
            [$openH, $openM] = array_map('intval', explode(':', $slot['open']));
            [$closeH, $closeM] = array_map('intval', explode(':', $slot['close']));
            $openMinutes = $openH * 60 + $openM;
            $closeMinutes = $closeH * 60 + $closeM;
            if ($currentMinutes >= $openMinutes && $currentMinutes < $closeMinutes) {
                return 'Abierto hasta las ' . $slot['close'];
            }
        }
        $nextSlot = null;
        foreach ($todayHours as $slot) {
            [$openH, $openM] = array_map('intval', explode(':', $slot['open']));
            if ($openH * 60 + $openM > $currentMinutes) {
                $nextSlot = $slot;
                break;
            }
        }
        if ($nextSlot) {
            return 'Abre a las ' . $nextSlot['open'];
        }
        return 'Cerrado';
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
            ->whereHas('products')
            ->with('icon')
            ->orderBy('name')
            ->get();

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

        $shippingMethod = \App\Models\Tenant\Shipping\TenantShippingMethod::where('tenant_id', $tenant->id)
            ->where('type', 'local')
            ->where('is_active', true)
            ->with(['zones' => function ($q) {
            $q->orderBy('price', 'asc');
        }])
            ->first();

        $selectedLocationId = session('selected_location_id');
        $bankAccountsQuery = \App\Models\Tenant\Payments\BankAccount::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->orderBy('sort_order');
        if ($selectedLocationId !== null) {
            $bankAccountsQuery->where('location_id', $selectedLocationId);
        } else {
            $bankAccountsQuery->whereNull('location_id');
        }
        $bankAccounts = $bankAccountsQuery->get();

        $table = session('selected_table');
        $defaultLocation = Location::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->where('is_main', true)
            ->first()
            ?? Location::where('tenant_id', $tenant->id)->where('is_active', true)->first();

        return Inertia::render('Tenant/Gastronomy/Public/Checkout/Index', [
            'tenant' => $tenant,
            'table' => $table,
            'shippingMethod' => $shippingMethod,
            'bankAccounts' => $bankAccounts,
            'default_location_id' => $defaultLocation?->id,
        ]);
    }

    /**
     * Procesa el pedido desde la tienda pública. Responde JSON para que el front redirija a la pantalla de éxito.
     */
    public function processCheckout(StorePublicOrderRequest $request): JsonResponse
    {
        $tenant = app('currentTenant');
        $validated = $request->validated();

        if ($validated['service_type'] === 'dine_in' && !empty($validated['table_id'])) {
            $table = Table::where('tenant_id', $tenant->id)->find($validated['table_id']);
            if ($table) {
                $validated['location_id'] = $table->location_id;
            }
        }

        if (empty($validated['location_id'])) {
            return response()->json([
                'success' => false,
                'message' => 'Debes indicar la sede o la mesa para tu pedido.',
            ], 422);
        }

        try {
            $mergedRequest = $request->duplicate([], $validated, [], [], $request->allFiles());
            $order = $this->storeGastronomyOrder($mergedRequest, 'pending', 'Public');

            return response()->json([
                'success' => true,
                'message' => 'Pedido enviado correctamente.',
                'redirect_url' => route('tenant.checkout.success', ['tenant' => $tenant->slug, 'order' => $order->id]),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
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
