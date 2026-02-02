<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$tenant = App\Models\Tenant::find(3);

echo "Tenant ID: {$tenant->id}\n";
echo "Tenant Name: {$tenant->name}\n";
echo "Tenant Vertical ID: " . ($tenant->vertical_id ?? 'NULL') . "\n\n";

echo "All Public Plans:\n";
$allPlans = App\Models\Plan::where('is_public', true)->get();
foreach ($allPlans as $plan) {
    echo "  - {$plan->name} (ID: {$plan->id}, Vertical: {$plan->vertical_id})\n";
}

echo "\nFiltered Plans for Vertical {$tenant->vertical_id}:\n";
$filteredPlans = App\Models\Plan::where('is_public', true)
    ->where('vertical_id', $tenant->vertical_id)
    ->get();

if ($filteredPlans->count() > 0) {
    foreach ($filteredPlans as $plan) {
        echo "  - {$plan->name} (ID: {$plan->id})\n";
    }
} else {
    echo "  No plans found for this vertical\n";
}
