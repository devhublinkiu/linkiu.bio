<?php

namespace App\Http\Controllers\Tenant\Admin\Gastronomy;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\Gastronomy\BulkStoreTablesRequest;
use App\Http\Requests\Tenant\Admin\Gastronomy\StoreTableRequest;
use App\Http\Requests\Tenant\Admin\Gastronomy\StoreZoneRequest;
use App\Http\Requests\Tenant\Admin\Gastronomy\UpdateTableRequest;
use App\Http\Requests\Tenant\Admin\Gastronomy\UpdateZoneRequest;
use App\Models\Table;
use App\Models\Zone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class TableController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('tables.view');

        $tenant = app('currentTenant');
        $locations = \App\Models\Tenant\Locations\Location::where('tenant_id', $tenant->id)->get();

        $locationId = $request->input('location_id');
        if (!$locationId && $locations->count() > 0) {
            $mainLocation = $locations->where('is_main', true)->first() ?: $locations->first();
            $locationId = $mainLocation->id;
        }

        $zones = Zone::where('tenant_id', $tenant->id)
            ->where('location_id', $locationId)
            ->with(['tables' => function ($q) {
                $q->orderBy('name', 'asc');
            }])
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Tenant/Admin/Gastronomy/Tables/Index', [
            'zones' => $zones,
            'locations' => $locations,
            'currentLocationId' => (int) $locationId,
        ]);
    }

    public function storeZone(StoreZoneRequest $request)
    {
        $validated = $request->validated();
        Zone::create([
            'tenant_id' => app('currentTenant')->id,
            'location_id' => $validated['location_id'],
            'name' => $validated['name'],
        ]);
        return redirect()->back()->with('success', 'Zona creada correctamente');
    }

    public function updateZone(UpdateZoneRequest $request, $tenant, Zone $zone)
    {
        $zone->update($request->validated());
        return redirect()->back()->with('success', 'Zona actualizada correctamente');
    }

    public function destroyZone($tenant, Zone $zone)
    {
        Gate::authorize('tables.delete');
        $zone->delete();
        return redirect()->back()->with('success', 'Zona eliminada correctamente');
    }

    public function storeTable(StoreTableRequest $request)
    {
        $validated = $request->validated();
        Table::create($validated + ['tenant_id' => app('currentTenant')->id]);
        return redirect()->back()->with('success', 'Mesa creada correctamente');
    }

    public function updateTable(UpdateTableRequest $request, $tenant, Table $table)
    {
        $table->update($request->validated());
        return redirect()->back()->with('success', 'Mesa actualizada correctamente');
    }

    public function destroyTable($tenant, Table $table)
    {
        Gate::authorize('tables.delete');
        $table->delete();
        return redirect()->back()->with('success', 'Mesa eliminada correctamente');
    }

    public function bulkStore(BulkStoreTablesRequest $request)
    {
        $validated = $request->validated();
        $tenantId = app('currentTenant')->id;
        $prefix = $validated['prefix'] ?? 'Mesa ';

        try {
            DB::transaction(function () use ($validated, $tenantId, $prefix) {
                for ($i = 0; $i < $validated['count']; $i++) {
                    $number = $validated['start_number'] + $i;
                    Table::create([
                        'tenant_id' => $tenantId,
                        'location_id' => $validated['location_id'],
                        'zone_id' => $validated['zone_id'],
                        'name' => $prefix . $number,
                        'capacity' => $validated['capacity'] ?? null,
                        'status' => 'available',
                    ]);
                }
            });
        } catch (\Throwable $e) {
            report($e);
            return redirect()->back()->with('error', 'No se pudieron crear las mesas. Inténtalo de nuevo o con menos cantidad.');
        }

        return redirect()->back()->with('success', $validated['count'] . ' mesas creadas correctamente');
    }

    public function regenerateToken($tenant, Table $table)
    {
        Gate::authorize('tables.update');
        $table->update(['token' => Table::generateUniqueToken()]);
        return redirect()->back()->with('success', 'Token de mesa regenerado correctamente');
    }

    public function print()
    {
        Gate::authorize('tables.view');
        $tenant = app('currentTenant');
        $zones = Zone::where('tenant_id', $tenant->id)
            ->with(['tables' => function ($query) {
                $query->where('status', 'available');
            }])
            ->orderBy('name', 'asc')
            ->get();
        return Inertia::render('Tenant/Admin/Gastronomy/Tables/Print', [
            'zones' => $zones,
        ]);
    }
}
