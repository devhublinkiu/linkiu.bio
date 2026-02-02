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
                'user' => $request->user(),
                'notifications' => $request->user() ? [
                    'unread_count' => $request->user()->unreadNotifications()->count(),
                    'recent' => $request->user()->notifications()->latest()->limit(5)->get(),
                ] : null,
            ],
            'currentTenant' => app()->bound('currentTenant')
                ? app('currentTenant')->load(['latestSubscription.plan', 'pendingInvoice', 'vertical'])
                : null,
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
                return $settings ? [
                    'app_name' => $settings->app_name,
                    'logo_url' => $settings->logo_path ? \Illuminate\Support\Facades\Storage::disk('s3')->url($settings->logo_path) : null,
                    'favicon_url' => $settings->favicon_path ? \Illuminate\Support\Facades\Storage::disk('s3')->url($settings->favicon_path) : null,
                ] : null;
            }),
        ];
    }
}
