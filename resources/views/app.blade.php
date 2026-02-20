<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @inertiaHead

    @php
        $tenant = app()->bound('currentTenant') ? app('currentTenant') : null;
        $tenantFavicon = null;

        $storageDisk = \Illuminate\Support\Facades\Storage::disk('bunny');
        if ($tenant && isset($tenant->settings['favicon_url'])) {
            $tenantFavicon = $tenant->settings['favicon_url'];
        } elseif ($tenant && isset($tenant->settings['favicon_path'])) {
            $tenantFavicon = $storageDisk->url($tenant->settings['favicon_path']);
        }

        $globalSettings = \Illuminate\Support\Facades\Cache::remember('site_settings_global', 3600, function () {
            $settingModel = \App\Models\SiteSetting::first();
            $disk = \Illuminate\Support\Facades\Storage::disk('bunny');
            return $settingModel ? [
                'app_name' => $settingModel->app_name,
                'logo_url' => $settingModel->logo_path ? $disk->url($settingModel->logo_path) : null,
                'favicon_url' => $settingModel->favicon_path ? $disk->url($settingModel->favicon_path) : null,
            ] : null;
        });

        $faviconUrl = $tenantFavicon ?? ($globalSettings['favicon_url'] ?? null);
    @endphp

    @if($faviconUrl)
        <link rel="icon" href="{{ $faviconUrl }}">
    @endif
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>