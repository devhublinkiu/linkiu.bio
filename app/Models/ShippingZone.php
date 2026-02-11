<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_shipping_method_id',
        'department_code',
        'department_name',
        'city_code', // Nullable (if null, applies to entire department)
        'city_name',
        'price',
    ];

    public function shippingMethod()
    {
        return $this->belongsTo(TenantShippingMethod::class , 'tenant_shipping_method_id');
    }
}
