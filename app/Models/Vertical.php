<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vertical extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    public function categories()
    {
        return $this->hasMany(BusinessCategory::class);
    }

    public function plans()
    {
        return $this->hasMany(Plan::class);
    }
}
