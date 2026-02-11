<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class WhatsAppController extends Controller
{
    /**
     * Show the WhatsApp notification settings page.
     */
    public function edit()
    {
        Gate::authorize('whatsapp.view');
        $tenant = app('currentTenant');

        return Inertia::render('Tenant/Admin/WhatsApp/Settings', [
            'tenant' => $tenant,
            'settings' => [
                'whatsapp_admin_phone' => $tenant->settings['whatsapp_admin_phone'] ?? '',
            ],
            'hasFeature' => $tenant->hasFeature('whatsapp'),
        ]);
    }

    /**
     * Update the WhatsApp notification settings.
     */
    public function update(Request $request)
    {
        Gate::authorize('whatsapp.update');
        $tenant = app('currentTenant');

        // Rule: Can't update if feature is not in plan
        if (!$tenant->hasFeature('whatsapp')) {
            return redirect()->back()->with('error', 'El módulo de WhatsApp no está habilitado en tu plan actual.');
        }

        $validated = $request->validate([
            'whatsapp_admin_phone' => ['nullable', 'string', 'max:20', 'regex:/^\+?[1-9]\d{1,14}$/'],
        ], [
            'whatsapp_admin_phone.regex' => 'El formato del número debe ser internacional (ej: +57310...).',
        ]);

        $settings = $this->ensureArray($tenant->settings);

        $settings['whatsapp_admin_phone'] = $validated['whatsapp_admin_phone'];

        $tenant->update(['settings' => $settings]);

        return redirect()->back()->with('success', 'Configuración de WhatsApp actualizada');
    }

    /**
     * Ensure the input is an array (helper for settings field)
     */
    private function ensureArray($input): array
    {
        if (is_null($input)) {
            return [];
        }

        if (is_string($input)) {
            $decoded = json_decode($input, true);
            return is_array($decoded) ? $decoded : [];
        }

        return (array)$input;
    }
}
