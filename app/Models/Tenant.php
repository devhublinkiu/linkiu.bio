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
        'slug_changes_count',
        'trial_ends_at'
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
        'last_slug_changed_at' => 'datetime',
        'slug_changes_count' => 'integer',
        'trial_ends_at' => 'datetime',
    ];

    protected $appends = ['logo_url', 'store_description', 'brand_colors'];

    public function getLogoUrlAttribute()
    {
        $settings = $this->settings ?? [];
        if (isset($settings['logo_url'])) {
            return $settings['logo_url'];
        }
        if (isset($settings['logo_path'])) {
            return Storage::disk('s3')->url($settings['logo_path']);
        }
        return null;
    }

    public function getStoreDescriptionAttribute()
    {
        return $this->settings['store_description'] ?? null;
    }

    public function getBrandColorsAttribute()
    {
        return [
            'bg_color' => $this->settings['bg_color'] ?? '#E91E63', // Default Pink
            'name_color' => $this->settings['name_color'] ?? '#ffffff',
            'description_color' => $this->settings['description_color'] ?? '#ffffff'
        ];
    }

    public function category()
    {
        return $this->belongsTo(BusinessCategory::class , 'category_id');
    }

    public function vertical()
    {
        return $this->belongsTo(Vertical::class , 'vertical_id');
    }

    public function roles()
    {
        return $this->hasMany(Role::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class , 'tenant_user')
            ->withPivot(['role', 'role_id', 'profile_photo_path'])
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
     * Check if the tenant's current plan has a specific feature enabled
     */
    public function hasFeature(string $featureSlug): bool
    {
        // For trial period, we might want to allow some features
        if ($this->trial_ends_at && $this->trial_ends_at->isFuture()) {
            return true;
        }

        $subscription = $this->latestSubscription;

        if (!$subscription || !$subscription->isActive()) {
            return false;
        }

        $plan = $subscription->plan;

        if (!$plan) {
            return false;
        }

        // Check if the feature slug exists in the features array or as a true value in a config object
        $features = $plan->features ?? [];

        // Case 1: Simple array of strings ['feat1', 'feat2']
        if (is_array($features) && in_array($featureSlug, $features)) {
            return true;
        }

        // Case 2: Object/Assoc array {'feat1': true, 'feat2': false}
        if (is_array($features)) {
            foreach ($features as $key => $value) {
                if (is_array($value) || is_object($value))
                    continue; // Skip nested if any

                if ($key === $featureSlug && $value === true) {
                    return true;
                }
            }
        }

        // Case 3: List containing an object (sometimes found in DB: [{"feat1": true}])
        if (is_array($features)) {
            foreach ($features as $item) {
                if (is_array($item) && isset($item[$featureSlug]) && $item[$featureSlug] === true) {
                    return true;
                }
            }
        }

        return false;
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

    /**
     * Get the payment methods configured for the tenant.
     */
    public function paymentMethods()
    {
        return $this->hasMany(TenantPaymentMethod::class);
    }

    /**
     * Get the bank accounts configured for the tenant.
     */
    public function bankAccounts()
    {
        return $this->hasMany(TenantBankAccount::class)->orderBy('sort_order')->orderBy('created_at');
    }

    /**
     * Get the shipping methods configured for the tenant.
     */
    public function shippingMethods()
    {
        return $this->hasMany(TenantShippingMethod::class);
    }

    public function locations()
    {
        return $this->hasMany(Location::class);
    }
}
