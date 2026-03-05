<?php

namespace App\Models\Tenant\Church;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChurchDevotionalReaction extends Model
{
    protected $table = 'church_devotional_reactions';

    public const TYPE_BLESSING = 'blessing';
    public const TYPE_PRAYER = 'prayer';

    protected $fillable = ['church_devotional_id', 'visitor_id', 'reaction_type'];

    public function devotional(): BelongsTo
    {
        return $this->belongsTo(ChurchDevotional::class, 'church_devotional_id');
    }
}
