<?php

namespace App\Models\Tenant\Payments;

use App\Models\Tenant;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentMethod extends Model
{
    use HasFactory, BelongsToTenant;

    protected $table = 'tenant_payment_methods';

    protected $fillable = [
        'tenant_id',
        'location_id',
        'type',
        'is_active',
        'settings',
        'gateway_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'settings' => 'array',
    ];

    public function location(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Tenant\Locations\Location::class);
    }
}
