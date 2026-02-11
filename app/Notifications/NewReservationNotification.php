<?php

namespace App\Notifications;

use App\Models\Tenant\Gastronomy\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewReservationNotification extends Notification
{
    use Queueable;

    public $reservation;

    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'reservation_id' => $this->reservation->id,
            'customer_name' => $this->reservation->customer_name,
            'message' => "Nueva reserva: {$this->reservation->customer_name} ({$this->reservation->reservation_date->format('d/m')} - {$this->reservation->reservation_time})",
            'url' => route('tenant.admin.reservations.index', ['tenant' => $this->reservation->tenant->slug]),
            'icon' => 'Calendar',
        ];
    }
}
