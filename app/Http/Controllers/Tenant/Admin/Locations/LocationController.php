<?php

namespace App\Http\Controllers\Tenant\Admin\Locations;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\StoreLocationRequest;
use App\Http\Requests\Tenant\Admin\UpdateLocationRequest;
use App\Models\Tenant\Locations\Location;
use App\Services\BunnyStreamService;
use App\Models\Tenant\Gastronomy\Reservation;
use App\Models\Tenant\Gastronomy\Order;
use App\Models\Tenant\All\Slider;
use App\Models\Table;
use App\Models\Zone;
use App\Models\Tenant\Payments\PaymentMethod as TenantPaymentMethod;
use App\Models\Tenant\Payments\BankAccount as TenantBankAccount;
use App\Models\Tenant\Shipping\TenantShippingMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('locations.view');

        $tenant = app('currentTenant');
        $locationsLimit = $tenant->getLimit('locations');
        $locationsCount = Location::where('tenant_id', $tenant->id)->count();

        $locations = Location::select([
            'id', 'tenant_id', 'name', 'manager', 'description', 'is_main', 'phone', 'whatsapp',
            'whatsapp_message', 'state', 'city', 'address', 'latitude', 'longitude', 'opening_hours',
            'social_networks', 'is_active', 'created_at',
        ])
            ->where('tenant_id', $tenant->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('Tenant/Admin/Locations/Index', [
            'locations' => $locations,
            'locations_limit' => $locationsLimit,
            'locations_count' => $locationsCount,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('locations.create');

        $tenant = app('currentTenant');
        $locationsLimit = $tenant->getLimit('locations');
        $locationsCount = Location::where('tenant_id', $tenant->id)->count();

        return Inertia::render('Tenant/Admin/Locations/Create', [
            'locations_limit' => $locationsLimit,
            'locations_count' => $locationsCount,
        ]);
    }

    public function store(StoreLocationRequest $request, string $tenant): RedirectResponse
    {
        Gate::authorize('locations.create');

        $tenantModel = app('currentTenant');
        $maxLocations = $tenantModel->getLimit('locations');
        if ($maxLocations !== null && Location::where('tenant_id', $tenantModel->id)->count() >= $maxLocations) {
            return redirect()
                ->route('tenant.locations.index', $tenantModel->slug)
                ->withErrors(['limit' => "Has alcanzado el máximo de {$maxLocations} sedes permitidas en tu plan."]);
        }

        $validated = $request->validated();
        $validated['tenant_id'] = $tenantModel->id;
        $validated['is_active'] = true;

        try {
            Location::create($validated);
        } catch (\Throwable $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'No se pudo crear la sede. Intenta de nuevo.');
        }

        return redirect()
            ->route('tenant.locations.index', $tenantModel->slug)
            ->with('success', 'Sede creada correctamente.');
    }

    public function show(string $tenant, int $id): Response
    {
        Gate::authorize('locations.view');

        $tenantModel = app('currentTenant');
        $location = Location::where('tenant_id', $tenantModel->id)->findOrFail($id);

        return Inertia::render('Tenant/Admin/Locations/Show', [
            'location' => $location,
        ]);
    }

    public function edit(string $tenant, int $id): Response
    {
        Gate::authorize('locations.update');

        $tenantModel = app('currentTenant');
        $location = Location::where('tenant_id', $tenantModel->id)->findOrFail($id);

        return Inertia::render('Tenant/Admin/Locations/Edit', [
            'location' => $location,
        ]);
    }

    public function update(UpdateLocationRequest $request, BunnyStreamService $bunnyStream, string $tenant, int $id): RedirectResponse
    {
        Gate::authorize('locations.update');

        $tenantModel = app('currentTenant');
        $location = Location::where('tenant_id', $tenantModel->id)->findOrFail($id);

        $validated = $request->validated();

        unset($validated['short_video'], $validated['remove_short']);

        if ($request->boolean('remove_short')) {
            $validated['short_video_id'] = null;
        } elseif ($request->hasFile('short_video')) {
            if (!$bunnyStream->isEnabled()) {
                return redirect()
                    ->back()
                    ->withInput()
                    ->withErrors(['short_video' => 'El servicio de shorts no está configurado. Contacta a soporte.']);
            }
            $title = 'Sede ' . $location->name . ' - ' . now()->format('Y-m-d H:i');
            $videoId = $bunnyStream->createAndUpload($title, $request->file('short_video'), $tenantModel);
            if (!$videoId) {
                return redirect()
                    ->back()
                    ->withInput()
                    ->withErrors(['short_video' => 'No se pudo subir el video. Verifica formato (MP4/MOV) y tamaño (máx 50 MB).']);
            }
            $validated['short_video_id'] = $videoId;
        }

        try {
            $location->update($validated);
        } catch (\Throwable $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'No se pudo actualizar la sede. Intenta de nuevo.');
        }

        return redirect()
            ->route('tenant.locations.index', $tenantModel->slug)
            ->with('success', 'Sede actualizada correctamente.');
    }

    public function destroy(string $tenant, int $id): RedirectResponse
    {
        Gate::authorize('locations.delete');

        $tenantModel = app('currentTenant');
        $location = Location::where('tenant_id', $tenantModel->id)->findOrFail($id);

        if ($location->is_main) {
            throw ValidationException::withMessages([
                'delete' => ['No se puede eliminar la sede principal.'],
            ]);
        }

        $tenantId = $tenantModel->id;
        $locationId = $location->id;
        $reasons = [];

        $reservationsCount = Reservation::where('tenant_id', $tenantId)->where('location_id', $locationId)->count();
        if ($reservationsCount > 0) {
            $reasons[] = $reservationsCount . ' reserva(s)';
        }
        $ordersCount = Order::where('tenant_id', $tenantId)->where('location_id', $locationId)->count();
        if ($ordersCount > 0) {
            $reasons[] = $ordersCount . ' pedido(s)';
        }
        $slidersCount = Slider::where('tenant_id', $tenantId)->where('location_id', $locationId)->count();
        if ($slidersCount > 0) {
            $reasons[] = $slidersCount . ' slider(s)';
        }
        $tablesCount = Table::where('tenant_id', $tenantId)->where('location_id', $locationId)->count();
        if ($tablesCount > 0) {
            $reasons[] = $tablesCount . ' mesa(s)';
        }
        $zonesCount = Zone::where('tenant_id', $tenantId)->where('location_id', $locationId)->count();
        if ($zonesCount > 0) {
            $reasons[] = $zonesCount . ' zona(s)';
        }
        $shippingCount = TenantShippingMethod::where('tenant_id', $tenantId)->where('location_id', $locationId)->count();
        if ($shippingCount > 0) {
            $reasons[] = $shippingCount . ' método(s) de envío';
        }
        $paymentCount = TenantPaymentMethod::where('tenant_id', $tenantId)->where('location_id', $locationId)->count();
        if ($paymentCount > 0) {
            $reasons[] = $paymentCount . ' método(s) de pago';
        }
        $bankCount = TenantBankAccount::where('tenant_id', $tenantId)->where('location_id', $locationId)->count();
        if ($bankCount > 0) {
            $reasons[] = $bankCount . ' cuenta(s) bancaria(s)';
        }
        $usersCount = DB::table('tenant_user')->where('tenant_id', $tenantId)->where('location_id', $locationId)->count();
        if ($usersCount > 0) {
            $reasons[] = $usersCount . ' usuario(s) asignado(s)';
        }

        if (count($reasons) > 0) {
            $message = 'No se puede eliminar la sede porque tiene ' . implode(', ', $reasons) . '. Reasigna o elimina esos registros primero.';
            throw ValidationException::withMessages(['delete' => [$message]]);
        }

        try {
            $location->delete();
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'No se pudo eliminar la sede. Intenta de nuevo.');
        }

        return redirect()->back()->with('success', 'Sede eliminada correctamente.');
    }

    public function toggleActive(string $tenant, int $id): RedirectResponse
    {
        Gate::authorize('locations.update');

        $tenantModel = app('currentTenant');
        $location = Location::where('tenant_id', $tenantModel->id)->findOrFail($id);

        try {
            $location->update(['is_active' => !$location->is_active]);
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'No se pudo actualizar el estado. Intenta de nuevo.');
        }

        return redirect()->back()->with('success', 'Estado de la sede actualizado.');
    }
}
