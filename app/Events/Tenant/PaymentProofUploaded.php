<?php

namespace App\Events\Tenant;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentProofUploaded implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $token;
    public $fileUrl;
    public $tenantId;

    /**
     * Create a new event instance.
     */
    public function __construct($tenantId, $token, $fileUrl)
    {
        $this->tenantId = $tenantId;
        $this->token = $token;
        $this->fileUrl = $fileUrl;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // Broadcast to a specific channel for this magic link token
        // Use a private channel if we want security, but for POS public functionality, a public channel with obscure name is easier?
        // Actually, let's use a private channel authorized for the tenant.
        // But the CheckoutDialog is inside the Tenant Admin, so it IS authorized.
        // Channel name: private-pos.{tenantId}.magic.{token}

        return [
            new PrivateChannel('pos.' . $this->tenantId . '.magic.' . $this->token),
        ];
    }

    public function broadcastAs()
    {
        return 'proof.uploaded';
    }
}
