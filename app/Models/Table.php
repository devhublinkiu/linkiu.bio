<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;
use App\Models\Tenant\Gastronomy\Order;

class Table extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'location_id',
        'zone_id',
        'name',
        'token',
        'capacity',
        'status'
    ];

    public function location(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Location::class);
    }

    /**
     * Auto-generate a unique token on creation
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($table) {
            if (!$table->token) {
                $table->token = static::generateUniqueToken();
            }
        });
    }

    public static function generateUniqueToken()
    {
        do {
            $token = Str::random(8); // Alphanumeric, case sensitive
        } while (static::where('token', $token)->exists());

        return $token;
    }

    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    public function reservations()
    {
        return $this->hasMany(\App\Models\Tenant\Gastronomy\Reservation::class);
    }

    /**
     * Get the current active order for this table
     */
    public function activeOrder(): HasOne
    {
        return $this->hasOne(Order::class)->latestOfMany()
            ->whereIn('status', ['pending', 'in_progress', 'ready']);
    }
}
