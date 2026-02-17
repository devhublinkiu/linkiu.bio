<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Tenant\Locations\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index()
    {
        Gate::authorize("users.view");

        $tenant = app("currentTenant");

        // Optimización N+1: Cargar miembros con sus roles a través del tenant.
        $members = $tenant->users()
            ->withPivot(["role", "role_id", "location_id", "created_at"])
            ->get()
            ->map(function ($user) use ($tenant) {
            $userRole = "Miembro";
            $roleType = "legacy";

            // PRIORIDAD: Si es el dueño, ignoramos cualquier otro rol asignado para proteger sus permisos.
            if ($user->id === $tenant->owner_id) {
                $userRole = "Propietario";
                $roleType = "owner";
            }
            elseif ($user->pivot->role_id) {
                $role = Role::find($user->pivot->role_id);
                if ($role) {
                    $userRole = $role->name;
                    $roleType = $role->is_system ? "system" : "custom";
                }
            }

            return [
            "id" => $user->id,
            "name" => $user->name,
            "email" => $user->email,
            "profile_photo_url" => $user->profile_photo_url,
            "role_label" => $userRole,
            "role_type" => $roleType,
            "pivot" => $user->pivot,
            ];
        });

        $availableRoles = Role::where("tenant_id", $tenant->id)->get();
        $locations = Location::where("tenant_id", $tenant->id)->active()->get();

        return Inertia::render("Tenant/Admin/Members/Index", [
            "members" => $members,
            "roles" => $availableRoles,
            "locations" => $locations
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize("users.create");

        $request->validate([
            "email" => "required|email",
            "role_id" => "required|exists:roles,id",
            "location_id" => "nullable|exists:locations,id",
            "name" => "nullable|string|max:255",
            "password" => "nullable|string|min:8",
        ]);

        $tenant = app("currentTenant");

        $user = User::where("email", $request->email)->first();

        if (!$user) {
            if (!$request->name || !$request->password) {
                return back()->with("error", "Para nuevos usuarios, el nombre y la contraseña son obligatorios.");
            }

            $user = User::create([
                "name" => $request->name,
                "email" => $request->email,
                "password" => Hash::make($request->password),
                "email_verified_at" => now(),
            ]);
        }

        if ($tenant->users()->where("user_id", $user->id)->exists()) {
            return back()->with("error", "El usuario ya es miembro del equipo.");
        }

        $tenant->users()->attach($user->id, [
            "role_id" => $request->role_id,
            "location_id" => $request->location_id,
            "role" => "member",
        ]);

        return back()->with("success", "Miembro agregado correctamente.");
    }

    public function update(Request $request, $tenant, $id)
    {
        Gate::authorize("users.update");

        $tenantModel = app("currentTenant");

        $request->validate([
            "role_id" => "sometimes|exists:roles,id",
            "location_id" => "nullable|exists:locations,id",
        ]);

        // PROTECCIÓN BACKEND: Evitar cambios al propietario
        if ($tenantModel->owner_id == $id) {
            return back()->with("error", "No se puede cambiar el rol del propietario.");
        }

        $attributes = [];
        if ($request->has('role_id')) {
            $attributes['role_id'] = $request->role_id;
        }
        if ($request->has('location_id')) {
            $attributes['location_id'] = $request->location_id;
        }

        if (!empty($attributes)) {
            $tenantModel->users()->updateExistingPivot($id, $attributes);
        }

        return back()->with("success", "Miembro actualizado correctamente.");
    }

    public function destroy($tenant, $id)
    {
        Gate::authorize("users.delete");

        $tenantModel = app("currentTenant");

        if (auth()->id() == $id) {
            return back()->with("error", "No puedes eliminarte a ti mismo.");
        }

        // PROTECCIÓN BACKEND: Evitar eliminar al propietario
        if ($tenantModel->owner_id == $id) {
            return back()->with("error", "No se puede eliminar al propietario.");
        }

        $tenantModel->users()->detach($id);

        return back()->with("success", "Miembro eliminado del equipo.");
    }
}