<?php

namespace App\Models\Tenant\Gastronomy;

use App\Models\Table;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $table = 'gastronomy_reservations';

    protected $fillable = [
        'tenant_id',
        'location_id',
        'customer_id',
        'table_id',
        'reservation_date',
        'reservation_time',
        'party_size',
        'status', // pending, confirmed, seated, cancelled, no_show
        'customer_name',
        'customer_phone',
        'customer_email',
        'notes',
        'admin_notes',
        'payment_proof',
        'payment_method',
        'payment_reference',
    ];

    protected $casts = [
        'reservation_date' => 'date:Y-m-d',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function location()
    {
        return $this->belongsTo(\App\Models\Location::class);
    }

    // Scopes
    public function scopeUpcoming($query)
    {
        return $query->where('reservation_date', '>=', now()->toDateString())
            ->orderBy('reservation_date')
            ->orderBy('reservation_time');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('reservation_date', now()->toDateString())
            ->orderBy('reservation_time');
    }
}
