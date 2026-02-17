<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use App\Models\Tenant\Gastronomy\Reservation;
use App\Services\InfobipService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendReservationReminders extends Command
{
    protected $signature = 'reservations:send-reminders
                            {--minutes=60 : Minutos antes de la hora de la reserva para enviar (por defecto 1 hora)}
                            {--window=10 : Ventana en minutos (ej. 60±10 = entre 50 y 70 min)}';

    protected $description = 'Envía recordatorios WhatsApp (RE-04) para reservas que están por comenzar.';

    public function handle(InfobipService $infobip): int
    {
        $minutesBefore = (int) $this->option('minutes');
        $window = (int) $this->option('window');
        $windowStart = now()->addMinutes($minutesBefore - $window);
        $windowEnd = now()->addMinutes($minutesBefore + $window);

        $tenants = Tenant::where('is_active', true)->get();
        $sent = 0;

        foreach ($tenants as $tenant) {
            if (!$tenant->hasFeature('whatsapp')) {
                continue;
            }

            app()->instance('currentTenant', $tenant);

            $reservations = Reservation::query()
                ->where('tenant_id', $tenant->id)
                ->whereDate('reservation_date', now()->toDateString())
                ->whereIn('status', ['pending', 'confirmed'])
                ->get();

            foreach ($reservations as $reservation) {
                $reservationDateTime = $this->parseReservationDateTime($reservation);
                if (!$reservationDateTime) {
                    continue;
                }

                if ($reservationDateTime->between($windowStart, $windowEnd)) {
                    $infobip->sendTemplate(
                        $reservation->customer_phone,
                        'linkiu_reminder_v1',
                        [
                            $reservation->customer_name,
                            $tenant->name,
                            $reservation->reservation_time,
                        ],
                        "{$tenant->slug}/sedes"
                    );
                    $sent++;
                    $this->line("  Recordatorio enviado: reserva #{$reservation->id} — {$reservation->customer_name}");
                }
            }
        }

        if ($sent > 0) {
            $this->info("Se enviaron {$sent} recordatorio(s).");
        }

        return self::SUCCESS;
    }

    private function parseReservationDateTime(Reservation $reservation): ?Carbon
    {
        $date = $reservation->reservation_date;
        $time = $reservation->reservation_time ?? '';

        if (!$date || !$time) {
            return null;
        }

        $dateStr = $date instanceof \DateTimeInterface
            ? $date->format('Y-m-d')
            : Carbon::parse($date)->format('Y-m-d');

        try {
            return Carbon::parse($dateStr . ' ' . $time);
        } catch (\Exception $e) {
            return null;
        }
    }
}
