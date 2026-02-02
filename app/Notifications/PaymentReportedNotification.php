<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class PaymentReportedNotification extends Notification
{
    use Queueable;

    public $invoice;

    /**
     * Create a new notification instance.
     */
    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
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
        return [
            'invoice_id' => $this->invoice->id,
            'tenant_name' => $this->invoice->tenant->name,
            'amount' => $this->invoice->amount,
            'message' => "La tienda '{$this->invoice->tenant->name}' ha reportado un pago de $" . number_format($this->invoice->amount ?? 0, 0, ',', '.'),
            'type' => 'payment_reported',
            'url' => route('payments.index'), // SuperAdmin payments list
        ];
    }

    /**
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'invoice_id' => $this->invoice->id,
            'tenant_name' => $this->invoice->tenant->name,
            'amount' => $this->invoice->amount,
            'message' => "La tienda '{$this->invoice->tenant->name}' ha reportado un pago de $" . number_format($this->invoice->amount ?? 0, 0, ',', '.'),
            'type' => 'payment_reported',
            'url' => route('payments.index'),
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
        return 'payment.reported';
    }
}
