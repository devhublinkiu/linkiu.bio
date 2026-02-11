<?php

namespace App\Http\Controllers\Tenant\Admin\Gastronomy;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Http\Requests\Tenant\Admin\StoreProductRequest;
use App\Http\Requests\Tenant\Admin\UpdateProductRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductController extends Controller
{
    protected $imageManager;

    // Constructor removed to avoid eager loading of Image Driver

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tenant = app('currentTenant');

        $products = Product::where('tenant_id', $tenant->id)
            ->with(['category', 'variantGroups.options'])
            ->orderBy('sort_order')
            ->latest()
            ->paginate(20);

        $categories = Category::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Tenant/Admin/Gastronomy/Products/Index', [
            'products' => $products,
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $tenant = app('currentTenant');
        $categories = Category::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Tenant/Admin/Gastronomy/Products/Create', [
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($tenantRaw, Product $product)
    {
        $tenant = app('currentTenant');
        $categories = Category::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->get();

        $product->load('variantGroups.options');

        return Inertia::render('Tenant/Admin/Gastronomy/Products/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $tenant = app('currentTenant');
        $validated = $request->validated();

        // 1. Generate Slug
        $slug = Str::slug($validated['name']);
        $count = Product::where('tenant_id', $tenant->id)->where('slug', 'like', $slug . '%')->count();
        if ($count > 0) {
            $slug = $slug . '-' . ($count + 1);
        }
        $validated['slug'] = $slug;
        $validated['tenant_id'] = $tenant->id;

        // 2. Process Main Image (800x800 Square)
        if ($request->hasFile('image_file')) {
            $validated['image'] = $this->processAndStoreImage($request->file('image_file'), $tenant->id);
        }
        elseif ($request->input('image')) {
            // Picked from Media Manager (URL/Path)
            $validated['image'] = $this->processAndStoreImage($request->input('image'), $tenant->id);
        }

        // 3. Process Gallery (Optional)
        $galleryPaths = [];
        if ($request->hasFile('gallery_files')) {
            foreach ($request->file('gallery_files') as $file) {
                $galleryPaths[] = $this->processAndStoreImage($file, $tenant->id, 'gallery');
            }
        }

        if ($request->input('gallery')) {
            foreach ($request->input('gallery') as $path) {
                // If it's already a path from our storage, we might still want to process it to ensure it's square
                $galleryPaths[] = $this->processAndStoreImage($path, $tenant->id, 'gallery');
            }
        }
        $validated['gallery'] = $galleryPaths;

        $product = Product::create($validated);

        // 4. Process Variants
        if ($request->has('variant_groups')) {
            foreach ($request->input('variant_groups', []) as $groupData) {
                // Ensure array data for creation (sometimes frontend sends objects with index keys)
                if (!is_array($groupData))
                    continue;

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
                        if (!is_array($optionData))
                            continue;
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

        return redirect()->route('tenant.admin.products.index', $tenant->slug)
            ->with('success', 'Producto creado correctamente.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, $tenantRaw, Product $product)
    {
        $tenant = app('currentTenant');
        $validated = $request->validated();

        // 1. Update Slug if name changed
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

        // 2. Process Main Image if updated
        if ($request->hasFile('image_file')) {
            // Delete old if it was a custom product image
            if ($product->image && str_contains($product->image, 'products/')) {
                Storage::disk('s3')->delete($product->image);
            }
            $validated['image'] = $this->processAndStoreImage($request->file('image_file'), $tenant->id);
        }
        elseif ($request->input('image') && $request->input('image') !== $product->image) {
            // New path from Media Manager
            if ($product->image && str_contains($product->image, 'products/')) {
                Storage::disk('s3')->delete($product->image);
            }
            $validated['image'] = $this->processAndStoreImage($request->input('image'), $tenant->id);
        }

        // 3. Process Gallery if updated
        if ($request->hasFile('gallery_files') || $request->has('gallery')) {
            $newGalleryPaths = [];
            $keptPaths = $request->input('gallery', []);

            // Clean paths (remove /media/ prefix if present to match DB/S3)
            $keptPathsClean = array_map(function ($path) {
                return str_replace('/media/', '', $path);
            }, $keptPaths);

            // Calculate paths to delete (Present in DB but NOT in Request)
            if ($product->gallery) {
                foreach ($product->gallery as $oldPath) {
                    if (str_contains($oldPath, 'gallery/') && !in_array($oldPath, $keptPathsClean)) {
                        Storage::disk('s3')->delete($oldPath);
                    }
                }
            }

            // Process Kept Paths (should just be re-added)
            foreach ($keptPathsClean as $path) {
                // Optimization: if it's already an uploaded file in our system, just keep it. 
                // If we re-process it, we generate a new file, which is fine, but deleting the source first was the bug.
                // Here we simply assume if it exists on S3, we keep it. 
                // But wait, processAndStoreImage generates a new file. 
                // If we pass an existing S3 path to processAndStoreImage, it reads it and writes a NEW file.
                // Ideally we shouldn't re-process if we don't need to.
                if (Storage::disk('s3')->exists($path)) {
                    $newGalleryPaths[] = $path;
                }
                else {
                    // Try to process (maybe it's a URL or something)
                    $newGalleryPaths[] = $this->processAndStoreImage($path, $tenant->id, 'gallery');
                }
            }

            // Process New Files
            if ($request->hasFile('gallery_files')) {
                foreach ($request->file('gallery_files') as $file) {
                    $newGalleryPaths[] = $this->processAndStoreImage($file, $tenant->id, 'gallery');
                }
            }

            $validated['gallery'] = $newGalleryPaths;
        }

        $product->update($validated);

        // 4. Process Variants (Sync)
        if ($request->has('variant_groups')) {
            // Delete existing variants and recreate
            $product->variantGroups()->delete();

            foreach ($request->input('variant_groups', []) as $groupData) {
                if (!is_array($groupData))
                    continue;

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
                        if (!is_array($optionData))
                            continue;
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

        return redirect()->route('tenant.admin.products.index', $tenant->slug)
            ->with('success', 'Producto actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($tenantRaw, Product $product)
    {
        $tenant = app('currentTenant');

        // Delete Main Image only if it's a generated one for this product
        if ($product->image && str_contains($product->image, 'products/')) {
            Storage::disk('s3')->delete($product->image);
        }

        // Delete Gallery
        if ($product->gallery) {
            foreach ($product->gallery as $path) {
                if (str_contains($path, 'gallery/')) {
                    Storage::disk('s3')->delete($path);
                }
            }
        }

        $product->delete();

        return redirect()->route('tenant.admin.products.index', $tenant->slug)
            ->with('success', 'Producto eliminado correctamente.');
    }

    /**
     * Internal helper to process image (resize to 800x800 square) and store in S3.
     * Supports both UploadedFile and existing Path/URL.
     */
    private function processAndStoreImage($input, $tenantId, $folder = 'products')
    {
        // 1. Get Image Content
        if ($input instanceof \Illuminate\Http\UploadedFile) {
            $imageContent = $input;
        }
        else {
            // It's a path or URL. Remove /media/ prefix if present
            $path = str_replace('/media/', '', $input);
            // Also handle full URLs if any
            if (str_starts_with($path, 'http')) {
                $imageContent = file_get_contents($path);
            }
            else {
                if (!Storage::disk('s3')->exists($path)) {
                    return $path; // Return original if not found
                }
                $imageContent = Storage::disk('s3')->get($path);
            }
        }

        // 2. Prepare Path
        $filename = Str::random(40) . '.webp';
        $destinationPath = "uploads/{$tenantId}/{$folder}/{$filename}";

        // 3. Process
        try {
            $manager = new ImageManager(new Driver());
            $image = $manager->read($imageContent);
            $image->cover(800, 800);
            $encoded = $image->toWebp(85);

            Storage::disk('s3')->put($destinationPath, (string)$encoded);

            // 4. Register in Media Library (Unified Visibility)
            \App\Models\MediaFile::firstOrCreate(
            ['path' => $destinationPath],
            [
                'tenant_id' => $tenantId,
                'name' => basename($destinationPath),
                'disk' => 's3',
                'mime_type' => 'image/webp',
                'size' => strlen((string)$encoded),
                'extension' => 'webp',
                'type' => 'image',
                'folder' => $folder,
                'uploaded_by' => auth()->id(),
                'url' => Storage::disk('s3')->url($destinationPath),
                'is_public' => true,
            ]
            );

            return $destinationPath;
        }
        catch (\Exception $e) {
            // Fallback to original path if processing fails
            $path = is_string($input) ? $input : $input->store("uploads/{$tenantId}/{$folder}", 's3');

            // Even on fallback, try to register if it's a new upload
            if ($input instanceof \Illuminate\Http\UploadedFile) {
                \App\Models\MediaFile::firstOrCreate(
                ['path' => $path],
                [
                    'tenant_id' => $tenantId,
                    'name' => $input->getClientOriginalName(),
                    'disk' => 's3',
                    'mime_type' => $input->getMimeType(),
                    'size' => $input->getSize(),
                    'extension' => $input->getClientOriginalExtension(),
                    'type' => 'image',
                    'folder' => $folder,
                    'uploaded_by' => auth()->id(),
                    'url' => Storage::disk('s3')->url($path),
                    'is_public' => true,
                ]
                );
            }

            return $path;
        }
    }
}
