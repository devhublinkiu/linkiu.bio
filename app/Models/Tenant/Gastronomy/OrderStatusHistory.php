<?php

namespace App\Models\Tenant\Gastronomy;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderStatusHistory extends Model
{
    use HasFactory;

    protected $table = 'gastronomy_order_status_histories';

    protected $fillable = [
        'gastronomy_order_id',
        'user_id',
        'from_status',
        'to_status',
        'notes',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class , 'gastronomy_order_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
