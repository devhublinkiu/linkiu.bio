<?php

namespace App\Models\Tenant\Church;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class ChurchAppointment extends Model
{
    use BelongsToTenant;

    protected $table = 'church_appointments';

    protected $fillable = [
        'tenant_id',
        'guest_name',
        'guest_phone',
        'guest_email',
        'appointment_type',
        'preferred_date',
        'assigned_date',
        'notes',
        'status',
        'consent',
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'assigned_date' => 'date',
        'consent' => 'boolean',
    ];

    public const TYPE_ORACION = 'oracion';
    public const TYPE_CONSEJERIA = 'consejeria';
    public const TYPE_REUNION_PASTOR = 'reunion_pastor';
    public const TYPE_OTRO = 'otro';

    public const STATUS_PENDING = 'pending';
    public const STATUS_CONTACTED = 'contacted';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    public static function typeLabels(): array
    {
        return [
            self::TYPE_ORACION => 'Oración',
            self::TYPE_CONSEJERIA => 'Consejería pastoral',
            self::TYPE_REUNION_PASTOR => 'Reunión con pastor',
            self::TYPE_OTRO => 'Otro',
        ];
    }

    public static function statusLabels(): array
    {
        return [
            self::STATUS_PENDING => 'Pendiente',
            self::STATUS_CONTACTED => 'Contactado',
            self::STATUS_CONFIRMED => 'Confirmada',
            self::STATUS_COMPLETED => 'Realizada',
            self::STATUS_CANCELLED => 'Cancelada',
        ];
    }
}
