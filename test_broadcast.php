<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Broadcast;

echo "=== Testing Direct Broadcast ===\n\n";

// Test a direct broadcast to the channel
$channel = 'superadmin-updates';
$event = 'payment.reported';
$data = [
    'message' => 'Test broadcast message from CLI at ' . now()->format('H:i:s'),
    'type' => 'payment_reported',
    'url' => '/payments'
];

echo "Broadcasting to channel: $channel\n";
echo "Event: $event\n";
echo "Data: " . json_encode($data) . "\n\n";

try {
    // Use Laravel's broadcast facade directly
    broadcast(
        new class ($channel, $event, $data) implements \Illuminate\Contracts\Broadcasting\ShouldBroadcastNow {
        public $channel;
        public $eventName;
        public $payload;

        public function __construct($channel, $event, $data)
        {
            $this->channel = $channel;
            $this->eventName = $event;
            $this->payload = $data;
        }

        public function broadcastOn()
        {
            return [$this->channel];
        }

        public function broadcastAs()
        {
            return $this->eventName;
        }

        public function broadcastWith()
        {
            return $this->payload;
        }
        }
    );

    echo "Broadcast sent successfully!\n";
    echo "Check your frontend console for the event.\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "\nStack trace:\n" . $e->getTraceAsString() . "\n";
}
