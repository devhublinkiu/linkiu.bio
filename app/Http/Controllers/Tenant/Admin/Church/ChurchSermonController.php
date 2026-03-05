<?php

namespace App\Http\Controllers\Tenant\Admin\Church;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Church\ChurchSermon;
use App\Models\Tenant\Church\ChurchYoutubeConfig;
use App\Services\Church\YouTubeSermonSyncService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ChurchSermonController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('sermons.view');

        $sermons = ChurchSermon::orderByRaw("CASE status WHEN 'live' THEN 0 WHEN 'upcoming' THEN 1 ELSE 2 END")
            ->orderBy('live_start_at')
            ->orderBy('published_at', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(15)
            ->through(function (ChurchSermon $s) {
                return [
                    'id' => $s->id,
                    'youtube_video_id' => $s->youtube_video_id,
                    'title' => $s->title,
                    'published_at' => $s->published_at?->toDateString(),
                    'thumbnail_url' => $s->thumbnail_url,
                    'formatted_duration' => $s->formatted_duration,
                    'status' => $s->status,
                    'live_start_at' => $s->live_start_at?->toIso8601String(),
                    'watch_url' => $s->watch_url,
                ];
            });

        $config = ChurchYoutubeConfig::firstOrCreate(
            ['tenant_id' => app('currentTenant')->id],
            ['youtube_channel_id' => null]
        );

        return Inertia::render('Tenant/Admin/Sermons/Index', [
            'sermons' => $sermons,
            'youtube_config' => [
                'youtube_channel_id' => $config->youtube_channel_id,
                'last_synced_at' => $config->last_synced_at?->toIso8601String(),
            ],
        ]);
    }

    public function config(Request $request)
    {
        Gate::authorize('sermons.update');

        $config = ChurchYoutubeConfig::firstOrCreate(
            ['tenant_id' => app('currentTenant')->id],
            ['youtube_channel_id' => null]
        );

        return Inertia::render('Tenant/Admin/Sermons/Config', [
            'youtube_config' => [
                'youtube_channel_id' => $config->youtube_channel_id,
                'last_synced_at' => $config->last_synced_at?->toIso8601String(),
            ],
        ]);
    }

    public function updateConfig(Request $request)
    {
        Gate::authorize('sermons.update');

        $validated = $request->validate([
            'youtube_channel_id' => 'nullable|string|max:255',
        ]);

        $config = ChurchYoutubeConfig::firstOrCreate(
            ['tenant_id' => app('currentTenant')->id],
            ['youtube_channel_id' => null]
        );

        $channelId = $validated['youtube_channel_id'] ?? null;
        if (is_string($channelId)) {
            $channelId = trim($channelId);
            if ($channelId === '') {
                $channelId = null;
            }
        }
        $config->update(['youtube_channel_id' => $channelId]);

        return redirect()
            ->route('tenant.admin.sermons.index', ['tenant' => $request->route('tenant')])
            ->with('success', 'Canal de YouTube guardado.');
    }

    public function sync(Request $request)
    {
        Gate::authorize('sermons.update');

        $config = ChurchYoutubeConfig::firstOrCreate(
            ['tenant_id' => app('currentTenant')->id],
            ['youtube_channel_id' => null]
        );

        $result = app(YouTubeSermonSyncService::class)->sync($config);

        if ($result['success']) {
            return back()->with('success', $result['message']);
        }

        throw ValidationException::withMessages(['sync' => $result['message']]);
    }

    /**
     * Actualizar estado y fecha de transmisión de una predica (programar en vivo / próxima).
     */
    public function update(Request $request, ChurchSermon $sermon)
    {
        Gate::authorize('sermons.update');

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:live,upcoming,completed'],
            'live_start_at' => ['nullable', 'date'],
        ]);

        $sermon->status = $validated['status'];
        $sermon->live_start_at = isset($validated['live_start_at']) ? $validated['live_start_at'] : null;
        $sermon->save();

        return back()->with('success', 'Predica actualizada.');
    }
}
