<?php

namespace App\Models\Tenant\All;

use App\Models\Tenant\Locations\Location;
use App\Services\BunnyStreamService;
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
        'poster_url',
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

    /**
     * URL para miniatura en feed público: manual, o preview animado Bunny (misma ruta que el panel Stream).
     */
    public function feedPosterUrl(): ?string
    {
        if ($this->poster_url) {
            return $this->poster_url;
        }

        if ($this->short_video_id) {
            $bunny = app(BunnyStreamService::class);
            if ($bunny->isEnabled()) {
                $fromApi = $bunny->getThumbnailOrPreviewUrlFromPlayApi($this->short_video_id);
                if ($fromApi) {
                    return $fromApi;
                }
            }
        }

        return $this->bunnyCdnPreviewPosterUrl();
    }

    protected function bunnyCdnPreviewPosterUrl(): ?string
    {
        if (! $this->short_video_id) {
            return null;
        }
        $cdn = config('bunny.stream.cdn_hostname');
        if (! $cdn) {
            return null;
        }
        $base = str_starts_with($cdn, 'http') ? rtrim($cdn, '/') : 'https://'.rtrim($cdn, '/');

        return "{$base}/{$this->short_video_id}/preview.webp";
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
