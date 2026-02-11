<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariantOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'name',
        'price_adjustment',
        'is_available',
        'sort_order',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'price_adjustment' => 'decimal:2',
    ];

    public function group()
    {
        return $this->belongsTo(ProductVariantGroup::class, 'group_id');
    }
}
