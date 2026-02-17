<?php

namespace App\Http\Controllers\Tenant\Admin\WhatsApp;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\UpdateWhatsAppSettingsRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class WhatsAppController extends Controller
{
    /**
     * Muestra la pantalla de configuración de notificaciones WhatsApp.
     */
    public function edit(Request $request, $tenant): Response
    {
        Gate::authorize('whatsapp.view');
        $tenantModel = app('currentTenant');

        return Inertia::render('Tenant/Admin/WhatsApp/Settings', [
            'tenant' => $tenantModel,
            'settings' => [
                'whatsapp_admin_phone' => $tenantModel->settings['whatsapp_admin_phone'] ?? '',
            ],
            'hasFeature' => $tenantModel->hasFeature('whatsapp'),
        ]);
    }

    /**
     * Actualiza la configuración de notificaciones WhatsApp.
     * Origen único para alertas al admin: tenant.settings['whatsapp_admin_phone'].
     */
    public function update(UpdateWhatsAppSettingsRequest $request, $tenant): RedirectResponse
    {
        Gate::authorize('whatsapp.update');
        $tenantModel = app('currentTenant');

        if (!$tenantModel->hasFeature('whatsapp')) {
            return redirect()->back()->with('error', 'El módulo de WhatsApp no está habilitado en tu plan actual.');
        }

        $validated = $request->validated();
        $settings = $this->ensureArray($tenantModel->settings);
        $settings['whatsapp_admin_phone'] = $validated['whatsapp_admin_phone'] ?? '';

        try {
            $tenantModel->update(['settings' => $settings]);
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'No se pudo guardar la configuración. Intenta de nuevo.');
        }

        return redirect()->back()->with('success', 'Configuración de WhatsApp actualizada.');
    }

    private function ensureArray($input): array
    {
        if (is_null($input)) {
            return [];
        }
        if (is_string($input)) {
            $decoded = json_decode($input, true);
            return is_array($decoded) ? $decoded : [];
        }
        return (array) $input;
    }
}
