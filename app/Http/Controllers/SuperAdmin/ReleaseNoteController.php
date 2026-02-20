<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ReleaseNote;
use App\Models\ReleaseNoteCategory;
use App\Traits\StoresImageAsWebp;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ReleaseNoteController extends Controller
{
    use StoresImageAsWebp;

    public function index(Request $request)
    {
        $releases = ReleaseNote::with('releaseNoteCategory')
            ->when($request->search, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->when($request->category_id, fn ($q, $id) => $q->where('release_note_category_id', $id))
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        foreach ($releases as $r) {
            $r->cover_url = $r->cover_path && Storage::disk('bunny')->exists($r->cover_path)
                ? Storage::disk('bunny')->url($r->cover_path)
                : null;
        }

        return Inertia::render('SuperAdmin/ReleaseNotes/Index', [
            'releases' => $releases,
            'categories' => ReleaseNoteCategory::orderBy('sort_order')->orderBy('name')->get(),
            'filters' => $request->only(['search', 'category_id']),
        ]);
    }

    /**
     * Subir una imagen para insertar en el cuerpo del release note (editor rico).
     * Devuelve JSON con la URL de la imagen.
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $path = $this->storeImageAsWebp(
            $request->file('image'),
            'uploads/superadmin/release-notes/body',
            'bunny',
            1920,
            85
        );

        $url = Storage::disk('bunny')->url($path);

        return response()->json(['url' => $url]);
    }

    public function create()
    {
        $categories = ReleaseNoteCategory::orderBy('sort_order')->orderBy('name')->get();
        if ($categories->isEmpty()) {
            return redirect()->route('release-notes.index')
                ->with('info', 'Crea al menos una categoría antes de crear un release note.');
        }

        return Inertia::render('SuperAdmin/ReleaseNotes/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'release_note_category_id' => 'required|exists:release_note_categories,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'type' => 'required|string|in:new,fix,improvement,security,performance',
            'icon_name' => 'nullable|string|max:100',
            'cover_path' => 'nullable|string',
            'hero_path' => 'nullable|string',
            'cover' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'snippet' => 'nullable|string',
            'body' => 'nullable|string',
            'published_at' => 'nullable|date',
            'status' => 'required|string|in:draft,published',
            'is_featured' => 'boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(4);
        }
        $validated['slug'] = $this->ensureUniqueSlug($validated['slug']);

        if ($request->hasFile('cover')) {
            $validated['cover_path'] = $this->storeImageAsWebp($request->file('cover'), 'uploads/superadmin/release-notes', 'bunny', 1200, 85);
        }
        unset($validated['cover']);

        $validated['icon_name'] = ($validated['icon_name'] ?? '') === '' ? null : $validated['icon_name'];

        ReleaseNote::create($validated);

        return redirect()->route('release-notes.index')->with('success', 'Release note creado correctamente.');
    }

    public function edit(ReleaseNote $release_note)
    {
        $release_note->cover_url = $release_note->cover_path && Storage::disk('bunny')->exists($release_note->cover_path)
            ? Storage::disk('bunny')->url($release_note->cover_path)
            : null;

        return Inertia::render('SuperAdmin/ReleaseNotes/Edit', [
            'release' => $release_note,
            'categories' => ReleaseNoteCategory::orderBy('sort_order')->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, ReleaseNote $release_note)
    {
        $validated = $request->validate([
            'release_note_category_id' => 'required|exists:release_note_categories,id',
            'title' => 'required|string|max:255',
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('release_notes')->ignore($release_note->id)],
            'type' => 'required|string|in:new,fix,improvement,security,performance',
            'icon_name' => 'nullable|string|max:100',
            'cover_path' => 'nullable|string',
            'hero_path' => 'nullable|string',
            'cover' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'snippet' => 'nullable|string',
            'body' => 'nullable|string',
            'published_at' => 'nullable|date',
            'status' => 'required|string|in:draft,published',
            'is_featured' => 'boolean',
        ]);

        if (!empty($validated['slug'])) {
            $validated['slug'] = $this->ensureUniqueSlug($validated['slug'], $release_note->id);
        }

        if ($request->has('cover_path') && $request->cover_path) {
            $validated['cover_path'] = $request->cover_path;
        } elseif ($request->hasFile('cover')) {
            if ($release_note->cover_path && Storage::disk('bunny')->exists($release_note->cover_path)) {
                Storage::disk('bunny')->delete($release_note->cover_path);
            }
            $validated['cover_path'] = $this->storeImageAsWebp($request->file('cover'), 'uploads/superadmin/release-notes', 'bunny', 1200, 85);
        }
        unset($validated['cover']);

        $validated['icon_name'] = ($validated['icon_name'] ?? '') === '' ? null : $validated['icon_name'];

        $release_note->update($validated);

        return redirect()->route('release-notes.index')->with('success', 'Release note actualizado correctamente.');
    }

    public function destroy(ReleaseNote $release_note)
    {
        if ($release_note->cover_path && Storage::disk('bunny')->exists($release_note->cover_path)) {
            Storage::disk('bunny')->delete($release_note->cover_path);
        }
        $release_note->delete();

        return redirect()->back()->with('success', 'Release note eliminado correctamente.');
    }

    private function ensureUniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $base = $slug;
        $n = 0;
        while (true) {
            $q = ReleaseNote::where('slug', $slug);
            if ($ignoreId) {
                $q->where('id', '!=', $ignoreId);
            }
            if (!$q->exists()) {
                return $slug;
            }
            $n++;
            $slug = $base . '-' . $n;
        }
    }

}
