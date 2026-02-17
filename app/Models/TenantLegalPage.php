<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TenantLegalPage extends Model
{
    protected $table = 'tenant_legal_pages';

    protected $fillable = [
        'tenant_id',
        'slug',
        'title',
        'content',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Slugs y títulos de las páginas legales disponibles (para todas las verticales).
     */
    public static function legalSlugs(): array
    {
        return [
            'terminos-y-condiciones' => 'Términos y condiciones',
            'politica-privacidad' => 'Política de privacidad',
            'politica-cookies' => 'Política de cookies',
            'condiciones-uso' => 'Condiciones de uso',
            'politica-devoluciones' => 'Política de devoluciones y reembolsos',
            'condiciones-reservas' => 'Condiciones de reservas',
            'informacion-consumidores' => 'Información para consumidores',
        ];
    }
}
