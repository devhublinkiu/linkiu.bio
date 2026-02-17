<?php

namespace App\Models\Tenant\Locations;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory, BelongsToTenant;

    protected $table = 'locations';

    protected $fillable = [
        'tenant_id',
        'name',
        'manager',
        'description',
        'is_main',
        'phone',
        'whatsapp',
        'whatsapp_message',
        'state',
        'city',
        'address',
        'latitude',
        'longitude',
        'opening_hours',
        'social_networks',
        'reservation_price_per_person',
        'reservation_min_anticipation',
        'reservation_slot_duration',
        'reservation_payment_proof_required',
        'is_active',
        'short_video_id',
    ];

    protected $appends = ['short_embed_url'];

    protected $casts = [
        'is_main' => 'boolean',
        'is_active' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
        'opening_hours' => 'array',
        'social_networks' => 'array',
        'reservation_price_per_person' => 'float',
        'reservation_min_anticipation' => 'integer',
        'reservation_slot_duration' => 'integer',
        'reservation_payment_proof_required' => 'boolean',
    ];

    /**
     * Embed URL for Bunny Stream short (for iframe/player).
     */
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
     * Scope a query to only include active locations.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Ensure only one location is main for a tenant.
     */
    protected static function booted()
    {
        static::saving(function ($location) {
            if ($location->is_main) {
                static::withoutEvents(function () use ($location) {
                    static::where('tenant_id', $location->tenant_id)
                        ->where('id', '!=', $location->id)
                        ->update(['is_main' => false]);
                });
            }
        });
    }
}
