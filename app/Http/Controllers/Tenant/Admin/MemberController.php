<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index()
    {
        $tenant = app('currentTenant');

        $members = $tenant->users()
            ->withPivot(['role', 'role_id', 'created_at'])
            ->get()
            ->map(function ($user) {
                // Fetch role name for display
                // If role_id is present, get custom role name
                // If not, use legacy 'role' string
                $userRole = 'Miembro';
                $roleType = 'legacy';

                if ($user->pivot->role_id) {
                    $role = \App\Models\Role::find($user->pivot->role_id);
                    if ($role) {
                        $userRole = $role->name;
                        $roleType = $role->is_system ? 'system' : 'custom';
                    }
                } elseif ($user->pivot->role === 'owner') {
                    $userRole = 'Propietario';
                    $roleType = 'owner';
                }

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'profile_photo_url' => $user->profile_photo_url,
                    'role_label' => $userRole,
                    'role_type' => $roleType,
                    'pivot' => $user->pivot,
                ];
            });

        $availableRoles = \App\Models\Role::where('tenant_id', $tenant->id)->get();

        return \Inertia\Inertia::render('Tenant/Admin/Members/Index', [
            'members' => $members,
            'roles' => $availableRoles
        ]);
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'role_id' => 'required|exists:roles,id',
            'name' => 'nullable|string|max:255', // Required if new user
            'password' => 'nullable|string|min:8', // Required if new user
        ]);

        $tenant = app('currentTenant');

        // Find user by email
        $user = \App\Models\User::where('email', $request->email)->first();

        if (!$user) {
            // Create new user
            if (!$request->name || !$request->password) {
                return back()->with('error', 'Para nuevos usuarios, el nombre y la contraseña son obligatorios.');
            }

            $user = \App\Models\User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => \Illuminate\Support\Facades\Hash::make($request->password),
                'email_verified_at' => now(), // Auto-verify for simplicity or require email verification?
                // For a smooth onboarding, maybe auto-verify or send link. 
                // Let's auto-verify for now as it's an admin creating it.
            ]);
        }

        // Check if already a member
        if ($tenant->users()->where('user_id', $user->id)->exists()) {
            return back()->with('error', 'El usuario ya es miembro del equipo.');
        }

        $tenant->users()->attach($user->id, [
            'role_id' => $request->role_id,
            'role' => 'member',
        ]);

        return back()->with('success', 'Miembro agregado correctamente.');
    }

    public function update(\Illuminate\Http\Request $request, $tenant, $id)
    {
        $tenantModel = app('currentTenant');
        $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $tenantModel->users()->updateExistingPivot($id, [
            'role_id' => $request->role_id,
        ]);

        return back()->with('success', 'Rol actualizado correctamente.');
    }

    public function destroy($tenant, $id)
    {
        $tenantModel = app('currentTenant');

        // Prevent deleting oneself
        if (auth()->id() == $id) {
            return back()->with('error', 'No puedes eliminarte a ti mismo.');
        }

        // Prevent deleting owner (legacy check)
        $user = $tenantModel->users()->find($id);
        if ($user && $user->pivot->role === 'owner') {
            return back()->with('error', 'No se puede eliminar al propietario.');
        }

        $tenantModel->users()->detach($id);

        return back()->with('success', 'Miembro eliminado del equipo.');
    }
}
