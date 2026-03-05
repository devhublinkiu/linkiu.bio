<?php

namespace App\Models\Tenant\Church;

use App\Models\Tenant;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChurchTestimonial extends Model
{
    use BelongsToTenant;

    protected $table = 'church_testimonials';

    protected $fillable = [
        'tenant_id',
        'video_url',
        'image_url',
        'title',
        'body',
        'category',
        'is_featured',
        'short_quote',
        'author',
        'is_published',
        'order',
        'share_count',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'order' => 'integer',
        'share_count' => 'integer',
    ];

    public function reactions(): HasMany
    {
        return $this->hasMany(ChurchTestimonialReaction::class, 'church_testimonial_id');
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * URL de embed de YouTube a partir de video_url (watch o youtu.be).
     */
    public function getEmbedUrlAttribute(): ?string
    {
        $url = $this->video_url;
        if (empty($url)) {
            return null;
        }
        $id = $this->getYoutubeVideoIdFromUrl($url);
        return $id ? 'https://www.youtube.com/embed/' . $id : null;
    }

    protected function getYoutubeVideoIdFromUrl(string $url): ?string
    {
        if (preg_match('/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/', $url, $m)) {
            return $m[1];
        }
        if (preg_match('/youtu\.be\/([a-zA-Z0-9_-]+)/', $url, $m)) {
            return $m[1];
        }
        if (preg_match('/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/', $url, $m)) {
            return $m[1];
        }
        return null;
    }
}
