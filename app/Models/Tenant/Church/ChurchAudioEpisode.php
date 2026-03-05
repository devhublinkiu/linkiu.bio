<?php

namespace App\Models\Tenant\Church;

use App\Models\Tenant;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ChurchAudioEpisode extends Model
{
    use BelongsToTenant;

    protected $table = 'church_audio_episodes';

    protected $fillable = [
        'tenant_id',
        'title',
        'audio_path',
        'duration_seconds',
        'sort_order',
        'is_published',
    ];

    protected $casts = [
        'duration_seconds' => 'integer',
        'sort_order' => 'integer',
        'is_published' => 'boolean',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function getAudioUrlAttribute(): ?string
    {
        if (empty($this->audio_path)) {
            return null;
        }
        return Storage::disk('bunny')->exists($this->audio_path)
            ? Storage::disk('bunny')->url($this->audio_path)
            : null;
    }

    public function getFormattedDurationAttribute(): string
    {
        $m = (int) floor($this->duration_seconds / 60);
        $s = $this->duration_seconds % 60;
        return sprintf('%d:%02d', $m, $s);
    }
}
