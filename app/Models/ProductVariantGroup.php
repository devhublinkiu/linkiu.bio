<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariantGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'name',
        'type', // 'radio', 'checkbox'
        'min_selection',
        'max_selection',
        'is_required',
        'sort_order',
    ];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function options()
    {
        return $this->hasMany(ProductVariantOption::class, 'group_id')->orderBy('sort_order');
    }
}
