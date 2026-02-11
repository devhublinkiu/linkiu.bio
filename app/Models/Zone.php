<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Zone extends Model
{
    use BelongsToTenant;

    protected $fillable = ['tenant_id', 'name'];

    public function tables(): HasMany
    {
        return $this->hasMany(Table::class);
    }
}
