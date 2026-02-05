<?php

namespace App\Events;

use App\Models\Ticket;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TicketCreatedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Ticket $ticket;

    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    public function broadcastOn(): array
    {
        return [new Channel('superadmin-updates')];
    }

    public function broadcastAs(): string
    {
        return 'ticket.created';
    }

    public function broadcastWith(): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'tenant_name' => $this->ticket->tenant->name ?? 'Tienda',
            'subject' => $this->ticket->subject,
            'message' => "Nuevo ticket soporte: '{$this->ticket->subject}' de {$this->ticket->tenant->name}",
            'type' => 'ticket_created',
            'url' => route('superadmin.support.show', $this->ticket->id),
        ];
    }
}
