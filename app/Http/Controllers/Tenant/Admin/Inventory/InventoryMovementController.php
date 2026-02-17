<?php

namespace App\Http\Controllers\Tenant\Admin\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\Gastronomy\StoreInventoryMovementRequest;
use App\Models\Tenant\Gastronomy\InventoryItem;
use App\Models\Tenant\Gastronomy\InventoryMovement;
use App\Models\Tenant\Gastronomy\InventoryStock;
use App\Models\Tenant\Locations\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class InventoryMovementController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('inventory.movements.view');

        $tenant = app('currentTenant');

        $query = InventoryMovement::where('tenant_id', $tenant->id)
            ->with(['item', 'location', 'user']);

        // Filtros
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        if ($request->filled('item_id')) {
            $query->where('inventory_item_id', $request->item_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('reason')) {
            $query->where('reason', $request->reason);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $movements = $query->orderByDesc('created_at')->paginate(30)->withQueryString();

        $locations = Location::where('tenant_id', $tenant->id)
            ->select('id', 'name')
            ->get();

        $items = InventoryItem::where('tenant_id', $tenant->id)
            ->where('status', 'active')
            ->select('id', 'name', 'unit')
            ->orderBy('name')
            ->get();

        return Inertia::render('Tenant/Admin/Inventory/Movements/Index', [
            'movements' => $movements,
            'locations' => $locations,
            'items' => $items,
            'filters' => [
                'location_id' => $request->location_id,
                'item_id' => $request->item_id,
                'type' => $request->type,
                'reason' => $request->reason,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
        ]);
    }

    public function store(StoreInventoryMovementRequest $request)
    {
        $validated = $request->validated();
        $tenant = app('currentTenant');

        DB::beginTransaction();
        try {
            // 1. Obtener o crear stock
            $stock = InventoryStock::firstOrCreate([
                'tenant_id' => $tenant->id,
                'inventory_item_id' => $validated['inventory_item_id'],
                'location_id' => $validated['location_id'],
            ], [
                'quantity' => 0,
                'min_stock' => 0,
            ]);

            // 2. Calcular nuevo stock
            $previousStock = $stock->quantity;
            $quantity = $validated['quantity'];
            $newStock = $validated['type'] === 'entry' 
                ? $previousStock + $quantity 
                : $previousStock - $quantity;

            // 3. Validar stock no negativo (bloqueante)
            if ($newStock < 0) {
                return back()->withErrors(['quantity' => 'Stock insuficiente. Stock actual: ' . $previousStock]);
            }

            // 4. Calcular costos
            $unitCost = $validated['unit_cost'] ?? null;
            $totalCost = $unitCost ? $unitCost * $quantity : ($validated['total_cost'] ?? null);

            // 5. Crear movimiento
            $movement = InventoryMovement::create([
                'tenant_id' => $tenant->id,
                'inventory_item_id' => $validated['inventory_item_id'],
                'location_id' => $validated['location_id'],
                'type' => $validated['type'],
                'reason' => $validated['reason'],
                'quantity' => $quantity,
                'unit_cost' => $unitCost,
                'total_cost' => $totalCost,
                'previous_stock' => $previousStock,
                'new_stock' => $newStock,
                'reference' => $validated['reference'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'user_id' => auth()->id(),
            ]);

            // 6. Actualizar stock
            $stock->update([
                'quantity' => $newStock,
                'last_movement_at' => now(),
            ]);

            // 7. Recalcular costo promedio si es compra
            if ($validated['type'] === 'entry' && $validated['reason'] === 'purchase' && $unitCost) {
                $this->updateAverageCost($stock->item, $quantity, $unitCost);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Movimiento registrado correctamente.');
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return back()->withErrors(['error' => 'No se pudo registrar el movimiento. Intenta de nuevo.']);
        }
    }

    /**
     * Actualizar el costo promedio ponderado del item.
     */
    private function updateAverageCost(InventoryItem $item, float $newQty, float $newCost): void
    {
        $totalStock = $item->stocks->sum('quantity');
        $currentAvg = $item->cost_per_unit ?? 0;
        
        if ($totalStock > 0) {
            $item->cost_per_unit = (($currentAvg * ($totalStock - $newQty)) + ($newCost * $newQty)) / $totalStock;
            $item->save();
        }
    }
}
