<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function getImageUrlAttribute()
    {
        return $this->image ?\Illuminate\Support\Facades\Storage::disk('s3')->url($this->image) : null;
    }

    public function getGalleryUrlsAttribute()
    {
        if (empty($this->gallery)) {
            return [];
        }

        return array_map(function ($path) {
            return \Illuminate\Support\Facades\Storage::disk('s3')->url($path);
        }, $this->gallery);
    }

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
}
