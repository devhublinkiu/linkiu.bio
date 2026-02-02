<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'vertical_id',
        'name',
        'slug',
        'description',
        'cover_path',
        'monthly_price',
        'currency',
        'quarterly_discount_percent',
        'semiannual_discount_percent',
        'yearly_discount_percent',
        'trial_days',
        'no_initial_payment_required',
        'support_level',
        'allow_custom_slug',
        'is_public',
        'is_featured',
        'highlight_text',
        'sort_order',
        'features',
        'limits',
        'stripe_product_id',
    ];

    protected $casts = [
        'monthly_price' => 'decimal:2',
        'no_initial_payment_required' => 'boolean',
        'allow_custom_slug' => 'boolean',
        'is_public' => 'boolean',
        'is_featured' => 'boolean',
        'features' => 'array',
        'limits' => 'array',
    ];

    protected $appends = ['yearly_price', 'quarterly_price'];

    public function vertical()
    {
        return $this->belongsTo(Vertical::class);
    }

    /**
     * Calculate price for a specific duration in months
     */
    public function getPriceForDuration(int $months): float
    {
        $basePrice = $this->monthly_price * $months;
        $discountPercent = 0;

        if ($months === 3)
            $discountPercent = $this->quarterly_discount_percent;
        if ($months === 6)
            $discountPercent = $this->semiannual_discount_percent;
        if ($months === 12)
            $discountPercent = $this->yearly_discount_percent;

        return $basePrice * (1 - ($discountPercent / 100));
    }

    public function getYearlyPriceAttribute()
    {
        return $this->getPriceForDuration(12);
    }

    public function getQuarterlyPriceAttribute()
    {
        return $this->getPriceForDuration(3);
    }
}
