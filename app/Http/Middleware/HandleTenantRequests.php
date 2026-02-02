<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleTenantRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenantSlug = $request->route('tenant');

        // Prevent collision with SuperAdmin management routes
        if (!$tenantSlug || $request->is('superlinkiu*')) {
            return $next($request);
        }

        $tenant = Tenant::where('slug', $tenantSlug)->firstOrFail();

        // Bind current tenant to the container for easy access globally
        app()->instance('currentTenant', $tenant);

        // Optional: Set default URL for route generation to include tenant
        // URL::defaults(['tenant' => $tenant->slug]);

        return $next($request);
    }
}
