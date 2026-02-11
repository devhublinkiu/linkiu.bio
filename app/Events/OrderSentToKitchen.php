<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderSentToKitchen implements ShouldBroadcastNow
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
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('tenant.' . $this->order->tenant_id . '.kitchen'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'order.sent';
    }

    public function broadcastWith(): array
    {
        // Load relationships if not loaded to prevent lazy loading issues in serialization
        if (!$this->order->relationLoaded('items')) {
            $this->order->load('items.product', 'table', 'creator');
        }

        return [
            'id' => $this->order->id,
            'ticket_number' => $this->order->ticket_number,
            'table_name' => $this->order->table->name ?? 'N/A',
            'customer_name' => $this->order->customer_name,
            'service_type' => $this->order->service_type,
            'status' => $this->order->status,
            'created_at' => $this->order->created_at->toIso8601String(),
            'items' => $this->order->items->map(function ($item) {
            return [
                    'product_name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'variant_options' => $item->variant_options,
                ];
        }),
        ];
    }
}
