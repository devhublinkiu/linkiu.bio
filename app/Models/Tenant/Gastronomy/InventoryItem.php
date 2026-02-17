<?php

namespace App\Models\Tenant\Gastronomy;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class InventoryItem extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'name',
        'slug',
        'sku',
        'description',
        'unit',
        'cost_per_unit',
        'image',
        'storage_disk',
        'category',
        'status',
    ];

    protected $casts = [
        'cost_per_unit' => 'decimal:4',
    ];

    protected $appends = ['image_url'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($item) {
            if (!$item->slug) {
                $item->slug = Str::slug($item->name);
            }
        });
    }

    /**
     * Accessor para obtener la URL completa de la imagen.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        $disk = $this->storage_disk ?? 'bunny';

        try {
            return Storage::disk($disk)->url($this->image);
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Relación: Stocks del item por sede.
     */
    public function stocks(): HasMany
    {
        return $this->hasMany(InventoryStock::class);
    }

    /**
     * Relación: Movimientos del item.
     */
    public function movements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class);
    }

    /**
     * Obtener o crear stock para una sede específica.
     */
    public function getStockForLocation(int $locationId): InventoryStock
    {
        return $this->stocks()
            ->where('location_id', $locationId)
            ->firstOrCreate([
                'tenant_id' => $this->tenant_id,
                'location_id' => $locationId,
            ], [
                'quantity' => 0,
                'min_stock' => 0,
            ]);
    }
}
