<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$subscription = App\Models\Subscription::with('plan')->first();

if ($subscription) {
    echo "ID: {$subscription->id}\n";
    echo "Tenant ID: {$subscription->tenant_id}\n";
    echo "Status: {$subscription->status}\n";
    echo "Starts At: {$subscription->starts_at}\n";
    echo "Ends At: {$subscription->ends_at}\n";
    echo "Trial Ends At: " . ($subscription->trial_ends_at ?? 'null') . "\n";
    echo "Billing Cycle: {$subscription->billing_cycle}\n";
    echo "Days Remaining: {$subscription->days_remaining}\n";
    echo "Total Days: {$subscription->total_days}\n";
} else {
    echo "No subscription found\n";
}
