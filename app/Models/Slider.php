<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Slider extends Model
{
    use HasFactory, \App\Traits\BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'name',
        'image_path',
        'image_path_desktop',
        'link_type',
        'external_url',
        'linkable_type',
        'linkable_id',
        'start_at',
        'end_at',
        'active_days',
        'clicks_count',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'active_days' => 'array',
        'is_active' => 'boolean',
        'clicks_count' => 'integer',
        'sort_order' => 'integer',
    ];

    protected $appends = ['image_url', 'desktop_image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image_path ?Storage::disk('s3')->url($this->image_path) : null;
    }

    public function getDesktopImageUrlAttribute()
    {
        return $this->image_path_desktop ?Storage::disk('s3')->url($this->image_path_desktop) : null;
    }

    /**
     * Polymorphic relation to Product or Category
     */
    public function linkable()
    {
        return $this->morphTo();
    }

    /**
     * Scope for active sliders visible now
     */
    public function scopeVisible($query)
    {
        $now = now();

        return $query->where('is_active', true)
            ->where(function ($q) use ($now) {
            $q->whereNull('start_at')
                ->orWhere('start_at', '<=', $now);
        })
            ->where(function ($q) use ($now) {
            $q->whereNull('end_at')
                ->orWhere('end_at', '>=', $now);
        })
            ->orderBy('sort_order', 'asc');
    }
}
