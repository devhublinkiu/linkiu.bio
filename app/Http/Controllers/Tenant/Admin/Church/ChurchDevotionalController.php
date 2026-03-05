<?php

namespace App\Http\Controllers\Tenant\Admin\Church;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\Church\StoreChurchDevotionalRequest;
use App\Http\Requests\Tenant\Admin\Church\UpdateChurchDevotionalRequest;
use App\Models\Tenant\Church\ChurchDevotional;
use App\Traits\StoresImageAsWebp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChurchDevotionalController extends Controller
{
    use StoresImageAsWebp;

    public function index()
    {
        Gate::authorize('devotionals.view');

        $devotionals = ChurchDevotional::select([
            'id', 'title', 'scripture_reference', 'date', 'cover_image', 'order', 'is_published', 'created_at',
        ])
            ->orderBy('date', 'desc')
            ->orderBy('order')
            ->orderBy('id')
            ->paginate(15);

        return Inertia::render('Tenant/Admin/Devotionals/Index', [
            'devotionals' => $devotionals,
        ]);
    }

    public function create()
    {
        Gate::authorize('devotionals.create');

        return Inertia::render('Tenant/Admin/Devotionals/Create');
    }

    public function store(StoreChurchDevotionalRequest $request, string $tenant)
    {
        Gate::authorize('devotionals.create');

        $validated = $request->validated();

        if ($request->hasFile('cover_image_file')) {
            $tenantModel = app('currentTenant');
            $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenantModel->slug ?? ''));
            $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenantModel->id) . '/church-devotionals';
            $path = $this->storeImageAsWebpCover($request->file('cover_image_file'), $basePath, 1200, 630, 'bunny', 85);
            $validated['cover_image'] = Storage::disk('bunny')->url($path);
            $this->registerMedia($path, 'bunny');
        }
        unset($validated['cover_image_file']);

        ChurchDevotional::create($validated);

        return redirect()
            ->route('tenant.admin.devotionals.index', ['tenant' => $tenant])
            ->with('success', 'Devocional creado correctamente');
    }

    public function edit(string $tenant, ChurchDevotional $devotional)
    {
        Gate::authorize('devotionals.update');

        return Inertia::render('Tenant/Admin/Devotionals/Edit', [
            'devotional' => $devotional->only([
                'id', 'title', 'scripture_reference', 'scripture_text', 'body', 'prayer', 'author',
                'date', 'reflection_question', 'cover_image', 'video_url', 'external_link', 'excerpt',
                'order', 'is_published',
            ]),
        ]);
    }

    public function update(UpdateChurchDevotionalRequest $request, string $tenant, ChurchDevotional $devotional)
    {
        Gate::authorize('devotionals.update');

        $validated = $request->validated();

        if ($request->hasFile('cover_image_file')) {
            $tenantModel = app('currentTenant');
            $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenantModel->slug ?? ''));
            $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenantModel->id) . '/church-devotionals';
            $path = $this->storeImageAsWebpCover($request->file('cover_image_file'), $basePath, 1200, 630, 'bunny', 85);
            $validated['cover_image'] = Storage::disk('bunny')->url($path);
            $this->registerMedia($path, 'bunny');
        }
        unset($validated['cover_image_file']);

        $devotional->update($validated);

        return redirect()
            ->route('tenant.admin.devotionals.index', ['tenant' => $tenant])
            ->with('success', 'Devocional actualizado correctamente');
    }

    public function destroy(string $tenant, ChurchDevotional $devotional)
    {
        Gate::authorize('devotionals.delete');

        $devotional->delete();

        return redirect()
            ->route('tenant.admin.devotionals.index', ['tenant' => $tenant])
            ->with('success', 'Devocional eliminado correctamente');
    }

    public function togglePublished(string $tenant, ChurchDevotional $devotional)
    {
        Gate::authorize('devotionals.update');

        $devotional->update(['is_published' => !$devotional->is_published]);

        return back()->with('success', $devotional->is_published ? 'Devocional publicado' : 'Devocional despublicado');
    }

    /**
     * Subir imagen para insertar en el cuerpo del devocional (editor rico).
     * Devuelve JSON con la URL de la imagen.
     */
    public function uploadImage(Request $request, string $tenant)
    {
        if (! Gate::any(['devotionals.create', 'devotionals.update'])) {
            abort(403);
        }

        $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $tenantModel = app('currentTenant');
        $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenantModel->slug ?? ''));
        $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenantModel->id) . '/church-devotionals/body';

        $path = $this->storeImageAsWebp(
            $request->file('image'),
            $basePath,
            'bunny',
            1920,
            85
        );

        $this->registerMedia($path, 'bunny');
        $url = Storage::disk('bunny')->url($path);

        return response()->json(['url' => $url]);
    }
}
