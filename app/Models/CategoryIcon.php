<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryIcon extends Model
{
    protected $fillable = [
        'name',
        'path',
        'vertical_id',
        'business_category_id',
        'is_global',
        'is_active',
    ];

    protected $casts = [
        'is_global' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected $appends = ['icon_url'];

    public function getIconUrlAttribute()
    {
        return $this->path ? \Illuminate\Support\Facades\Storage::disk('bunny')->url($this->path) : null;
    }

    public function vertical()
    {
        return $this->belongsTo(Vertical::class);
    }

    public function businessCategory()
    {
        return $this->belongsTo(BusinessCategory::class);
    }

    public function categories(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Category::class);
    }
}
