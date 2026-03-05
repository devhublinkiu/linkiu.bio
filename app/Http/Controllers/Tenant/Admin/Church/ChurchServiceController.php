<?php

namespace App\Http\Controllers\Tenant\Admin\Church;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\Church\StoreChurchServiceRequest;
use App\Http\Requests\Tenant\Admin\Church\UpdateChurchServiceRequest;
use App\Models\Tenant\Church\ChurchService;
use App\Traits\StoresImageAsWebp;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChurchServiceController extends Controller
{
    use StoresImageAsWebp;
    public function index()
    {
        Gate::authorize('services.view');

        $services = ChurchService::select([
            'id', 'name', 'description', 'audience', 'service_type', 'schedule', 'frequency', 'duration',
            'location', 'modality', 'image_url', 'leader', 'contact_info', 'external_url',
            'order', 'is_active', 'created_at',
        ])
            ->orderBy('order')
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('Tenant/Admin/Services/Index', [
            'services' => $services,
        ]);
    }

    public function create()
    {
        Gate::authorize('services.create');

        return Inertia::render('Tenant/Admin/Services/Create');
    }

    public function store(StoreChurchServiceRequest $request, string $tenant)
    {
        Gate::authorize('services.create');

        ChurchService::create($request->validated());

        return redirect()
            ->route('tenant.admin.services.index', ['tenant' => $tenant])
            ->with('success', 'Servicio creado correctamente');
    }

    public function edit(string $tenant, ChurchService $service)
    {
        Gate::authorize('services.update');

        return Inertia::render('Tenant/Admin/Services/Edit', [
            'service' => $service->only([
                'id', 'name', 'description', 'audience', 'service_type', 'schedule', 'frequency', 'duration',
                'location', 'modality', 'image_url', 'leader', 'contact_info', 'external_url', 'order', 'is_active',
            ]),
        ]);
    }

    public function update(UpdateChurchServiceRequest $request, string $tenant, ChurchService $service)
    {
        Gate::authorize('services.update');

        $validated = $request->validated();

        if ($request->hasFile('image_file')) {
            $tenantModel = app('currentTenant');
            $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenantModel->slug ?? ''));
            $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenantModel->id) . '/church-services';
            $path = $this->storeImageAsWebpCover($request->file('image_file'), $basePath, 200, 120, 'bunny', 85);
            $validated['image_url'] = Storage::disk('bunny')->url($path);
            $this->registerMedia($path, 'bunny');
        }
        unset($validated['image_file']);

        $service->update($validated);

        return redirect()
            ->route('tenant.admin.services.index', ['tenant' => $tenant])
            ->with('success', 'Servicio actualizado correctamente');
    }

    public function destroy(string $tenant, ChurchService $service)
    {
        Gate::authorize('services.delete');

        $service->delete();

        return redirect()
            ->route('tenant.admin.services.index', ['tenant' => $tenant])
            ->with('success', 'Servicio eliminado correctamente');
    }
}
