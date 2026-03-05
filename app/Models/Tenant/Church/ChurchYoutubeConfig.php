<?php

namespace App\Models\Tenant\Church;

use App\Models\Tenant;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChurchYoutubeConfig extends Model
{
    use BelongsToTenant;

    protected $table = 'church_youtube_config';

    protected $fillable = [
        'tenant_id',
        'youtube_channel_id',
        'last_synced_at',
    ];

    protected $casts = [
        'last_synced_at' => 'datetime',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
