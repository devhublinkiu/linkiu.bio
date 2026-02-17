<?php

namespace App\Models;

use App\Models\Tenant\Locations\Location;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'category_id',
        'name',
        'slug',
        'short_description',
        'price',
        'original_price',
        'cost',
        'sku',
        'image',
        'storage_disk',
        'gallery',
        'preparation_time',
        'calories',
        'allergens',
        'tags',
        'is_available',
        'is_featured',
        'status',
        'sort_order',
        'tax_name',
        'tax_rate',
        'price_includes_tax'
    ];

    protected $casts = [
        'gallery' => 'array',
        'allergens' => 'array',
        'tags' => 'array',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'cost' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'price_includes_tax' => 'boolean',
    ];

    protected $appends = ['image_url', 'gallery_urls'];

    /* ──────────────────── Accessors ──────────────────── */

    public function getImageUrlAttribute(): ?string
    {
        if (empty($this->image)) {
            return null;
        }
        $disk = $this->attributes['storage_disk'] ?? 'bunny';
        if ($disk !== 'bunny') {
            return null;
        }
        $path = ltrim($this->image, '/');
        try {
            $url = Storage::disk('bunny')->url($path);
            return (is_string($url) && str_starts_with($url, 'http')) ? $url : null;
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function getGalleryUrlsAttribute(): array
    {
        if (empty($this->gallery)) {
            return [];
        }
        $disk = $this->attributes['storage_disk'] ?? 'bunny';
        if ($disk !== 'bunny') {
            return [];
        }
        $urls = array_map(function ($path) {
            try {
                $url = Storage::disk('bunny')->url(ltrim($path, '/'));
                return (is_string($url) && str_starts_with($url, 'http')) ? $url : null;
            } catch (\Throwable $e) {
                return null;
            }
        }, $this->gallery);

        return array_values(array_filter($urls));
    }

    /* ──────────────────── Relations ──────────────────── */

    /**
     * Get the category that owns the product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variantGroups()
    {
        return $this->hasMany(ProductVariantGroup::class)->orderBy('sort_order');
    }

    /**
     * Sedes donde este producto está disponible (tabla pivote product_location).
     */
    public function locations(): BelongsToMany
    {
        return $this->belongsToMany(Location::class, 'product_location')
            ->withPivot('is_available')
            ->withTimestamps();
    }
}
