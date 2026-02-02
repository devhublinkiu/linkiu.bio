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

// Media Proxy Route for Local MinIO (Fixes Mixed Content HTTPS/HTTP)
Route::get('/media/{path}', function ($path) {
    /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
    $disk = Storage::disk('s3');

    if (!$disk->exists($path)) {
        abort(404);
    }
    $content = $disk->get($path);
    $mime = $disk->mimeType($path);
    return response($content)->header('Content-Type', $mime);
})->where('path', '.*')->name('media.proxy');

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

// 2. SuperAdmin Auth
Route::prefix('superlinkiu')->group(function () {
    require __DIR__ . '/auth.php';
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Notifications
    // Notifications
    Route::post('/notifications/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
    Route::post('/notifications/{id}/mark-read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.markRead');
    Route::delete('/notifications/destroy-all-read', [\App\Http\Controllers\NotificationController::class, 'destroyAllRead'])->name('notifications.destroyAllRead');
    Route::delete('/notifications/{id}', [\App\Http\Controllers\NotificationController::class, 'destroy'])->name('notifications.destroy');
});

// 3. SuperAdmin Zone
Route::prefix('superlinkiu')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('SuperAdmin/Dashboard');
    })->name('superadmin.dashboard');

    Route::resource('tenants', \App\Http\Controllers\SuperAdmin\TenantController::class);
    Route::resource('categories', \App\Http\Controllers\SuperAdmin\BusinessCategoryController::class)->except(['create', 'show', 'edit']);
    Route::resource('users', \App\Http\Controllers\SuperAdmin\UserController::class)->except(['create', 'show', 'edit', 'store']);

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
    Route::prefix('media')->name('media.')->group(function () {
        Route::get('/', [\App\Http\Controllers\SuperAdmin\MediaController::class, 'index'])->name('index');
        Route::post('/', [\App\Http\Controllers\SuperAdmin\MediaController::class, 'store'])->name('store');
        Route::post('/create-folder', [\App\Http\Controllers\SuperAdmin\MediaController::class, 'createFolder'])->name('create-folder');
        Route::post('/{mediaFile}/move', [\App\Http\Controllers\SuperAdmin\MediaController::class, 'moveToFolder'])->name('move');
        Route::get('/{mediaFile}', [\App\Http\Controllers\SuperAdmin\MediaController::class, 'show'])->name('show');
        Route::put('/{mediaFile}', [\App\Http\Controllers\SuperAdmin\MediaController::class, 'update'])->name('update');
        Route::delete('/{mediaFile}', [\App\Http\Controllers\SuperAdmin\MediaController::class, 'destroy'])->name('destroy');
        Route::post('/bulk-delete', [\App\Http\Controllers\SuperAdmin\MediaController::class, 'bulkDelete'])->name('bulk-delete');
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
        });
    });
});
