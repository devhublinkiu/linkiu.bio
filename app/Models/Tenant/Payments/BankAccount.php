<?php

namespace App\Models\Tenant\Payments;

use App\Models\Tenant;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BankAccount extends Model
{
    use HasFactory, BelongsToTenant;

    protected $table = 'tenant_bank_accounts';

    protected $fillable = [
        'tenant_id',
        'location_id',
        'bank_name',
        'account_type',
        'account_number',
        'account_holder',
        'holder_id',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function location(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Tenant\Locations\Location::class);
    }
}
