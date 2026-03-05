<?php

namespace App\Models\Tenant\Church;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChurchDevotional extends Model
{
    use BelongsToTenant;

    protected $table = 'church_devotionals';

    protected $fillable = [
        'tenant_id',
        'title',
        'scripture_reference',
        'scripture_text',
        'body',
        'prayer',
        'author',
        'date',
        'reflection_question',
        'cover_image',
        'video_url',
        'external_link',
        'excerpt',
        'order',
        'is_published',
        'share_count',
    ];

    protected $casts = [
        'date' => 'date',
        'order' => 'integer',
        'is_published' => 'boolean',
        'share_count' => 'integer',
    ];

    public function reactions(): HasMany
    {
        return $this->hasMany(ChurchDevotionalReaction::class, 'church_devotional_id');
    }
}
