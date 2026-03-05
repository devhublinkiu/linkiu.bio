<?php

namespace App\Models\Tenant\Church;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChurchTestimonialReaction extends Model
{
    protected $table = 'church_testimonial_reactions';

    public const TYPE_BLESSING = 'blessing';
    public const TYPE_PRAYER = 'prayer';
    public const TYPE_AMEN = 'amen';

    protected $fillable = ['church_testimonial_id', 'visitor_id', 'reaction_type'];

    public function testimonial(): BelongsTo
    {
        return $this->belongsTo(ChurchTestimonial::class, 'church_testimonial_id');
    }
}
