<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Recordatorio de reservas (RE-04): ~1 hora antes de la cita
Schedule::command('reservations:send-reminders')->hourly();
