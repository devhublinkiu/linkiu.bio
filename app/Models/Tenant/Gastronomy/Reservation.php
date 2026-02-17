<?php

namespace App\Models\Tenant\Gastronomy;

use App\Models\Table;
use App\Models\Tenant;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory, BelongsToTenant;

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
        'payment_proof_storage_disk',
        'payment_method',
        'payment_reference',
    ];

    protected $casts = [
        'reservation_date' => 'date:Y-m-d',
    ];

    protected $appends = ['payment_proof_url'];

    /**
     * Accessor para obtener la URL completa del comprobante de pago (Bunny, no S3).
     */
    public function getPaymentProofUrlAttribute(): ?string
    {
        if (!$this->payment_proof) {
            return null;
        }

        $disk = $this->payment_proof_storage_disk ?? 'bunny';
        if ($disk !== 'bunny') {
            return null;
        }

        return \Storage::disk('bunny')->url($this->payment_proof);
    }

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
        return $this->belongsTo(\App\Models\Tenant\Locations\Location::class);
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
