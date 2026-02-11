<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
// use Illuminate\Broadcasting\PrivateChannel; // Removed to match existing public channel pattern

use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $order;

    /**
     * Create a new event instance.
     */
    public function __construct(\App\Models\Tenant\Gastronomy\Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('tenant.' . $this->order->tenant_id . '.orders'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'order.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->order->id,
            'customer_name' => $this->order->customer_name,
            'total' => $this->order->total,
            'status' => $this->order->status,
            'service_type' => $this->order->service_type,
            'created_at' => $this->order->created_at,
            'items_summary' => $this->order->items->map(function ($item) {
            return $item->quantity . 'x ' . $item->product_name;
        })->implode(', '),
            'message' => 'Nuevo pedido #' . $this->order->id,
        ];
    }
}
