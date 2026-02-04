<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('sa.permission:sa.users.view')->only(['index']);
        $this->middleware('sa.permission:sa.users.create')->only(['create', 'store']);
        $this->middleware('sa.permission:sa.users.update')->only(['edit', 'update']);
        $this->middleware('sa.permission:sa.users.delete')->only(['destroy']);
    }

    public function index(Request $request)
    {
        $query = User::with(['tenants', 'globalRole']);

        // Search Filter
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Role Filter
        if ($request->filled('role')) {
            if ($request->role === 'superadmin') {
                $query->where('is_super_admin', true);
            } elseif ($request->role === 'user') {
                $query->where('is_super_admin', false);
            }
        }

        return Inertia::render('SuperAdmin/Users/Index', [
            'users' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'role']),
            'roles' => Role::whereNull('tenant_id')->get(),
        ]);
    }

    public function create()
    {
        $roles = Role::whereNull('tenant_id')->get(); // Global roles

        return Inertia::render('SuperAdmin/Users/Create', [
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role_id' => 'nullable|exists:roles,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'] ?? null,
        ]);

        return redirect()->route('users.index')->with('success', 'Usuario creado correctamente.');
    }

    public function update(Request $request, User $user)
    {
        // ... (existing update logic)
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'is_super_admin' => 'boolean',
            'role_id' => 'nullable|exists:roles,id',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'is_super_admin' => $request->boolean('is_super_admin'),
            'role_id' => $request->role_id,
        ]);

        return redirect()->back()->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy(User $user)
    {
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Usuario eliminado correctamente.');
    }
}
