<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\BusinessCategory;
use App\Models\Vertical;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BusinessCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = BusinessCategory::withCount('tenants')->with('vertical');

        // Search Filter
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Vertical Filter
        if ($request->filled('vertical_id')) {
            $query->where('vertical_id', $request->vertical_id);
        }

        return Inertia::render('SuperAdmin/Categories/Index', [
            'categories' => $query->latest()->get(),
            'verticals' => Vertical::all(),
            'filters' => $request->only(['search', 'vertical_id']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'vertical_id' => 'required|exists:verticals,id',
            'require_verification' => 'boolean',
        ]);

        BusinessCategory::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'vertical_id' => $request->vertical_id,
            'require_verification' => $request->require_verification ?? false,
        ]);

        return redirect()->back()->with('success', 'Categoría creada exitosamente.');
    }

    public function update(Request $request, BusinessCategory $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'vertical_id' => 'required|exists:verticals,id',
            'require_verification' => 'boolean',
        ]);

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'vertical_id' => $request->vertical_id,
            'require_verification' => $request->require_verification ?? false,
        ]);

        return redirect()->back()->with('success', 'Categoría actualizada.');
    }

    public function destroy(BusinessCategory $category)
    {
        if ($category->tenants()->exists()) {
            return redirect()->back()->with('error', 'No se puede eliminar la categoría porque tiene tiendas asociadas.');
        }

        $category->delete();

        return redirect()->back()->with('success', 'Categoría eliminada correctamente.');
    }
}
