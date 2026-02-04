<?php

use App\Http\Controllers\ProfileController;
use App\Http\Middleware\HandleTenantRequests;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use Illuminate\Support\Facades\Storage;

// 1. Landing Page (Global)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/test-broadcast', function () {
    // Manually broadcast to check connection
    $msg = 'Helllo from server ' . now();
    // Use Ably SDK directly if possible or mock event
    \Illuminate\Support\Facades\Broadcast::on(new \Illuminate\Broadcasting\Channel('superadmin-updates'))
        ->as('icon.requested')
        ->with(['message' => $msg])
        ->send();
    return "Broadcast sent: $msg";
});



// Public Tenant Onboarding (Multi-step)
Route::prefix('onboarding')->name('onboarding.')->group(function () {
    // Step 1: Select vertical, category, plan
    Route::get('/', [\App\Http\Controllers\OnboardingController::class, 'step1'])->name('step1');
    Route::post('/step1', [\App\Http\Controllers\OnboardingController::class, 'storeStep1'])->name('step1.store');

    // Step 2: Business details (name, slug, phone)
    Route::get('/negocio', [\App\Http\Controllers\OnboardingController::class, 'step2'])->name('step2');
    Route::post('/step2', [\App\Http\Controllers\OnboardingController::class, 'storeStep2'])->name('step2.store');

    // Step 3: Account creation
    Route::get('/cuenta', [\App\Http\Controllers\OnboardingController::class, 'step3'])->name('step3');
    Route::post('/complete', [\App\Http\Controllers\OnboardingController::class, 'complete'])->name('complete');

    // Post-registration pages
    Route::get('/construyendo', [\App\Http\Controllers\OnboardingController::class, 'building'])->name('building');
    Route::get('/listo', [\App\Http\Controllers\OnboardingController::class, 'success'])->name('success');
    Route::get('/pendiente', [\App\Http\Controllers\OnboardingController::class, 'pending'])->name('pending');
});

// Legacy route redirect (keep old URL working)
Route::get('/register/tenant', fn() => redirect()->route('onboarding.step1'))->name('register.tenant');

// WhatsApp Verification
Route::post('/auth/whatsapp/send', [\App\Http\Controllers\Auth\WhatsAppVerificationController::class, 'send'])->name('auth.whatsapp.send');
Route::post('/auth/whatsapp/verify', [\App\Http\Controllers\Auth\WhatsAppVerificationController::class, 'verify'])->name('auth.whatsapp.verify');

// Global Media Proxy (must be before other wildcard routes if any)
// Handles /media/site-assets/... mapping to S3
Route::get('/media/{path}', [\App\Http\Controllers\Shared\MediaController::class, 'file'])
    ->where('path', '.*')
    ->name('media.proxy');

