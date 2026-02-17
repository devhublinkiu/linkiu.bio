<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use App\Traits\StoresImageAsWebp;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    use StoresImageAsWebp;

    /**
     * Display the tenant admin's profile form.
     */
    public function edit(Request $request): Response
    {
        Gate::authorize('profile.view');

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
        Gate::authorize('profile.edit');

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
        Gate::authorize('profile.edit');

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
        Gate::authorize('profile.edit');

        $request->validate([
            'photo' => ['nullable', 'image', 'max:2048'],
            'photo_url' => ['nullable', 'string', 'url'],
        ]);

        $user = $request->user();

        if ($tenant = app('currentTenant')) {
            $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenant->slug ?? ''));
            $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenant->id) . '/profiles';

            if ($request->hasFile('photo')) {
                try {
                    // Delete old photo if exists
                    $oldPath = $user->tenants()->where('tenant_id', $tenant->id)->first()?->pivot->profile_photo_path;
                    if ($oldPath && !filter_var($oldPath, FILTER_VALIDATE_URL)) {
                        Storage::disk('bunny')->delete($oldPath);
                    }

                    $path = $this->storeImageAsWebp($request->file('photo'), $basePath);
                    $user->tenants()->updateExistingPivot($tenant->id, ['profile_photo_path' => $path]);
                    $this->registerMedia($path, 'bunny');
                } catch (\Throwable $e) {
                    if (isset($path)) {
                        Storage::disk('bunny')->delete($path);
                    }
                    return back()->withErrors(['photo' => 'Error al subir la foto. Intenta de nuevo.']);
                }
            } elseif ($request->input('photo_url')) {
                $user->tenants()->updateExistingPivot($tenant->id, ['profile_photo_path' => $request->input('photo_url')]);
            }
        } else {
            $basePath = 'uploads/profiles';

            if ($request->hasFile('photo')) {
                try {
                    if ($user->profile_photo_path && !filter_var($user->profile_photo_path, FILTER_VALIDATE_URL)) {
                        Storage::disk('bunny')->delete($user->profile_photo_path);
                    }

                    $path = $this->storeImageAsWebp($request->file('photo'), $basePath);
                    $user->update(['profile_photo_path' => $path]);
                    $this->registerMedia($path, 'bunny');
                } catch (\Throwable $e) {
                    if (isset($path)) {
                        Storage::disk('bunny')->delete($path);
                    }
                    return back()->withErrors(['photo' => 'Error al subir la foto. Intenta de nuevo.']);
                }
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
