<?php

namespace App\Models\Tenant\Church;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class ChurchCollaborator extends Model
{
    use BelongsToTenant;

    protected $table = 'church_collaborators';

    protected $fillable = [
        'tenant_id',
        'name',
        'role',
        'photo',
        'bio',
        'email',
        'phone',
        'whatsapp',
        'order',
        'is_published',
    ];

    protected $casts = [
        'order' => 'integer',
        'is_published' => 'boolean',
    ];
}
