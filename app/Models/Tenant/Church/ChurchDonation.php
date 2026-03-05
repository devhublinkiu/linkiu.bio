<?php

namespace App\Models\Tenant\Church;

use App\Models\Tenant;
use App\Models\Tenant\Payments\BankAccount;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ChurchDonation extends Model
{
    use BelongsToTenant;

    protected $table = 'church_donations';

    protected $fillable = [
        'tenant_id',
        'donor_name',
        'donor_phone',
        'amount',
        'currency',
        'bank_account_id',
        'proof_path',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    protected $appends = ['proof_url'];

    public const STATUS_PENDING = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class, 'bank_account_id');
    }

    public function getProofUrlAttribute(): ?string
    {
        if (empty($this->proof_path)) {
            return null;
        }
        return Storage::disk('bunny')->exists($this->proof_path)
            ? Storage::disk('bunny')->url($this->proof_path)
            : null;
    }
}
