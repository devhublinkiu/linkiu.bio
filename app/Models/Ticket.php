<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;

class Ticket extends Model
{
    use BelongsToTenant;
    protected $fillable = [
        'tenant_id',
        'user_id',
        'reference_id',
        'assigned_to_id',
        'subject',
        'status',
        'priority',
        'category',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($ticket) {
            $tenant = app('currentTenant');
            $prefix = 'L';

            if ($tenant) {
                $words = explode(' ', $tenant->name);
                $initials = '';
                if (count($words) >= 2) {
                    $initials = substr($words[0], 0, 1) . substr($words[1], 0, 1);
                } else {
                    $initials = substr($words[0], 0, 2);
                }
                $prefix .= strtoupper($initials);
            }

            // Simple random sequence to ensure uniqueness before ID is generated
            $ticket->reference_id = $prefix . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        });

        static::created(function ($ticket) {
            // Optional: Update with actual ID for a true sequence
            $tenant = app('currentTenant');
            $prefix = 'L';
            if ($tenant) {
                $words = explode(' ', $tenant->name);
                if (count($words) >= 2) {
                    $initials = substr($words[0], 0, 1) . substr($words[1], 0, 1);
                } else {
                    $initials = substr($words[0], 0, 2);
                }
                $prefix .= strtoupper($initials);
            }
            $ticket->reference_id = $prefix . str_pad($ticket->id, 4, '0', STR_PAD_LEFT);
            $ticket->saveQuietly();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to_id');
    }

    public function replies()
    {
        return $this->hasMany(TicketReply::class);
    }

    public function lastReply()
    {
        return $this->hasOne(TicketReply::class)->latestOfMany();
    }

    public function scopeWithLastReply($query)
    {
        return $query->with('lastReply');
    }
}
