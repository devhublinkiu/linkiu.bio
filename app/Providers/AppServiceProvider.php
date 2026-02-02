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

                // Legacy Role Check (Transition period)
                // Owner has full access to their tenant
                if ($pivot->role === 'owner') {
                    return true;
                }

                // Custom Role Check
                if ($pivot->role_id) {
                    // Ideally, cache this or eager load on login
                    $role = \App\Models\Role::with('permissions')->find($pivot->role_id);

                    if ($role && $role->permissions->contains('name', $ability)) {
                        return true;
                    }
                }
            }

            return null; // Continue to other gates or deny
        });
    }
}
