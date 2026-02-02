<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Redirect;

class CheckSubscriptionStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!app()->bound('currentTenant')) {
            return $next($request);
        }

        $tenant = app('currentTenant');
        $isAdminRoute = $request->is('*/admin*');
        $subscription = $tenant->latestSubscription;

        // 1. ADMIN PANEL: Allow consistent access to prevent lockout
        if ($isAdminRoute) {
            // Always allow invoices, settings, profile, logout
            if (
                $request->is('*/admin/invoices*') ||
                $request->is('*/admin/settings*') ||
                $request->is('*/admin/profile*') ||
                $request->is('*/admin/logout')
            ) {
                return $next($request);
            }

            if (!$subscription) {
                return redirect()->route('tenant.invoices.index', ['tenant' => $tenant->slug])
                    ->withErrors(['error' => 'No tienes una suscripción activa.']);
            }

            // Status Check for Admin - Warn but Allow
            if (!in_array($subscription->status, ['active', 'trialing'])) {
                // If cancelled or clearly expired
                if (in_array($subscription->status, ['cancelled', 'expired'])) {
                    session()->flash('warning', "Tu suscripción está cancelada o expirada. Tu tienda pública no es visible.");
                }
                // If past due / overdue
                elseif ($subscription->status === 'past_due' || ($subscription->ends_at && $subscription->ends_at->isPast())) {
                    session()->flash('warning', "Tu suscripción ha vencido. Por favor realiza el pago para reactivar tu tienda pública.");
                }

                // Allow access to admin panel despite status (Option A)
                return $next($request);
            }

            return $next($request);
        }

        // 2. PUBLIC STORE (User Decision: Block if unpaid)
        if (!$subscription || !in_array($subscription->status, ['active', 'trialing'])) {
            // Render friendly "Unavailable" page
            return \Inertia\Inertia::render('Tenant/Public/Unavailable')
                ->toResponse($request)
                ->setStatusCode(403);
        }

        return $next($request);
    }
}