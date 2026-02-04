<?php

namespace App\Events;

use App\Models\IconRequest;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class IconRequestedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $iconRequest;
    public $tenantName;

    /**
     * Create a new event instance.
     */
    public function __construct(IconRequest $iconRequest)
    {
        $this->iconRequest = $iconRequest;
        $this->tenantName = $iconRequest->tenant->name ?? 'Un Tenant';
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [new Channel('superadmin-updates')];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'icon.requested';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->iconRequest->id,
            'tenant_name' => $this->tenantName,
            'requested_name' => $this->iconRequest->requested_name,
            'message' => "La tienda '{$this->tenantName}' ha solicitado el icono '{$this->iconRequest->requested_name}'.",
            'type' => 'icon_requested',
            'url' => route('icon-requests.index'),
        ];
    }
}
