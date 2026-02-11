<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class SliderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('sliders.view');

        $sliders = Slider::orderBy('sort_order')->get();

        return Inertia::render('Tenant/Admin/Sliders/Index', [
            'sliders' => $sliders
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('sliders.create');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image_path' => 'required|image|max:2048', // 2MB max
            'image_path_desktop' => 'nullable|image|max:4096',
            'link_type' => 'required|in:none,internal,external',
            'external_url' => 'nullable|required_if:link_type,external|url',
            'linkable_type' => 'nullable|required_if:link_type,internal',
            'linkable_id' => 'nullable|required_if:link_type,internal',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after:start_at',
            'active_days' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        // Handle Image Uploads
        if ($request->hasFile('image_path')) {
            $validated['image_path'] = $request->file('image_path')->store('uploads/' . app('currentTenant')->id . '/sliders', 's3');
        }

        if ($request->hasFile('image_path_desktop')) {
            $validated['image_path_desktop'] = $request->file('image_path_desktop')->store('uploads/' . app('currentTenant')->id . '/sliders', 's3');
        }

        $slider = Slider::create($validated);

        // Register in Media Library
        if ($slider->image_path)
            $this->registerMedia($slider->image_path);
        if ($slider->image_path_desktop)
            $this->registerMedia($slider->image_path_desktop);

        return redirect()->back()->with('success', 'Slider creado correctamente.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $tenant, Slider $slider)
    {
        Gate::authorize('sliders.update');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'link_type' => 'required|in:none,internal,external',
            'external_url' => 'nullable|url',
            'linkable_type' => 'nullable',
            'linkable_id' => 'nullable',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after:start_at',
            'active_days' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer'
        ]);

        if ($request->hasFile('image_path')) {
            // Delete old
            if ($slider->image_path)
                Storage::disk('s3')->delete($slider->image_path);
            $validated['image_path'] = $request->file('image_path')->store('uploads/' . app('currentTenant')->id . '/sliders', 's3');
        }

        if ($request->hasFile('image_path_desktop')) {
            if ($slider->image_path_desktop) {
                Storage::disk('s3')->delete($slider->image_path_desktop);
            }
            $validated['image_path_desktop'] = $request->file('image_path_desktop')->store('uploads/' . app('currentTenant')->id . '/sliders', 's3');
        }

        $slider->update($validated);

        // Register in Media Library (if new ones were uploaded)
        if ($request->hasFile('image_path'))
            $this->registerMedia($slider->image_path);
        if ($request->hasFile('image_path_desktop'))
            $this->registerMedia($slider->image_path_desktop);

        return redirect()->back()->with('success', 'Slider actualizado.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($tenant, Slider $slider)
    {
        Gate::authorize('sliders.delete');

        if ($slider->image_path)
            Storage::disk('s3')->delete($slider->image_path);
        if ($slider->image_path_desktop)
            Storage::disk('s3')->delete($slider->image_path_desktop);

        $slider->delete();

        return redirect()->back()->with('success', 'Slider eliminado.');
    }

    /**
     * Public Endpoint: Track click and redirect
     */
    public function click(Slider $slider)
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

    /**
     * Internal helper to register media in the global library.
     */
    private function registerMedia($path, $folder = 'sliders')
    {
        if (!$path)
            return;

        $disk = Storage::disk('s3');
        if (!$disk->exists($path))
            return;

        \App\Models\MediaFile::firstOrCreate(
        ['path' => $path],
        [
            'tenant_id' => app('currentTenant')->id,
            'name' => basename($path),
            'disk' => 's3',
            'mime_type' => $disk->mimeType($path),
            'size' => $disk->size($path),
            'extension' => pathinfo($path, PATHINFO_EXTENSION),
            'type' => 'image',
            'folder' => $folder,
            'uploaded_by' => auth()->id(),
            'url' => $disk->url($path),
            'is_public' => true,
        ]
        );
    }
}
