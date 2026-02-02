<?php

namespace App\Events;

use App\Models\Invoice;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentStatusUpdatedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Invoice $invoice;
    public string $status;
    public ?string $notes;

    public function __construct(Invoice $invoice, string $status, ?string $notes = null)
    {
        $this->invoice = $invoice;
        $this->status = $status;
        $this->notes = $notes;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [new Channel('tenant-updates.' . $this->invoice->tenant_id)];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'payment.status_updated';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        $statusText = $this->status === 'paid' ? 'APROBADO' : 'RECHAZADO';
        $message = "Tu pago para la factura #{$this->invoice->id} ha sido {$statusText}.";

        if ($this->status !== 'paid' && $this->notes) {
            $message .= " Motivo: {$this->notes}";
        }

        return [
            'invoice_id' => $this->invoice->id,
            'status' => $this->status,
            'message' => $message,
            'type' => 'payment_status_updated',
        ];
    }
}
