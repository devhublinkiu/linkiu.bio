<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class StoreReport extends Model
{
    protected $table = 'store_reports';

    protected $fillable = [
        'tenant_id',
        'category',
        'message',
        'reporter_email',
        'reporter_whatsapp',
        'image_path',
        'url_context',
        'status',
        'ip',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }
        return Storage::disk('bunny')->url($this->image_path);
    }

    public static function categories(): array
    {
        return [
            'problema_pedido' => 'Problema con pedido',
            'publicidad_enganosa' => 'Publicidad engañosa',
            'trato_indebido' => 'Trato indebido',
            'producto_servicio' => 'Producto o servicio',
            'otro' => 'Otro',
        ];
    }

    public static function statuses(): array
    {
        return [
            'new' => 'Nuevo',
            'in_review' => 'En revisión',
            'resolved' => 'Resuelto',
            'dismissed' => 'Descartado',
        ];
    }
}
