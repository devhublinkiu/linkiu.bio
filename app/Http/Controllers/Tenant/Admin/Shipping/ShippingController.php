<?php

namespace App\Http\Controllers\Tenant\Admin\Shipping;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\UpdateShippingMethodRequest;
use App\Http\Requests\Tenant\Admin\UpdateShippingZonesRequest;
use App\Models\Tenant;
use App\Models\Tenant\Shipping\TenantShippingMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ShippingController extends Controller
{
    private function ensureDefaultMethods(Tenant $tenant, ?int $locationId = null): void
    {
        $defaults = [
            'pickup' => [
                'name' => 'Retiro en Tienda',
                'is_active' => true,
                'cost' => 0,
                'instructions' => 'Acércate a nuestro punto físico con tu número de pedido.',
                'settings' => ['prep_time' => '24 horas'],
            ],
            'local' => [
                'name' => 'Domicilio Local',
                'is_active' => false,
                'cost' => 10000,
                'delivery_time' => '45-60 min',
                'instructions' => 'Entrega en la puerta de tu casa.',
                'settings' => [],
            ],
            'national' => [
                'name' => 'Envío Nacional',
                'is_active' => false,
                'cost' => 15000,
                'delivery_time' => '2-5 días hábiles',
                'instructions' => 'Enviamos a través de transportadora certificada.',
                'settings' => [],
            ],
        ];

        foreach ($defaults as $type => $data) {
            $tenant->shippingMethods()->firstOrCreate(
                [
                    'type' => $type,
                    'location_id' => $locationId,
                ],
                $data
            );
        }
    }

    public function index(): Response
    {
        Gate::authorize('shipping_zones.view');

        $tenant = app('currentTenant');

        $userLocationId = null;
        if (!Auth::user()->is_super_admin && $tenant->owner_id !== Auth::id()) {
            $userLocationId = (int) DB::table('tenant_user')
                ->where('tenant_id', $tenant->id)
                ->where('user_id', Auth::id())
                ->value('location_id');
        }

        $this->ensureDefaultMethods($tenant, $userLocationId);

        $query = $tenant->shippingMethods()
            ->select([
                'id', 'tenant_id', 'location_id', 'type', 'name', 'is_active', 'cost',
                'free_shipping_min_amount', 'delivery_time', 'instructions', 'settings',
            ])
            ->with(['zones', 'location:id,name,city,state'])
            ->orderByRaw("CASE type WHEN 'pickup' THEN 1 WHEN 'local' THEN 2 WHEN 'national' THEN 3 ELSE 4 END");

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

    public function update(UpdateShippingMethodRequest $request, $tenant, $method): RedirectResponse
    {
        Gate::authorize('shipping_zones.update');

        $model = $method instanceof TenantShippingMethod
            ? $method
            : TenantShippingMethod::findOrFail($method);

        $currentTenant = app('currentTenant');
        if ($model->tenant_id !== $currentTenant->id) {
            abort(403);
        }

        $model->update($request->validated());

        return back()->with('success', 'Método de envío actualizado correctamente.');
    }

    public function updateZones(UpdateShippingZonesRequest $request, $tenant, $method): RedirectResponse
    {
        Gate::authorize('shipping_zones.update');

        $model = $method instanceof TenantShippingMethod
            ? $method
            : TenantShippingMethod::findOrFail($method);

        $currentTenant = app('currentTenant');
        if ($model->tenant_id !== $currentTenant->id) {
            abort(403);
        }

        if ($model->type !== 'national') {
            abort(400, 'Solo el envío nacional maneja zonas.');
        }

        try {
            DB::transaction(function () use ($model, $request) {
                $model->zones()->delete();
                $model->zones()->createMany($request->validated('zones'));
            });
        } catch (\Throwable $e) {
            return back()->with('error', 'No se pudieron guardar las zonas. Intenta de nuevo.');
        }

        return back()->with('success', 'Zonas de cobertura actualizadas.');
    }
}
