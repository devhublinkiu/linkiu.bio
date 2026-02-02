<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class InvoiceGeneratedNotification extends Notification
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
        $tenant = $this->invoice->tenant;
        return [
            'invoice_id' => $this->invoice->id,
            'amount' => $this->invoice->amount,
            'message' => "Se ha generado una nueva factura por $" . number_format($this->invoice->amount, 0, ',', '.'),
            'type' => 'invoice_generated',
            'url' => route('tenant.invoices.index', ['tenant' => $tenant->slug]),
        ];
    }

    /**
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        $tenant = $this->invoice->tenant;
        return new BroadcastMessage([
            'invoice_id' => $this->invoice->id,
            'amount' => $this->invoice->amount,
            'message' => "Se ha generado una nueva factura por $" . number_format($this->invoice->amount, 0, ',', '.'),
            'type' => 'invoice_generated',
            'url' => route('tenant.invoices.index', ['tenant' => $tenant->slug]),
        ]);
    }

    /**
     * Determine the broadcast channel.
     */
    public function broadcastOn()
    {
        return ['tenant-updates.' . $this->invoice->tenant_id];
    }

    /**
     * Get the broadcast name.
     */
    public function broadcastType()
    {
        return 'invoice.generated';
    }
}
