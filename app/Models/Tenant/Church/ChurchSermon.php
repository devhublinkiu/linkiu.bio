<?php

namespace App\Models\Tenant\Church;

use App\Models\Tenant;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChurchSermon extends Model
{
    use BelongsToTenant;

    protected $table = 'church_sermons';

    public const STATUS_LIVE = 'live';
    public const STATUS_UPCOMING = 'upcoming';
    public const STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'tenant_id',
        'youtube_video_id',
        'title',
        'description',
        'published_at',
        'thumbnail_url',
        'duration_seconds',
        'status',
        'live_start_at',
    ];

    protected $casts = [
        'published_at' => 'date',
        'duration_seconds' => 'integer',
        'live_start_at' => 'datetime',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function getEmbedUrlAttribute(): string
    {
        return 'https://www.youtube.com/embed/' . $this->youtube_video_id;
    }

    public function getWatchUrlAttribute(): string
    {
        return 'https://www.youtube.com/watch?v=' . $this->youtube_video_id;
    }

    public function getFormattedDurationAttribute(): ?string
    {
        if ($this->duration_seconds === null) {
            return null;
        }
        $m = (int) floor($this->duration_seconds / 60);
        $s = $this->duration_seconds % 60;
        return sprintf('%d:%02d', $m, $s);
    }
}
