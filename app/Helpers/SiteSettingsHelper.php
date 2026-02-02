<?php

namespace App\Helpers;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Storage;

class SiteSettingsHelper
{
    /**
     * Get publicized site settings (name, logo, etc)
     */
    public static function get(): array
    {
        $setting = SiteSetting::first();

        return [
            'app_name' => $setting->app_name ?? config('app.name', 'Linkiu'),
            'logo_url' => $setting?->logo_path
                ? Storage::disk('s3')->url($setting->logo_path)
                : null,
            'favicon_url' => $setting?->favicon_path
                ? Storage::disk('s3')->url($setting->favicon_path)
                : null,
        ];
    }
}
