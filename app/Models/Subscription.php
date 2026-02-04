<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class Subscription extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'plan_id',
        'status',
        'billing_cycle',
        'starts_at',
        'ends_at',
        'trial_ends_at',
        'next_payment_date',
        'cancelled_at'
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'trial_ends_at' => 'datetime',
        'next_payment_date' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    protected $appends = ['days_remaining', 'trial_days_remaining', 'total_days', 'percent_completed'];

    public function getDaysRemainingAttribute()
    {
        if (!$this->ends_at)
            return 0;
        $hours = now()->diffInHours($this->ends_at, false);
        return (int) max(0, ceil($hours / 24));
    }

    public function getTrialDaysRemainingAttribute()
    {
        if (!$this->trial_ends_at)
            return 0;
        // diffInDays returns float in some contexts or if using specialized methods. 
        // We'll use diffInHours / 24 and ceil to be safe and precise.
        $hours = now()->diffInHours($this->trial_ends_at, false);
        return (int) max(0, ceil($hours / 24));
    }

    public function getTotalDaysAttribute()
    {
        if ($this->status === 'trialing') {
            return $this->plan?->trial_days ?? 15;
        }

        $start = $this->starts_at ?? $this->created_at;
        $end = $this->ends_at;

        if ($start && $end) {
            return (int) max(1, $start->diffInDays($end));
        }

        return 30; // Default fallback for monthly
    }

    public function getPercentCompletedAttribute()
    {
        $total = $this->total_days;
        $remaining = ($this->status === 'trialing') ? $this->trial_days_remaining : $this->days_remaining;

        if ($total <= 0)
            return 0;

        // We want to show how much has been CONSUMED, or how much is LEFT? 
        // Usually progress bars show what's DONE. 
        // But user asked for "consumo de tiempo" (time consumption).
        // consumed = total - remaining
        $consumed = max(0, $total - $remaining);
        return min(100, round(($consumed / $total) * 100));
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Helpers
    public function isActive()
    {
        return $this->status === 'active' || ($this->status === 'trialing' && $this->trial_ends_at?->isFuture());
    }
}