// 2. SuperAdmin Auth
Route::prefix('superlinkiu')->group(function () {
    require __DIR__ . '/auth.php';
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // SuperAdmin Specific Profile (for internal naming consistency)
    Route::prefix('superlinkiu')->name('superadmin.')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // Notifications
    Route::post('/notifications/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
    Route::post('/notifications/{id}/mark-read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.markRead');
    Route::delete('/notifications/destroy-all-read', [\App\Http\Controllers\NotificationController::class, 'destroyAllRead'])->name('notifications.destroyAllRead');
    Route::delete('/notifications/{id}', [\App\Http\Controllers\NotificationController::class, 'destroy'])->name('notifications.destroy');

    // Debug Route
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
});

// 3. SuperAdmin Zone
Route::prefix('superlinkiu')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('SuperAdmin/Dashboard');
    })->name('superadmin.dashboard');

    Route::resource('tenants', \App\Http\Controllers\SuperAdmin\TenantController::class);
    Route::resource('categories', \App\Http\Controllers\SuperAdmin\BusinessCategoryController::class)->except(['create', 'show', 'edit']);
    Route::resource('users', \App\Http\Controllers\SuperAdmin\UserController::class)->except(['show', 'edit']);
    Route::resource('roles', \App\Http\Controllers\SuperAdmin\RoleController::class);

    // Categories & Icons
    Route::resource('category-icons', \App\Http\Controllers\SuperAdmin\CategoryIconController::class);

    // Support & Requests
    Route::prefix('support')->group(function () {
        Route::get('requests', [\App\Http\Controllers\SuperAdmin\IconRequestController::class, 'index'])->name('icon-requests.index');
    });
    Route::patch('icon-requests/{iconRequest}/approve', [\App\Http\Controllers\SuperAdmin\IconRequestController::class, 'approve'])->name('icon-requests.approve');
    Route::patch('icon-requests/{iconRequest}/reject', [\App\Http\Controllers\SuperAdmin\IconRequestController::class, 'reject'])->name('icon-requests.reject');

    // Settings
    Route::get('/settings', [\App\Http\Controllers\SuperAdmin\SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [\App\Http\Controllers\SuperAdmin\SettingController::class, 'update'])->name('settings.update');
    Route::post('/settings', [\App\Http\Controllers\SuperAdmin\SettingController::class, 'update'])->name('settings.update');

    // Plans
    Route::resource('plans', \App\Http\Controllers\SuperAdmin\PlanController::class);

    // Billing
    Route::get('/subscriptions', [\App\Http\Controllers\SuperAdmin\SubscriptionController::class, 'index'])->name('subscriptions.index');
    Route::get('/payments', [\App\Http\Controllers\SuperAdmin\PaymentController::class, 'index'])->name('payments.index');
    Route::put('/payments/{payment}', [\App\Http\Controllers\SuperAdmin\PaymentController::class, 'update'])->name('payments.update');

    // Media Management
    // Media Management (Unified Shared Controller)
    Route::prefix('media')->name('media.')->group(function () {
        Route::get('/', [\App\Http\Controllers\SuperAdmin\MediaController::class, 'index'])->name('index');
        // Route::get('/list', [\App\Http\Controllers\Shared\MediaController::class, 'list'])->name('list'); // Unused in SA Media?
        Route::post('/create-folder', [\App\Http\Controllers\SuperAdmin\MediaController::class, 'createFolder'])->name('create-folder'); // Matches Index.tsx
        Route::post('/delete-folder', [\App\Http\Controllers\SuperAdmin\MediaController::class, 'deleteFolder'])->name('folder.delete');
        Route::post('/', [\App\Http\Controllers\SuperAdmin\MediaController::class, 'store'])->name('store');
        Route::delete('/{id}', [\App\Http\Controllers\SuperAdmin\MediaController::class, 'destroy'])->name('destroy');
    });
});



