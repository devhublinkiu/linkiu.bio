<?php

namespace App\Models\Tenant\All;

use App\Models\Tenant\Locations\Location;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Short extends Model
{
    use BelongsToTenant;

    protected $table = 'shorts';

    protected $fillable = [
        'tenant_id',
        'location_id',
        'name',
        'description',
        'link_type',
        'external_url',
        'linkable_type',
        'linkable_id',
        'short_video_id',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = ['short_embed_url'];

    public function getShortEmbedUrlAttribute(): ?string
    {
        if (!$this->short_video_id) {
            return null;
        }
        $libraryId = config('bunny.stream.library_id');
        return $libraryId
            ? 'https://iframe.mediadelivery.net/embed/' . $libraryId . '/' . $this->short_video_id
            : null;
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function linkable()
    {
        return $this->morphTo();
    }
}
