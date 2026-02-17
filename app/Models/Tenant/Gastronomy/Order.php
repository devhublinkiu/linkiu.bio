<?php

namespace App\Models\Tenant\Gastronomy;

use App\Models\Table;
use App\Models\Tenant;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory, BelongsToTenant;

    protected $table = 'gastronomy_orders';

    protected $fillable = [
        'tenant_id',
        'location_id',
        'status',
        'service_type',
        'table_id',
        'customer_id',
        'customer_name',
        'customer_phone',
        'delivery_address',
        'delivery_cost',
        'total',
        'subtotal',
        'tax_amount',
        'tax_details',
        'payment_method',
        'payment_reference',
        'payment_proof',
        'waiter_collected',
        'cash_change',
        'created_by',
    ];

    public function creator()
    {
        return $this->belongsTo(\App\Models\User::class , 'created_by');
    }

    protected $casts = [
        'delivery_address' => 'array',
        'tax_details' => 'array',
        'delivery_cost' => 'decimal:2',
        'total' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'cash_change' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    protected $appends = ['ticket_number', 'payment_proof_url'];

    public function getTicketNumberAttribute()
    {
        // Option 1: Simple Zero-Padding (e.g., #0042)
        return '#' . str_pad($this->id, 4, '0', STR_PAD_LEFT);
    }

    public function getPaymentProofUrlAttribute()
    {
        return $this->payment_proof ?\Illuminate\Support\Facades\Storage::disk('bunny')->url($this->payment_proof) : null;
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class , 'gastronomy_order_id');
    }

    public function statusHistory()
    {
        return $this->hasMany(OrderStatusHistory::class , 'gastronomy_order_id');
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function location()
    {
        return $this->belongsTo(\App\Models\Tenant\Locations\Location::class);
    }
}
