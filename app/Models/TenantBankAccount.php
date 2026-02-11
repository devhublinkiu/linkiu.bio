<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TenantBankAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'location_id',
        'bank_name',
        'account_type',
        'account_number',
        'account_holder',
        'holder_id',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
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
