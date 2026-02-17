<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\StoreShortRequest;
use App\Http\Requests\Tenant\Admin\UpdateShortRequest;
use App\Models\Tenant\All\Short;
use App\Models\Tenant\Locations\Location;
use App\Models\Category;
use App\Models\Product;
use App\Services\BunnyStreamService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ShortController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('shorts.view');

        $tenant = app('currentTenant');
        $shortsLimit = $tenant->getLimit('shorts');
        $shortsCount = Short::count();

        $shorts = Short::with(['location:id,name', 'linkable:id,name,slug'])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate(15)
            ->through(function ($short) {
                return [
                    'id' => $short->id,
                    'name' => $short->name,
                    'description' => $short->description,
                    'location_id' => $short->location_id,
                    'location' => $short->location ? ['id' => $short->location->id, 'name' => $short->location->name] : null,
                    'link_type' => $short->link_type,
                    'external_url' => $short->external_url,
                    'linkable_type' => $short->linkable_type,
                    'linkable_id' => $short->linkable_id,
                    'link_label' => $short->linkable ? $short->linkable->name : ($short->external_url ?? '—'),
                    'sort_order' => $short->sort_order,
                    'is_active' => $short->is_active,
                ];
            });

        return Inertia::render('Tenant/Admin/Shorts/Index', [
            'shorts' => $shorts,
            'shorts_limit' => $shortsLimit,
            'shorts_count' => $shortsCount,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('shorts.create');

        $tenant = app('currentTenant');
        $shortsLimit = $tenant->getLimit('shorts');
        $shortsCount = Short::count();

        $locations = Location::where('tenant_id', $tenant->id)->orderBy('name')->get(['id', 'name']);
        $categories = Category::where('tenant_id', $tenant->id)->orderBy('name')->get(['id', 'name', 'slug']);
        $products = Product::where('tenant_id', $tenant->id)->orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('Tenant/Admin/Shorts/Create', [
            'locations' => $locations,
            'categories' => $categories,
            'products' => $products,
            'shorts_limit' => $shortsLimit,
            'shorts_count' => $shortsCount,
        ]);
    }

    public function store(StoreShortRequest $request, BunnyStreamService $bunnyStream): RedirectResponse
    {
        Gate::authorize('shorts.create');

        $tenant = app('currentTenant');
        $maxShorts = $tenant->getLimit('shorts');
        if ($maxShorts !== null && Short::count() >= $maxShorts) {
            return redirect()
                ->route('tenant.shorts.index', ['tenant' => $tenant->slug])
                ->withErrors(['limit' => "Has alcanzado el máximo de {$maxShorts} shorts permitidos en tu plan."]);
        }

        $validated = $request->validated();
        unset($validated['short_video']);

        if (!$bunnyStream->isEnabled()) {
            return redirect()->back()->withInput()->withErrors(['short_video' => 'El servicio de shorts no está configurado. Contacta a soporte.']);
        }

        $title = 'Short ' . ($validated['name'] ?? '') . ' - ' . now()->format('Y-m-d H:i');
        $videoId = $bunnyStream->createAndUpload($title, $request->file('short_video'), $tenant);
        if (!$videoId) {
            return redirect()->back()->withInput()->withErrors(['short_video' => 'No se pudo subir el video. Verifica formato (MP4/MOV) y tamaño (máx 50 MB).']);
        }

        $validated['short_video_id'] = $videoId;
        $validated['tenant_id'] = $tenant->id;
        $validated['linkable_type'] = $validated['link_type'] === 'external' ? null : ($validated['linkable_type'] ?? null);
        $validated['linkable_id'] = $validated['link_type'] === 'external' ? null : (isset($validated['linkable_id']) && $validated['linkable_id'] !== '' ? (int) $validated['linkable_id'] : null);
        $validated['external_url'] = $validated['link_type'] === 'external' ? ($validated['external_url'] ?? null) : null;
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);
        $validated['is_active'] = true;

        Short::create($validated);

        return redirect()
            ->route('tenant.shorts.index', ['tenant' => $tenant->slug])
            ->with('success', 'Short creado correctamente.');
    }

    public function edit(string $tenant, int $id): Response
    {
        Gate::authorize('shorts.update');

        $tenantModel = app('currentTenant');
        $short = Short::where('tenant_id', $tenantModel->id)->with('location:id,name')->findOrFail($id);

        $locations = Location::where('tenant_id', $tenantModel->id)->orderBy('name')->get(['id', 'name']);
        $categories = Category::where('tenant_id', $tenantModel->id)->orderBy('name')->get(['id', 'name', 'slug']);
        $products = Product::where('tenant_id', $tenantModel->id)->orderBy('name')->get(['id', 'name', 'slug']);

        $shortData = [
            'id' => $short->id,
            'name' => $short->name,
            'description' => $short->description,
            'location_id' => $short->location_id,
            'location' => $short->location ? ['id' => $short->location->id, 'name' => $short->location->name] : null,
            'link_type' => $short->link_type,
            'external_url' => $short->external_url,
            'linkable_type' => $short->linkable_type,
            'linkable_id' => $short->linkable_id,
            'short_embed_url' => $short->short_embed_url,
            'sort_order' => $short->sort_order,
            'is_active' => $short->is_active,
        ];

        return Inertia::render('Tenant/Admin/Shorts/Edit', [
            'short' => $shortData,
            'locations' => $locations,
            'categories' => $categories,
            'products' => $products,
        ]);
    }

    public function update(UpdateShortRequest $request, BunnyStreamService $bunnyStream, string $tenant, int $id): RedirectResponse
    {
        Gate::authorize('shorts.update');

        $tenantModel = app('currentTenant');
        $short = Short::where('tenant_id', $tenantModel->id)->findOrFail($id);

        $validated = $request->validated();
        unset($validated['short_video'], $validated['remove_short'], $validated['_method']);

        if ($request->boolean('remove_short')) {
            $validated['short_video_id'] = null;
        } elseif ($request->hasFile('short_video')) {
            if (!$bunnyStream->isEnabled()) {
                return redirect()->back()->withInput()->withErrors(['short_video' => 'El servicio de shorts no está configurado.']);
            }
            $title = 'Short ' . ($short->name ?? '') . ' - ' . now()->format('Y-m-d H:i');
            $videoId = $bunnyStream->createAndUpload($title, $request->file('short_video'), $tenantModel);
            if (!$videoId) {
                return redirect()->back()->withInput()->withErrors(['short_video' => 'No se pudo subir el video.']);
            }
            $validated['short_video_id'] = $videoId;
        }

        if (($validated['link_type'] ?? '') === 'external') {
            $validated['linkable_type'] = null;
            $validated['linkable_id'] = null;
        } else {
            $validated['external_url'] = null;
            $validated['linkable_type'] = $validated['linkable_type'] ?? null;
            $validated['linkable_id'] = isset($validated['linkable_id']) && $validated['linkable_id'] !== '' ? (int) $validated['linkable_id'] : null;
        }

        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        $short->update($validated);

        return redirect()
            ->route('tenant.shorts.index', ['tenant' => $tenantModel->slug])
            ->with('success', 'Short actualizado correctamente.');
    }

    public function destroy(string $tenant, int $id): RedirectResponse
    {
        Gate::authorize('shorts.delete');

        $tenantModel = app('currentTenant');
        $short = Short::where('tenant_id', $tenantModel->id)->findOrFail($id);
        $short->delete();

        return redirect()
            ->route('tenant.shorts.index', ['tenant' => $tenantModel->slug])
            ->with('success', 'Short eliminado.');
    }

    public function toggleActive(Request $request, string $tenant, int $id): RedirectResponse
    {
        Gate::authorize('shorts.update');

        $tenantModel = app('currentTenant');
        $short = Short::where('tenant_id', $tenantModel->id)->findOrFail($id);
        $short->update(['is_active' => !$short->is_active]);

        return redirect()
            ->route('tenant.shorts.index', ['tenant' => $tenantModel->slug])
            ->with('success', 'Estado actualizado.');
    }
}
