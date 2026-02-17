<?php

namespace App\Models\Tenant\Gastronomy;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $table = 'gastronomy_order_items';

    protected $fillable = [
        'gastronomy_order_id',
        'product_id',
        'product_name',
        'quantity',
        'price',
        'total',
        'variant_options',
        'notes',
        'status',
        'cancelled_by',
        'cancelled_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'total' => 'decimal:2',
        'variant_options' => 'array',
        'cancelled_at' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class , 'gastronomy_order_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
