<?php

namespace App\Events;

use App\Models\IconRequest;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class IconRequestStatusUpdated implements ShouldBroadcastNow
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
        // Broadcast to the specific tenant channel
        return [
            new Channel('tenant-updates.' . $this->iconRequest->tenant_id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'icon.status_updated';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {


        $status = $this->iconRequest->status === 'approved' ? 'APROBADA' : 'RECHAZADA';
        $message = "Tu solicitud de icono '{$this->iconRequest->requested_name}' ha sido {$status}.";

        if ($this->iconRequest->admin_feedback) {
            $message .= " Comentarios: {$this->iconRequest->admin_feedback}";
        }

        return [
            'id' => $this->iconRequest->id,
            'status' => $this->iconRequest->status,
            'icon_name' => $this->iconRequest->requested_name,
            'message' => $message,
            'type' => 'icon_status_updated',
            'url' => route('tenant.categories.index', ['tenant' => $this->iconRequest->tenant->id /* slug logic handles redirection usually but let's be safe */]),
        ];
    }
}
