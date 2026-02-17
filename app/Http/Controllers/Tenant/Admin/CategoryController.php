<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\StoreCategoryRequest;
use App\Http\Requests\Tenant\Admin\UpdateCategoryRequest;
use App\Models\Category;
use App\Models\CategoryIcon;
use App\Models\IconRequest;
use App\Traits\StoresImageAsWebp;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    use StoresImageAsWebp;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('categories.view');

        $tenant = app('currentTenant');

        $categories = Category::where('tenant_id', $tenant->id)
            ->with(['icon', 'parent'])
            ->withCount(['products', 'children', 'allProducts'])
            ->latest()
            ->paginate(20);

        // Icons available for this tenant (Global + Matching Vertical & Niche)
        $availableIcons = CategoryIcon::where('is_active', true)
            ->where(function ($query) use ($tenant) {
            // 1. Global icons
            $query->where('is_global', true)
                // 2. Or Vertical specific
                ->orWhere(function ($q) use ($tenant) {
                $q->where('vertical_id', $tenant->vertical_id)
                    ->where(function ($sq) use ($tenant) {
                    // 2a. Generic Vertical icons (no niche)
                    $sq->whereNull('business_category_id')
                        // 2b. Or matching Niche (if tenant has one)
                        ->orWhere('business_category_id', $tenant->category_id);
                }
                );
            }
            );
        })
            ->get();

        // My Icon Requests
        $myRequests = IconRequest::where('tenant_id', $tenant->id)
            ->latest()
            ->paginate(5, ['*'], 'requests_page');

        // Parent candidates (root categories or all? Avoid loops)
        // For simplicity, just list all except self in edit, but here just all for create.
        $parents = Category::where('tenant_id', $tenant->id)->select('id', 'name')->get();

        return Inertia::render('Tenant/Admin/Categories/Index', [
            'categories' => $categories,
            'availableIcons' => $availableIcons,
            'myRequests' => $myRequests,
            'parents' => $parents,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $tenant = app('currentTenant');
        $validated = $request->validated();

        $slug = Str::slug($validated['name']);
        $count = Category::where('tenant_id', $tenant->id)->where('slug', 'like', $slug . '%')->count();
        if ($count > 0) {
            $slug = $slug . '-' . ($count + 1);
        }

        Category::create([
            'tenant_id' => $tenant->id,
            'name' => $validated['name'],
            'slug' => $slug,
            'category_icon_id' => $validated['category_icon_id'],
            'parent_id' => $validated['parent_id'] ?? null,
            'is_active' => true,
        ]);

        return back()->with('success', 'Categoría creada correctamente.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, $tenant, $category): RedirectResponse
    {
        $currentTenant = app('currentTenant');
        $categoryModel = Category::where('tenant_id', $currentTenant->id)->findOrFail($category);
        $validated = $request->validated();

        $categoryModel->update([
            'name' => $validated['name'],
            'category_icon_id' => $validated['category_icon_id'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        return back()->with('success', 'Categoría actualizada correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($tenant, $category)
    {
        Gate::authorize('categories.delete');

        $currentTenant = app('currentTenant');
        $categoryModel = Category::where('tenant_id', $currentTenant->id)
            ->withCount(['allProducts', 'children'])
            ->findOrFail($category);

        if ($categoryModel->children_count > 0) {
            return back()->with('error', 'No se puede eliminar una categoría que tiene subcategorías.');
        }

        if ($categoryModel->all_products_count > 0) {
            return back()->with('error', 'No se puede eliminar una categoría que tiene productos asociados.');
        }

        $categoryModel->delete();

        return back()->with('success', 'Categoría eliminada correctamente.');
    }

    /**
     * Request a new icon.
     */
    public function requestIcon(Request $request)
    {
        Gate::authorize('categories.create');

        $tenant = app('currentTenant');

        $request->validate([
            'requested_name' => 'required|string|max:255',
            'reference_image' => 'required|image|max:2048',
        ]);

        $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenant->slug ?? ''));
        $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenant->id) . '/icon-requests';

        try {
            $path = $this->storeImageAsWebp($request->file('reference_image'), $basePath);

            $iconRequest = IconRequest::create([
                'tenant_id' => $tenant->id,
                'requested_name' => $request->requested_name,
                'reference_image_path' => $path,
                'status' => 'pending',
            ]);

            $this->registerMedia($path, 'bunny');
            \App\Events\IconRequested::dispatch($iconRequest);

            \Illuminate\Support\Facades\Notification::send(
                \App\Models\User::where('is_super_admin', true)->get(),
                new \App\Notifications\IconRequestedNotification($iconRequest)
            );
        } catch (\Throwable $e) {
            if (isset($path)) {
                Storage::disk('bunny')->delete($path);
            }
            report($e);
            return back()->with('error', 'No se pudo enviar la solicitud. Intenta de nuevo más tarde.');
        }

        return back()->with('success', 'Solicitud de icono enviada. Te avisaremos cuando sea aprobada.');
    }
    /**
     * Toggle the active status of the category.
     */
    public function toggleActive($tenantRaw, $category)
    {
        Gate::authorize('categories.update');

        $tenant = app('currentTenant');
        $categoryModel = Category::where('tenant_id', $tenant->id)->findOrFail($category);

        $categoryModel->update([
            'is_active' => !$categoryModel->is_active
        ]);

        return back()->with('success', 'Estado de la categoría actualizado correctamente.');
    }
}
