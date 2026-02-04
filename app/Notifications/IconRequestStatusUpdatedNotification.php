<?php

namespace App\Notifications;

use App\Models\IconRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class IconRequestStatusUpdatedNotification extends Notification
{
    use Queueable;

    public $iconRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct(IconRequest $iconRequest)
    {
        $this->iconRequest = $iconRequest;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
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
            'url' => route('tenant.categories.index', ['tenant' => $this->iconRequest->tenant->slug]),
        ];
    }

    /**
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        \Illuminate\Support\Facades\Log::info('IconRequestStatusUpdatedNotification broadcasting: ' . $this->iconRequest->id);
        $status = $this->iconRequest->status === 'approved' ? 'APROBADA' : 'RECHAZADA';
        $message = "Tu solicitud de icono '{$this->iconRequest->requested_name}' ha sido {$status}.";

        if ($this->iconRequest->admin_feedback) {
            $message .= " Comentarios: {$this->iconRequest->admin_feedback}";
        }

        return new BroadcastMessage([
            'id' => $this->iconRequest->id,
            'status' => $this->iconRequest->status,
            'icon_name' => $this->iconRequest->requested_name,
            'message' => $message,
            'type' => 'icon_status_updated',
            'url' => route('tenant.categories.index', ['tenant' => $this->iconRequest->tenant->slug]),
        ]);
    }

    /**
     * Determine the broadcast channel.
     */
    public function broadcastOn()
    {
        return ['tenant-updates.' . $this->iconRequest->tenant_id];
    }

    /**
     * Get the broadcast name.
     */
    public function broadcastType()
    {
        return 'icon.status_updated';
    }
}
