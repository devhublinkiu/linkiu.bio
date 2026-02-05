<?php

namespace App\Events;

use App\Models\Ticket;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TicketAssignedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Ticket $ticket;
    public $assignedTo;

    public function __construct(Ticket $ticket, $assignedTo)
    {
        $this->ticket = $ticket;
        $this->assignedTo = $assignedTo;
    }

    public function broadcastOn(): array
    {
        $channels = [new Channel('superadmin-updates')];

        // Also broadcast to tenant's channel
        if ($this->ticket->tenant_id) {
            $channels[] = new Channel('tenant-updates.' . $this->ticket->tenant_id);
        }

        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'ticket.assigned';
    }

    public function broadcastWith(): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'subject' => $this->ticket->subject,
            'assigned_to' => $this->assignedTo->name,
            'tenant' => $this->ticket->tenant->name ?? 'N/A',
            'message' => "Ticket #{$this->ticket->id} asignado a {$this->assignedTo->name}",
            'url' => route('superadmin.support.show', $this->ticket->id),
        ];
    }
}
