<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CategoryIcon;
use App\Models\IconRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tenant = app('currentTenant');

        $categories = Category::where('tenant_id', $tenant->id)
            ->with(['icon', 'parent'])
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
                        });
                });
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
    public function store(Request $request)
    {
        $tenant = app('currentTenant');

        $request->validate([
            'name' => 'required|string|max:255',
            'category_icon_id' => 'required|exists:category_icons,id', // Should validate if icon is actually available to tenant?
            'parent_id' => 'nullable|exists:categories,id', // Should enforce tenant ownership of parent
        ]);

        // Simple security check for parent ownership
        if ($request->parent_id && !Category::where('id', $request->parent_id)->where('tenant_id', $tenant->id)->exists()) {
            return back()->with('error', 'La categoría padre no es válida.');
        }

        // Generate Slug
        $slug = Str::slug($request->name);
        // Ensure uniqueness per tenant
        $count = Category::where('tenant_id', $tenant->id)->where('slug', 'like', $slug . '%')->count();
        if ($count > 0) {
            $slug = $slug . '-' . ($count + 1);
        }

        Category::create([
            'tenant_id' => $tenant->id,
            'name' => $request->name,
            'slug' => $slug,
            'category_icon_id' => $request->category_icon_id,
            'parent_id' => $request->parent_id,
            'is_active' => true,
        ]);

        return back()->with('success', 'Categoría creada correctamente.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $category)
    {
        // Note: Route model binding might not automatically work with tenant scoping if not configured.
        // Assuming $category is the ID or model. Let's find manually to be safe or rely on binding if set up.
        // With 'tenant' prefix, explicit binding is safer.

        $tenant = app('currentTenant');
        $categoryModel = Category::where('tenant_id', $tenant->id)->findOrFail($category);

        $request->validate([
            'name' => 'required|string|max:255',
            'category_icon_id' => 'required|exists:category_icons,id',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        if ($request->parent_id && $request->parent_id == $categoryModel->id) {
            return back()->with('error', 'Una categoría no puede ser su propio padre.');
        }

        // Validate parent ownership
        if ($request->parent_id && !Category::where('id', $request->parent_id)->where('tenant_id', $tenant->id)->exists()) {
            return back()->with('error', 'La categoría padre no es válida.');
        }

        // Update slug if name changes? Often better to keep slug stable or ask user.
        // For now, let's keep slug stable unless explicitly requested or just name update.
        // Update: Implementation Plan said "name, slug". 
        // Let's simpler: update name only. Slug remains.

        $categoryModel->update([
            'name' => $request->name,
            'category_icon_id' => $request->category_icon_id,
            'parent_id' => $request->parent_id,
        ]);

        return back()->with('success', 'Categoría actualizada correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($category)
    {
        $tenant = app('currentTenant');
        $categoryModel = Category::where('tenant_id', $tenant->id)->findOrFail($category);

        // Handle children? 
        // If has children, prevent or update them to root?
        if ($categoryModel->children()->count() > 0) {
            return back()->with('error', 'No se puede eliminar una categoría que tiene subcategorías.');
        }

        $categoryModel->delete();

        return back()->with('success', 'Categoría eliminada correctamente.');
    }

    /**
     * Request a new icon.
     */
    public function requestIcon(Request $request)
    {
        $tenant = app('currentTenant');

        $request->validate([
            'requested_name' => 'required|string|max:255',
            'reference_image' => 'required|image|max:2048', // 2MB
        ]);

        $path = $request->file('reference_image')->store('icon-requests', 's3');

        $iconRequest = IconRequest::create([
            'tenant_id' => $tenant->id,
            'requested_name' => $request->requested_name,
            'reference_image_path' => $path,
            'status' => 'pending',
        ]);

        // Dispatch Real-time Event (Bypasses Queue)
        \App\Events\IconRequested::dispatch($iconRequest);

        // Dispatch Notification (Database/Email)
        \Illuminate\Support\Facades\Notification::send(
            \App\Models\User::where('is_super_admin', true)->get(),
            new \App\Notifications\IconRequestedNotification($iconRequest)
        );

        return back()->with('success', 'Solicitud de icono enviada. Te avisaremos cuando sea aprobada.');
    }
    /**
     * Toggle the active status of the category.
     */
    public function toggleActive($tenantRaw, $category)
    {
        $tenant = app('currentTenant');
        $categoryModel = Category::where('tenant_id', $tenant->id)->findOrFail($category);

        $categoryModel->update([
            'is_active' => !$categoryModel->is_active
        ]);

        return back()->with('success', 'Estado de la categoría actualizado correctamente.');
    }
}
