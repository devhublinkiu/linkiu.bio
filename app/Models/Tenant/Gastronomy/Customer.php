<?php

namespace App\Models\Tenant\Gastronomy;

use App\Models\Tenant;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use BelongsToTenant, HasFactory;

    protected $table = 'gastronomy_customers';

    protected $fillable = [
        'tenant_id',
        'name',
        'phone',
        'email',
        'identification_type',
        'identification_number',
        'address',
        'city',
        'notes',
        'status', // active, inactive
    ];

    protected $casts = [
        'address' => 'array', // Assuming address might be complex or just a string, but array gives flexibility if we want struct
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
