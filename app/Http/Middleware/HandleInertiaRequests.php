<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => function () use ($request) {
                    $user = $request->user();
                    if (!$user)
                        return null;

                    return array_merge($user->toArray(), [
                        'profile_photo_url' => $user->profile_photo_url,
                        'global_role' => $user->globalRole ? [
                            'name' => $user->globalRole->name,
                        ] : null,
                    ]);
                },
                'notifications' => $request->user() ? [
                    'unread_count' => $request->user()->unreadNotifications()->count(),
                    'recent' => $request->user()->notifications()->latest()->limit(5)->get(),
                ] : null,
                'permissions' => function () use ($request) {
                    $user = $request->user();
                    if (!$user)
                        return [];

                    // Super Admin Bypass
                    if ($user->is_super_admin)
                        return ['*'];

                    // Global/System Permissions (when outside tenant context)
                    if (!app()->bound('currentTenant')) {
                        $user->loadMissing('globalRole.permissions');
                        return $user->globalRole ? $user->globalRole->permissions->pluck('name')->toArray() : [];
                    }

                    return [];
                },
            ],
            'currentTenant' => app()->bound('currentTenant')
                ? app('currentTenant')->load(['latestSubscription.plan', 'pendingInvoice', 'vertical'])
                : null,
            'currentUserRole' => function () use ($request) {
                // Determine role for current tenant
                if (!app()->bound('currentTenant') || !$request->user())
                    return null;

                $tenant = app('currentTenant');
                // Check pivot directly or use helper if available? helper logic is easiest to reimplement here or call
                // We can use the relation loaded on user, BUT we need to be careful about not loading all tenants.
                // Better to query the pivot specifically or use the cached relation if already loaded.
    
                $pivot = $request->user()->tenants()->where('tenant_id', $tenant->id)->first()?->pivot;

                if (!$pivot)
                    return null;

                $roleName = 'Miembro';
                if ($pivot->role_id) {
                    $role = \App\Models\Role::find($pivot->role_id);
                    if ($role)
                        $roleName = $role->name;
                } elseif ($pivot->role === 'owner') {
                    $roleName = 'Propietario';
                }

                return [
                    'label' => $roleName,
                    'is_owner' => $pivot->role === 'owner',
                    'permissions' => $pivot->role === 'owner'
                        ? ['*'] // Owner has all permissions
                        : (isset($role) ? $role->permissions->pluck('name')->toArray() : [])
                ];
            },
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'info' => fn() => $request->session()->get('info'),
                // Custom flash for plan change slug warning
                'slug_warning' => fn() => $request->session()->get('slug_warning'),
                'current_slug' => fn() => $request->session()->get('current_slug'),
                'new_auto_slug' => fn() => $request->session()->get('new_auto_slug'),
                'pending_plan_id' => fn() => $request->session()->get('pending_plan_id'),
                'pending_billing_cycle' => fn() => $request->session()->get('pending_billing_cycle'),
            ],
            'site_settings' => fn() => cache()->remember('site_settings_global', 3600, function () {
                $settings = \App\Models\SiteSetting::first();
                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = \Illuminate\Support\Facades\Storage::disk('s3');

                return $settings ? [
                    'app_name' => $settings->app_name,
                    'logo_url' => $settings->logo_path ? $disk->url($settings->logo_path) : null,
                    'favicon_url' => $settings->favicon_path ? $disk->url($settings->favicon_path) : null,
                ] : null;
            }),
            'selectedTable' => session('selected_table'),
        ];
    }
}
