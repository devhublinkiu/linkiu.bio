<?php

namespace App\Models\Tenant\Gastronomy;

use App\Models\Tenant\Locations\Location;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryStock extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'inventory_item_id',
        'location_id',
        'quantity',
        'min_stock',
        'max_stock',
        'last_movement_at',
    ];

    protected $casts = [
        'quantity' => 'decimal:4',
        'min_stock' => 'decimal:4',
        'max_stock' => 'decimal:4',
        'last_movement_at' => 'datetime',
    ];

    protected $appends = ['is_low_stock', 'is_out_of_stock'];

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
     * Accessor: Determina si el stock está bajo.
     */
    public function getIsLowStockAttribute(): bool
    {
        return $this->quantity <= $this->min_stock && $this->quantity > 0;
    }

    /**
     * Accessor: Determina si no hay stock.
     */
    public function getIsOutOfStockAttribute(): bool
    {
        return $this->quantity <= 0;
    }

    /**
     * Scope: Solo stocks bajos.
     */
    public function scopeLowStock($query)
    {
        return $query->whereColumn('quantity', '<=', 'min_stock')
            ->where('quantity', '>', 0);
    }

    /**
     * Scope: Sin stock.
     */
    public function scopeOutOfStock($query)
    {
        return $query->where('quantity', '<=', 0);
    }
}
