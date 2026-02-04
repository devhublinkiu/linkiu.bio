<?php

namespace App\Notifications;

use App\Models\IconRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class IconRequestedNotification extends Notification
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

    /**
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        $tenantName = $this->iconRequest->tenant->name ?? 'Un Tenant';
        return new BroadcastMessage([
            'id' => $this->iconRequest->id,
            'tenant_name' => $tenantName,
            'requested_name' => $this->iconRequest->requested_name,
            'message' => "La tienda '{$tenantName}' ha solicitado el icono '{$this->iconRequest->requested_name}'.",
            'type' => 'icon_requested',
            'url' => route('icon-requests.index'),
        ]);
    }

    /**
     * Determine the broadcast channel.
     * Overrides default private channel to use our public channel.
     */
    public function broadcastOn()
    {
        return ['superadmin-updates'];
    }

    /**
     * Get the broadcast name.
     */
    public function broadcastType()
    {
        return 'icon.requested';
    }
}
