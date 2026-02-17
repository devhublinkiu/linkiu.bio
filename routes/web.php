<?php

use App\Http\Controllers\ProfileController;
use App\Http\Middleware\HandleTenantRequests;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// use Illuminate\Support\Facades\Storage;
// use App\Http\Controllers\PublicSite\InvoiceVerificationController as PublicInvoiceVerificationController;

use App\Http\Controllers\PublicSite\InvoiceVerificationController as PublicInvoiceVerificationController;

// 1. Landing Page (Global)
Route::get('/', function () {
    return Inertia::render('Welcome', [
    'canLogin' => Route::has('login'),
    'canRegister' => Route::has('register'),
    'laravelVersion' => Application::VERSION,
    'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

/* Route::get('/test-broadcast', function () {
 // Manually broadcast to check connection
 $msg = 'Helllo from server ' . now();
 // Use Ably SDK directly if possible or mock event
 \Illuminate\Support\Facades\Broadcast::on(new \Illuminate\Broadcasting\Channel('superadmin-updates'))
 ->as('icon.requested')
 ->with(['message' => $msg])
 ->send();
 return "Broadcast sent: $msg"; }); */



// Public Tenant Onboarding (Multi-step)
Route::group(['prefix' => 'onboarding', 'as' => 'onboarding.'], function () {
    Route::get('/debug-settings', function () {
            $tenant = \App\Models\Tenant::first();
            app()->instance('currentTenant', $tenant);

            $data = ['tax_rate' => '15', 'tax_name' => 'Test Tax'];
            $validator = \Illuminate\Support\Facades\Validator::make($data, [
                'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
                'tax_name' => ['nullable', 'string', 'max:50'],
            ]);

            $validated = $validator->validated();
            $merged = array_merge($tenant->settings ?? [], $validated);

            return [
            'original' => $data,
            'validated' => $validated,
            'merged_tax_rate' => $merged['tax_rate'] ?? 'MISSING',
            'tenant_id' => $tenant->id
            ];
        }
        );

        // Step 1: Select vertical, category, plan
        // Step 1: Select vertical, category, plan
        Route::get('/', [\App\Http\Controllers\OnboardingController::class , 'step1'])->name('step1');
        Route::post('/step1', [\App\Http\Controllers\OnboardingController::class , 'storeStep1'])->name('step1.store');

        // Step 2: Business details (name, slug, phone)
        Route::get('/negocio', [\App\Http\Controllers\OnboardingController::class , 'step2'])->name('step2');
        Route::post('/step2', [\App\Http\Controllers\OnboardingController::class , 'storeStep2'])->name('step2.store');

        // Step 3: Account creation
        Route::get('/cuenta', [\App\Http\Controllers\OnboardingController::class , 'step3'])->name('step3');
        Route::post('/complete', [\App\Http\Controllers\OnboardingController::class , 'complete'])->name('complete');

        // Validation
        Route::post('/validate', [\App\Http\Controllers\OnboardingController::class , 'validateField'])->name('validate');

        // Post-registration pages
        Route::get('/construyendo', [\App\Http\Controllers\OnboardingController::class , 'building'])->name('building');
        Route::get('/listo', [\App\Http\Controllers\OnboardingController::class , 'success'])->name('success');
        Route::get('/pendiente', [\App\Http\Controllers\OnboardingController::class , 'pending'])->name('pending');
    });
// Route::get('/verificar/{invoice_id}', [PublicInvoiceVerificationController::class , 'verify'])->name('invoice.verify');

// Legacy route redirect (keep old URL working)
Route::get('/register/tenant', fn() => redirect()->route('onboarding.step1'))->name('register.tenant');

// WhatsApp Verification
Route::post('/auth/whatsapp/send', [\App\Http\Controllers\Auth\WhatsAppVerificationController::class , 'send'])->name('auth.whatsapp.send');
Route::post('/auth/whatsapp/verify', [\App\Http\Controllers\Auth\WhatsAppVerificationController::class , 'verify'])->name('auth.whatsapp.verify');

// Global Media Proxy (must be before other wildcard routes if any)
// Handles /media/site-assets/... mapping to S3
Route::get('/media/{path}', [\App\Http\Controllers\Shared\MediaController::class , 'file'])
    ->where('path', '.*')
    ->name('media.proxy');

// 2. SuperAdmin Auth
Route::prefix('superlinkiu')->group(function () {
    require __DIR__ . '/auth.php';
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class , 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class , 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class , 'destroy'])->name('profile.destroy');

    // SuperAdmin Specific Profile (for internal naming consistency)
    Route::group(['prefix' => 'superlinkiu', 'as' => 'superadmin.'], function () {
            Route::get('/profile', [ProfileController::class , 'edit'])->name('profile.edit');
            Route::patch('/profile', [ProfileController::class , 'update'])->name('profile.update');
            Route::delete('/profile', [ProfileController::class , 'destroy'])->name('profile.destroy');
        }
        );

        // Notifications
        Route::post('/notifications/mark-all-read', [\App\Http\Controllers\NotificationController::class , 'markAllAsRead'])->name('notifications.markAllRead');
        Route::post('/notifications/{id}/mark-read', [\App\Http\Controllers\NotificationController::class , 'markAsRead'])->name('notifications.markRead');
        Route::delete('/notifications/destroy-all-read', [\App\Http\Controllers\NotificationController::class , 'destroyAllRead'])->name('notifications.destroyAllRead');
        Route::delete('/notifications/{id}', [\App\Http\Controllers\NotificationController::class , 'destroy'])->name('notifications.destroy');

    // Debug Route
    // Debug Route - DISABLED FOR PRODUCTION
    /*
     Route::get('/test-notification', function () {
     $iconRequest = \App\Models\IconRequest::first();
     if (!$iconRequest)
     return 'No IconRequest found. Please create one first.';
     \Illuminate\Support\Facades\Log::info('Manually triggering IconRequestedNotification for IconRequest #' . $iconRequest->id);
     \Illuminate\Support\Facades\Notification::send(
     \App\Models\User::where('is_super_admin', true)->get(),
     new \App\Notifications\IconRequestedNotification($iconRequest)
     );
     return 'Sent IconRequestedNotification to all SuperAdmins. Check logs and frontend.';
     });
     */});

// 3. SuperAdmin Zone
Route::prefix('superlinkiu')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
            return Inertia::render('SuperAdmin/Dashboard');
        }
        )->name('superadmin.dashboard');

        Route::resource('tenants', \App\Http\Controllers\SuperAdmin\TenantController::class);
        Route::get('reportes-tiendas', [\App\Http\Controllers\SuperAdmin\StoreReportController::class, 'index'])->name('superadmin.store-reports.index');
        Route::patch('reportes-tiendas/{storeReport}/status', [\App\Http\Controllers\SuperAdmin\StoreReportController::class, 'updateStatus'])->name('superadmin.store-reports.update-status');
        Route::resource('categories', \App\Http\Controllers\SuperAdmin\BusinessCategoryController::class)->except(['create', 'show', 'edit']);
        Route::resource('users', \App\Http\Controllers\SuperAdmin\UserController::class)->except(['show', 'edit']);
        Route::resource('roles', \App\Http\Controllers\SuperAdmin\RoleController::class);

        // Categories & Icons
        Route::resource('category-icons', \App\Http\Controllers\SuperAdmin\CategoryIconController::class);

        // Support & Requests
        Route::prefix('support')->group(function () {
            Route::get('requests', [\App\Http\Controllers\SuperAdmin\IconRequestController::class , 'index'])->name('icon-requests.index');
        }
        );
        Route::patch('icon-requests/{iconRequest}/approve', [\App\Http\Controllers\SuperAdmin\IconRequestController::class , 'approve'])->name('icon-requests.approve');
        Route::patch('icon-requests/{iconRequest}/reject', [\App\Http\Controllers\SuperAdmin\IconRequestController::class , 'reject'])->name('icon-requests.reject');

        // Settings
        Route::get('/settings', [\App\Http\Controllers\SuperAdmin\SettingController::class , 'index'])->name('settings.index');
        Route::post('/settings', [\App\Http\Controllers\SuperAdmin\SettingController::class , 'update'])->name('settings.update');

        // Plans
        Route::resource('plans', \App\Http\Controllers\SuperAdmin\PlanController::class);

        // Billing
        Route::get('/subscriptions', [\App\Http\Controllers\SuperAdmin\SubscriptionController::class , 'index'])->name('subscriptions.index');
        Route::get('/payments', [\App\Http\Controllers\SuperAdmin\PaymentController::class , 'index'])->name('payments.index');
        Route::put('/payments/{payment}', [\App\Http\Controllers\SuperAdmin\PaymentController::class , 'update'])->name('payments.update');

        // Support Module
        Route::resource('support', \App\Http\Controllers\SuperAdmin\SupportController::class)->names('superadmin.support');
        Route::post('support/{ticket}/reply', [\App\Http\Controllers\SuperAdmin\SupportController::class , 'reply'])->name('superadmin.support.reply');
        Route::post('support/{ticket}/assign', [\App\Http\Controllers\SuperAdmin\SupportController::class , 'assign'])->name('superadmin.support.assign');

        // Media Management
        // Media Management (Unified Shared Controller)
        Route::prefix('media')->name('media.')->group(function () {
            Route::get('/', [\App\Http\Controllers\SuperAdmin\MediaController::class , 'index'])->name('index');
            // Route::get('/list', [\App\Http\Controllers\Shared\MediaController::class, 'list'])->name('list'); // Unused in SA Media?
            Route::post('/create-folder', [\App\Http\Controllers\SuperAdmin\MediaController::class , 'createFolder'])->name('create-folder'); // Matches Index.tsx
            Route::post('/delete-folder', [\App\Http\Controllers\SuperAdmin\MediaController::class , 'deleteFolder'])->name('folder.delete');
            Route::post('/', [\App\Http\Controllers\SuperAdmin\MediaController::class , 'store'])->name('store');
            Route::delete('/{id}', [\App\Http\Controllers\SuperAdmin\MediaController::class , 'destroy'])->name('destroy');
        }
        );
    });



