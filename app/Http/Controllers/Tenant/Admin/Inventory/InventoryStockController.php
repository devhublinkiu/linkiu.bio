<?php

namespace App\Http\Controllers\Tenant\Admin\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\Gastronomy\UpdateInventoryStockRequest;
use App\Models\Tenant\Gastronomy\InventoryStock;
use App\Models\Tenant\Locations\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class InventoryStockController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('inventory.stocks.view');

        $tenant = app('currentTenant');

        $query = InventoryStock::where('tenant_id', $tenant->id)
            ->with(['item', 'location']);

        // Filtros
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        if ($request->filled('item_id')) {
            $query->where('inventory_item_id', $request->item_id);
        }

        if ($request->boolean('show_low_stock')) {
            $query->lowStock();
        }

        if ($request->boolean('show_out_of_stock')) {
            $query->outOfStock();
        }

        $stocks = $query->orderBy('quantity', 'asc')->get();

        $locations = Location::where('tenant_id', $tenant->id)
            ->select('id', 'name')
            ->get();

        return Inertia::render('Tenant/Admin/Inventory/Stocks/Index', [
            'stocks' => $stocks,
            'locations' => $locations,
            'filters' => [
                'location_id' => $request->location_id,
                'item_id' => $request->item_id,
                'show_low_stock' => $request->boolean('show_low_stock'),
                'show_out_of_stock' => $request->boolean('show_out_of_stock'),
            ],
        ]);
    }

    public function update(UpdateInventoryStockRequest $request, InventoryStock $inventoryStock)
    {
        $validated = $request->validated();

        $inventoryStock->update($validated);

        return redirect()->back()->with('success', 'Configuración de stock actualizada correctamente.');
    }
}
