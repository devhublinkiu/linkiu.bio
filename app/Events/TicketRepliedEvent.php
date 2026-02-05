<?php

namespace App\Events;

use App\Models\Ticket;
use App\Models\TicketReply;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TicketRepliedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Ticket $ticket;
    public TicketReply $reply;

    public function __construct(Ticket $ticket, TicketReply $reply)
    {
        $this->ticket = $ticket;
        $this->reply = $reply;
    }

    public function broadcastOn(): array
    {
        if ($this->reply->is_staff) {
            // Si responde soporte, avisamos al tenant
            return [new Channel('tenant-updates.' . $this->ticket->tenant_id)];
        }

        // Si responde el cliente, avisamos al superadmin
        return [new Channel('superadmin-updates')];
    }

    public function broadcastAs(): string
    {
        return 'ticket.replied';
    }

    public function broadcastWith(): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'subject' => $this->ticket->subject,
            'message' => $this->reply->is_staff
                ? "Soporte respondió: '{$this->ticket->subject}'"
                : "Nueva respuesta del cliente en '{$this->ticket->subject}'",
            'user_name' => $this->reply->user->name ?? 'Usuario',
            'is_staff' => $this->reply->is_staff,
            'type' => 'ticket_replied',
            'url' => route('superadmin.support.show', $this->ticket->id),
        ];
    }
}
