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

    // 4.1 Tenant Public URL
    // 4.1 Tenant Public URL
    Route::get('/', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'index'])->name('tenant.home');

    // 4.1b Public Locations (Transversal)
    Route::get('/locations', [\App\Http\Controllers\Tenant\PublicController::class , 'locations'])->name('tenant.public.locations');

    // 4.1c Public Menu (Smart Catalogue)
    Route::get('/menu', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'menu'])->name('tenant.menu');
    Route::get('/menu/category/{slug}', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'category'])->name('tenant.menu.category');

    // 4.1d Public Favorites
    Route::get('/favoritos', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'favorites'])->name('tenant.favorites');

    // 4.1g Public Cart
    Route::get('/carrito', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'cart'])->name('tenant.cart');

    Route::post('/menu/products/batch', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'batchProducts'])->name('tenant.menu.products.batch');

    // 4.1e Public Payment Methods
    Route::get('/api/cart/payment-methods', [\App\Http\Controllers\Tenant\Client\PaymentController::class , 'index'])->name('tenant.api.payment-methods.index');

    // 4.1f Public Checkout (Dedicated Page)
    Route::get('/checkout', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'checkout'])->name('tenant.checkout');
    Route::post('/checkout/process', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'processCheckout'])->name('tenant.checkout.process');
    Route::get('/pedido/{order}', [\App\Http\Controllers\Tenant\Gastronomy\PublicController::class , 'success'])->name('tenant.checkout.success');
    Route::post('/pos/orders', [\App\Http\Controllers\Tenant\Gastronomy\POSController::class , 'store'])->name('tenant.pos.store');

    // 4.1h Magic Link Upload (Payment Proof)
    Route::get('/magic/upload/{token}', [\App\Http\Controllers\Tenant\Gastronomy\MagicLinkController::class , 'show'])->name('tenant.magic.show');
    Route::post('/magic/upload/{token}', [\App\Http\Controllers\Tenant\Gastronomy\MagicLinkController::class , 'store'])->name('tenant.magic.store');

    // 4.1b Validar Clicks en Sliders (Public)
    Route::get('/sliders/{slider}/click', [\App\Http\Controllers\Tenant\Admin\SliderController::class , 'click'])->name('tenant.sliders.click');

    // 4.1i Public Reservations
    Route::get('/reservas', [\App\Http\Controllers\Tenant\Gastronomy\ReservationController::class , 'index'])->name('tenant.reservations.index');
    Route::post('/reservas', [\App\Http\Controllers\Tenant\Gastronomy\ReservationController::class , 'store'])->name('tenant.reservations.store');

    // 4.2 Tenant Admin Panel
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
                    Route::resource('tickers', \App\Http\Controllers\Tenant\Admin\TickerController::class)->names('tenant.admin.tickers');

                    // 4.7 Locations (Sedes)
                    Route::resource('locations', \App\Http\Controllers\Tenant\Admin\LocationController::class)->names('tenant.locations');
                    Route::patch('locations/{location}/toggle-active', [\App\Http\Controllers\Tenant\Admin\LocationController::class , 'toggleActive'])->name('tenant.locations.toggle-active');

                    // Productos (Gastronomía)
                    Route::resource('products', \App\Http\Controllers\Tenant\Admin\Gastronomy\ProductController::class)->names('tenant.admin.products');

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

                        // Punto de Venta (POS)
                        Route::get('/pos', [\App\Http\Controllers\Tenant\Gastronomy\POSController::class , 'index'])->name('tenant.admin.pos');
                        Route::post('/pos/tables/{table}/free', [\App\Http\Controllers\Tenant\Gastronomy\POSController::class , 'freeTable'])->name('tenant.admin.pos.free-table');
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
                        Route::post('/settings/logo', [\App\Http\Controllers\Tenant\Admin\SettingsController::class , 'updateLogo'])->name('tenant.settings.logo.update');
                        Route::post('/settings/favicon', [\App\Http\Controllers\Tenant\Admin\SettingsController::class , 'updateFavicon'])->name('tenant.settings.favicon.update');

                        Route::get('/whatsapp', [\App\Http\Controllers\Tenant\Admin\WhatsAppController::class , 'edit'])->name('tenant.whatsapp.edit');
                        Route::patch('/whatsapp', [\App\Http\Controllers\Tenant\Admin\WhatsAppController::class , 'update'])->name('tenant.whatsapp.update');

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
                            Route::get('/', [\App\Http\Controllers\Tenant\Admin\PaymentMethodController::class , 'index'])->name('index');
                            Route::put('/{method}', [\App\Http\Controllers\Tenant\Admin\PaymentMethodController::class , 'updateMethod'])->name('update.method');
                            Route::post('/accounts', [\App\Http\Controllers\Tenant\Admin\PaymentMethodController::class , 'storeAccount'])->name('accounts.store');
                            Route::put('/accounts/{account}', [\App\Http\Controllers\Tenant\Admin\PaymentMethodController::class , 'updateAccount'])->name('accounts.update');
                            Route::delete('/accounts/{account}', [\App\Http\Controllers\Tenant\Admin\PaymentMethodController::class , 'destroyAccount'])->name('accounts.destroy');
                        }
                        );

                        // Shipping Methods
                        Route::prefix('shipping')->name('tenant.shipping.')->group(function () {
                            Route::get('/', [\App\Http\Controllers\Tenant\Admin\ShippingController::class , 'index'])->name('index');
                            Route::put('/{method}', [\App\Http\Controllers\Tenant\Admin\ShippingController::class , 'update'])->name('update');
                            Route::post('/{method}/zones', [\App\Http\Controllers\Tenant\Admin\ShippingController::class , 'updateZones'])->name('zones.update');
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
                        }
                        );

                        Route::prefix('media')->name('tenant.media.')->group(function () {
                            Route::get('/', [\App\Http\Controllers\Shared\MediaController::class , 'index'])->name('index');
                            Route::get('/list', [\App\Http\Controllers\Shared\MediaController::class , 'list'])->name('list');
                            Route::post('/folder', [\App\Http\Controllers\Shared\MediaController::class , 'createFolder'])->name('folder.create');
                            Route::post('/', [\App\Http\Controllers\Shared\MediaController::class , 'store'])->name('store');
                            Route::delete('/{id}', [\App\Http\Controllers\Shared\MediaController::class , 'destroy'])->name('destroy');
                        }
                        );
                    }
                    );
                }
                );
            });
