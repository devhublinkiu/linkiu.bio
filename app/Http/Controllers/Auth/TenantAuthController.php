<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\SiteSettingsHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TenantAuthController extends Controller
{
    /**
     * Display the tenant login view.
     */
    public function showLogin(Request $request): Response|RedirectResponse
    {
        // If already logged in, go to dashboard
        if (Auth::check()) {
            return redirect()->route('tenant.dashboard', ['tenant' => $request->route('tenant')]);
        }

        $tenant = app('currentTenant');

        return Inertia::render('Tenant/Admin/Login', [
            'tenant' => [
                'name' => $tenant->name,
                'slug' => $tenant->slug,
            ],
            'status' => session('status'),
            'siteSettings' => SiteSettingsHelper::get(),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function login(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $tenant = app('currentTenant');

        // DO NOT use intended() here to avoid redirection conflicts with SuperAdmin
        if (Auth::user()->hasRole($tenant->id, 'waiter')) {
            return redirect()->route('tenant.admin.pos', ['tenant' => $tenant->slug]);
        }

        return redirect()->route('tenant.dashboard', ['tenant' => $tenant->slug]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        $tenant = app('currentTenant');

        return redirect()->route('tenant.login', ['tenant' => $tenant->slug]);
    }
}
