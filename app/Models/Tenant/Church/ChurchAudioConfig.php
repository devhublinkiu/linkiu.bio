<?php

namespace App\Models\Tenant\Church;

use App\Models\Tenant;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChurchAudioConfig extends Model
{
    use BelongsToTenant;

    protected $table = 'church_audio_config';

    protected $fillable = [
        'tenant_id',
        'page_title',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
