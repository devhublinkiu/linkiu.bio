<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the tenant admin's profile form.
     */
    public function edit(Request $request): Response
    {
        $tenant = app('currentTenant');
        if ($tenant) {
            $tenant->load('category.vertical');
        }

        return Inertia::render('Tenant/Admin/Profile/Edit', [
            'status' => session('status'),
            'tenant' => $tenant ? [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'category_name' => $tenant->category?->name,
                'vertical_name' => $tenant->category?->vertical?->name,
            ] : null,
        ]);
    }

    /**
     * Update the tenant admin's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
        ]);

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::back()->with('success', 'Perfil actualizado correctamente.');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validateWithBag('updatePassword', [
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return Redirect::back()->with('success', 'Contraseña actualizada correctamente.');
    }

    /**
     * Update the user's profile photo.
     */
    public function updatePhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'photo' => ['nullable', 'image', 'max:2048'],
            'photo_url' => ['nullable', 'string', 'url'],
        ]);

        $user = $request->user();

        if ($tenant = app('currentTenant')) {
            // Update Tenant Pivot
            if ($request->hasFile('photo')) {
                // Determine if we need to delete old file? (Maybe complex for pivot)
                // For now just overwrite path
                $path = $request->file('photo')->store('profiles/' . $tenant->id, 's3');
                $user->tenants()->updateExistingPivot($tenant->id, ['profile_photo_path' => $path]);
            } elseif ($request->input('photo_url')) {
                $user->tenants()->updateExistingPivot($tenant->id, ['profile_photo_path' => $request->input('photo_url')]);
            }
        } else {
            // Global fallback
            if ($request->hasFile('photo')) {
                if ($user->profile_photo_path && !filter_var($user->profile_photo_path, FILTER_VALIDATE_URL)) {
                    Storage::disk('s3')->delete($user->profile_photo_path);
                }
                $path = $request->file('photo')->store('profiles', 's3');
                $user->update(['profile_photo_path' => $path]);
            } elseif ($request->input('photo_url')) {
                $user->update(['profile_photo_path' => $request->input('photo_url')]);
            }
        }

        return Redirect::back()->with('success', 'Foto de perfil actualizada.');
    }

    /**
     * Delete the user's account (Optional / Context dependent).
     * For now, we might not want tenant admins to delete themselves easily.
     */
}
