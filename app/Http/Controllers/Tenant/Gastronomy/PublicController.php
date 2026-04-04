<?php

namespace App\Http\Controllers\Tenant\Gastronomy;

use App\Http\Controllers\Controller;
use App\Models\Table;
use App\Models\Tenant\All\Short;
use App\Models\Tenant\Gastronomy\Order;
use App\Models\Tenant\Gastronomy\Reservation;
use App\Models\Tenant\Locations\Location;
use App\Http\Requests\Tenant\Gastronomy\StorePublicOrderRequest;
use App\Traits\ProcessesGastronomyOrders;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
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

        // Top 6: últimos 30 días, pedidos completados (completed_at), ítems no cancelados; desempate por product_id; caché 10 min.
        $topSellingSince = Carbon::now()->subDays(30);
        $topSellingCacheTtl = 600;
        $topSellingCounts = Cache::remember(
            \App\Models\Tenant\Gastronomy\Order::topSellingProductsCacheKey($tenant->id),
            $topSellingCacheTtl,
            function () use ($tenant, $topSellingSince) {
                return \App\Models\Tenant\Gastronomy\OrderItem::query()
                    ->join('gastronomy_orders', 'gastronomy_order_items.gastronomy_order_id', '=', 'gastronomy_orders.id')
                    ->where('gastronomy_orders.tenant_id', $tenant->id)
                    ->where('gastronomy_orders.status', 'completed')
                    ->whereNotNull('gastronomy_orders.completed_at')
                    ->where('gastronomy_orders.completed_at', '>=', $topSellingSince)
                    ->where(function ($q) {
                        $q->whereNull('gastronomy_order_items.status')
                            ->orWhere('gastronomy_order_items.status', '!=', 'cancelled');
                    })
                    ->selectRaw('gastronomy_order_items.product_id, sum(gastronomy_order_items.quantity) as total_sold')
                    ->groupBy('gastronomy_order_items.product_id')
                    ->orderByDesc('total_sold')
                    ->orderBy('gastronomy_order_items.product_id')
                    ->limit(6)
                    ->pluck('total_sold', 'product_id')
                    ->map(fn ($v) => (int) $v)
                    ->all();
            }
        );

        $topSellingIds = array_keys($topSellingCounts);
        $topSellingOrder = [];
        foreach (array_values($topSellingIds) as $i => $pid) {
            $topSellingOrder[(int) $pid] = $i;
        }

        $topSellingProducts = $topSellingIds === []
            ? []
            : \App\Models\Product::where('tenant_id', $tenant->id)
                ->where('is_available', true)
                ->where('status', 'active')
                ->whereIn('id', $topSellingIds)
                ->with(['variantGroups.options'])
                ->get()
                ->sortBy(fn ($p) => $topSellingOrder[(int) $p->id] ?? 999)
                ->values()
                ->map(function ($p) use ($topSellingCounts) {
                    $sold = 0;
                    foreach ($topSellingCounts as $pid => $qty) {
                        if ((int) $pid === (int) $p->id) {
                            $sold = (int) $qty;
                            break;
                        }
                    }

                    return array_merge($p->toArray(), [
                        'sold_count_30d' => $sold,
                    ]);
                })
                ->values()
                ->all();

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
                    'poster_url' => $short->feedPosterUrl(),
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

        $activePublicOrders = $this->activePublicOrdersForHome();
        $activePublicReservations = $this->activePublicReservationsForHome();

        return Inertia::render('Tenant/Gastronomy/Public/Home', [
            'tenant' => $tenant,
            'sliders' => $sliders,
            'categories' => $categories,
            'featured_products' => $featuredProducts,
            'top_selling_products' => $topSellingProducts,
            'top_categories' => $topCategoriesForHome,
            'tickers' => $tickers,
            'promo_shorts' => $promoShorts,
            'active_public_orders' => $activePublicOrders,
            'active_public_reservations' => $activePublicReservations,
        ]);
    }

    public function getLocationStatusMessage($tenant): ?string
    {
        $location = null;
        $locationId = session('selected_location_id');
        if ($locationId) {
            $location = Location::where('tenant_id', $tenant->id)
                ->where('is_active', true)
                ->find($locationId);
        }
        if (! $location) {
            $location = Location::where('tenant_id', $tenant->id)
                ->where('is_active', true)
                ->orderByRaw('is_main DESC')
                ->orderBy('name')
                ->first();
        }
        if (! $location || ! $location->opening_hours) {
            return null;
        }
        $now = \Carbon\Carbon::now(config('app.timezone'));
        $dayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][$now->dayOfWeek];
        $todayHours = $location->opening_hours[$dayKey] ?? [];
        if (empty($todayHours)) {
            return $this->closedWithNextOpening($location, $now, 'Cerrado hoy');
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

        return $this->closedWithNextOpening($location, $now, 'Cerrado');
    }

    /**
     * Cierra el mensaje con la próxima apertura: "Cerrado - Abre mañana a las HH:MM" (o día de la semana si no abre mañana).
     *
     * @param  Location  $location
     */
    private function closedWithNextOpening(Location $location, \Carbon\Carbon $now, string $closedLabel): string
    {
        $next = $this->nextOpeningLine($location, $now);
        if ($next === null) {
            return $closedLabel;
        }

        return $closedLabel.' - '.$next;
    }

    /**
     * Primera franja de apertura en los próximos días (desde mañana).
     *
     * @param  Location  $location
     */
    private function nextOpeningLine(Location $location, \Carbon\Carbon $now): ?string
    {
        $hoursByDay = $location->opening_hours ?? [];
        if (! is_array($hoursByDay) || $hoursByDay === []) {
            return null;
        }

        $dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        $spanishDays = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

        for ($addDays = 1; $addDays <= 14; $addDays++) {
            $d = $now->copy()->addDays($addDays)->startOfDay();
            $key = $dayKeys[(int) $d->dayOfWeek];
            $slots = $hoursByDay[$key] ?? [];
            if ($slots === []) {
                continue;
            }
            $first = $slots[0] ?? null;
            $open = is_array($first) ? ($first['open'] ?? null) : null;
            if ($open === null || $open === '') {
                continue;
            }
            if ($addDays === 1) {
                return 'Abre mañana a las '.$open;
            }

            return 'Abre el '.$spanishDays[(int) $d->dayOfWeek].' a las '.$open;
        }

        return null;
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

    public function success(Request $request, $tenant, $order)
    {
        $orderModel = Order::query()->whereKey($order)->firstOrFail();
        $tenant = app('currentTenant');

        if ($orderModel->tenant_id !== $tenant->id) {
            abort(404);
        }

        $this->trackPublicGastronomyOrderId((int) $orderModel->id);

        $orderModel->load(['items.product', 'table', 'statusHistory']);

        return Inertia::render('Tenant/Gastronomy/Public/Checkout/Success', [
            'tenant' => $tenant,
            'order' => $orderModel,
        ]);
    }

    /**
     * Refuerza sesión + cookie para el timeline (p. ej. tras checkout o al abrir el éxito en otro tab).
     */
    public function trackOrderForTimeline(Request $request): JsonResponse
    {
        $tenant = app('currentTenant');
        $validated = $request->validate([
            'order_id' => 'required|integer|min:1',
        ]);

        $order = Order::query()->whereKey($validated['order_id'])->firstOrFail();
        if ((int) $order->tenant_id !== (int) $tenant->id) {
            abort(404);
        }

        $this->trackPublicGastronomyOrderId((int) $order->id);

        return response()->json(['ok' => true]);
    }

    /**
     * IDs de pedidos hechos desde la tienda pública (sesión + cookie) para el timeline en el home.
     * La cookie evita perder el listado si la sesión se regenera o caduca.
     */
    private const SESSION_PUBLIC_ORDER_IDS = 'gastronomy_public_order_ids';

    /** Distinta del nombre de la clave de sesión para evitar solapamientos con el stack HTTP. */
    private const COOKIE_PUBLIC_ORDER_IDS = 'gastronomy_tracked_order_ids_ck';

    /** Minutos de vida de la cookie (~1 año). */
    private const COOKIE_ORDER_IDS_MINUTES = 525600;

    private const SESSION_PUBLIC_RESERVATION_IDS = 'gastronomy_public_reservation_ids';

    private const COOKIE_PUBLIC_RESERVATION_IDS = 'gastronomy_tracked_reservation_ids_ck';

    /**
     * @return array<int, int>
     */
    private function readTrackedOrderIdsFromCookie(): array
    {
        $raw = request()->cookie(self::COOKIE_PUBLIC_ORDER_IDS);
        if ($raw === null || $raw === '') {
            return [];
        }
        $decoded = json_decode($raw, true);
        if (! is_array($decoded)) {
            return [];
        }

        return array_values(array_unique(array_filter(array_map('intval', $decoded))));
    }

    /**
     * @param  array<int, int>  $ids
     */
    private function persistTrackedOrderIds(array $ids): void
    {
        $ids = array_values(array_unique(array_map('intval', $ids)));
        $ids = array_slice($ids, -30);
        session([self::SESSION_PUBLIC_ORDER_IDS => $ids]);

        Cookie::queue(
            self::COOKIE_PUBLIC_ORDER_IDS,
            json_encode($ids),
            self::COOKIE_ORDER_IDS_MINUTES,
            '/',
            null,
            (bool) config('session.secure'),
            true,
            false,
            'lax'
        );
    }

    /**
     * @return array<int, int>
     */
    private function mergedTrackedOrderIds(): array
    {
        $sessionIds = array_map('intval', session(self::SESSION_PUBLIC_ORDER_IDS, []));
        $cookieIds = $this->readTrackedOrderIdsFromCookie();
        // Cookie antigua (mismo nombre que la sesión) por si el navegador aún la tenía guardada
        $legacyCookie = $this->readLegacyTrackedOrderIdsFromCookie();

        return array_values(array_unique(array_merge($sessionIds, $cookieIds, $legacyCookie)));
    }

    /**
     * @return array<int, int>
     */
    private function readLegacyTrackedOrderIdsFromCookie(): array
    {
        $raw = request()->cookie(self::SESSION_PUBLIC_ORDER_IDS);
        if ($raw === null || $raw === '') {
            return [];
        }
        $decoded = json_decode($raw, true);
        if (! is_array($decoded)) {
            return [];
        }

        return array_values(array_unique(array_filter(array_map('intval', $decoded))));
    }

    private function trackPublicGastronomyOrderId(int $orderId): void
    {
        $merged = $this->mergedTrackedOrderIds();
        $merged[] = $orderId;
        $this->persistTrackedOrderIds($merged);
    }

    /**
     * @return array<int, int>
     */
    private function readTrackedReservationIdsFromCookie(): array
    {
        $raw = request()->cookie(self::COOKIE_PUBLIC_RESERVATION_IDS);
        if ($raw === null || $raw === '') {
            return [];
        }
        $decoded = json_decode($raw, true);
        if (! is_array($decoded)) {
            return [];
        }

        return array_values(array_unique(array_filter(array_map('intval', $decoded))));
    }

    /**
     * @param  array<int, int>  $ids
     */
    private function persistTrackedReservationIds(array $ids): void
    {
        $ids = array_values(array_unique(array_map('intval', $ids)));
        $ids = array_slice($ids, -30);
        session([self::SESSION_PUBLIC_RESERVATION_IDS => $ids]);

        Cookie::queue(
            self::COOKIE_PUBLIC_RESERVATION_IDS,
            json_encode($ids),
            self::COOKIE_ORDER_IDS_MINUTES,
            '/',
            null,
            (bool) config('session.secure'),
            true,
            false,
            'lax'
        );
    }

    /**
     * @return array<int, int>
     */
    private function mergedTrackedReservationIds(): array
    {
        $sessionIds = array_map('intval', session(self::SESSION_PUBLIC_RESERVATION_IDS, []));
        $cookieIds = $this->readTrackedReservationIdsFromCookie();

        return array_values(array_unique(array_merge($sessionIds, $cookieIds)));
    }

    /** Registra la reserva en sesión + cookie para el timeline del home (p. ej. tras crear la solicitud). */
    public function trackPublicReservationId(int $reservationId): void
    {
        $merged = $this->mergedTrackedReservationIds();
        $merged[] = $reservationId;
        $this->persistTrackedReservationIds($merged);
    }

    /**
     * Reservas activas del visitante (sesión + cookie) para el carrusel del home.
     *
     * @return array<int, array{id: int, reservation_date: string, reservation_time: string, party_size: int, timeline_status: string, created_at: string}>
     */
    private function activePublicReservationsForHome(): array
    {
        $tenant = app('currentTenant');
        $trackedIds = array_map('intval', $this->mergedTrackedReservationIds());
        if ($trackedIds === []) {
            return [];
        }

        $reservations = Reservation::query()
            ->where('tenant_id', $tenant->id)
            ->whereIn('id', $trackedIds)
            ->orderByDesc('created_at')
            ->get();

        $terminal = ['cancelled', 'no_show'];
        $activeStatuses = ['pending', 'confirmed', 'seated'];

        $foundIds = $reservations->pluck('id')->map(fn ($id) => (int) $id)->all();
        $orphanIds = array_values(array_diff($trackedIds, $foundIds));
        $terminalIds = $reservations->filter(fn ($r) => in_array($r->status, $terminal, true))
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->all();

        $this->persistTrackedReservationIds(array_values(array_diff($trackedIds, $orphanIds, $terminalIds)));

        $tz = config('app.timezone');
        $today = Carbon::today($tz);

        $forDisplay = $reservations->filter(function (Reservation $r) use ($activeStatuses, $today) {
            if (! in_array($r->status, $activeStatuses, true)) {
                return false;
            }

            return $r->reservation_date->copy()->startOfDay()->gte($today);
        })->values();

        return $forDisplay->map(function (Reservation $reservation) {
            return [
                'id' => $reservation->id,
                'reservation_date' => $reservation->reservation_date->format('Y-m-d'),
                'reservation_time' => (string) $reservation->reservation_time,
                'party_size' => (int) $reservation->party_size,
                'timeline_status' => $this->mapReservationStatusToTimeline($reservation->status),
                'created_at' => $reservation->created_at->toIso8601String(),
            ];
        })->all();
    }

    private function mapReservationStatusToTimeline(string $status): string
    {
        return match ($status) {
            'pending' => 'solicitada',
            'confirmed' => 'confirmada',
            'seated' => 'sentado',
            default => 'solicitada',
        };
    }

    /**
     * Pedidos activos del visitante (sesión + cookie) para el carrusel del home.
     *
     * @return array<int, array{id: int, order_number: string, estimated_delivery_range: string, timeline_status: string}>
     */
    private function activePublicOrdersForHome(): array
    {
        $trackedIds = array_map('intval', $this->mergedTrackedOrderIds());
        if ($trackedIds === []) {
            return [];
        }

        // Sin filtrar por estado aquí: si solo usábamos estados «activos», un estado distinto en BD
        // hacía que el resultado fuera vacío y se borraban todos los IDs guardados (sesión/cookie).
        $orders = Order::query()
            ->whereIn('id', $trackedIds)
            ->orderByDesc('created_at')
            ->get();

        $terminal = ['completed', 'cancelled'];
        $activeStatuses = ['pending', 'confirmed', 'preparing', 'ready'];

        $foundIds = $orders->pluck('id')->map(fn ($id) => (int) $id)->all();
        $orphanIds = array_values(array_diff($trackedIds, $foundIds));
        $terminalIds = $orders->filter(fn ($o) => in_array($o->status, $terminal, true))
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->all();

        $this->persistTrackedOrderIds(array_values(array_diff($trackedIds, $orphanIds, $terminalIds)));

        $forDisplay = $orders->filter(fn ($o) => in_array($o->status, $activeStatuses, true))->values();

        return $forDisplay->map(function (Order $order) {
            return [
                'id' => $order->id,
                'order_number' => str_pad((string) $order->id, 4, '0', STR_PAD_LEFT),
                'estimated_delivery_range' => $this->estimatedDeliveryRangeForOrder($order),
                'timeline_status' => $this->mapGastronomyOrderStatusToTimeline($order->status),
                'created_at' => $order->created_at->toIso8601String(),
            ];
        })->all();
    }

    private function estimatedDeliveryRangeForOrder(Order $order): string
    {
        $tz = config('app.timezone');
        $start = $order->created_at->copy()->timezone($tz)->addMinutes(20);
        $end = $order->created_at->copy()->timezone($tz)->addMinutes(35);
        if ($end->isPast()) {
            $start = now($tz)->addMinutes(10);
            $end = now($tz)->addMinutes(25);
        }

        $fmt = static fn (Carbon $c): string => $c->locale(app()->getLocale())->translatedFormat('H:i');

        return $fmt($start).' - '.$fmt($end);
    }

    private function mapGastronomyOrderStatusToTimeline(string $status): string
    {
        return match ($status) {
            'pending' => 'recibido',
            'confirmed' => 'confirmado',
            'preparing' => 'preparando',
            'ready' => 'en_camino',
            default => 'recibido',
        };
    }
}
