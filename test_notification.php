<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Testing Notification Broadcast via notify() ===\n\n";

try {
    // Get the first invoice with tenant
    $invoice = App\Models\Invoice::with('tenant')->latest()->first();

    echo "Invoice ID: {$invoice->id}, Tenant: {$invoice->tenant->name}\n";

    // Get first superadmin
    $admin = App\Models\User::where('is_super_admin', true)->first();

    echo "Sending notification to: {$admin->email}\n";

    // Create the notification
    $notification = new App\Notifications\PaymentReportedNotification($invoice);

    // Check what channels and type the notification uses
    echo "\nNotification configuration:\n";
    echo "  via(): " . json_encode($notification->via($admin)) . "\n";
    echo "  broadcastOn(): " . json_encode($notification->broadcastOn()) . "\n";
    echo "  broadcastType(): " . $notification->broadcastType() . "\n";
    echo "  toBroadcast():\n";
    $broadcastMessage = $notification->toBroadcast($admin);
    echo "    " . json_encode($broadcastMessage->data) . "\n";

    echo "\nSending notification...\n";
    $admin->notify($notification);

    echo "\nNotification sent! Check your frontend console.\n";

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
