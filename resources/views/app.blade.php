<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    @php
        $ogTenant = app()->bound('currentTenant') ? app('currentTenant') : null;
        $routeName = request()->route()?->getName();
        $tenantPublicRoutes = [
            'tenant.home', 'tenant.menu', 'tenant.menu.category', 'tenant.public.locations',
            'tenant.reservations.index', 'tenant.public.shorts',
            'tenant.public.podcast', 'tenant.public.sermons', 'tenant.public.sermons.show',
            'tenant.public.devotionals', 'tenant.public.devotionals.show', 'tenant.public.services',
            'tenant.public.team', 'tenant.public.team.show', 'tenant.public.donations',
            'tenant.public.testimonials', 'tenant.public.testimonials.show', 'tenant.public.appointments.request',
        ];
        $isTenantPublic = $ogTenant && $routeName && in_array($routeName, $tenantPublicRoutes, true);
        $ogFromPage = (isset($page) && isset($page['props']['og']) && is_array($page['props']['og'])) ? $page['props']['og'] : null;
        $isPodcastRoute = $routeName === 'tenant.public.podcast';
    @endphp
    @if($isPodcastRoute && $ogTenant)
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="{{ 'Podcast - ' . $ogTenant->name }}">
        <meta property="og:description" content="Mensajes y enseñanzas en audio.">
        @if($ogTenant->logo_url ?? null)
        <meta property="og:image" content="{{ $ogTenant->logo_url }}">
        @endif
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ 'Podcast - ' . $ogTenant->name }}">
        <meta name="twitter:description" content="Mensajes y enseñanzas en audio.">
        @if($ogTenant->logo_url ?? null)
        <meta name="twitter:image" content="{{ $ogTenant->logo_url }}">
        @endif
    @elseif($ogFromPage)
        <meta property="og:type" content="{{ $ogFromPage['type'] ?? 'article' }}">
        <meta property="og:url" content="{{ $ogFromPage['url'] ?? url()->current() }}">
        <meta property="og:title" content="{{ $ogFromPage['title'] ?? '' }}">
        <meta property="og:description" content="{{ $ogFromPage['description'] ?? '' }}">
        @if(!empty($ogFromPage['image']))
        <meta property="og:image" content="{{ $ogFromPage['image'] }}">
        @endif
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $ogFromPage['title'] ?? '' }}">
        <meta name="twitter:description" content="{{ $ogFromPage['description'] ?? '' }}">
        @if(!empty($ogFromPage['image']))
        <meta name="twitter:image" content="{{ $ogFromPage['image'] }}">
        @endif
    @elseif($ogTenant && $isTenantPublic)
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="{{ $ogTenant->name }} - {{ config('app.name') }}">
        <meta property="og:description" content="{{ $ogTenant->store_description ?: 'Descubre nuestra tienda en ' . config('app.name') }}">
        @if($ogTenant->logo_url)
        <meta property="og:image" content="{{ $ogTenant->logo_url }}">
        @endif
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $ogTenant->name }} - {{ config('app.name') }}">
        <meta name="twitter:description" content="{{ $ogTenant->store_description ?: 'Descubre nuestra tienda en ' . config('app.name') }}">
        @if($ogTenant->logo_url)
        <meta name="twitter:image" content="{{ $ogTenant->logo_url }}">
        @endif
    @endif

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
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
    @routes
</body>

</html>