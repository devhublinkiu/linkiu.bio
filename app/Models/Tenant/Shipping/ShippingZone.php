<?php

namespace App\Models\Tenant\Shipping;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingZone extends Model
{
    use HasFactory;

    protected $table = 'shipping_zones';

    protected $fillable = [
        'tenant_shipping_method_id',
        'department_code',
        'department_name',
        'city_code',
        'city_name',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function shippingMethod()
    {
        return $this->belongsTo(TenantShippingMethod::class, 'tenant_shipping_method_id');
    }
}
