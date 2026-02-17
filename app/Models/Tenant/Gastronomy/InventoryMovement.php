<?php

namespace App\Models\Tenant\Gastronomy;

use App\Models\Tenant\Locations\Location;
use App\Models\User;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryMovement extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'inventory_item_id',
        'location_id',
        'type',
        'reason',
        'quantity',
        'unit_cost',
        'total_cost',
        'previous_stock',
        'new_stock',
        'reference',
        'notes',
        'user_id',
    ];

    protected $casts = [
        'quantity' => 'decimal:4',
        'unit_cost' => 'decimal:4',
        'total_cost' => 'decimal:4',
        'previous_stock' => 'decimal:4',
        'new_stock' => 'decimal:4',
    ];

    /**
     * Relación: Item de inventario.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }

    /**
     * Relación: Sede.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Relación: Usuario que registró el movimiento.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope: Solo entradas.
     */
    public function scopeEntries($query)
    {
        return $query->where('type', 'entry');
    }

    /**
     * Scope: Solo salidas.
     */
    public function scopeExits($query)
    {
        return $query->where('type', 'exit');
    }

    /**
     * Scope: Por razón específica.
     */
    public function scopeByReason($query, string $reason)
    {
        return $query->where('reason', $reason);
    }
}
