<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\StoreSliderRequest;
use App\Http\Requests\Tenant\Admin\UpdateSliderRequest;
use App\Models\Tenant\Locations\Location;
use App\Models\Tenant\All\Slider;
use App\Traits\StoresImageAsWebp;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SliderController extends Controller
{
    use StoresImageAsWebp;

    public function index(Request $request): Response
    {
        Gate::authorize('sliders.view');

        $tenant = app('currentTenant');
        $locationId = $request->query('location_id');
        $userLocationId = $this->getUserLocationId($tenant);
        if ($userLocationId !== null) {
            $locationId = $userLocationId;
        }

        $query = Slider::select([
            'id', 'tenant_id', 'location_id', 'name', 'image_path', 'image_path_desktop',
            'storage_disk', 'link_type', 'external_url', 'linkable_type', 'linkable_id',
            'start_at', 'end_at', 'active_days', 'clicks_count', 'sort_order', 'is_active', 'created_at',
        ])->orderBy('sort_order');

        if ($locationId) {
            $query->where('location_id', $locationId);
        }

        $sliders = $query->paginate(15)->appends($request->query());
        $locations = Location::select(['id', 'name'])->orderBy('name')->get();

        $slidersLimit = $tenant->getLimit('sliders');
        $slidersCount = Slider::count();

        return Inertia::render('Tenant/Admin/Sliders/Index', [
            'sliders' => $sliders,
            'locations' => $locations,
            'sliders_limit' => $slidersLimit,
            'sliders_count' => $slidersCount,
            'filters' => ['location_id' => $locationId],
        ]);
    }

    public function store(StoreSliderRequest $request, $tenant): RedirectResponse
    {
        Gate::authorize('sliders.create');

        $tenantModel = app('currentTenant');
        $maxSliders = $tenantModel->getLimit('sliders');
        if ($maxSliders !== null && Slider::count() >= $maxSliders) {
            return back()->withErrors([
                'limit' => "Has alcanzado el máximo de {$maxSliders} sliders permitidos en tu plan.",
            ]);
        }

        $validated = $request->validated();
        $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenantModel->slug ?? ''));
        $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenantModel->id) . '/sliders';

        try {
            if ($request->hasFile('image_path')) {
                $validated['image_path'] = $this->storeImageAsWebp($request->file('image_path'), $basePath);
                $validated['storage_disk'] = 'bunny';
            }
            if ($request->hasFile('image_path_desktop')) {
                $validated['image_path_desktop'] = $this->storeImageAsWebp($request->file('image_path_desktop'), $basePath);
            }

            $slider = Slider::create($validated);

            if (!empty($slider->image_path)) {
                $this->registerMedia($slider->image_path, 'bunny');
            }
            if (!empty($slider->image_path_desktop)) {
                $this->registerMedia($slider->image_path_desktop, 'bunny');
            }
        } catch (\Throwable $e) {
            if (!empty($validated['image_path'] ?? null)) {
                Storage::disk('bunny')->delete($validated['image_path'] ?? '');
            }
            if (!empty($validated['image_path_desktop'] ?? null)) {
                Storage::disk('bunny')->delete($validated['image_path_desktop'] ?? '');
            }
            return back()->withErrors(['image_path' => 'Error al subir la imagen. Intenta de nuevo.'])->withInput();
        }

        return redirect()->back()->with('success', 'Slider creado correctamente.');
    }

    public function update(UpdateSliderRequest $request, $tenant, Slider $slider): RedirectResponse
    {
        Gate::authorize('sliders.update');
        $this->authorizeSliderLocation($slider);

        $validated = $request->validated();
        $tenantModel = app('currentTenant');
        $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenantModel->slug ?? ''));
        $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenantModel->id) . '/sliders';

        try {
            if ($request->hasFile('image_path')) {
                if ($slider->image_path && $slider->storage_disk) {
                    Storage::disk($slider->storage_disk)->delete($slider->image_path);
                }
                $validated['image_path'] = $this->storeImageAsWebp($request->file('image_path'), $basePath);
                $validated['storage_disk'] = 'bunny';
            }
            if ($request->hasFile('image_path_desktop')) {
                if ($slider->image_path_desktop && $slider->storage_disk) {
                    Storage::disk($slider->storage_disk)->delete($slider->image_path_desktop);
                }
                $validated['image_path_desktop'] = $this->storeImageAsWebp($request->file('image_path_desktop'), $basePath);
            }

            $slider->update($validated);

            if ($request->hasFile('image_path')) {
                $this->registerMedia($slider->fresh()->image_path, 'bunny');
            }
            if ($request->hasFile('image_path_desktop')) {
                $this->registerMedia($slider->fresh()->image_path_desktop, 'bunny');
            }
        } catch (\Throwable $e) {
            return back()->withErrors(['image_path' => 'Error al actualizar la imagen. Intenta de nuevo.'])->withInput();
        }

        return redirect()->back()->with('success', 'Slider actualizado.');
    }

    public function destroy($tenant, Slider $slider): RedirectResponse
    {
        Gate::authorize('sliders.delete');
        $this->authorizeSliderLocation($slider);

        $disk = $slider->storage_disk ?? 'bunny';
        try {
            if ($slider->image_path) {
                Storage::disk($disk)->delete($slider->image_path);
            }
            if ($slider->image_path_desktop) {
                Storage::disk($disk)->delete($slider->image_path_desktop);
            }
        } catch (\Throwable $e) {
            // Log but continue with delete
        }
        $slider->delete();

        return redirect()->back()->with('success', 'Slider eliminado.');
    }

    public function click(Slider $slider): RedirectResponse
    {
        $slider->increment('clicks_count');

        if ($slider->link_type === 'external' && $slider->external_url) {
            return redirect()->away($slider->external_url);
        }

        if ($slider->link_type === 'internal' && $slider->linkable) {
            if (method_exists($slider->linkable, 'getUrl')) {
                return redirect($slider->linkable->getUrl());
            }
        }

        return redirect()->route('tenant.home', ['tenant' => app('currentTenant')->slug]);
    }

    /** Location_id del usuario en este tenant (null = puede ver todas las sedes). */
    private function getUserLocationId($tenant): ?int
    {
        if (Auth::user()->is_super_admin || $tenant->owner_id === Auth::id()) {
            return null;
        }
        $id = DB::table('tenant_user')
            ->where('tenant_id', $tenant->id)
            ->where('user_id', Auth::id())
            ->value('location_id');

        return $id !== null ? (int) $id : null;
    }

    /**
     * IDOR: si el usuario tiene sede asignada en el tenant, solo puede actuar sobre sliders de esa sede.
     */
    private function authorizeSliderLocation(Slider $slider): void
    {
        $tenant = app('currentTenant');
        $userLocationId = $this->getUserLocationId($tenant);
        if ($userLocationId === null) {
            return;
        }
        if ((int) $slider->location_id !== $userLocationId) {
            abort(403, 'No tienes permiso para gestionar este slider.');
        }
    }

    private function registerMedia(string $path, string $disk = 'bunny'): void
    {
        if (!$path) {
            return;
        }
        $storage = Storage::disk($disk);
        if (!$storage->exists($path)) {
            return;
        }
        \App\Models\Tenant\MediaFile::firstOrCreate(
            ['path' => $path],
            [
                'tenant_id' => app('currentTenant')->id,
                'name' => basename($path),
                'disk' => $disk,
                'mime_type' => $storage->mimeType($path),
                'size' => $storage->size($path),
                'extension' => pathinfo($path, PATHINFO_EXTENSION),
                'type' => 'image',
                'folder' => 'sliders',
                'uploaded_by' => auth()->id(),
                'url' => $storage->url($path),
                'is_public' => true,
            ]
        );
    }
}
