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
            'photo' => ['required', 'image', 'max:2048'],
        ]);

        $user = $request->user();

        if ($user->profile_photo_path) {
            Storage::disk('s3')->delete($user->profile_photo_path);
        }

        $path = $request->file('photo')->store('profiles', 's3');

        $user->update([
            'profile_photo_path' => $path,
        ]);

        return Redirect::back()->with('success', 'Foto de perfil actualizada.');
    }

    /**
     * Delete the user's account (Optional / Context dependent).
     * For now, we might not want tenant admins to delete themselves easily.
     */
}
