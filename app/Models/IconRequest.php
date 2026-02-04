<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IconRequest extends Model
{
    protected $fillable = ['tenant_id', 'requested_name', 'reference_image_path', 'status', 'admin_feedback'];

    public function tenant(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
