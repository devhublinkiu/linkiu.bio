<?php

namespace App\Models\Tenant\Shipping;

use App\Models\Tenant;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TenantShippingMethod extends Model
{
    use BelongsToTenant, HasFactory;

    protected $table = 'tenant_shipping_methods';

    protected $fillable = [
        'tenant_id',
        'location_id',
        'type',
        'name',
        'is_active',
        'cost',
        'free_shipping_min_amount',
        'delivery_time',
        'instructions',
        'settings',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'cost' => 'decimal:2',
        'free_shipping_min_amount' => 'decimal:2',
        'settings' => 'array',
    ];

    public function zones()
    {
        return $this->hasMany(ShippingZone::class, 'tenant_shipping_method_id');
    }

    public function location()
    {
        return $this->belongsTo(\App\Models\Tenant\Locations\Location::class);
    }
}
