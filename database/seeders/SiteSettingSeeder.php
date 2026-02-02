<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteSetting;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::firstOrCreate(
            ['id' => 1],
            [
                'app_name' => 'Linkiu.bio',
                'logo_path' => null,
                'favicon_path' => null,
                'bank_name' => 'Bancolombia',
                'bank_account_type' => 'Ahorros',
                'bank_account_number' => '123-456789-00',
                'bank_account_holder' => 'Linkiu SAS',
                'bank_account_nit' => '901.234.567-8',
                'slug_change_price' => 10000.00,
            ]
        );
    }
}
