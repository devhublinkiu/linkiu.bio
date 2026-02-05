<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Slider extends Model
{
    use HasFactory;

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

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
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
