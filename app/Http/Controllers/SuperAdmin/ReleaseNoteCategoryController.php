<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ReleaseNoteCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ReleaseNoteCategoryController extends Controller
{
    public function index()
    {
        $categories = ReleaseNoteCategory::orderBy('sort_order')->orderBy('name')->get();

        return Inertia::render('SuperAdmin/ReleaseNoteCategories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('SuperAdmin/ReleaseNoteCategories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'sort_order' => 'integer|min:0',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        ReleaseNoteCategory::create($validated);

        return redirect()->route('release-note-categories.index')->with('success', 'Categoría creada correctamente.');
    }

    public function edit(ReleaseNoteCategory $release_note_category)
    {
        return Inertia::render('SuperAdmin/ReleaseNoteCategories/Edit', [
            'category' => $release_note_category,
        ]);
    }

    public function update(Request $request, ReleaseNoteCategory $release_note_category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'sort_order' => 'integer|min:0',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $release_note_category->update($validated);

        return redirect()->route('release-note-categories.index')->with('success', 'Categoría actualizada correctamente.');
    }

    public function destroy(ReleaseNoteCategory $release_note_category)
    {
        if ($release_note_category->releaseNotes()->exists()) {
            return redirect()->back()->with('error', 'No se puede eliminar: tiene release notes asociados.');
        }

        $release_note_category->delete();

        return redirect()->back()->with('success', 'Categoría eliminada correctamente.');
    }
}
