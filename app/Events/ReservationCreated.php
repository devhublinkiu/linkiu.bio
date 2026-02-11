<?php

namespace App\Events;

use App\Models\Tenant\Gastronomy\Reservation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReservationCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $reservation;

    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('tenant.' . $this->reservation->tenant_id . '.reservations'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'reservation.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->reservation->id,
            'customer_name' => $this->reservation->customer_name,
            'party_size' => $this->reservation->party_size,
            'reservation_time' => $this->reservation->reservation_time,
            'message' => "Nueva reserva: {$this->reservation->customer_name} ({$this->reservation->party_size} pax)",
            'type' => 'reservation.created'
        ];
    }
}
