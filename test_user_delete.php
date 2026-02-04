<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Role;
use App\Models\User;

try {
    echo "--- Step 1: Making Role 3 Global ---\n";
    $role = Role::find(3);
    if ($role) {
        $role->tenant_id = null;
        $role->save();
        echo "Role 3 ({$role->name}) is now Global (tenant_id = NULL).\n";
    } else {
        echo "Error: Role 3 not found.\n";
        exit;
    }

    echo "\n--- Step 2: Assigning Role 3 to User 16 ---\n";
    $user = User::find(16);
    if ($user) {
        $user->role_id = 3;
        $user->save();
        echo "User 16 ({$user->name}) assigned to Role 3.\n";
    } else {
        echo "Error: User 16 not found.\n";
        exit;
    }

    echo "\n--- Step 3: Attempting Deletion ---\n";
    // Reload user to be sure
    $user = User::find(16);
    if ($user->delete()) {
        echo "SUCCESS: User 16 deleted successfully.\n";
    } else {
        echo "FAILURE: User 16 could not be deleted (unknown reason).\n";
    }

} catch (\Exception $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
