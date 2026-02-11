<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TenantPaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'location_id',
        'type', // 'bank_transfer', 'cash', 'dataphone', 'gateway'
        'is_active',
        'settings',
        'gateway_id'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'settings' => 'array',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
