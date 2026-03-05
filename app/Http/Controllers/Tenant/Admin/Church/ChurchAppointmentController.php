<?php

namespace App\Http\Controllers\Tenant\Admin\Church;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Church\ChurchAppointment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class ChurchAppointmentController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('appointments.view');

        $appointments = ChurchAppointment::select([
            'id', 'guest_name', 'guest_phone', 'guest_email', 'appointment_type',
            'preferred_date', 'assigned_date', 'notes', 'status', 'created_at',
        ])
            ->orderByRaw("CASE status WHEN 'pending' THEN 0 WHEN 'contacted' THEN 1 WHEN 'confirmed' THEN 2 WHEN 'completed' THEN 3 ELSE 4 END")
            ->orderBy('assigned_date')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Tenant/Admin/Appointments/Index', [
            'appointments' => $appointments,
            'typeLabels' => ChurchAppointment::typeLabels(),
            'statusLabels' => ChurchAppointment::statusLabels(),
        ]);
    }

    public function update(Request $request, string $tenant, ChurchAppointment $church_appointment)
    {
        Gate::authorize('appointments.update');

        $validated = $request->validate([
            'status' => ['required', Rule::in(array_keys(ChurchAppointment::statusLabels()))],
            'assigned_date' => 'nullable|date',
        ]);

        $church_appointment->update([
            'status' => $validated['status'],
            'assigned_date' => $validated['assigned_date'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Cita actualizada.');
    }
}
