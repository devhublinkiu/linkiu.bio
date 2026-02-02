<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead

        @php
            $settings = \Illuminate\Support\Facades\Cache::remember('site_settings_global', 3600, function () {
                $settingModel = \App\Models\SiteSetting::first();
                return $settingModel ? [
                    'app_name' => $settingModel->app_name,
                    'logo_url' => $settingModel->logo_path ? \Illuminate\Support\Facades\Storage::disk('s3')->url($settingModel->logo_path) : null,
                    'favicon_url' => $settingModel->favicon_path ? \Illuminate\Support\Facades\Storage::disk('s3')->url($settingModel->favicon_path) : null,
                ] : null;
            });
            
            $faviconUrl = $settings['favicon_url'] ?? null;
        @endphp

        @if($faviconUrl)
            <link rel="icon" href="{{ $faviconUrl }}">
        @endif
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>