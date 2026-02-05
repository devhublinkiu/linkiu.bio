<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SliderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sliders = Slider::where('tenant_id', app('currentTenant')->id)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Tenant/Admin/Sliders/Index', [
            'sliders' => $sliders
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $tenant)
    {
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

        $validated['tenant_id'] = app('currentTenant')->id;

        // Handle Image Uploads
        if ($request->hasFile('image_path')) {
            $validated['image_path'] = $request->file('image_path')->store('uploads/' . app('currentTenant')->id . '/sliders', 's3');
        }

        if ($request->hasFile('image_path_desktop')) {
            $validated['image_path_desktop'] = $request->file('image_path_desktop')->store('uploads/' . app('currentTenant')->id . '/sliders', 's3');
        }

        Slider::create($validated);

        return redirect()->back()->with('success', 'Slider creado correctamente.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $tenant, Slider $slider)
    {
        // Ensure tenant ownership
        if ($slider->tenant_id !== app('currentTenant')->id)
            abort(403);

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

        return redirect()->back()->with('success', 'Slider actualizado.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($tenant, Slider $slider)
    {
        if ($slider->tenant_id !== app('currentTenant')->id)
            abort(403);

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
        // Validation handled by route model binding (implicit 404 if not found)
        // Ensure it belongs to current tenant route scope if applicable
        if ($slider->tenant_id !== app('currentTenant')->id)
            abort(404);

        $slider->increment('clicks_count');

        if ($slider->link_type === 'external' && $slider->external_url) {
            return redirect()->away($slider->external_url);
        }

        if ($slider->link_type === 'internal' && $slider->linkable) {
            // Assuming linkable models (Product/Category) have a 'route()' method or similar, 
            // otherwise construct URL based on type.
            // For now, redirect to home or implement dynamic routing.
            // This needs frontend coordination, or simple logic here.

            // Example redirection logic:
            if (method_exists($slider->linkable, 'getUrl')) {
                return redirect($slider->linkable->getUrl());
            }
            // Fallback for known types
            /*
            if ($slider->linkable_type === 'App\Models\Product') {
                return redirect()->route('tenant.product', ['slug' => $slider->linkable->slug]);
            }
            */
        }

        return redirect()->route('tenant.home', ['tenant' => app('currentTenant')->slug]);
    }
}
