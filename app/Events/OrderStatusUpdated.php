<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $order;
    public $comment;

    /**
     * Create a new event instance.
     */
    public function __construct(\App\Models\Tenant\Gastronomy\Order $order, $comment = null)
    {
        $this->order = $order;
        $this->comment = $comment;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // Public channel for customer updates (could be private but requires auth logic for guests)
        // For MVP simplicity and because order IDs are not secret, we use a public channel with order ID
        return [
            new Channel('tenant.' . $this->order->tenant_id . '.orders.' . $this->order->id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'order.status.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->order->id,
            'status' => $this->order->status,
            'comment' => $this->comment,
            'updated_at' => now()->toIso8601String(),
            'message' => 'El estado de tu pedido ha cambiado a: ' . $this->order->status,
        ];
    }
}
