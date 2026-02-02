<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;

use App\Models\Role;
use App\Models\Permission;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('sa.permission:sa.roles.view')->only(['index']);
        $this->middleware('sa.permission:sa.roles.create')->only(['create', 'store']);
        $this->middleware('sa.permission:sa.roles.update')->only(['edit', 'update']);
        $this->middleware('sa.permission:sa.roles.delete')->only(['destroy']);
    }

    public function index()
    {
        $roles = Role::where('guard_name', 'web')
            ->whereNull('tenant_id') // Global roles only
            ->withCount('users')
            ->paginate(10);

        return Inertia::render('SuperAdmin/Roles/Index', [
            'roles' => $roles
        ]);
    }

    public function create()
    {
        $permissions = Permission::where('guard_name', 'web')
            ->where('name', 'like', 'sa.%')
            ->get()
            ->groupBy('module')
            ->mapWithKeys(function ($group, $key) {
                $newKey = $key === 'System' ? 'Sistema Global' : $key;
                return [$newKey => $group];
            });

        return Inertia::render('SuperAdmin/Roles/Create', [
            'permissions' => $permissions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name,NULL,id,tenant_id,NULL',
            'permissions' => 'array'
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
            'tenant_id' => null
        ]);

        if (!empty($validated['permissions'])) {
            $permissionIds = Permission::whereIn('name', $validated['permissions'])->pluck('id');
            $role->permissions()->sync($permissionIds);
        }

        return redirect()->route('roles.index')->with('success', 'Rol creado correctamente.');
    }

    public function edit(Role $role)
    {
        // Prevent editing built-in Super Admin role
        if ($role->name === 'Super Admin') {
            return redirect()->route('roles.index')->with('error', 'No puedes editar el rol de Super Admin.');
        }

        $permissions = Permission::where('guard_name', 'web')
            ->where('name', 'like', 'sa.%')
            ->get()
            ->groupBy('module')
            ->mapWithKeys(function ($group, $key) {
                $newKey = $key === 'System' ? 'Sistema Global' : $key;
                return [$newKey => $group];
            });

        $role->load('permissions');

        return Inertia::render('SuperAdmin/Roles/Edit', [
            'role' => $role,
            'permissions' => $permissions,
            'rolePermissions' => $role->permissions->pluck('name')
        ]);
    }

    public function update(Request $request, Role $role)
    {
        if ($role->name === 'Super Admin') {
            abort(403, 'No puedes editar este rol.');
        }

        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id . ',id,tenant_id,NULL',
            'permissions' => 'array'
        ]);

        $role->update(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            $permissionIds = Permission::whereIn('name', $validated['permissions'])->pluck('id');
            $role->permissions()->sync($permissionIds);
        }

        return redirect()->route('roles.index')->with('success', 'Rol actualizado correctamente.');
    }

    public function destroy(Role $role)
    {
        if ($role->name === 'Super Admin') {
            return redirect()->back()->with('error', 'No puedes eliminar el rol Principal.');
        }

        if ($role->users()->count() > 0) {
            return redirect()->back()->with('error', 'No puedes eliminar un rol con usuarios asignados.');
        }

        $role->delete();

        return redirect()->route('roles.index')->with('success', 'Rol eliminado correctamente.');
    }
}
