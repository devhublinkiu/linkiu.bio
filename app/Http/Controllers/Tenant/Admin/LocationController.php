<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        \Illuminate\Support\Facades\Gate::authorize('locations.view');

        $tenant = app('currentTenant');

        $locations = Location::where('tenant_id', $tenant->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('Tenant/Admin/Locations/Index', [
            'locations' => $locations
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        \Illuminate\Support\Facades\Gate::authorize('locations.create');

        return Inertia::render('Tenant/Admin/Locations/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        \Illuminate\Support\Facades\Gate::authorize('locations.create');

        $tenant = app('currentTenant');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'manager' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:500',
            'is_main' => 'required|boolean',
            'phone' => 'nullable|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'whatsapp_message' => 'nullable|string',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'opening_hours' => 'nullable|array',
            'social_networks' => 'nullable|array',
        ]);

        $validated['tenant_id'] = $tenant->id;
        $validated['is_active'] = true;

        Location::create($validated);

        return redirect()->route('tenant.locations.index', $tenant->slug)
            ->with('success', 'Sede creada correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show($tenantRaw, $id)
    {
        \Illuminate\Support\Facades\Gate::authorize('locations.view');

        $tenant = app('currentTenant');
        $location = Location::where('tenant_id', $tenant->id)->findOrFail($id);

        return Inertia::render('Tenant/Admin/Locations/Show', [
            'location' => $location
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($tenantRaw, $id)
    {
        \Illuminate\Support\Facades\Gate::authorize('locations.update');

        $tenant = app('currentTenant');
        $location = Location::where('tenant_id', $tenant->id)->findOrFail($id);

        return Inertia::render('Tenant/Admin/Locations/Edit', [
            'location' => $location
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $tenantRaw, $id)
    {
        \Illuminate\Support\Facades\Gate::authorize('locations.update');

        $tenant = app('currentTenant');
        $location = Location::where('tenant_id', $tenant->id)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'manager' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:500',
            'is_main' => 'required|boolean',
            'phone' => 'nullable|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'whatsapp_message' => 'nullable|string',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'opening_hours' => 'nullable|array',
            'social_networks' => 'nullable|array',
            'is_active' => 'required|boolean',
        ]);

        $location->update($validated);

        return redirect()->route('tenant.locations.index', $tenant->slug)
            ->with('success', 'Sede actualizada correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        \Illuminate\Support\Facades\Gate::authorize('locations.delete');

        $tenant = app('currentTenant');
        $location = Location::where('tenant_id', $tenant->id)->findOrFail($id);

        if ($location->is_main) {
            return back()->with('error', 'No se puede eliminar la sede principal.');
        }

        $location->delete();

        return back()->with('success', 'Sede eliminada correctamente.');
    }

    /**
     * Toggle active status.
     */
    public function toggleActive($tenantRaw, $id)
    {
        \Illuminate\Support\Facades\Gate::authorize('locations.update');

        $tenant = app('currentTenant');
        $location = Location::where('tenant_id', $tenant->id)->findOrFail($id);

        $location->update([
            'is_active' => !$location->is_active
        ]);

        return back()->with('success', 'Estado de la sede actualizado.');
    }
}
