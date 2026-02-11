<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOrderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $order;

    /**
     * Create a new notification instance.
     */
    public function __construct(\App\Models\Tenant\Gastronomy\Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'amount' => $this->order->total,
            'customer_name' => $this->order->customer_name,
            'icon' => 'Utensils', // Icon for frontend display
            'message' => "Nuevo pedido #{$this->order->id} de {$this->order->customer_name}",
            'url' => route('tenant.admin.gastronomy.orders.show', ['tenant' => $this->order->tenant->slug, 'order' => $this->order->id]), // Placeholder route until implemented
            'created_at' => $this->order->created_at,
        ];
    }
}