// 4. Tenant Zone
Route::prefix('{tenant}')->group(function () {

    // ═══════════════════════════════════════════════════════════════════════
    // 4.1 TENANT PUBLIC VIEWS (Vertical-Specific Router)
    // ═══════════════════════════════════════════════════════════════════════

    // Páginas legales primero (evitar que otra ruta consuma segmentos)
    Route::get('/legal/{slug}', [\App\Http\Controllers\Tenant\LegalController::class , 'show'])->name('tenant.legal.show');

    /**
     * Main Public Homepage - Conditional Router by Vertical
     * 
     * Detects the tenant's vertical and loads the appropriate controller/view.
     * Add new vertical routes here as they are implemented.
     */
    Route::get('/', function () {
        $tenant = app('currentTenant');

        // Load vertical relationship to get slug
        $tenant->load('vertical');
        $verticalSlug = $tenant->vertical->slug ?? null;

        switch ($verticalSlug) {
            case 'gastronomia':
                $locationsCount = \App\Models\Tenant\Locations\Location::where('tenant_id', $tenant->id)->where('is_active', true)->count();
                if ($locationsCount >= 2 && !session('selected_location_id')) {
                    return app(\App\Http\Controllers\Tenant\Gastronomy\PublicController::class)->shorts(request());
                }
                return app(\App\Http\Controllers\Tenant\Gastronomy\PublicController::class)->index(request());

            case 'ecommerce':
                // TODO: Implement E-commerce public controller
                // return app(\App\Http\Controllers\Tenant\Ecommerce\PublicController::class)->index(request());
                return \Inertia\Inertia::render('Tenant/Public/Unavailable', [
                    'tenant' => $tenant,
                    'message' => 'Tienda en construcción. Próximamente disponible.'
                ]);

            case 'dropshipping':
                // TODO: Implement Dropshipping public controller
                // return app(\App\Http\Controllers\Tenant\Dropshipping\PublicController::class)->index(request());
                return \Inertia\Inertia::render('Tenant/Public/Unavailable', [
                    'tenant' => $tenant,
                    'message' => 'Tienda en construcción. Próximamente disponible.'
                ]);

            default:
                // Unknown vertical or no vertical assigned
                return \Inertia\Inertia::render('Tenant/Public/Unavailable', [
                    'tenant' => $tenant,
                    'message' => 'Vertical no configurado. Contacta a soporte.'
                ]);
        }
    })->name('tenant.home');

    // ═══════════════════════════════════════════════════════════════════════
    // 4.2 TRANSVERSAL PUBLIC ROUTES (Available for all verticals)
    // ═══════════════════════════════════════════════════════════════════════

    // Public Locations (Sedes)
    Route::get('/locations', [\App\Http\Controllers\Tenant\PublicController::class , 'locations'])->name('tenant.public.locations');

    // Reporte de problemas con el negocio (público, transversal)
    Route::post('/report', [\App\Http\Controllers\Tenant\StoreReportController::class , 'store'])->name('tenant.report.store');

    // Validar Clicks en Sliders (Public)
    Route::get('/sliders/{slider}/click', [\App\Http\Controllers\Tenant\Admin\SliderController::class , 'click'])->name('tenant.sliders.click');

    // ═══════════════════════════════════════════════════════════════════════
    // 4.3 GASTRONOMÍA - PUBLIC ROUTES
    // ═══════════════════════════════════════════════════════════════════════

    // Menu & Catalogue
    Route::get('/menu', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'menu'])->name('tenant.menu');
    Route::get('/menu/category/{slug}', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'category'])->name('tenant.menu.category');
    Route::post('/menu/products/batch', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'batchProducts'])->name('tenant.menu.products.batch');

    // Favorites
    Route::get('/favoritos', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'favorites'])->name('tenant.favorites');

    // Cart
    Route::get('/carrito', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'cart'])->name('tenant.cart');

    // Checkout & Orders
    Route::get('/checkout', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'checkout'])->name('tenant.checkout');
    Route::post('/checkout/process', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'processCheckout'])->name('tenant.checkout.process');
    Route::get('/pedido/{order}', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'success'])->name('tenant.checkout.success');
    Route::post('/pos/orders', [\App\Http\Controllers\Tenant\Gastronomy\POSController::class , 'store'])->name('tenant.pos.store');

    // Payment Methods API
    Route::get('/api/cart/payment-methods', [\App\Http\Controllers\Tenant\Client\PaymentController::class , 'index'])->name('tenant.api.payment-methods.index');

    // Magic Link Upload (Payment Proof)
    Route::get('/magic/upload/{token}', [\App\Http\Controllers\Tenant\Gastronomy\MagicLinkController::class , 'show'])->name('tenant.magic.show');
    Route::post('/magic/upload/{token}', [\App\Http\Controllers\Tenant\Gastronomy\MagicLinkController::class , 'store'])->name('tenant.magic.store');

    // Reservations
    Route::get('/reservas', [\App\Http\Controllers\Tenant\Gastronomy\ReservationController::class , 'index'])->name('tenant.reservations.index');
    Route::post('/reservas', [\App\Http\Controllers\Tenant\Gastronomy\ReservationController::class , 'store'])->name('tenant.reservations.store');

    // Shorts: vista pública (elegir sede + promos) y entrar
    Route::get('/shorts', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'shorts'])->name('tenant.public.shorts');
    Route::post('/entrar', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'enterLocation'])->name('tenant.shorts.enter');

    // ═══════════════════════════════════════════════════════════════════════
    // TODO: 4.4 E-COMMERCE - PUBLIC ROUTES (When implemented)
    // ═══════════════════════════════════════════════════════════════════════
    // Route::get('/catalog', [Ecommerce\PublicController::class, 'catalog'])->name('tenant.ecommerce.catalog');
    // Route::get('/product/{slug}', [Ecommerce\PublicController::class, 'product'])->name('tenant.ecommerce.product');
    // ...

    // ═══════════════════════════════════════════════════════════════════════
    // TODO: 4.5 DROPSHIPPING - PUBLIC ROUTES (When implemented)
    // ═══════════════════════════════════════════════════════════════════════
    // Route::get('/shop', [Dropshipping\PublicController::class, 'shop'])->name('tenant.dropshipping.shop');
    // ...

    // ═══════════════════════════════════════════════════════════════════════
    // 4.6 TENANT ADMIN PANEL (Authenticated Area)
    // ═══════════════════════════════════════════════════════════════════════

    Route::prefix('admin')->group(function () {
            // Redirect /slug/admin to /slug/admin/dashboard
            Route::get('/', function () {
                    return redirect()->route('tenant.dashboard', ['tenant' => app('currentTenant')->slug]);
                }
                );

                // Login routes for tenant admin (manual check for authenticated users in controller)
                Route::get('/login', [\App\Http\Controllers\Auth\TenantAuthController::class , 'showLogin'])->name('tenant.login');
                Route::post('/login', [\App\Http\Controllers\Auth\TenantAuthController::class , 'login'])->name('tenant.login.post');

                // Authenticated routes for tenant admin
                Route::middleware(['auth'])->group(function () {
                    Route::get('/dashboard', [\App\Http\Controllers\Tenant\Admin\DashboardController::class , 'index'])->name('tenant.dashboard');

                    Route::get('/profile', [\App\Http\Controllers\Tenant\Admin\ProfileController::class , 'edit'])->name('tenant.profile.edit');
                    Route::patch('/profile', [\App\Http\Controllers\Tenant\Admin\ProfileController::class , 'update'])->name('tenant.profile.update');
                    Route::put('/profile/password', [\App\Http\Controllers\Tenant\Admin\ProfileController::class , 'updatePassword'])->name('tenant.profile.password.update');
                    Route::post('/profile/photo', [\App\Http\Controllers\Tenant\Admin\ProfileController::class , 'updatePhoto'])->name('tenant.profile.photo.update');

                    // 4.3 Roles
                    Route::resource('roles', \App\Http\Controllers\Tenant\Admin\RoleController::class)->names('tenant.roles');

                    // 4.3b Members
                    Route::resource('members', \App\Http\Controllers\Tenant\Admin\MemberController::class)->names('tenant.members');

                    // 4.4 Categories
                    Route::resource('categories', \App\Http\Controllers\Tenant\Admin\CategoryController::class)->names('tenant.categories');
                    Route::patch('categories/{category}/toggle-active', [\App\Http\Controllers\Tenant\Admin\CategoryController::class , 'toggleActive'])->name('tenant.categories.toggle-active');
                    Route::post('categories/request-icon', [\App\Http\Controllers\Tenant\Admin\CategoryController::class , 'requestIcon'])->name('tenant.categories.request-icon');

                    // 4.5 Sliders (Banners)
                    Route::resource('sliders', \App\Http\Controllers\Tenant\Admin\SliderController::class)->names('tenant.sliders');

                    // 4.6 Tickers (Promotional)
                    Route::patch('tickers/reorder', [\App\Http\Controllers\Tenant\Admin\TickerController::class, 'reorder'])->name('tenant.admin.tickers.reorder');
                    Route::resource('tickers', \App\Http\Controllers\Tenant\Admin\TickerController::class)->names('tenant.admin.tickers');

                    // 4.7 Locations (Sedes)
                    Route::resource('locations', \App\Http\Controllers\Tenant\Admin\Locations\LocationController::class)->names('tenant.locations');
                    Route::patch('locations/{location}/toggle-active', [\App\Http\Controllers\Tenant\Admin\Locations\LocationController::class, 'toggleActive'])->name('tenant.locations.toggle-active');

                    // Shorts (aplica a todas las verticales)
                    Route::resource('shorts', \App\Http\Controllers\Tenant\Admin\ShortController::class)->names('tenant.shorts');
                    Route::patch('shorts/{short}/toggle-active', [\App\Http\Controllers\Tenant\Admin\ShortController::class, 'toggleActive'])->name('tenant.shorts.toggle-active');

                    // Productos (Gastronomía)
                    Route::resource('products', \App\Http\Controllers\Tenant\Admin\Gastronomy\ProductController::class)->names('tenant.admin.products');
                    Route::patch('products/{product}/toggle-availability', [\App\Http\Controllers\Tenant\Admin\Gastronomy\ProductController::class, 'toggleAvailability'])->name('tenant.admin.products.toggle-availability');

                    // Mesas y Zonas (Gastronomía)
                    Route::prefix('tables')->group(function () {
                            Route::get('/', [\App\Http\Controllers\Tenant\Admin\Gastronomy\TableController::class , 'index'])->name('tenant.admin.tables.index');
                            Route::post('/zones', [\App\Http\Controllers\Tenant\Admin\Gastronomy\TableController::class , 'storeZone'])->name('tenant.admin.zones.store');
                            Route::put('/zones/{zone}', [\App\Http\Controllers\Tenant\Admin\Gastronomy\TableController::class , 'updateZone'])->name('tenant.admin.zones.update');
                            Route::delete('/zones/{zone}', [\App\Http\Controllers\Tenant\Admin\Gastronomy\TableController::class , 'destroyZone'])->name('tenant.admin.zones.destroy');

                            Route::post('/', [\App\Http\Controllers\Tenant\Admin\Gastronomy\TableController::class , 'storeTable'])->name('tenant.admin.tables.store');
                            Route::put('/{table}', [\App\Http\Controllers\Tenant\Admin\Gastronomy\TableController::class , 'updateTable'])->name('tenant.admin.tables.update');
                            Route::delete('/{table}', [\App\Http\Controllers\Tenant\Admin\Gastronomy\TableController::class , 'destroyTable'])->name('tenant.admin.tables.destroy');
                            Route::post('/bulk', [\App\Http\Controllers\Tenant\Admin\Gastronomy\TableController::class , 'bulkStore'])->name('tenant.admin.tables.bulk');
                            Route::post('/{table}/regenerate-token', [\App\Http\Controllers\Tenant\Admin\Gastronomy\TableController::class , 'regenerateToken'])->name('tenant.admin.tables.regenerate-token');
                            Route::get('/print', [\App\Http\Controllers\Tenant\Admin\Gastronomy\TableController::class , 'print'])->name('tenant.admin.tables.print');
                        }
                        );

                        // Inventario (Inventory)
                        Route::prefix('inventory')->group(function () {
                            // Items
                            Route::get('/', [\App\Http\Controllers\Tenant\Admin\Inventory\InventoryItemController::class, 'index'])->name('tenant.admin.inventory.index');
                            Route::post('/', [\App\Http\Controllers\Tenant\Admin\Inventory\InventoryItemController::class, 'store'])->name('tenant.admin.inventory.store');
                            Route::put('/{inventoryItem}', [\App\Http\Controllers\Tenant\Admin\Inventory\InventoryItemController::class, 'update'])->name('tenant.admin.inventory.update');
                            Route::delete('/{inventoryItem}', [\App\Http\Controllers\Tenant\Admin\Inventory\InventoryItemController::class, 'destroy'])->name('tenant.admin.inventory.destroy');

                            // Stocks
                            Route::get('/stocks', [\App\Http\Controllers\Tenant\Admin\Inventory\InventoryStockController::class, 'index'])->name('tenant.admin.inventory.stocks.index');
                            Route::put('/stocks/{inventoryStock}', [\App\Http\Controllers\Tenant\Admin\Inventory\InventoryStockController::class, 'update'])->name('tenant.admin.inventory.stocks.update');

                            // Movements
                            Route::get('/movements', [\App\Http\Controllers\Tenant\Admin\Inventory\InventoryMovementController::class, 'index'])->name('tenant.admin.inventory.movements.index');
                            Route::post('/movements', [\App\Http\Controllers\Tenant\Admin\Inventory\InventoryMovementController::class, 'store'])->name('tenant.admin.inventory.movements.store');
                        });

                        // Punto de Venta (POS)
                        Route::get('/pos', [\App\Http\Controllers\Tenant\Gastronomy\POSController::class , 'index'])->name('tenant.admin.pos');
                        Route::post('/pos/tables/{table}/free', [\App\Http\Controllers\Tenant\Gastronomy\POSController::class , 'freeTable'])->name('tenant.admin.pos.free-table');
                        Route::post('/pos/items/{item}/cancel', [\App\Http\Controllers\Tenant\Gastronomy\POSController::class , 'cancelItem'])->name('tenant.admin.pos.cancel-item');
                        Route::post('/pos/orders/{order}/verify-payment', [\App\Http\Controllers\Tenant\Gastronomy\POSController::class , 'verifyWaiterPayment'])->name('tenant.admin.pos.verify-payment');
                        Route::get('/pos/customers', [\App\Http\Controllers\Tenant\Gastronomy\CustomerController::class , 'index'])->name('tenant.admin.pos.customers.index');
                        Route::post('/pos/customers', [\App\Http\Controllers\Tenant\Gastronomy\CustomerController::class , 'store'])->name('tenant.admin.pos.customers.store');

                        // Pedidos (Gastronomía)
                        Route::prefix('orders')->name('tenant.admin.gastronomy.orders.')->group(function () {
                            Route::get('/', [\App\Http\Controllers\Tenant\Admin\Gastronomy\OrderController::class , 'index'])->name('index');
                            Route::get('/{order}', [\App\Http\Controllers\Tenant\Admin\Gastronomy\OrderController::class , 'show'])->name('show');
                            Route::post('/{order}/status', [\App\Http\Controllers\Tenant\Admin\Gastronomy\OrderController::class , 'updateStatus'])->name('update-status');
                        }
                        );

                        // Reservas (Admin)
                        Route::prefix('reservations')->name('tenant.admin.reservations.')->group(function () {
                            Route::get('/', [\App\Http\Controllers\Tenant\Gastronomy\AdminReservationController::class , 'index'])->name('index');
                            Route::put('/{reservation}', [\App\Http\Controllers\Tenant\Gastronomy\AdminReservationController::class , 'update'])->name('update');
                            Route::put('/{location}/settings', [\App\Http\Controllers\Tenant\Gastronomy\AdminReservationController::class , 'updateLocationSettings'])->name('settings.update');
                        }
                        );

                        Route::get('/settings', [\App\Http\Controllers\Tenant\Admin\SettingsController::class , 'edit'])->name('tenant.settings.edit');
                        Route::patch('/settings', [\App\Http\Controllers\Tenant\Admin\SettingsController::class , 'update'])->name('tenant.settings.update');
                        Route::post('/settings/legal-pages/update', [\App\Http\Controllers\Tenant\Admin\LegalPageController::class , 'update'])->name('tenant.settings.legal-pages.update');
                        Route::post('/settings/logo', [\App\Http\Controllers\Tenant\Admin\SettingsController::class , 'updateLogo'])->name('tenant.settings.logo.update');
                        Route::post('/settings/favicon', [\App\Http\Controllers\Tenant\Admin\SettingsController::class , 'updateFavicon'])->name('tenant.settings.favicon.update');

                        Route::get('/whatsapp', [\App\Http\Controllers\Tenant\Admin\WhatsApp\WhatsAppController::class, 'edit'])->name('tenant.whatsapp.edit');
                        Route::patch('/whatsapp', [\App\Http\Controllers\Tenant\Admin\WhatsApp\WhatsAppController::class, 'update'])->name('tenant.whatsapp.update');

                        Route::post('/logout', [\App\Http\Controllers\Auth\TenantAuthController::class , 'logout'])->name('tenant.logout');

                        // Subscriptions & Plans
                        Route::get('/subscription', [\App\Http\Controllers\Tenant\Admin\SubscriptionController::class , 'index'])->name('tenant.subscription.index');
                        Route::post('/subscription/change-plan', [\App\Http\Controllers\Tenant\Admin\SubscriptionController::class , 'changePlan'])->name('tenant.subscription.change-plan');
                        Route::get('/subscription/checkout', [\App\Http\Controllers\Tenant\Admin\SubscriptionController::class , 'checkout'])->name('tenant.subscription.checkout');
                        Route::post('/subscription/process-payment', [\App\Http\Controllers\Tenant\Admin\SubscriptionController::class , 'processPayment'])->name('tenant.subscription.process-payment');
                        Route::get('/subscription/success', [\App\Http\Controllers\Tenant\Admin\SubscriptionController::class , 'success'])->name('tenant.subscription.success');
                        Route::post('/subscription/advance-invoice', [\App\Http\Controllers\Tenant\Admin\SubscriptionController::class , 'generateAdvanceInvoice'])->name('tenant.subscription.advance-invoice');
                        Route::post('/slug/update', [\App\Http\Controllers\Tenant\Admin\SubscriptionController::class , 'updateSlug'])->name('tenant.slug.update');

                        // Invoices & Payments
                        Route::get('/invoices', [\App\Http\Controllers\Tenant\Admin\InvoiceController::class , 'index'])->name('tenant.invoices.index');
                        Route::get('/invoices/{invoice}', [\App\Http\Controllers\Tenant\Admin\InvoiceController::class , 'show'])->name('tenant.invoices.show');
                        Route::post('/invoices/upload', [\App\Http\Controllers\Tenant\Admin\InvoiceController::class , 'store'])->name('tenant.invoices.store');

                        // Support Module
                        Route::resource('support', \App\Http\Controllers\Tenant\Admin\SupportController::class)->names('tenant.support');
                        Route::post('support/{ticket}/reply', [\App\Http\Controllers\Tenant\Admin\SupportController::class , 'reply'])->name('tenant.support.reply');
                        Route::post('support/{ticket}/close', [\App\Http\Controllers\Tenant\Admin\SupportController::class , 'close'])->name('tenant.support.close');

                        // Payment Methods
                        Route::prefix('payment-methods')->name('tenant.payment-methods.')->group(function () {
                            Route::get('/', [\App\Http\Controllers\Tenant\Admin\PaymentMethods\PaymentMethodController::class, 'index'])->name('index');
                            Route::put('/{method}', [\App\Http\Controllers\Tenant\Admin\PaymentMethods\PaymentMethodController::class, 'updateMethod'])->name('update.method');
                            Route::post('/accounts', [\App\Http\Controllers\Tenant\Admin\PaymentMethods\PaymentMethodController::class, 'storeAccount'])->name('accounts.store');
                            Route::put('/accounts/{account}', [\App\Http\Controllers\Tenant\Admin\PaymentMethods\PaymentMethodController::class, 'updateAccount'])->name('accounts.update');
                            Route::delete('/accounts/{account}', [\App\Http\Controllers\Tenant\Admin\PaymentMethods\PaymentMethodController::class, 'destroyAccount'])->name('accounts.destroy');
                        });

                        // Shipping Methods
                        Route::prefix('shipping')->name('tenant.shipping.')->group(function () {
                            Route::get('/', [\App\Http\Controllers\Tenant\Admin\Shipping\ShippingController::class, 'index'])->name('index');
                            Route::put('/{method}', [\App\Http\Controllers\Tenant\Admin\Shipping\ShippingController::class, 'update'])->name('update');
                            Route::post('/{method}/zones', [\App\Http\Controllers\Tenant\Admin\Shipping\ShippingController::class, 'updateZones'])->name('zones.update');
                        }
                        );
                        // Specific Gastronomy Modules (KDS & Waiters)
                        Route::prefix('kitchen')->name('tenant.admin.kitchen.')->group(function () {
                            Route::get('/', [\App\Http\Controllers\Tenant\Admin\Gastronomy\KitchenController::class , 'index'])->name('index');
                            Route::get('/orders', [\App\Http\Controllers\Tenant\Admin\Gastronomy\KitchenController::class , 'getOrders'])->name('orders');
                            Route::post('/{order}/ready', [\App\Http\Controllers\Tenant\Admin\Gastronomy\KitchenController::class , 'markAsReady'])->name('ready');
                        }
                        );

                        Route::prefix('waiters')->name('tenant.admin.waiters.')->group(function () {
                            Route::get('/', [\App\Http\Controllers\Tenant\Admin\Gastronomy\WaiterController::class , 'index'])->name('index');
                            Route::post('/order', [\App\Http\Controllers\Tenant\Admin\Gastronomy\WaiterController::class , 'storeOrder'])->name('store');
                            Route::post('/payment-proof', [\App\Http\Controllers\Tenant\Admin\Gastronomy\WaiterController::class , 'submitPaymentProof'])->name('payment-proof');
                        }
                        );

                        Route::prefix('media')->name('tenant.media.')->group(function () {
                            Route::get('/', [\App\Http\Controllers\Tenant\Admin\Media\MediaController::class, 'index'])->name('index');
                            Route::get('/list', [\App\Http\Controllers\Tenant\Admin\Media\MediaController::class, 'list'])->name('list');
                            Route::get('/{id}/download', [\App\Http\Controllers\Tenant\Admin\Media\MediaController::class, 'download'])->name('download');
                            Route::get('/{id}', [\App\Http\Controllers\Tenant\Admin\Media\MediaController::class, 'show'])->name('show');
                            Route::post('/folder', [\App\Http\Controllers\Tenant\Admin\Media\MediaController::class, 'createFolder'])->name('folder.create');
                            Route::post('/', [\App\Http\Controllers\Tenant\Admin\Media\MediaController::class, 'store'])->name('store');
                            Route::delete('/{id}', [\App\Http\Controllers\Tenant\Admin\Media\MediaController::class, 'destroy'])->name('destroy');
                        }
                        );
                    }
                    );
                }
                );
            });
