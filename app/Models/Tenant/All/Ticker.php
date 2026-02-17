<?php

namespace App\Models\Tenant\All;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class Ticker extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'content',
        'link',
        'background_color',
        'text_color',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}
