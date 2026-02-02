<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/SuperAdminLogin', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Redirect to SuperAdmin dashboard if user has permission or is super admin
        // Assuming global context (no tenant)
        if ($request->user()->is_super_admin || $request->user()->hasGlobalPermission('sa.view')) {
            return redirect()->intended(route('superadmin.dashboard', absolute: false));
        }

        // Fallback for regular users in global context (maybe they shouldn't be here?)
        // If they have no roles, maybe redirect to home or show error?
        // For now, let's allow dashboard access if they have *any* global role
        if ($request->user()->role_id) {
            return redirect()->intended(route('superadmin.dashboard', absolute: false));
        }

        return redirect()->intended(route('welcome', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        // If we are in superadmin context (URL prefix check or similar), redirect to superadmin login
        if ($request->is('superlinkiu/*') || str_contains(url()->previous(), 'superlinkiu')) {
            return redirect()->route('login');
        }

        return redirect('/');
    }
}
