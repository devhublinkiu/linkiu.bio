<?php

namespace App\Http\Controllers\Tenant\Gastronomy;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Gastronomy\Reservation;
use App\Models\Table;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class AdminReservationController extends Controller
{
    /**
     * Check if current user has a specific tenant permission.
     * Owners bypass all checks. Non-owners must have the explicit permission in their role.
     */
    private function checkTenantPermission(string $permission): void
    {
        $user = auth()->user();
        $tenant = app('currentTenant');

        $pivot = $user->tenants()->where('tenant_id', $tenant->id)->first()?->pivot;

        if (!$pivot) {
            abort(403, 'No tienes acceso a este negocio.');
        }

        // Owner bypasses all permission checks
        if ($pivot->role === 'owner') {
            return;
        }

        // Check role permissions
        if ($pivot->role_id) {
            $role = \App\Models\Role::with('permissions')->find($pivot->role_id);
            if ($role && ($role->permissions->contains('name', '*') || $role->permissions->contains('name', $permission))) {
                return;
            }
        }

        abort(403, 'No tienes permiso para realizar esta accion.');
    }

    /**
     * Display a listing of the reservations.
     */
    public function index(Request $request)
    {
        $this->checkTenantPermission('reservations.view');

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
    public function update(Request $request, $tenant, Reservation $reservation, \App\Services\InfobipService $infobip)
    {
        $this->checkTenantPermission('reservations.update');

        $tenantModel = app('currentTenant');

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,seated,cancelled,no_show',
            'table_id' => 'nullable|exists:tables,id',
            'admin_notes' => 'nullable|string',
            'reservation_date' => 'nullable|date',
            'reservation_time' => 'nullable|string',
        ]);

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
            Table::where('id', $previousTableId)->update(['status' => 'active']);
        }

        // 2. Set new table status (ONLY IF RESERVATION IS FOR TODAY)
        $isToday = Carbon::parse($reservation->reservation_date)->isToday();

        if ($newTableId && $isToday) {
            $tableStatus = 'active';
            if ($newStatus === 'seated') {
                $tableStatus = 'occupied';
            }
            elseif ($newStatus === 'confirmed') {
                $tableStatus = 'reserved';
            }

            if ($tableStatus !== 'active') {
                Table::where('id', $newTableId)->update(['status' => $tableStatus]);
            }
        }
        // --------------------------------------

        // Logic for "Confirmed" status -> Send WhatsApp
        if ($previousStatus !== 'confirmed' && $newStatus === 'confirmed') {
            $formattedDate = Carbon::parse($reservation->reservation_date)->format('d/m/Y');

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
        }

        // Logic for Rescheduled -> Send WhatsApp notification
        $dateChanged = isset($validated['reservation_date']) && $previousDate != $reservation->reservation_date;
        $timeChanged = isset($validated['reservation_time']) && $previousTime != $reservation->reservation_time;

        if (($dateChanged || $timeChanged) && $newStatus !== 'cancelled') {
            $formattedDate = Carbon::parse($reservation->reservation_date)->format('d/m/Y');

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
        }

        return redirect()->back()->with('success', 'Reserva actualizada correctamente.');
    }

    /**
     * Update reservation settings for a location.
     */
    public function updateLocationSettings(Request $request, $tenant, Location $location)
    {
        $this->checkTenantPermission('reservations.update');

        $tenantModel = app('currentTenant');

        if ($location->tenant_id !== $tenantModel->id) {
            abort(403);
        }

        $validated = $request->validate([
            'reservation_price_per_person' => 'required|numeric|min:0',
            'reservation_min_anticipation' => 'required|numeric|min:0',
            'reservation_slot_duration' => 'required|integer|min:15',
            'reservation_payment_proof_required' => 'required|boolean',
        ]);

        $location->update($validated);

        return redirect()->back()->with('success', 'Configuracion de sede actualizada correctamente.');
    }
}