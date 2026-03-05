<?php

namespace App\Http\Controllers\Tenant\Admin\Church;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\Church\StoreChurchAudioEpisodeRequest;
use App\Http\Requests\Tenant\Admin\Church\UpdateChurchAudioEpisodeRequest;
use App\Models\Tenant\Church\ChurchAudioConfig;
use App\Models\Tenant\Church\ChurchAudioEpisode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChurchAudioEpisodeController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('audio_dosis.view');

        $tenant = app('currentTenant');
        $config = ChurchAudioConfig::firstOrCreate(
            ['tenant_id' => $tenant->id],
            ['page_title' => 'Audio Dosis']
        );

        $episodes = ChurchAudioEpisode::select([
            'id', 'title', 'audio_path', 'duration_seconds', 'sort_order', 'is_published', 'created_at',
        ])
            ->orderBy('sort_order', 'desc')
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(15);

        return Inertia::render('Tenant/Admin/AudioDosis/Index', [
            'config' => ['page_title' => $config->page_title],
            'episodes' => $episodes,
        ]);
    }

    public function updateConfig(Request $request, string $tenant)
    {
        Gate::authorize('audio_dosis.update');

        $request->validate(['page_title' => 'required|string|max:255']);

        $tenantModel = app('currentTenant');
        $config = ChurchAudioConfig::firstOrCreate(
            ['tenant_id' => $tenantModel->id],
            ['page_title' => 'Audio Dosis']
        );
        $config->update(['page_title' => $request->input('page_title')]);

        return back()->with('success', 'Título guardado.');
    }

    public function create()
    {
        Gate::authorize('audio_dosis.create');

        return Inertia::render('Tenant/Admin/AudioDosis/Create');
    }

    public function store(StoreChurchAudioEpisodeRequest $request, string $tenant)
    {
        Gate::authorize('audio_dosis.create');

        $tenantModel = app('currentTenant');
        $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenantModel->slug ?? ''));
        $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenantModel->id) . '/church-audio';

        $path = $request->file('audio_file')->store($basePath, 'bunny');

        ChurchAudioEpisode::create([
            'tenant_id' => $tenantModel->id,
            'title' => $request->input('title'),
            'audio_path' => $path,
            'duration_seconds' => (int) $request->input('duration_seconds', 0),
            'sort_order' => (int) $request->input('sort_order', 0),
            'is_published' => $request->boolean('is_published', true),
        ]);

        return redirect()
            ->route('tenant.admin.audio-dosis.index', ['tenant' => $tenant])
            ->with('success', 'Episodio creado correctamente');
    }

    public function edit(string $tenant, ChurchAudioEpisode $episode)
    {
        Gate::authorize('audio_dosis.update');

        return Inertia::render('Tenant/Admin/AudioDosis/Edit', [
            'episode' => $episode->only([
                'id', 'title', 'audio_path', 'duration_seconds', 'sort_order', 'is_published', 'created_at',
            ]),
        ]);
    }

    public function update(UpdateChurchAudioEpisodeRequest $request, string $tenant, ChurchAudioEpisode $episode)
    {
        Gate::authorize('audio_dosis.update');

        $validated = $request->validated();
        $tenantModel = app('currentTenant');
        $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenantModel->slug ?? ''));
        $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenantModel->id) . '/church-audio';

        if ($request->hasFile('audio_file')) {
            $path = $request->file('audio_file')->store($basePath, 'bunny');
            if ($episode->audio_path && Storage::disk('bunny')->exists($episode->audio_path)) {
                Storage::disk('bunny')->delete($episode->audio_path);
            }
            $episode->audio_path = $path;
        }

        $episode->title = $validated['title'];
        $episode->duration_seconds = (int) $validated['duration_seconds'];
        $episode->sort_order = (int) $validated['sort_order'];
        $episode->is_published = $request->boolean('is_published', true);
        $episode->save();

        return redirect()
            ->route('tenant.admin.audio-dosis.index', ['tenant' => $tenant])
            ->with('success', 'Episodio actualizado');
    }

    public function destroy(string $tenant, ChurchAudioEpisode $episode)
    {
        Gate::authorize('audio_dosis.delete');

        if ($episode->audio_path && Storage::disk('bunny')->exists($episode->audio_path)) {
            Storage::disk('bunny')->delete($episode->audio_path);
        }
        $episode->delete();

        return redirect()
            ->route('tenant.admin.audio-dosis.index', ['tenant' => $tenant])
            ->with('success', 'Episodio eliminado');
    }

    public function togglePublished(string $tenant, ChurchAudioEpisode $episode)
    {
        Gate::authorize('audio_dosis.update');

        $episode->update(['is_published' => !$episode->is_published]);

        return back()->with('success', $episode->is_published ? 'Episodio publicado' : 'Episodio despublicado');
    }
}
