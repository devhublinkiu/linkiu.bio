<?php

namespace App\Models\Tenant\Church;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class ChurchService extends Model
{
    use BelongsToTenant;

    protected $table = 'church_services';

    protected $fillable = [
        'tenant_id',
        'name',
        'description',
        'audience',
        'service_type',
        'schedule',
        'frequency',
        'duration',
        'location',
        'modality',
        'image_url',
        'leader',
        'contact_info',
        'external_url',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}
