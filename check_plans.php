<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$plans = \App\Models\Plan::all();
foreach ($plans as $plan) {
    echo "Plan: {$plan->name}\n";
    echo "Features: " . json_encode($plan->features) . "\n\n";
}

$tenant = \App\Models\Tenant::where('slug', 'linkiurest')->first();
if ($tenant) {
    echo "Tenant: linkiurest\n";
    $sub = $tenant->latestSubscription;
    if ($sub && $sub->plan) {
        echo "Active Plan: {$sub->plan->name}\n";
        echo "Trial Ends: " . ($tenant->trial_ends_at ? $tenant->trial_ends_at->toDateTimeString() : 'N/A') . "\n";
        echo "Has Feature 'whatsapp': " . ($tenant->hasFeature('whatsapp') ? 'Yes' : 'No') . "\n";
        echo "Has Feature 'whatsapp_notifications': " . ($tenant->hasFeature('whatsapp_notifications') ? 'Yes' : 'No') . "\n";
    }
    else {
        echo "No active subscription found.\n";
    }
}
