<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'domain',
        'vertical_id',
        'category_id',
        'owner_id',
        'params',
        'regime',
        'doc_type',
        'doc_number',
        'verification_digit',
        'contact_email',
        'contact_phone',
        'address',
        'state',
        'city',
        'settings',
        'status',
        'is_active',
        'last_slug_changed_at',
        'slug_changes_count'
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
        'last_slug_changed_at' => 'datetime',
        'slug_changes_count' => 'integer',
    ];

    protected $appends = ['logo_url'];

    public function getLogoUrlAttribute()
    {
        $settings = $this->settings ?? [];
        if (isset($settings['logo_path'])) {
            return Storage::disk('s3')->url($settings['logo_path']);
        }
        return null;
    }

    public function category()
    {
        return $this->belongsTo(BusinessCategory::class, 'category_id');
    }

    public function vertical()
    {
        return $this->belongsTo(Vertical::class, 'vertical_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'tenant_user')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function latestSubscription()
    {
        return $this->hasOne(Subscription::class)->latestOfMany();
    }

    public function pendingInvoice()
    {
        return $this->hasOne(Invoice::class)->whereIn('status', ['pending', 'overdue'])->latestOfMany();
    }

    /**
     * Check if the tenant has a custom slug (different from auto-generated)
     */
    public function hasCustomSlug(): bool
    {
        return $this->slug !== $this->generateAutoSlug();
    }

    /**
     * Generate auto slug based on tenant name
     */
    public function generateAutoSlug(): string
    {
        // Generate a consistent "random" suffix based on tenant ID
        // This ensures the slug looks random (to incentivize upgrade) but stays stable for the tenant
        $suffix = substr(md5($this->id . 'salt'), 0, 5);
        return \Illuminate\Support\Str::slug($this->name) . '-' . $suffix;
    }

    /**
     * Revert to auto-generated slug
     */
    public function revertToAutoSlug(): void
    {
        $this->update([
            'slug' => $this->generateAutoSlug(),
            'last_slug_changed_at' => now(),
        ]);
    }
}
