<?php

namespace App\Notifications;

use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class TenantCreatedNotification extends Notification
{
    use Queueable;

    public $tenant;

    /**
     * Create a new notification instance.
     */
    public function __construct(Tenant $tenant)
    {
        $this->tenant = $tenant;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        // Load relationships (safely)
        $owner = \App\Models\User::find($this->tenant->owner_id);
        $subscription = $this->tenant->latestSubscription()->with('plan')->first();
        $planName = $subscription && $subscription->plan ? $subscription->plan->name : 'N/A';
        $ownerEmail = $owner ? $owner->email : 'N/A';

        $message = "🚀 Nueva Tienda: {$this->tenant->name}\n\n" .
            "Dueño: {$ownerEmail}\n\n" .
            "Plan: {$planName}\n";

        return [
            'tenant_id' => $this->tenant->id,
            'tenant_name' => $this->tenant->name,
            'tenant_slug' => $this->tenant->slug,
            'owner_email' => $ownerEmail,
            'plan_name' => $planName,
            'message' => $message,
            'type' => 'tenant_created',
            'url' => route('tenants.show', $this->tenant->id),
        ];
    }

    /**
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        // Load relationships (safely)
        $owner = \App\Models\User::find($this->tenant->owner_id);
        $subscription = $this->tenant->latestSubscription()->with('plan')->first();
        $planName = $subscription && $subscription->plan ? $subscription->plan->name : 'N/A';
        $ownerEmail = $owner ? $owner->email : 'N/A';

        $message = "🚀 Nueva Tienda: {$this->tenant->name}\n\n" .
            "Dueño: {$ownerEmail}\n\n" .
            "Plan: {$planName}\n";

        return new BroadcastMessage([
            'tenant_id' => $this->tenant->id,
            'tenant_name' => $this->tenant->name,
            'tenant_slug' => $this->tenant->slug,
            'owner_email' => $ownerEmail,
            'plan_name' => $planName,
            'message' => $message,
            'type' => 'tenant_created',
            'url' => route('tenants.show', $this->tenant->id),
        ]);
    }

    /**
     * Determine the broadcast channel.
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
        return 'tenant.created';
    }
}
