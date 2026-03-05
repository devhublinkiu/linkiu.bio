<?php

namespace App\Http\Controllers\Tenant\Admin\Church;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\Church\StoreChurchTestimonialRequest;
use App\Http\Requests\Tenant\Admin\Church\UpdateChurchTestimonialRequest;
use App\Models\Tenant\Church\ChurchTestimonial;
use App\Traits\StoresImageAsWebp;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChurchTestimonialController extends Controller
{
    use StoresImageAsWebp;

    public function index()
    {
        Gate::authorize('testimonials.view');

        $testimonials = ChurchTestimonial::orderBy('order')
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->through(fn (ChurchTestimonial $t) => [
                'id' => $t->id,
                'title' => $t->title,
                'author' => $t->author,
                'category' => $t->category,
                'short_quote' => $t->short_quote,
                'is_featured' => $t->is_featured,
                'is_published' => $t->is_published,
                'image_url' => $t->image_url,
                'video_url' => $t->video_url,
                'order' => $t->order,
                'created_at' => $t->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Tenant/Admin/Testimonials/Index', [
            'testimonials' => $testimonials,
        ]);
    }

    public function create()
    {
        Gate::authorize('testimonials.create');

        return Inertia::render('Tenant/Admin/Testimonials/Create');
    }

    public function store(StoreChurchTestimonialRequest $request, string $tenant)
    {
        Gate::authorize('testimonials.create');

        $validated = $request->validated();
        if ($request->hasFile('image_file')) {
            $tenantModel = app('currentTenant');
            $basePath = 'uploads/' . preg_replace('/[^a-z0-9\-]/', '', strtolower($tenantModel->slug ?? 'tenant-' . $tenantModel->id)) . '/church-testimonials';
            $path = $this->storeImageAsWebp($request->file('image_file'), $basePath, 'bunny', 800, 85);
            $validated['image_url'] = Storage::disk('bunny')->url($path);
            $this->registerMedia($path, 'bunny');
        }
        unset($validated['image_file']);
        $validated['is_featured'] = (bool) ($validated['is_featured'] ?? false);
        $validated['is_published'] = (bool) ($validated['is_published'] ?? false);

        ChurchTestimonial::create($validated);

        return redirect()
            ->route('tenant.admin.testimonials.index', ['tenant' => $tenant])
            ->with('success', 'Testimonio creado correctamente');
    }

    public function edit(string $tenant, ChurchTestimonial $testimonial)
    {
        Gate::authorize('testimonials.update');

        return Inertia::render('Tenant/Admin/Testimonials/Edit', [
            'testimonial' => $testimonial->only([
                'id', 'title', 'body', 'video_url', 'image_url', 'category',
                'is_featured', 'short_quote', 'author', 'is_published', 'order',
            ]),
        ]);
    }

    public function update(UpdateChurchTestimonialRequest $request, string $tenant, ChurchTestimonial $testimonial)
    {
        Gate::authorize('testimonials.update');

        $validated = $request->validated();
        if ($request->hasFile('image_file')) {
            $tenantModel = app('currentTenant');
            $basePath = 'uploads/' . preg_replace('/[^a-z0-9\-]/', '', strtolower($tenantModel->slug ?? 'tenant-' . $tenantModel->id)) . '/church-testimonials';
            $path = $this->storeImageAsWebp($request->file('image_file'), $basePath, 'bunny', 800, 85);
            $validated['image_url'] = Storage::disk('bunny')->url($path);
            $this->registerMedia($path, 'bunny');
        }
        unset($validated['image_file']);
        $validated['is_featured'] = (bool) ($validated['is_featured'] ?? false);
        $validated['is_published'] = (bool) ($validated['is_published'] ?? false);

        $testimonial->update($validated);

        return redirect()
            ->route('tenant.admin.testimonials.index', ['tenant' => $tenant])
            ->with('success', 'Testimonio actualizado correctamente');
    }

    public function destroy(string $tenant, ChurchTestimonial $testimonial)
    {
        Gate::authorize('testimonials.delete');

        $testimonial->delete();

        return redirect()
            ->route('tenant.admin.testimonials.index', ['tenant' => $tenant])
            ->with('success', 'Testimonio eliminado correctamente');
    }
}
