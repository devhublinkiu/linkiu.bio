<?php

namespace App\Events;

use App\Models\IconRequest;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class IconRequested implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $iconRequest;

    /**
     * Create a new event instance.
     */
    public function __construct(IconRequest $iconRequest)
    {
        $this->iconRequest = $iconRequest;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('superadmin-updates'),
        ];
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
        $tenantName = $this->iconRequest->tenant->name ?? 'Un Tenant';



        return [
            'id' => $this->iconRequest->id,
            'tenant_name' => $tenantName,
            'requested_name' => $this->iconRequest->requested_name,
            'message' => "La tienda '{$tenantName}' ha solicitado el icono '{$this->iconRequest->requested_name}'.",
            'type' => 'icon_requested',
            'url' => route('icon-requests.index'),
        ];
    }
}
