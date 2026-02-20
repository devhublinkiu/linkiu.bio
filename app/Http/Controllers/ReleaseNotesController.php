<?php

namespace App\Http\Controllers;

use App\Models\ReleaseNote;
use App\Models\ReleaseNoteCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ReleaseNotesController extends Controller
{
    /**
     * Listado público: categorías + releases publicados.
     * Devuelve la misma estructura que espera ReleaseNotes/Index (sin tocar la vista).
     */
    public function index(Request $request)
    {
        $dbCategories = ReleaseNoteCategory::orderBy('sort_order')->orderBy('name')->get();

        $categories = collect([
            ['id' => 'all', 'name' => 'Todas las publicaciones'],
        ])->merge(
            $dbCategories->map(fn ($c) => ['id' => (string) $c->id, 'name' => $c->name])
        )->values()->all();

        $releases = ReleaseNote::with('releaseNoteCategory')
            ->published()
            ->orderByDesc('published_at')
            ->get()
            ->map(function (ReleaseNote $r) {
                $coverUrl = null;
                if ($r->cover_path) {
                    $coverUrl = Storage::disk('bunny')->exists($r->cover_path)
                        ? Storage::disk('bunny')->url($r->cover_path)
                        : null;
                }

                return [
                    'id' => (string) $r->id,
                    'slug' => $r->slug,
                    'category_id' => (string) $r->release_note_category_id,
                    'type' => $r->type,
                    'date' => $r->published_at?->format('Y-m-d') ?? $r->created_at->format('Y-m-d'),
                    'title' => $r->title,
                    'snippet' => $r->snippet ?? '',
                    'cover_url' => $coverUrl,
                ];
            })
            ->values()
            ->all();

        return Inertia::render('ReleaseNotes/Index', [
            'categories' => $categories,
            'releases' => $releases,
        ]);
    }

    /**
     * Vista pública individual de un release note (por slug).
     */
    public function show(string $slug)
    {
        $release = ReleaseNote::with('releaseNoteCategory')
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        $coverUrl = null;
        if ($release->cover_path && Storage::disk('bunny')->exists($release->cover_path)) {
            $coverUrl = Storage::disk('bunny')->url($release->cover_path);
        }

        $heroUrl = null;
        if ($release->hero_path && Storage::disk('bunny')->exists($release->hero_path)) {
            $heroUrl = Storage::disk('bunny')->url($release->hero_path);
        }

        return Inertia::render('ReleaseNotes/Show', [
            'release' => [
                'id' => (string) $release->id,
                'slug' => $release->slug,
                'title' => $release->title,
                'type' => $release->type,
                'date' => $release->published_at?->format('Y-m-d') ?? $release->created_at->format('Y-m-d'),
                'category_name' => $release->releaseNoteCategory?->name ?? '',
                'snippet' => $release->snippet ?? '',
                'body' => $release->body ?? '',
                'cover_url' => $coverUrl,
                'hero_url' => $heroUrl,
            ],
        ]);
    }
}
