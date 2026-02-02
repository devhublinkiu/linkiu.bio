<?php

namespace App\Events;

use App\Models\Invoice;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentReportedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Invoice $invoice;

    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
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
        return 'payment.reported';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'invoice_id' => $this->invoice->id,
            'tenant_name' => $this->invoice->tenant->name ?? 'Unknown',
            'amount' => $this->invoice->amount ?? 0,
            'message' => "La tienda '{$this->invoice->tenant->name}' ha reportado un pago de $" . number_format($this->invoice->amount ?? 0, 0, ',', '.'),
            'type' => 'payment_reported',
            'url' => route('payments.index'),
        ];
    }
}
