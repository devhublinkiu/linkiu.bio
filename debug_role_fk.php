<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\Tenant;

// Check FK on users.role_id
echo "--- Users Table Schema ---\n";
try {
    $results = DB::select("SHOW CREATE TABLE users");
    foreach ($results[0] as $key => $value) {
        if ($key === 'Create Table') {
            echo $value . "\n";
        }
    }
} catch (\Exception $e) {
    echo "Error getting schema: " . $e->getMessage() . "\n";
}

// Check Tenant
echo "\n--- Tenant Info ---\n";
$t = Tenant::where('slug', 'linkiuecom')
    ->orWhere('id', 'linkiuecom')
    ->orWhere('domain', 'linkiuecom') // Just in case
    ->first();

if ($t) {
    echo "Tenant Found: ID {$t->id}, Name: {$t->name}\n";
    // Check Pivot for User 16
    $pivots = DB::table('tenant_user')->where('user_id', 16)->where('tenant_id', $t->id)->get();
    echo "Pivot records for User 16:\n";
    print_r($pivots->toArray());
} else {
    echo "Tenant 'linkiuecom' NOT FOUND.\n";
}
