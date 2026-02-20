<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReleaseNote extends Model
{
    protected $fillable = [
        'release_note_category_id',
        'title',
        'slug',
        'type',
        'icon_name',
        'cover_path',
        'hero_path',
        'snippet',
        'body',
        'published_at',
        'status',
        'is_featured',
    ];

    protected $casts = [
        'published_at' => 'date',
        'is_featured' => 'boolean',
    ];

    public function releaseNoteCategory(): BelongsTo
    {
        return $this->belongsTo(ReleaseNoteCategory::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
