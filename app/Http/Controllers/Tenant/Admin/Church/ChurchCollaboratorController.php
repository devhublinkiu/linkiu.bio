<?php

namespace App\Http\Controllers\Tenant\Admin\Church;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\Church\StoreChurchCollaboratorRequest;
use App\Http\Requests\Tenant\Admin\Church\UpdateChurchCollaboratorRequest;
use App\Models\Tenant\Church\ChurchCollaborator;
use App\Traits\StoresImageAsWebp;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChurchCollaboratorController extends Controller
{
    use StoresImageAsWebp;

    public function index()
    {
        Gate::authorize('collaborators.view');

        $collaborators = ChurchCollaborator::select([
            'id', 'name', 'role', 'photo', 'order', 'is_published', 'created_at',
        ])
            ->orderBy('order')
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('Tenant/Admin/Collaborators/Index', [
            'collaborators' => $collaborators,
        ]);
    }

    public function create()
    {
        Gate::authorize('collaborators.create');

        return Inertia::render('Tenant/Admin/Collaborators/Create');
    }

    public function store(StoreChurchCollaboratorRequest $request, string $tenant)
    {
        Gate::authorize('collaborators.create');

        $validated = $request->validated();

        if ($request->hasFile('photo_file')) {
            $tenantModel = app('currentTenant');
            $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenantModel->slug ?? ''));
            $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenantModel->id) . '/church-collaborators';
            $path = $this->storeImageAsWebpCover($request->file('photo_file'), $basePath, 400, 400, 'bunny', 85);
            $validated['photo'] = Storage::disk('bunny')->url($path);
            $this->registerMedia($path, 'bunny');
        }
        unset($validated['photo_file']);

        ChurchCollaborator::create($validated);

        return redirect()
            ->route('tenant.admin.collaborators.index', ['tenant' => $tenant])
            ->with('success', 'Colaborador creado correctamente');
    }

    public function edit(string $tenant, ChurchCollaborator $collaborator)
    {
        Gate::authorize('collaborators.update');

        return Inertia::render('Tenant/Admin/Collaborators/Edit', [
            'collaborator' => $collaborator->only([
                'id', 'name', 'role', 'photo', 'bio', 'email', 'phone', 'whatsapp', 'order', 'is_published',
            ]),
        ]);
    }

    public function update(UpdateChurchCollaboratorRequest $request, string $tenant, ChurchCollaborator $collaborator)
    {
        Gate::authorize('collaborators.update');

        $validated = $request->validated();

        if ($request->hasFile('photo_file')) {
            $tenantModel = app('currentTenant');
            $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenantModel->slug ?? ''));
            $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenantModel->id) . '/church-collaborators';
            $path = $this->storeImageAsWebpCover($request->file('photo_file'), $basePath, 400, 400, 'bunny', 85);
            $validated['photo'] = Storage::disk('bunny')->url($path);
            $this->registerMedia($path, 'bunny');
        }
        unset($validated['photo_file']);

        $collaborator->update($validated);

        return redirect()
            ->route('tenant.admin.collaborators.index', ['tenant' => $tenant])
            ->with('success', 'Colaborador actualizado correctamente');
    }

    public function destroy(string $tenant, ChurchCollaborator $collaborator)
    {
        Gate::authorize('collaborators.delete');

        $collaborator->delete();

        return redirect()
            ->route('tenant.admin.collaborators.index', ['tenant' => $tenant])
            ->with('success', 'Colaborador eliminado correctamente');
    }

    public function togglePublished(string $tenant, ChurchCollaborator $collaborator)
    {
        Gate::authorize('collaborators.update');

        $collaborator->update(['is_published' => !$collaborator->is_published]);

        return back()->with('success', $collaborator->is_published ? 'Colaborador publicado' : 'Colaborador despublicado');
    }
}
