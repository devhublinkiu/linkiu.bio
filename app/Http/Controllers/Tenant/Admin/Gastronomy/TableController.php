<?php

namespace App\Http\Controllers\Tenant\Admin\Gastronomy;

use App\Http\Controllers\Controller;
use App\Models\Table;
use App\Models\Zone;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableController extends Controller
{
    public function index()
    {
        $tenant = app('currentTenant');

        $zones = Zone::where('tenant_id', $tenant->id)
            ->with('tables')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Tenant/Admin/Gastronomy/Tables/Index', [
            'zones' => $zones
        ]);
    }

    public function storeZone(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100'
        ]);

        Zone::create([
            'tenant_id' => app('currentTenant')->id,
            'name' => $validated['name']
        ]);

        return redirect()->back()->with('success', 'Zona creada correctamente');
    }

    public function updateZone(Request $request, $tenant, Zone $zone)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100'
        ]);

        $zone->update($validated);

        return redirect()->back()->with('success', 'Zona actualizada correctamente');
    }

    public function destroyZone($tenant, Zone $zone)
    {
        $zone->delete();
        return redirect()->back()->with('success', 'Zona eliminada correctamente');
    }

    public function storeTable(Request $request)
    {
        $validated = $request->validate([
            'zone_id' => 'required|exists:zones,id',
            'name' => 'required|string|max:100',
            'capacity' => 'nullable|integer|min:1',
            'status' => 'required|in:active,maintenance,inactive'
        ]);

        Table::create($validated + ['tenant_id' => app('currentTenant')->id]);

        return redirect()->back()->with('success', 'Mesa creada correctamente');
    }

    public function updateTable(Request $request, $tenant, Table $table)
    {
        $validated = $request->validate([
            'zone_id' => 'required|exists:zones,id',
            'name' => 'required|string|max:100',
            'capacity' => 'nullable|integer|min:1',
            'status' => 'required|in:active,maintenance,inactive'
        ]);

        $table->update($validated);

        return redirect()->back()->with('success', 'Mesa actualizada correctamente');
    }

    public function destroyTable($tenant, Table $table)
    {
        $table->delete();
        return redirect()->back()->with('success', 'Mesa eliminada correctamente');
    }

    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'zone_id' => 'required|exists:zones,id',
            'prefix' => 'nullable|string|max:50',
            'start_number' => 'required|integer|min:1',
            'count' => 'required|integer|min:1|max:50',
            'capacity' => 'nullable|integer|min:1'
        ]);

        $tenantId = app('currentTenant')->id;
        $prefix = $validated['prefix'] ?? 'Mesa ';

        for ($i = 0; $i < $validated['count']; $i++) {
            $number = $validated['start_number'] + $i;
            Table::create([
                'tenant_id' => $tenantId,
                'zone_id' => $validated['zone_id'],
                'name' => $prefix . $number,
                'capacity' => $validated['capacity'],
                'status' => 'active'
            ]);
        }

        return redirect()->back()->with('success', $validated['count'] . ' mesas creadas correctamente');
    }

    public function regenerateToken($tenant, Table $table)
    {
        $table->update([
            'token' => Table::generateUniqueToken()
        ]);

        return redirect()->back()->with('success', 'Token de mesa regenerado correctamente');
    }

    public function print()
    {
        $tenant = app('currentTenant');

        $zones = Zone::where('tenant_id', $tenant->id)
            ->with([
                'tables' => function ($query) {
                    $query->where('status', 'active');
                }
            ])
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Tenant/Admin/Gastronomy/Tables/Print', [
            'zones' => $zones
        ]);
    }
}
