<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        \Illuminate\Support\Facades\Gate::authorize('roles.view');
        $tenant = app('currentTenant');

        $roles = \App\Models\Role::where('tenant_id', $tenant->id)
            ->withCount('permissions')
            ->latest()
            ->get();

        return \Inertia\Inertia::render('Tenant/Admin/Roles/Index', [
            'roles' => $roles
        ]);
    }

    public function create()
    {
        \Illuminate\Support\Facades\Gate::authorize('roles.create');
        // Group permissions by module
        $permissions = \App\Models\Permission::where('name', 'not like', 'sa.%')
            ->get()
            ->groupBy('module');

        return \Inertia\Inertia::render('Tenant/Admin/Roles/CreateEdit', [
            'permissions' => $permissions
        ]);
    }

    public function store(Request $request)
    {
        \Illuminate\Support\Facades\Gate::authorize('roles.create');
        $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $tenant = app('currentTenant');

        $role = $tenant->roles()->create([
            'name' => $request->name,
            'guard_name' => 'web',
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return redirect()->route('tenant.roles.index', $tenant->slug)
            ->with('success', 'Rol creado correctamente.');
    }

    public function edit($tenant, $id)
    {
        \Illuminate\Support\Facades\Gate::authorize('roles.update');
        // $tenant is strictly just the slug from route, but we use app('currentTenant') for logic
        $tenantModel = app('currentTenant');

        $role = \App\Models\Role::forTenant($tenantModel->id)->findOrFail($id);

        if ($role->is_system) {
            abort(403, 'No puedes editar roles del sistema.');
        }

        $permissions = \App\Models\Permission::where('name', 'not like', 'sa.%')->get()->groupBy('module');
        $role->load('permissions');

        return \Inertia\Inertia::render('Tenant/Admin/Roles/CreateEdit', [
            'role' => $role,
            'permissions' => $permissions
        ]);
    }

    public function update(Request $request, $tenant, $id)
    {
        \Illuminate\Support\Facades\Gate::authorize('roles.update');
        $tenantModel = app('currentTenant');
        $role = \App\Models\Role::forTenant($tenantModel->id)->findOrFail($id);

        if ($role->is_system) {
            abort(403, 'No puedes editar roles del sistema.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update([
            'name' => $request->name,
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return redirect()->route('tenant.roles.index', $tenant)
            ->with('success', 'Rol actualizado correctamente.');
    }

    public function destroy($tenant, $id)
    {
        \Illuminate\Support\Facades\Gate::authorize('roles.delete');
        $tenantModel = app('currentTenant');
        $role = \App\Models\Role::forTenant($tenantModel->id)->findOrFail($id);

        if ($role->is_system) {
            abort(403, 'No puedes eliminar roles del sistema.');
        }

        // Check if any user is using this role
        // We need to check tenant_user pivot
        $isUsed = \DB::table('tenant_user')
            ->where('tenant_id', $tenantModel->id)
            ->where('role_id', $id)
            ->exists();

        if ($isUsed) {
            return back()->with('error', 'No puedes eliminar un rol que está asignado a usuarios.');
        }

        $role->delete();

        return redirect()->route('tenant.roles.index', $tenant)
            ->with('success', 'Rol eliminado correctamente.');
    }
}
