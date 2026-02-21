<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleTenantRequests::class,
            \App\Http\Middleware\CheckSubscriptionStatus::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'sa.permission' => \App\Http\Middleware\EnsureGlobalPermission::class,
        ]);

        $middleware->redirectGuestsTo(function (\Illuminate\Http\Request $request) {
            // Robust check using URL segments to capture /slug/admin context
            if ($request->is('*/admin') || $request->is('*/admin/*')) {
                $slug = $request->segment(1);
                // Ensure we don't trap superadmin or other reserved prefixes if they exist
                if ($slug && $slug !== 'superlinkiu' && $slug !== 'admin') {
                    return route('tenant.login', ['tenant' => $slug]);
                }
            }

            return route('login');
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        if (class_exists(\Sentry\Laravel\Integration::class)) {
            \Sentry\Laravel\Integration::handles($exceptions);
        }
    })->create();
