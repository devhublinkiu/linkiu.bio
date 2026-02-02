<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessCategory extends Model
{
    protected $fillable = ['vertical_id', 'name', 'slug', 'require_verification'];

    public function vertical()
    {
        return $this->belongsTo(Vertical::class);
    }

    public function tenants()
    {
        return $this->hasMany(Tenant::class, 'category_id');
    }
}
