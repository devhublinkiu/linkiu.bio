<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function __construct()
    {
        $this->middleware('sa.permission:sa.settings.view')->only('index');
        $this->middleware('sa.permission:sa.settings.update')->only('update');
    }

    public function index()
    {
        $settings = SiteSetting::firstOrCreate(
            ['id' => 1],
            ['app_name' => 'Linkiu.bio']
        );

        return Inertia::render('SuperAdmin/Settings/Index', [
            'settings' => $settings->toArray(),
            'logo_url' => $settings->logo_path ? Storage::disk('s3')->url($settings->logo_path) : null,
            'favicon_url' => $settings->favicon_path ? Storage::disk('s3')->url($settings->favicon_path) : null,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'app_name' => 'required|string|max:255',
            'support_email' => 'nullable|email|max:255',
            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'bank_name' => 'nullable|string|max:255',
            'bank_account_type' => 'nullable|string|max:255',
            'bank_account_number' => 'nullable|string|max:255',
            'bank_account_holder' => 'nullable|string|max:255',
            'bank_account_nit' => 'nullable|string|max:255',
            'logo' => 'nullable|file|mimes:jpeg,png,jpg,svg,xml,webp|max:2048',
            'favicon' => 'nullable|file|mimes:ico,png,svg,xml,webp|max:1024',
            'profile_photo' => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $settings = SiteSetting::firstOrCreate(
            ['id' => 1],
            ['app_name' => 'Linkiu.bio']
        );
        $user = $request->user();

        // Basic fields for settings
        $data = $request->only([
            'app_name',
            'support_email',
            'facebook_url',
            'instagram_url',
            'twitter_url',
            'meta_title',
            'meta_description',
            'bank_name',
            'bank_account_type',
            'bank_account_number',
            'bank_account_holder',
            'bank_account_nit'
        ]);

        if ($request->hasFile('logo')) {
            if ($settings->logo_path) {
                Storage::disk('s3')->delete($settings->logo_path);
            }
            $path = $request->file('logo')->store('site-assets', ['disk' => 's3', 'visibility' => 'public']);
            $data['logo_path'] = $path;
        }

        if ($request->hasFile('favicon')) {
            if ($settings->favicon_path) {
                Storage::disk('s3')->delete($settings->favicon_path);
            }
            $path = $request->file('favicon')->store('site-assets', ['disk' => 's3', 'visibility' => 'public']);
            $data['favicon_path'] = $path;
        }

        // Handle User Profile Photo
        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo_path) {
                Storage::disk('s3')->delete($user->profile_photo_path);
            }
            $user_path = $request->file('profile_photo')->store('profile-photos', ['disk' => 's3', 'visibility' => 'public']);
            $user->update(['profile_photo_path' => $user_path]);
        }

        $settings->update($data);

        // Invalidate global cache so the layout updates immediately
        \Illuminate\Support\Facades\Cache::forget('site_settings_global');

        return redirect()->back()->with('success', 'Configuración actualizada correctamente.');
    }
}