// 4. Tenant Zone
Route::prefix('{tenant}')->group(function () {

    // 4.1 Tenant Public URL
    Route::get('/', function ($tenant) {
        return Inertia::render('Tenant/Public/Home', [
            'tenant' => app('currentTenant')
        ]);
    })->name('tenant.home');

    // 4.2 Tenant Admin Panel
    Route::prefix('admin')->group(function () {
        // Redirect /slug/admin to /slug/admin/dashboard
        Route::get('/', function () {
            return redirect()->route('tenant.dashboard', ['tenant' => app('currentTenant')->slug]);
        });

        // Login routes for tenant admin (manual check for authenticated users in controller)
        Route::get('/login', [\App\Http\Controllers\Auth\TenantAuthController::class, 'showLogin'])->name('tenant.login');
        Route::post('/login', [\App\Http\Controllers\Auth\TenantAuthController::class, 'login'])->name('tenant.login.post');

        // Authenticated routes for tenant admin
        Route::middleware(['auth'])->group(function () {
            Route::get('/dashboard', function () {
                return Inertia::render('Tenant/Admin/Dashboard');
            })->name('tenant.dashboard');

            Route::get('/profile', [\App\Http\Controllers\Tenant\Admin\ProfileController::class, 'edit'])->name('tenant.profile.edit');
            Route::patch('/profile', [\App\Http\Controllers\Tenant\Admin\ProfileController::class, 'update'])->name('tenant.profile.update');
            Route::put('/profile/password', [\App\Http\Controllers\Tenant\Admin\ProfileController::class, 'updatePassword'])->name('tenant.profile.password.update');
            Route::post('/profile/photo', [\App\Http\Controllers\Tenant\Admin\ProfileController::class, 'updatePhoto'])->name('tenant.profile.photo.update');

            // 4.3 Roles
            Route::resource('roles', \App\Http\Controllers\Tenant\Admin\RoleController::class)->names('tenant.roles');

            // 4.3b Members
            Route::resource('members', \App\Http\Controllers\Tenant\Admin\MemberController::class)->names('tenant.members');

            // 4.4 Categories
            Route::resource('categories', \App\Http\Controllers\Tenant\Admin\CategoryController::class)->names('tenant.categories');
            Route::patch('categories/{category}/toggle-active', [\App\Http\Controllers\Tenant\Admin\CategoryController::class, 'toggleActive'])->name('tenant.categories.toggle-active');
            Route::post('categories/request-icon', [\App\Http\Controllers\Tenant\Admin\CategoryController::class, 'requestIcon'])->name('tenant.categories.request-icon');

            Route::get('/settings', [\App\Http\Controllers\Tenant\Admin\SettingsController::class, 'edit'])->name('tenant.settings.edit');
            Route::patch('/settings', [\App\Http\Controllers\Tenant\Admin\SettingsController::class, 'update'])->name('tenant.settings.update');
            Route::post('/settings/logo', [\App\Http\Controllers\Tenant\Admin\SettingsController::class, 'updateLogo'])->name('tenant.settings.logo.update');
            Route::post('/settings/favicon', [\App\Http\Controllers\Tenant\Admin\SettingsController::class, 'updateFavicon'])->name('tenant.settings.favicon.update');

            Route::post('/logout', [\App\Http\Controllers\Auth\TenantAuthController::class, 'logout'])->name('tenant.logout');

            // Subscriptions & Plans
            Route::get('/subscription', [\App\Http\Controllers\Tenant\Admin\SubscriptionController::class, 'index'])->name('tenant.subscription.index');
            Route::post('/subscription/change-plan', [\App\Http\Controllers\Tenant\Admin\SubscriptionController::class, 'changePlan'])->name('tenant.subscription.change-plan');
            Route::post('/subscription/advance-invoice', [\App\Http\Controllers\Tenant\Admin\SubscriptionController::class, 'generateAdvanceInvoice'])->name('tenant.subscription.advance-invoice');

            // Invoices & Payments
            Route::get('/invoices', [\App\Http\Controllers\Tenant\Admin\InvoiceController::class, 'index'])->name('tenant.invoices.index');
            Route::get('/invoices/{invoice}', [\App\Http\Controllers\Tenant\Admin\InvoiceController::class, 'show'])->name('tenant.invoices.show');
            Route::post('/invoices/upload', [\App\Http\Controllers\Tenant\Admin\InvoiceController::class, 'store'])->name('tenant.invoices.store');
            Route::post('/invoices/upload', [\App\Http\Controllers\Tenant\Admin\InvoiceController::class, 'store'])->name('tenant.invoices.store');

            // Shared Media Management (Tenant Context)
            Route::prefix('media')->name('tenant.media.')->group(function () {
                Route::get('/', [\App\Http\Controllers\Shared\MediaController::class, 'index'])->name('index');
                Route::get('/list', [\App\Http\Controllers\Shared\MediaController::class, 'list'])->name('list');
                Route::post('/folder', [\App\Http\Controllers\Shared\MediaController::class, 'createFolder'])->name('folder.create');
                Route::post('/', [\App\Http\Controllers\Shared\MediaController::class, 'store'])->name('store');
                Route::delete('/{id}', [\App\Http\Controllers\Shared\MediaController::class, 'destroy'])->name('destroy');
            });
        });
    });
});
