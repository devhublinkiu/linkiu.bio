<?php

namespace App\Http\Controllers\Tenant\Admin\Gastronomy;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\StoreProductRequest;
use App\Http\Requests\Tenant\Admin\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Tenant\Locations\Location;
use App\Traits\StoresImageAsWebp;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    use StoresImageAsWebp;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('products.view');

        $tenant = app('currentTenant');

        $products = Product::where('tenant_id', $tenant->id)
            ->with(['category', 'variantGroups.options', 'locations:id,name'])
            ->orderBy('sort_order')
            ->latest()
            ->paginate(20);

        $categories = Category::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->get();

        $locations = Location::where('tenant_id', $tenant->id)
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();

        $productsLimit = $tenant->getLimit('products');
        $productsCount = Product::where('tenant_id', $tenant->id)->count();

        return Inertia::render('Tenant/Admin/Gastronomy/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'locations' => $locations,
            'products_limit' => $productsLimit,
            'products_count' => $productsCount,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        Gate::authorize('products.create');

        $tenant = app('currentTenant');

        // Check plan limit
        $maxProducts = $tenant->getLimit('products');
        if ($maxProducts !== null && Product::where('tenant_id', $tenant->id)->count() >= $maxProducts) {
            return Inertia::render('Tenant/Admin/Gastronomy/Products/Create', [
                'categories' => [],
                'locations' => [],
                'limit_reached' => true,
                'products_limit' => $maxProducts,
            ]);
        }

        $categories = Category::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->get();

        $locations = Location::where('tenant_id', $tenant->id)
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Tenant/Admin/Gastronomy/Products/Create', [
            'categories' => $categories,
            'locations' => $locations,
            'limit_reached' => false,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($tenantRaw, Product $product): Response
    {
        Gate::authorize('products.update');

        $tenant = app('currentTenant');

        // IDOR: verify product belongs to this tenant
        if ((int) $product->tenant_id !== (int) $tenant->id) {
            abort(403, 'No tienes permiso para editar este producto.');
        }

        $product->load(['variantGroups.options', 'locations:id,name']);

        $categories = Category::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->get();

        $locations = Location::where('tenant_id', $tenant->id)
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Tenant/Admin/Gastronomy/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'locations' => $locations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        Gate::authorize('products.create');

        $tenant = app('currentTenant');

        // Check plan limit
        $maxProducts = $tenant->getLimit('products');
        if ($maxProducts !== null && Product::where('tenant_id', $tenant->id)->count() >= $maxProducts) {
            return back()->withErrors([
                'limit' => "Has alcanzado el máximo de {$maxProducts} productos permitidos en tu plan.",
            ]);
        }

        $validated = $request->validated();

        // Generate slug
        $slug = Str::slug($validated['name']);
        $count = Product::where('tenant_id', $tenant->id)->where('slug', 'like', $slug . '%')->count();
        if ($count > 0) {
            $slug = $slug . '-' . ($count + 1);
        }
        $validated['slug'] = $slug;
        $validated['tenant_id'] = $tenant->id;
        $validated['storage_disk'] = 'bunny';

        $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenant->slug ?? ''));
        $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenant->id) . '/products';
        $galleryBasePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenant->id) . '/products/gallery';

        DB::beginTransaction();
        try {
            // Process main image
            if ($request->hasFile('image_file')) {
                $validated['image'] = $this->storeImageAsWebp($request->file('image_file'), $basePath, 'bunny', 800, 85);
            } elseif ($request->input('image')) {
                $validated['image'] = $request->input('image');
            }

            // Process gallery
            $galleryPaths = [];
            if ($request->hasFile('gallery_files')) {
                foreach ($request->file('gallery_files') as $file) {
                    $galleryPaths[] = $this->storeImageAsWebp($file, $galleryBasePath, 'bunny', 800, 85);
                }
            }
            if ($request->input('gallery')) {
                foreach ($request->input('gallery') as $path) {
                    if (is_string($path)) {
                        $galleryPaths[] = $path;
                    }
                }
            }
            $validated['gallery'] = $galleryPaths;

            // Remove location_ids from validated before creating product
            $locationIds = $validated['location_ids'] ?? [];
            unset($validated['location_ids']);

            // Remove variant_groups from validated (handled separately)
            $variantGroupsData = $validated['variant_groups'] ?? [];
            unset($validated['variant_groups']);

            $product = Product::create($validated);

            // Register main image in media library
            if (!empty($validated['image'])) {
                $this->registerMedia($validated['image'], 'bunny', $tenant->id, 'products');
            }

            // Register gallery images
            foreach ($galleryPaths as $gPath) {
                $this->registerMedia($gPath, 'bunny', $tenant->id, 'products/gallery');
            }

            // Sync locations
            if (!empty($locationIds)) {
                $product->locations()->sync($locationIds);
            }

            // Process variants from validated data
            foreach ($variantGroupsData as $groupData) {
                if (!is_array($groupData)) continue;

                $group = $product->variantGroups()->create([
                    'name' => $groupData['name'],
                    'type' => $groupData['type'],
                    'min_selection' => $groupData['min_selection'] ?? 0,
                    'max_selection' => $groupData['max_selection'] ?? 1,
                    'is_required' => $groupData['is_required'] ?? false,
                    'sort_order' => $groupData['sort_order'] ?? 0,
                ]);

                if (isset($groupData['options']) && is_array($groupData['options'])) {
                    foreach ($groupData['options'] as $optionData) {
                        if (!is_array($optionData)) continue;
                        $group->options()->create([
                            'name' => $optionData['name'],
                            'price_adjustment' => $optionData['price_adjustment'] ?? 0,
                            'is_available' => $optionData['is_available'] ?? true,
                            'sort_order' => $optionData['sort_order'] ?? 0,
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('tenant.admin.products.index', $tenant->slug)
                ->with('success', 'Producto creado correctamente.');
        } catch (\Throwable $e) {
            DB::rollBack();
            // Clean up uploaded images on failure
            if (!empty($validated['image'])) {
                Storage::disk('bunny')->delete($validated['image']);
            }
            foreach ($galleryPaths as $gPath) {
                Storage::disk('bunny')->delete($gPath);
            }
            return back()->withErrors(['image' => 'Error al crear el producto. Intenta de nuevo.'])->withInput();
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, $tenantRaw, Product $product): RedirectResponse
    {
        Gate::authorize('products.update');

        $tenant = app('currentTenant');

        // IDOR: verify product belongs to this tenant
        if ((int) $product->tenant_id !== (int) $tenant->id) {
            abort(403, 'No tienes permiso para actualizar este producto.');
        }

        $validated = $request->validated();

        $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenant->slug ?? ''));
        $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenant->id) . '/products';
        $galleryBasePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenant->id) . '/products/gallery';
        $disk = $product->storage_disk ?? 'bunny';

        DB::beginTransaction();
        try {
            // Update slug if name changed
            if ($validated['name'] !== $product->name) {
                $slug = Str::slug($validated['name']);
                $count = Product::where('tenant_id', $tenant->id)
                    ->where('slug', 'like', $slug . '%')
                    ->where('id', '!=', $product->id)
                    ->count();
                if ($count > 0) {
                    $slug = $slug . '-' . ($count + 1);
                }
                $validated['slug'] = $slug;
            }

            // Process main image if updated
            if ($request->hasFile('image_file')) {
                // Delete old image
                if ($product->image && str_contains($product->image, 'products/')) {
                    Storage::disk($disk)->delete($product->image);
                }
                $validated['image'] = $this->storeImageAsWebp($request->file('image_file'), $basePath, 'bunny', 800, 85);
                $validated['storage_disk'] = 'bunny';
                $this->registerMedia($validated['image'], 'bunny', $tenant->id, 'products');
            } elseif ($request->input('image') && $request->input('image') !== $product->image) {
                // New path from Media Manager
                if ($product->image && str_contains($product->image, 'products/')) {
                    Storage::disk($disk)->delete($product->image);
                }
                $validated['image'] = $request->input('image');
                $validated['storage_disk'] = 'bunny';
            }

            // Process gallery if updated
            if ($request->hasFile('gallery_files') || $request->has('gallery')) {
                $newGalleryPaths = [];
                $keptPaths = $request->input('gallery', []);

                // Clean paths
                $keptPathsClean = array_map(function ($path) {
                    return is_string($path) ? str_replace('/media/', '', $path) : '';
                }, $keptPaths ?: []);

                // Delete removed gallery images
                if ($product->gallery) {
                    foreach ($product->gallery as $oldPath) {
                        if (str_contains($oldPath, 'gallery/') && !in_array($oldPath, $keptPathsClean)) {
                            Storage::disk($disk)->delete($oldPath);
                        }
                    }
                }

                // Keep existing paths
                foreach ($keptPathsClean as $path) {
                    if (!empty($path)) {
                        $newGalleryPaths[] = $path;
                    }
                }

                // Process new files
                if ($request->hasFile('gallery_files')) {
                    foreach ($request->file('gallery_files') as $file) {
                        $newPath = $this->storeImageAsWebp($file, $galleryBasePath, 'bunny', 800, 85);
                        $newGalleryPaths[] = $newPath;
                        $this->registerMedia($newPath, 'bunny', $tenant->id, 'products/gallery');
                    }
                }

                $validated['gallery'] = $newGalleryPaths;
            }

            // Remove location_ids and variant_groups from validated
            $locationIds = $validated['location_ids'] ?? [];
            unset($validated['location_ids']);

            $variantGroupsData = $validated['variant_groups'] ?? [];
            unset($validated['variant_groups']);

            $product->update($validated);

            // Sync locations
            $product->locations()->sync($locationIds);

            // Process variants (delete & recreate — safe because order_items stores snapshot)
            if ($request->has('variant_groups')) {
                $product->variantGroups()->each(function ($group) {
                    $group->options()->delete();
                    $group->delete();
                });

                foreach ($variantGroupsData as $groupData) {
                    if (!is_array($groupData)) continue;

                    $group = $product->variantGroups()->create([
                        'name' => $groupData['name'],
                        'type' => $groupData['type'],
                        'min_selection' => $groupData['min_selection'] ?? 0,
                        'max_selection' => $groupData['max_selection'] ?? 1,
                        'is_required' => $groupData['is_required'] ?? false,
                        'sort_order' => $groupData['sort_order'] ?? 0,
                    ]);

                    if (isset($groupData['options']) && is_array($groupData['options'])) {
                        foreach ($groupData['options'] as $optionData) {
                            if (!is_array($optionData)) continue;
                            $group->options()->create([
                                'name' => $optionData['name'],
                                'price_adjustment' => $optionData['price_adjustment'] ?? 0,
                                'is_available' => $optionData['is_available'] ?? true,
                                'sort_order' => $optionData['sort_order'] ?? 0,
                            ]);
                        }
                    }
                }
            }

            DB::commit();

            return redirect()->route('tenant.admin.products.index', $tenant->slug)
                ->with('success', 'Producto actualizado correctamente.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->withErrors(['image' => 'Error al actualizar el producto. Intenta de nuevo.'])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($tenantRaw, Product $product): RedirectResponse
    {
        Gate::authorize('products.delete');

        $tenant = app('currentTenant');

        // IDOR: verify product belongs to this tenant
        if ((int) $product->tenant_id !== (int) $tenant->id) {
            abort(403, 'No tienes permiso para eliminar este producto.');
        }

        $disk = $product->storage_disk ?? 'bunny';

        DB::beginTransaction();
        try {
            // Delete main image
            if ($product->image && str_contains($product->image, 'products/')) {
                Storage::disk($disk)->delete($product->image);
            }

            // Delete gallery images
            if ($product->gallery) {
                foreach ($product->gallery as $path) {
                    if (str_contains($path, 'gallery/')) {
                        Storage::disk($disk)->delete($path);
                    }
                }
            }

            // Detach locations (pivot table cleaned by cascade, but being explicit)
            $product->locations()->detach();

            // Delete variant groups & options
            $product->variantGroups()->each(function ($group) {
                $group->options()->delete();
                $group->delete();
            });

            $product->delete();

            DB::commit();

            return redirect()->route('tenant.admin.products.index', $tenant->slug)
                ->with('success', 'Producto eliminado correctamente.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al eliminar el producto.']);
        }
    }

    /**
     * Toggle product availability (dedicated endpoint).
     */
    public function toggleAvailability(Request $request, $tenantRaw, Product $product): RedirectResponse
    {
        Gate::authorize('products.update');

        $tenant = app('currentTenant');

        // IDOR
        if ((int) $product->tenant_id !== (int) $tenant->id) {
            abort(403, 'No tienes permiso.');
        }

        $product->update([
            'is_available' => !$product->is_available,
        ]);

        return back()->with('success', $product->is_available ? 'Producto disponible.' : 'Producto marcado como agotado.');
    }

    /**
     * Register media file in the unified media library.
     */
    private function registerMedia(string $path, string $disk = 'bunny', int $tenantId = 0, string $folder = 'products'): void
    {
        if (!$path) return;

        try {
            $storage = Storage::disk($disk);
            if (!$storage->exists($path)) return;

            \App\Models\Tenant\MediaFile::firstOrCreate(
                ['path' => $path],
                [
                    'tenant_id' => $tenantId,
                    'name' => basename($path),
                    'disk' => $disk,
                    'mime_type' => $storage->mimeType($path),
                    'size' => $storage->size($path),
                    'extension' => pathinfo($path, PATHINFO_EXTENSION),
                    'type' => 'image',
                    'folder' => $folder,
                    'uploaded_by' => auth()->id(),
                    'url' => $storage->url($path),
                    'is_public' => true,
                ]
            );
        } catch (\Throwable $e) {
            // Non-critical, log silently
        }
    }
}
