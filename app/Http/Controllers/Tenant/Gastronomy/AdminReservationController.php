<?php

namespace App\Http\Controllers\Tenant\Gastronomy;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\Gastronomy\UpdateLocationReservationSettingsRequest;
use App\Http\Requests\Tenant\Admin\Gastronomy\UpdateReservationRequest;
use App\Models\Tenant\Gastronomy\Reservation;
use App\Models\Table;
use App\Models\Tenant\Locations\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class AdminReservationController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('reservations.view');

        $tenant = app('currentTenant');

        // Support single date or date range
        $date = $request->input('date', Carbon::today()->toDateString());
        $startDate = $request->input('start_date', $date);
        $endDate = $request->input('end_date', $date);
        $locationId = $request->input('location_id');
        $view = $request->input('view', 'day'); // day, week, month

        $reservationsQuery = Reservation::where('tenant_id', $tenant->id)
            ->whereDate('reservation_date', '>=', $startDate)
            ->whereDate('reservation_date', '<=', $endDate)
            ->with(['customer', 'table', 'location']);

        if ($locationId) {
            $reservationsQuery->where('location_id', $locationId);
        }

        $reservations = $reservationsQuery->orderBy('reservation_date')->orderBy('reservation_time')->get();

        $tables = Table::where('tenant_id', $tenant->id)
            ->with(['reservations' => function ($query) use ($startDate, $endDate) {
            $query->whereDate('reservation_date', '>=', $startDate)
                ->whereDate('reservation_date', '<=', $endDate)
                ->whereIn('status', ['confirmed', 'seated'])
                ->select('id', 'table_id', 'customer_name', 'reservation_time', 'reservation_date', 'status', 'party_size');
        }])
            ->get();

        $locations = Location::where('tenant_id', $tenant->id)->get();

        return Inertia::render('Tenant/Admin/Gastronomy/Reservations/Index', [
            'reservations' => $reservations,
            'tables' => $tables,
            'locations' => $locations,
            'filters' => [
                'date' => $date,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'location_id' => $locationId,
                'view' => $view,
            ]
        ]);
    }

    /**
     * Update the specified reservation in storage.
     */
    public function update(UpdateReservationRequest $request, $tenant, Reservation $reservation, \App\Services\InfobipService $infobip)
    {
        $tenantModel = app('currentTenant');

        $validated = $request->validated();

        $previousStatus = $reservation->status;
        $table = Table::find($reservation->table_id);
        $previousTableId = $reservation->table_id;
        $previousDate = $reservation->reservation_date;
        $previousTime = $reservation->reservation_time;

        $reservation->update($validated);

        // --- Table Status Synchronization ---
        $newStatus = $validated['status'] ?? $reservation->status;
        $newTableId = $validated['table_id'] ?? $reservation->table_id;

        // 1. If table changed or reservation moved to a non-active status, free previous table
        if ($previousTableId && ($previousTableId != $newTableId || in_array($newStatus, ['cancelled', 'no_show']))) {
            Table::where('id', $previousTableId)->update(['status' => 'available']);
        }

        // 2. Set new table status (ONLY IF RESERVATION IS FOR TODAY)
        $isToday = Carbon::parse($reservation->reservation_date)->isToday();

        if ($newTableId && $isToday) {
            $tableStatus = 'available';
            if ($newStatus === 'seated') {
                $tableStatus = 'occupied';
            }
            elseif ($newStatus === 'confirmed') {
                $tableStatus = 'reserved';
            }

            if ($tableStatus !== 'available') {
                Table::where('id', $newTableId)->update(['status' => $tableStatus]);
            }
        }
        // --------------------------------------

        // Logic for "Confirmed" status -> Send WhatsApp
        if ($previousStatus !== 'confirmed' && $newStatus === 'confirmed') {
            $formattedDate = Carbon::parse($reservation->reservation_date)->format('d/m/Y');

            try {
                $infobip->sendTemplate(
                    $reservation->customer_phone,
                    'linkiu_approved_v1',
                [
                    $reservation->customer_name,
                    $tenantModel->name,
                    $formattedDate,
                    $reservation->reservation_time
                ],
                    "{$tenantModel->slug}/sedes"
                );
            } catch (\Throwable $e) {
                report($e);
                // No bloqueamos el flujo si falla el WhatsApp
            }
        }

        // Logic for Rescheduled -> Send WhatsApp notification
        $dateChanged = isset($validated['reservation_date']) && $previousDate != $reservation->reservation_date;
        $timeChanged = isset($validated['reservation_time']) && $previousTime != $reservation->reservation_time;

        if (($dateChanged || $timeChanged) && $newStatus !== 'cancelled') {
            $formattedDate = Carbon::parse($reservation->reservation_date)->format('d/m/Y');

            try {
                $infobip->sendTemplate(
                    $reservation->customer_phone,
                    'linkiu_confirmed_v1',
                [
                    $reservation->customer_name,
                    $tenantModel->name,
                    $formattedDate,
                    $reservation->reservation_time
                ],
                    "{$tenantModel->slug}/sedes"
                );
            } catch (\Throwable $e) {
                report($e);
                // No bloqueamos el flujo si falla el WhatsApp
            }
        }

        return redirect()->back()->with('success', 'Reserva actualizada correctamente.');
    }

    /**
     * Update reservation settings for a location.
     */
    public function updateLocationSettings(UpdateLocationReservationSettingsRequest $request, $tenant, Location $location)
    {
        $validated = $request->validated();

        $location->update($validated);

        return redirect()->back()->with('success', 'Configuracion de sede actualizada correctamente.');
    }
}