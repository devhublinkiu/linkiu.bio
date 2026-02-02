<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'app_name',
        'logo_path',
        'favicon_path',
        'support_email',
        'facebook_url',
        'instagram_url',
        'twitter_url',
        'meta_title',
        'meta_description',
        'bank_name',
        'bank_account_type',
        'bank_account_number',
        'bank_account_holder',
        'bank_account_nit',
        'slug_change_price',
    ];
}
