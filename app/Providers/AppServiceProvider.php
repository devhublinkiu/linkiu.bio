<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        \Illuminate\Support\Facades\Gate::before(function ($user, $ability) {
            // 1. Super Admin Global Bypass
            if ($user->is_super_admin) {
                return true;
            }

            // 2. Tenant Context Check
            if (app()->bound('currentTenant')) {
                $tenant = app('currentTenant');

                // Check if user belongs to this tenant
                $member = $user->tenants->find($tenant->id);

                if (!$member) {
                    return null; // Not member of this tenant
                }

                $pivot = $member->pivot;

                // Role-based Access Logic
                if ($pivot->role === 'owner') {
                    return true;
                }

                if ($pivot->role_id) {
                    // Ideally, cache this or eager load on login
                    $role = \App\Models\Role::with('permissions')->find($pivot->role_id);

                    if ($role) {
                        // Priority 1: Full Bypass for Propietario system role
                        if ($role->name === 'Propietario') {
                            return true;
                        }

                        // Priority 2: Granular permission check
                        if ($role->permissions->contains('name', $ability)) {
                            return true;
                        }
                    }
                }
            }

            return null; // Continue to other gates or deny
        });
    }
}
