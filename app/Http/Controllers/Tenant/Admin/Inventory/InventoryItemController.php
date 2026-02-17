<?php

namespace App\Http\Controllers\Tenant\Admin\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\Gastronomy\StoreInventoryItemRequest;
use App\Http\Requests\Tenant\Admin\Gastronomy\UpdateInventoryItemRequest;
use App\Models\Tenant\Gastronomy\InventoryItem;
use App\Models\Tenant\Locations\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InventoryItemController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('inventory.view');

        $tenant = app('currentTenant');

        $query = InventoryItem::where('tenant_id', $tenant->id)
            ->with(['stocks.location']);

        // Filtros
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $items = $query->orderBy('name')->paginate(20)->withQueryString();

        // Categorías únicas para filtros
        $categories = InventoryItem::where('tenant_id', $tenant->id)
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category');

        $locations = Location::where('tenant_id', $tenant->id)
            ->select('id', 'name')
            ->get();

        return Inertia::render('Tenant/Admin/Inventory/Items/Index', [
            'items' => $items,
            'categories' => $categories,
            'locations' => $locations,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'status' => $request->status,
            ],
        ]);
    }

    public function store(StoreInventoryItemRequest $request)
    {
        $validated = $request->validated();
        $tenant = app('currentTenant');

        $validated['tenant_id'] = $tenant->id;
        $validated['slug'] = Str::slug($validated['name']);
        $validated['storage_disk'] = 'bunny';

        $item = InventoryItem::create($validated);

        return redirect()->back()->with('success', 'Item de inventario creado correctamente.');
    }

    public function update(UpdateInventoryItemRequest $request, InventoryItem $inventoryItem)
    {
        $validated = $request->validated();

        if ($validated['name'] !== $inventoryItem->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $inventoryItem->update($validated);

        return redirect()->back()->with('success', 'Item actualizado correctamente.');
    }

    public function destroy(InventoryItem $inventoryItem)
    {
        Gate::authorize('inventory.delete');

        $inventoryItem->delete();

        return redirect()->back()->with('success', 'Item eliminado correctamente.');
    }
}
