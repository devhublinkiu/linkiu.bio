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

    public function __construct(\App\Models\Tenant\Gastronomy\Order $order)
    {
        $this->order = $order;
    }

    public function broadcastOn(): array
    {
        $tenantId = $this->order->tenant_id;
        $locationId = $this->order->location_id;

        $channels = [];
        $channels[] = new Channel('tenant.' . $tenantId . '.kitchen');

        if ($locationId) {
            $channels[] = new Channel('tenant.' . $tenantId . '.location.' . $locationId . '.kitchen');
        }

        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'order.sent';
    }

    public function broadcastWith(): array
    {
        if (!$this->order->relationLoaded('items')) {
            $this->order->load(['items.product', 'table', 'creator']);
        }

        return [
            'id' => $this->order->id,
            'ticket_number' => $this->order->ticket_number,
            'table' => $this->order->table ? ['name' => $this->order->table->name] : null,
            'creator' => $this->order->creator ? ['name' => $this->order->creator->name] : null,
            'customer_name' => $this->order->customer_name,
            'service_type' => $this->order->service_type,
            'status' => $this->order->status,
            'priority' => $this->order->priority ?? 'normal',
            'created_at' => $this->order->created_at->toIso8601String(),
            'items' => $this->order->items->map(fn($item) => [
                'id' => $item->id,
                'product_name' => $item->product_name,
                'quantity' => $item->quantity,
                'variant_options' => $item->variant_options,
                'notes' => $item->notes,
                'status' => $item->status ?? 'active',
            ]),
        ];
    }
}