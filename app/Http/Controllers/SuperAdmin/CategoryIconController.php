<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\BusinessCategory;
use App\Models\CategoryIcon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CategoryIconController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = CategoryIcon::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('vertical_id')) {
            $query->where('vertical_id', $request->vertical_id);
        }

        if ($request->has('business_category_id')) {
            $query->where('business_category_id', $request->business_category_id);
        }

        if ($request->has('is_global')) {
            if ($request->is_global === 'true' || $request->is_global === '1') {
                $query->where('is_global', true);
            }
        }

        $icons = $query->with(['vertical', 'businessCategory'])->latest()->paginate(20)->withQueryString();
        $verticals = \App\Models\Vertical::select('id', 'name')->get(); // Fetch Verticals specifically
        $businessCategories = BusinessCategory::select('id', 'name', 'vertical_id')->get(); // Fetch Business Categories

        return Inertia::render('SuperAdmin/Categories/Icons/Index', [
            'icons' => $icons,
            'verticals' => $verticals,
            'businessCategories' => $businessCategories,
            'filters' => $request->only(['search', 'vertical_id', 'business_category_id', 'is_global']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'required|image|max:2048', // Max 2MB
            'vertical_id' => 'nullable|exists:verticals,id',
            'business_category_id' => 'nullable|exists:business_categories,id',
            'is_global' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $path = $request->file('icon')->store('category-icons', 's3'); // Store in S3

        CategoryIcon::create([
            'name' => $request->name,
            'path' => $path,
            'vertical_id' => $request->boolean('is_global') ? null : $request->vertical_id,
            'business_category_id' => $request->boolean('is_global') ? null : $request->business_category_id,
            'is_global' => $request->boolean('is_global'),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Icono creado correctamente.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CategoryIcon $categoryIcon)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|image|max:2048',
            'vertical_id' => 'nullable|exists:verticals,id',
            'business_category_id' => 'nullable|exists:business_categories,id',
            'is_global' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $data = [
            'name' => $request->name,
            'vertical_id' => $request->boolean('is_global') ? null : $request->vertical_id,
            'business_category_id' => $request->boolean('is_global') ? null : $request->business_category_id,
            'is_global' => $request->boolean('is_global'),
            'is_active' => $request->boolean('is_active', true),
        ];

        if ($request->hasFile('icon')) {
            // Delete old
            if ($categoryIcon->path) {
                Storage::disk('s3')->delete($categoryIcon->path);
            }
            // Store new
            $data['path'] = $request->file('icon')->store('category-icons', 's3');
        }

        $categoryIcon->update($data);

        return back()->with('success', 'Icono actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CategoryIcon $categoryIcon)
    {
        if ($categoryIcon->categories()->count() > 0) {
            return back()->with('error', 'No se puede eliminar este icono porque está en uso por una o más categorías.');
        }

        Storage::disk('s3')->delete($categoryIcon->path);
        $categoryIcon->delete();

        return back()->with('success', 'Icono eliminado correctamente.');
    }
}
