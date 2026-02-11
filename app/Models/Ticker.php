<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticker extends Model
{
    use HasFactory, \App\Traits\BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'content',
        'link',
        'background_color',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
