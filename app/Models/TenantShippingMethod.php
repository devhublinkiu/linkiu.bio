<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TenantShippingMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'location_id',
        'type', // 'pickup', 'local', 'national'
        'name', // Optional custom name
        'is_active',
        'cost',
        'free_shipping_min_amount',
        'delivery_time', // e.g., "1-2 days"
        'instructions',
        'settings' // JSON for extra config like 'prep_time'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'cost' => 'decimal:2',
        'free_shipping_min_amount' => 'decimal:2',
        'settings' => 'array',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function zones()
    {
        return $this->hasMany(ShippingZone::class , 'tenant_shipping_method_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
