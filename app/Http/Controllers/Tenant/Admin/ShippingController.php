<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\TenantShippingMethod;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class ShippingController extends Controller
{
    private function ensureDefaultMethods(Tenant $tenant, $locationId = null)
    {
        $defaults = [
            'pickup' => [
                'name' => 'Retiro en Tienda',
                'is_active' => true,
                'cost' => 0,
                'instructions' => 'Acércate a nuestro punto físico con tu número de pedido.',
                'settings' => ['prep_time' => '24 horas']
            ],
            'local' => [
                'name' => 'Domicilio Local',
                'is_active' => false,
                'cost' => 10000,
                'delivery_time' => '45-60 min',
                'instructions' => 'Entrega en la puerta de tu casa.',
                'settings' => []
            ],
            'national' => [
                'name' => 'Envío Nacional',
                'is_active' => false,
                'cost' => 15000,
                'delivery_time' => '2-5 días hábiles',
                'instructions' => 'Enviamos a través de transportadora certificada.',
                'settings' => []
            ],
        ];

        foreach ($defaults as $type => $data) {
            $tenant->shippingMethods()->firstOrCreate(
            [
                'type' => $type,
                'location_id' => $locationId
            ],
                $data
            );
        }
    }

    public function index()
    {
        Gate::authorize('shipping_zones.view');

        $tenant = app('currentTenant');

        // Filter methods by location if the user is not an owner or super admin
        $userLocationId = null;
        if (!Auth::user()->is_super_admin && $tenant->owner_id !== Auth::id()) {
            $userLocationId = DB::table('tenant_user')
                ->where('tenant_id', $tenant->id)
                ->where('user_id', Auth::id())
                ->value('location_id');
        }

        $this->ensureDefaultMethods($tenant, $userLocationId);

        $query = $tenant->shippingMethods()->with('zones', 'location');

        if ($userLocationId) {
            $query->where(function ($q) use ($userLocationId) {
                $q->where('location_id', $userLocationId)
                    ->orWhereNull('location_id');
            });
        }

        return Inertia::render('Tenant/Admin/Shipping/Index', [
            'tenant' => $tenant,
            'shippingMethods' => $query->get(),
            'tenantCity' => $tenant->city,
            'tenantState' => $tenant->state,
            'locations' => $tenant->locations()->select('id', 'name')->get(),
            'userLocationId' => $userLocationId,
        ]);
    }

    public function update(Request $request, $tenant, $method)
    {
        Gate::authorize('shipping_zones.update');

        if (!($method instanceof TenantShippingMethod)) {
            $method = TenantShippingMethod::findOrFail($method);
        }

        $currentTenant = app('currentTenant');
        if ($method->tenant_id !== $currentTenant->id) {
            abort(403);
        }

        $validated = $request->validate([
            'is_active' => 'boolean',
            'cost' => 'numeric|min:0',
            'free_shipping_min_amount' => 'nullable|numeric|min:0',
            'delivery_time' => 'nullable|string|max:255',
            'instructions' => 'nullable|string',
            'settings' => 'nullable|array',
            'location_id' => 'nullable|exists:locations,id',
        ]);

        $method->update($validated);

        return back()->with('success', 'Método de envío actualizado correctamente.');
    }

    public function updateZones(Request $request, $tenant, $method)
    {
        Gate::authorize('shipping_zones.update');

        if (!($method instanceof TenantShippingMethod)) {
            $method = TenantShippingMethod::findOrFail($method);
        }

        if ($method->type !== 'national') {
            abort(400, 'Solo el envío nacional maneja zonas.');
        }

        $validated = $request->validate([
            'zones' => 'present|array',
            'zones.*.department_code' => 'required|string',
            'zones.*.department_name' => 'required|string',
            'zones.*.city_code' => 'nullable|string',
            'zones.*.city_name' => 'nullable|string',
            'zones.*.price' => 'nullable|numeric|min:0',
        ]);

        DB::transaction(function () use ($method, $validated) {
            // Delete existing zones
            $method->zones()->delete();

            // Create new zones
            $method->zones()->createMany($validated['zones']);
        });

        return back()->with('success', 'Zonas de cobertura actualizadas.');
    }
}
