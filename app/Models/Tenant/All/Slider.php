<?php

namespace App\Models\Tenant\All;

use App\Models\Tenant\Locations\Location;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Slider extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'location_id',
        'name',
        'image_path',
        'image_path_desktop',
        'storage_disk',
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

    public function getImageUrlAttribute(): ?string
    {
        if (empty($this->image_path)) {
            return null;
        }
        $disk = $this->attributes['storage_disk'] ?? 'bunny';
        $path = ltrim($this->image_path, '/');
        try {
            return Storage::disk($disk)->url($path);
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function getDesktopImageUrlAttribute(): ?string
    {
        if (empty($this->image_path_desktop)) {
            return null;
        }
        $disk = $this->attributes['storage_disk'] ?? 'bunny';
        $path = ltrim($this->image_path_desktop, '/');
        try {
            return Storage::disk($disk)->url($path);
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
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
