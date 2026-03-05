<?php

namespace App\Http\Controllers\Tenant\Church;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Church\StoreChurchAppointmentRequest;
use App\Http\Requests\Tenant\Church\StoreChurchDonationRequest;
use App\Models\Tenant\All\Slider;
use App\Models\Tenant\All\Ticker;
use App\Models\Tenant\Church\ChurchAppointment;
use App\Models\Tenant\Church\ChurchAudioConfig;
use App\Models\Tenant\Church\ChurchAudioEpisode;
use App\Models\Tenant\Church\ChurchCollaborator;
use App\Models\Tenant\All\Short;
use App\Models\Tenant\Church\ChurchDevotional;
use App\Models\Tenant\Church\ChurchDevotionalReaction;
use App\Models\Tenant\Church\ChurchDonation;
use App\Models\Tenant\Church\ChurchService;
use App\Models\Tenant\Church\ChurchSermon;
use App\Models\Tenant\Church\ChurchTestimonial;
use App\Models\Tenant\Church\ChurchTestimonialReaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicController extends Controller
{
    /**
     * Vista pública de inicio (home) para vertical church.
     */
    public function index(Request $request)
    {
        $tenant = app('currentTenant');

        $sliders = Slider::visible()
            ->get(['id', 'name', 'image_path', 'image_path_desktop', 'storage_disk', 'link_type', 'external_url', 'linkable_type', 'linkable_id', 'sort_order']);

        $tickers = Ticker::select(['id', 'content', 'link', 'background_color', 'text_color', 'order'])
            ->where('is_active', true)
            ->orderBy('order', 'asc')
            ->get();

        $services = ChurchService::where('is_active', true)
            ->orderBy('order')
            ->orderBy('name')
            ->get(['id', 'name', 'description', 'schedule', 'service_type', 'image_url']);

        $devotionals = ChurchDevotional::where('is_published', true)
            ->orderBy('date', 'desc')
            ->orderBy('order')
            ->orderBy('id')
            ->limit(8)
            ->withCount([
                'reactions as blessing_count' => fn ($q) => $q->where('reaction_type', ChurchDevotionalReaction::TYPE_BLESSING),
                'reactions as prayer_count' => fn ($q) => $q->where('reaction_type', ChurchDevotionalReaction::TYPE_PRAYER),
            ])
            ->get(['id', 'title', 'scripture_reference', 'date', 'cover_image', 'excerpt', 'share_count']);

        $promoShorts = Short::where('is_active', true)
            ->whereNotNull('short_video_id')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(function (Short $short) use ($tenant) {
                $actionUrl = $short->external_url ?? route('tenant.public.shorts', ['tenant' => $tenant->slug]);
                return [
                    'id' => $short->id,
                    'name' => $short->name,
                    'description' => $short->description ?? '',
                    'short_embed_url' => $short->short_embed_url,
                    'link_type' => $short->link_type,
                    'action_url' => $actionUrl,
                ];
            })
            ->filter(fn ($s) => !empty($s['short_embed_url']))
            ->values()
            ->all();

        $collaborators = ChurchCollaborator::where('is_published', true)
            ->orderBy('order')
            ->orderBy('name')
            ->limit(6)
            ->get(['id', 'name', 'role', 'photo', 'bio', 'email', 'phone', 'whatsapp']);

        $audioConfig = ChurchAudioConfig::firstOrCreate(
            ['tenant_id' => $tenant->id],
            ['page_title' => 'Audio Dosis']
        );
        $podcastEpisodeOfTheDay = ChurchAudioEpisode::where('is_published', true)
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->first();
        $podcastEpisodeOfTheDayArray = $podcastEpisodeOfTheDay ? [
            'id' => $podcastEpisodeOfTheDay->id,
            'title' => $podcastEpisodeOfTheDay->title,
            'audio_url' => $podcastEpisodeOfTheDay->audio_url,
            'formatted_duration' => $podcastEpisodeOfTheDay->formatted_duration,
            'created_at' => $podcastEpisodeOfTheDay->created_at?->toIso8601String(),
        ] : null;

        $sermonsLive = ChurchSermon::where('status', ChurchSermon::STATUS_LIVE)
            ->orderBy('live_start_at')
            ->limit(3)
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'youtube_video_id' => $s->youtube_video_id,
                'title' => $s->title,
                'thumbnail_url' => $s->thumbnail_url,
                'status' => $s->status,
                'live_start_at' => $s->live_start_at?->toIso8601String(),
                'embed_url' => $s->embed_url,
                'watch_url' => $s->watch_url,
            ])
            ->values()
            ->all();
        $sermonsUpcoming = ChurchSermon::where('status', ChurchSermon::STATUS_UPCOMING)
            ->orderByRaw('live_start_at IS NULL, live_start_at ASC')
            ->limit(3)
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'youtube_video_id' => $s->youtube_video_id,
                'title' => $s->title,
                'thumbnail_url' => $s->thumbnail_url,
                'status' => $s->status,
                'live_start_at' => $s->live_start_at?->toIso8601String(),
                'embed_url' => $s->embed_url,
                'watch_url' => $s->watch_url,
            ])
            ->values()
            ->all();

        $testimonialsForHome = $this->getTestimonialsForPublic(6);

        return Inertia::render('Tenant/Church/Public/Home', [
            'tenant' => $tenant,
            'sliders' => $sliders,
            'tickers' => $tickers,
            'services' => $services,
            'devotionals' => $devotionals,
            'promo_shorts' => $promoShorts,
            'collaborators' => $collaborators,
            'podcast_page_title' => $audioConfig->page_title,
            'podcast_episode_of_the_day' => $podcastEpisodeOfTheDayArray,
            'sermons_live' => $sermonsLive,
            'sermons_upcoming' => $sermonsUpcoming,
            'testimonials' => $testimonialsForHome,
        ]);
    }

    /**
     * Vista pública "Nuestro equipo" (listado de colaboradores).
     */
    public function team(Request $request)
    {
        $tenant = app('currentTenant');

        $collaborators = ChurchCollaborator::where('is_published', true)
            ->orderBy('order')
            ->orderBy('name')
            ->get(['id', 'name', 'role', 'photo', 'bio', 'email', 'phone', 'whatsapp']);

        return Inertia::render('Tenant/Church/Public/Team/Index', [
            'tenant' => $tenant,
            'collaborators' => $collaborators,
        ]);
    }

    /**
     * Vista pública detalle de un colaborador.
     */
    public function teamShow(string $tenant, ChurchCollaborator $collaborator)
    {
        $tenantModel = app('currentTenant');
        if ($collaborator->tenant_id !== $tenantModel->id || !$collaborator->is_published) {
            abort(404);
        }
        return Inertia::render('Tenant/Church/Public/Team/Show', [
            'tenant' => $tenantModel,
            'collaborator' => $collaborator->only([
                'id', 'name', 'role', 'photo', 'bio', 'email', 'phone', 'whatsapp',
            ]),
        ]);
    }

    /**
     * Vista pública Podcast / Audio Dosis (episodios en audio).
     */
    public function podcast(Request $request)
    {
        $tenant = app('currentTenant');
        $config = ChurchAudioConfig::firstOrCreate(
            ['tenant_id' => $tenant->id],
            ['page_title' => 'Audio Dosis']
        );

        // Más reciente = último subido (created_at desc). Al subir uno nuevo, el anterior pasa al listado.
        $baseQuery = ChurchAudioEpisode::where('is_published', true)
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc');

        $episodeOfTheDay = (clone $baseQuery)->first();
        $episodeOfTheDayArray = $episodeOfTheDay ? [
            'id' => $episodeOfTheDay->id,
            'title' => $episodeOfTheDay->title,
            'audio_url' => $episodeOfTheDay->audio_url,
            'formatted_duration' => $episodeOfTheDay->formatted_duration,
            'created_at' => $episodeOfTheDay->created_at?->toIso8601String(),
        ] : null;

        $episodes = (clone $baseQuery)
            ->when($episodeOfTheDay, fn ($q) => $q->where('id', '!=', $episodeOfTheDay->id))
            ->paginate(12)
            ->through(fn (ChurchAudioEpisode $e) => [
                'id' => $e->id,
                'title' => $e->title,
                'audio_url' => $e->audio_url,
                'formatted_duration' => $e->formatted_duration,
                'created_at' => $e->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Tenant/Church/Public/Podcast/Index', [
            'tenant' => $tenant,
            'pageTitle' => $config->page_title,
            'episodeOfTheDay' => $episodeOfTheDayArray,
            'episodes' => $episodes,
        ]);
    }

    /**
     * Vista pública de predicas: en vivo, próximas y archivadas por fecha.
     */
    public function sermons(Request $request)
    {
        $tenant = app('currentTenant');

        $live = ChurchSermon::where('status', ChurchSermon::STATUS_LIVE)
            ->orderBy('live_start_at')
            ->get()
            ->map(fn ($s) => $this->sermonToPublicArray($s));

        $upcoming = ChurchSermon::where('status', ChurchSermon::STATUS_UPCOMING)
            ->orderByRaw('live_start_at IS NULL, live_start_at ASC')
            ->get()
            ->map(fn ($s) => $this->sermonToPublicArray($s));

        $completed = ChurchSermon::where('status', ChurchSermon::STATUS_COMPLETED)
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get();

        $byDate = $completed->groupBy(fn ($s) => $s->published_at?->format('Y-m') ?? 'sin-fecha');
        $sermonsByDate = collect();
        $keys = $byDate->keys()->sortDesc()->values();
        foreach ($keys as $yearMonth) {
            $items = $byDate->get($yearMonth);
            $first = $items->first();
            $label = $first && $first->published_at
                ? $first->published_at->locale('es')->translatedFormat('F Y')
                : $yearMonth;
            $sermonsByDate->push([
                'key' => $yearMonth,
                'label' => ucfirst($label),
                'sermons' => $items->map(fn ($s) => $this->sermonToPublicArray($s))->values()->all(),
            ]);
        }

        return Inertia::render('Tenant/Church/Public/Sermons/Index', [
            'tenant' => $tenant,
            'sermons_live' => $live,
            'sermons_upcoming' => $upcoming,
            'sermons_by_date' => $sermonsByDate->values()->all(),
        ]);
    }

    /**
     * Ver predica embebida (en vivo o grabada) dentro de linkiu.
     */
    public function sermonShow(Request $request, string $tenant, ChurchSermon $sermon)
    {
        $tenantModel = app('currentTenant');
        $sermonArray = $this->sermonToPublicArray($sermon);

        $sermonArray['live_chat_id'] = null;
        if (in_array($sermon->status, [ChurchSermon::STATUS_LIVE, ChurchSermon::STATUS_UPCOMING], true)) {
            $sermonArray['live_chat_id'] = $this->fetchLiveChatIdForVideo($sermon->youtube_video_id);
        }

        return Inertia::render('Tenant/Church/Public/Sermons/Show', [
            'tenant' => $tenantModel,
            'sermon' => $sermonArray,
        ]);
    }

    /**
     * Mensajes del chat en vivo (polling). Solo para predicas en vivo.
     */
    public function sermonChatMessages(Request $request, string $tenant, ChurchSermon $sermon)
    {
        if (!in_array($sermon->status, [ChurchSermon::STATUS_LIVE, ChurchSermon::STATUS_UPCOMING], true)) {
            return response()->json(['messages' => [], 'nextPageToken' => null, 'pollingIntervalMillis' => 5000]);
        }

        $liveChatId = $request->query('live_chat_id');
        if (empty($liveChatId)) {
            $liveChatId = $this->fetchLiveChatIdForVideo($sermon->youtube_video_id);
        }
        if (empty($liveChatId)) {
            return response()->json(['messages' => [], 'nextPageToken' => null, 'pollingIntervalMillis' => 5000]);
        }

        $apiKey = config('services.youtube.api_key');
        if (empty($apiKey)) {
            return response()->json(['messages' => [], 'nextPageToken' => null, 'pollingIntervalMillis' => 5000]);
        }

        $params = [
            'liveChatId' => $liveChatId,
            'part' => 'snippet,authorDetails',
            'key' => $apiKey,
        ];
        if ($request->filled('pageToken')) {
            $params['pageToken'] = $request->query('pageToken');
        }

        $response = \Illuminate\Support\Facades\Http::get('https://www.googleapis.com/youtube/v3/liveChat/messages', $params);

        if (!$response->successful()) {
            \Illuminate\Support\Facades\Log::warning('YouTube liveChat/messages error', ['response' => $response->json(), 'status' => $response->status()]);
            return response()->json(['messages' => [], 'nextPageToken' => null, 'pollingIntervalMillis' => 5000]);
        }

        $data = $response->json();
        $items = $data['items'] ?? [];
        $messages = array_map(function ($item) {
            $snippet = $item['snippet'] ?? [];
            $author = $item['authorDetails'] ?? [];
            return [
                'id' => $item['id'] ?? null,
                'text' => $snippet['displayMessage'] ?? $snippet['textMessageDetails']['messageText'] ?? '',
                'author' => $author['displayName'] ?? $author['channelId'] ?? '',
                'profile_image' => $author['profileImageUrl'] ?? null,
                'published_at' => $snippet['publishedAt'] ?? null,
            ];
        }, $items);

        return response()->json([
            'messages' => $messages,
            'nextPageToken' => $data['nextPageToken'] ?? null,
            'pollingIntervalMillis' => (int) ($data['pollingIntervalMillis'] ?? 5000),
        ]);
    }

    private function fetchLiveChatIdForVideo(string $youtubeVideoId): ?string
    {
        $apiKey = config('services.youtube.api_key');
        if (empty($apiKey)) {
            return null;
        }
        $response = \Illuminate\Support\Facades\Http::get('https://www.googleapis.com/youtube/v3/videos', [
            'part' => 'liveStreamingDetails',
            'id' => $youtubeVideoId,
            'key' => $apiKey,
        ]);
        if (!$response->successful()) {
            return null;
        }
        $items = $response->json('items', []);
        $first = $items[0] ?? null;
        $chatId = $first['liveStreamingDetails']['activeLiveChatId'] ?? null;
        if (!$chatId && $first) {
            \Illuminate\Support\Facades\Log::debug('YouTube video has no activeLiveChatId', [
                'video_id' => $youtubeVideoId,
                'liveStreamingDetails' => $first['liveStreamingDetails'] ?? [],
            ]);
        }
        return $chatId;
    }

    private function sermonToPublicArray(ChurchSermon $s): array
    {
        return [
            'id' => $s->id,
            'youtube_video_id' => $s->youtube_video_id,
            'title' => $s->title,
            'thumbnail_url' => $s->thumbnail_url,
            'status' => $s->status,
            'published_at' => $s->published_at?->toIso8601String(),
            'live_start_at' => $s->live_start_at?->toIso8601String(),
            'formatted_duration' => $s->formatted_duration,
            'embed_url' => $s->embed_url,
            'watch_url' => $s->watch_url,
        ];
    }

    /**
     * Listado público de testimonios (solo publicados).
     */
    public function testimonials(Request $request)
    {
        $tenant = app('currentTenant');
        $testimonials = $this->getTestimonialsForPublic(999);

        return Inertia::render('Tenant/Church/Public/Testimonials/Index', [
            'tenant' => $tenant,
            'testimonials' => $testimonials,
        ]);
    }

    /**
     * Testimonios publicados con conteos de reacciones (para listado, home y servicios).
     */
    private function getTestimonialsForPublic(int $limit = 6): array
    {
        $query = ChurchTestimonial::where('is_published', true)
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->limit($limit);

        $items = $query->get();
        $ids = $items->pluck('id')->all();
        $counts = [];
        if (!empty($ids)) {
            $reactions = ChurchTestimonialReaction::whereIn('church_testimonial_id', $ids)
                ->selectRaw('church_testimonial_id, reaction_type, count(*) as c')
                ->groupBy('church_testimonial_id', 'reaction_type')
                ->get();
            foreach ($reactions as $r) {
                $counts[$r->church_testimonial_id][$r->reaction_type] = (int) $r->c;
            }
        }
        $shareCounts = ChurchTestimonial::whereIn('id', $ids)->pluck('share_count', 'id')->all();

        return $items->map(function (ChurchTestimonial $t) use ($counts, $shareCounts) {
            $cid = $t->id;
            return [
                'id' => $t->id,
                'title' => $t->title,
                'short_quote' => $t->short_quote,
                'author' => $t->author,
                'category' => $t->category,
                'image_url' => $t->image_url,
                'video_url' => $t->video_url,
                'embed_url' => $t->embed_url,
                'blessing_count' => (int) ($counts[$cid][ChurchTestimonialReaction::TYPE_BLESSING] ?? 0),
                'prayer_count' => (int) ($counts[$cid][ChurchTestimonialReaction::TYPE_PRAYER] ?? 0),
                'amen_count' => (int) ($counts[$cid][ChurchTestimonialReaction::TYPE_AMEN] ?? 0),
                'share_count' => (int) ($shareCounts[$cid] ?? 0),
            ];
        })->values()->all();
    }

    /**
     * Vista pública de un testimonio (con video embebido si hay).
     */
    public function testimonialShow(Request $request, string $tenant, ChurchTestimonial $testimonial)
    {
        if (!$testimonial->is_published) {
            abort(404);
        }
        $tenantModel = app('currentTenant');

        $blessingCount = ChurchTestimonialReaction::where('church_testimonial_id', $testimonial->id)
            ->where('reaction_type', ChurchTestimonialReaction::TYPE_BLESSING)
            ->count();
        $prayerCount = ChurchTestimonialReaction::where('church_testimonial_id', $testimonial->id)
            ->where('reaction_type', ChurchTestimonialReaction::TYPE_PRAYER)
            ->count();
        $amenCount = ChurchTestimonialReaction::where('church_testimonial_id', $testimonial->id)
            ->where('reaction_type', ChurchTestimonialReaction::TYPE_AMEN)
            ->count();
        $shareCount = (int) ($testimonial->share_count ?? 0);

        $visitorId = $request->cookie('testimonial_visitor_id');
        $alreadyBlessing = false;
        $alreadyPrayer = false;
        $alreadyAmen = false;
        if ($visitorId && strlen($visitorId) <= 64) {
            $alreadyBlessing = ChurchTestimonialReaction::where('church_testimonial_id', $testimonial->id)
                ->where('visitor_id', $visitorId)
                ->where('reaction_type', ChurchTestimonialReaction::TYPE_BLESSING)
                ->exists();
            $alreadyPrayer = ChurchTestimonialReaction::where('church_testimonial_id', $testimonial->id)
                ->where('visitor_id', $visitorId)
                ->where('reaction_type', ChurchTestimonialReaction::TYPE_PRAYER)
                ->exists();
            $alreadyAmen = ChurchTestimonialReaction::where('church_testimonial_id', $testimonial->id)
                ->where('visitor_id', $visitorId)
                ->where('reaction_type', ChurchTestimonialReaction::TYPE_AMEN)
                ->exists();
        }

        $data = [
            'id' => $testimonial->id,
            'title' => $testimonial->title,
            'body' => $testimonial->body,
            'short_quote' => $testimonial->short_quote,
            'author' => $testimonial->author,
            'category' => $testimonial->category,
            'image_url' => $testimonial->image_url,
            'video_url' => $testimonial->video_url,
            'embed_url' => $testimonial->embed_url,
        ];

        return Inertia::render('Tenant/Church/Public/Testimonials/Show', [
            'tenant' => $tenantModel,
            'testimonial' => $data,
            'blessing_count' => $blessingCount,
            'prayer_count' => $prayerCount,
            'amen_count' => $amenCount,
            'share_count' => $shareCount,
            'already_blessing' => $alreadyBlessing,
            'already_prayer' => $alreadyPrayer,
            'already_amen' => $alreadyAmen,
        ]);
    }

    /**
     * Estado de reacciones del visitante para un testimonio.
     */
    public function testimonialReactionsStatus(Request $request, string $tenant, ChurchTestimonial $testimonial)
    {
        if (!$testimonial->is_published) {
            abort(404);
        }
        $visitorId = $request->query('visitor_id');
        if (!$visitorId || strlen($visitorId) > 64) {
            return response()->json(['already_blessing' => false, 'already_prayer' => false, 'already_amen' => false]);
        }
        $alreadyBlessing = ChurchTestimonialReaction::where('church_testimonial_id', $testimonial->id)
            ->where('visitor_id', $visitorId)
            ->where('reaction_type', ChurchTestimonialReaction::TYPE_BLESSING)
            ->exists();
        $alreadyPrayer = ChurchTestimonialReaction::where('church_testimonial_id', $testimonial->id)
            ->where('visitor_id', $visitorId)
            ->where('reaction_type', ChurchTestimonialReaction::TYPE_PRAYER)
            ->exists();
        $alreadyAmen = ChurchTestimonialReaction::where('church_testimonial_id', $testimonial->id)
            ->where('visitor_id', $visitorId)
            ->where('reaction_type', ChurchTestimonialReaction::TYPE_AMEN)
            ->exists();
        return response()->json([
            'already_blessing' => $alreadyBlessing,
            'already_prayer' => $alreadyPrayer,
            'already_amen' => $alreadyAmen,
        ]);
    }

    /**
     * Registrar "Bendición" (1 por visitante por testimonio).
     */
    public function testimonialBlessing(Request $request, string $tenant, ChurchTestimonial $testimonial)
    {
        if (!$testimonial->is_published) {
            abort(404);
        }
        $visitorId = $request->input('visitor_id');
        if (!$visitorId || strlen($visitorId) > 64) {
            return response()->json(['error' => 'visitor_id required'], 422);
        }
        $exists = ChurchTestimonialReaction::where('church_testimonial_id', $testimonial->id)
            ->where('visitor_id', $visitorId)
            ->where('reaction_type', ChurchTestimonialReaction::TYPE_BLESSING)
            ->exists();
        if (!$exists) {
            ChurchTestimonialReaction::create([
                'church_testimonial_id' => $testimonial->id,
                'visitor_id' => $visitorId,
                'reaction_type' => ChurchTestimonialReaction::TYPE_BLESSING,
            ]);
        }
        $counts = $this->testimonialReactionCounts($testimonial->id);
        return response()->json(array_merge($counts, ['already_blessing' => true]));
    }

    /**
     * Registrar "Oración" (1 por visitante por testimonio).
     */
    public function testimonialPrayer(Request $request, string $tenant, ChurchTestimonial $testimonial)
    {
        if (!$testimonial->is_published) {
            abort(404);
        }
        $visitorId = $request->input('visitor_id');
        if (!$visitorId || strlen($visitorId) > 64) {
            return response()->json(['error' => 'visitor_id required'], 422);
        }
        $exists = ChurchTestimonialReaction::where('church_testimonial_id', $testimonial->id)
            ->where('visitor_id', $visitorId)
            ->where('reaction_type', ChurchTestimonialReaction::TYPE_PRAYER)
            ->exists();
        if (!$exists) {
            ChurchTestimonialReaction::create([
                'church_testimonial_id' => $testimonial->id,
                'visitor_id' => $visitorId,
                'reaction_type' => ChurchTestimonialReaction::TYPE_PRAYER,
            ]);
        }
        $counts = $this->testimonialReactionCounts($testimonial->id);
        return response()->json(array_merge($counts, ['already_prayer' => true]));
    }

    /**
     * Registrar "Amén" (1 por visitante por testimonio).
     */
    public function testimonialAmen(Request $request, string $tenant, ChurchTestimonial $testimonial)
    {
        if (!$testimonial->is_published) {
            abort(404);
        }
        $visitorId = $request->input('visitor_id');
        if (!$visitorId || strlen($visitorId) > 64) {
            return response()->json(['error' => 'visitor_id required'], 422);
        }
        $exists = ChurchTestimonialReaction::where('church_testimonial_id', $testimonial->id)
            ->where('visitor_id', $visitorId)
            ->where('reaction_type', ChurchTestimonialReaction::TYPE_AMEN)
            ->exists();
        if (!$exists) {
            ChurchTestimonialReaction::create([
                'church_testimonial_id' => $testimonial->id,
                'visitor_id' => $visitorId,
                'reaction_type' => ChurchTestimonialReaction::TYPE_AMEN,
            ]);
        }
        $counts = $this->testimonialReactionCounts($testimonial->id);
        return response()->json(array_merge($counts, ['already_amen' => true]));
    }

    /**
     * Registrar compartir (incrementa share_count).
     */
    public function testimonialShare(Request $request, string $tenant, ChurchTestimonial $testimonial)
    {
        if (!$testimonial->is_published) {
            abort(404);
        }
        $testimonial->increment('share_count');
        return response()->json(['ok' => true, 'share_count' => (int) $testimonial->fresh()->share_count]);
    }

    private function testimonialReactionCounts(int $testimonialId): array
    {
        $blessingCount = ChurchTestimonialReaction::where('church_testimonial_id', $testimonialId)
            ->where('reaction_type', ChurchTestimonialReaction::TYPE_BLESSING)
            ->count();
        $prayerCount = ChurchTestimonialReaction::where('church_testimonial_id', $testimonialId)
            ->where('reaction_type', ChurchTestimonialReaction::TYPE_PRAYER)
            ->count();
        $amenCount = ChurchTestimonialReaction::where('church_testimonial_id', $testimonialId)
            ->where('reaction_type', ChurchTestimonialReaction::TYPE_AMEN)
            ->count();
        return [
            'blessing_count' => $blessingCount,
            'prayer_count' => $prayerCount,
            'amen_count' => $amenCount,
        ];
    }

    /**
     * Vista pública de servicios (cultos, reuniones, actividades).
     */
    public function services(Request $request)
    {
        $tenant = app('currentTenant');

        $services = ChurchService::where('is_active', true)
            ->orderBy('order')
            ->orderBy('name')
            ->get([
                'id', 'name', 'description', 'audience', 'service_type', 'schedule', 'frequency', 'duration',
                'location', 'modality', 'image_url', 'leader', 'contact_info', 'external_url',
            ]);

        $sermonsLive = ChurchSermon::where('status', ChurchSermon::STATUS_LIVE)
            ->orderBy('live_start_at')
            ->limit(3)
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'title' => $s->title,
                'thumbnail_url' => $s->thumbnail_url,
                'status' => $s->status,
                'live_start_at' => $s->live_start_at?->toIso8601String(),
                'embed_url' => $s->embed_url,
                'watch_url' => $s->watch_url,
            ])
            ->values()
            ->all();
        $sermonsUpcoming = ChurchSermon::where('status', ChurchSermon::STATUS_UPCOMING)
            ->orderByRaw('live_start_at IS NULL, live_start_at ASC')
            ->limit(3)
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'title' => $s->title,
                'thumbnail_url' => $s->thumbnail_url,
                'status' => $s->status,
                'live_start_at' => $s->live_start_at?->toIso8601String(),
                'embed_url' => $s->embed_url,
                'watch_url' => $s->watch_url,
            ])
            ->values()
            ->all();

        $collaborators = ChurchCollaborator::where('is_published', true)
            ->orderBy('order')
            ->orderBy('name')
            ->limit(6)
            ->get(['id', 'name', 'role', 'photo', 'bio', 'email', 'phone', 'whatsapp']);

        $testimonialsForServices = $this->getTestimonialsForPublic(6);

        return Inertia::render('Tenant/Church/Public/Services/Index', [
            'tenant' => $tenant,
            'services' => $services,
            'sermons_live' => $sermonsLive,
            'sermons_upcoming' => $sermonsUpcoming,
            'collaborators' => $collaborators,
            'testimonials' => $testimonialsForServices,
        ]);
    }

    /**
     * Formulario público para solicitar una cita (oración, consejería, etc.).
     */
    public function appointmentForm(Request $request)
    {
        $tenant = app('currentTenant');

        return Inertia::render('Tenant/Church/Public/Appointments/Request', [
            'tenant' => $tenant,
            'appointmentTypes' => ChurchAppointment::typeLabels(),
        ]);
    }

    /**
     * Guardar solicitud de cita desde el formulario público.
     */
    public function storeAppointment(StoreChurchAppointmentRequest $request)
    {
        ChurchAppointment::create($request->validated());

        return redirect()->back()->with('success', 'Recibimos tu solicitud. Te contactaremos pronto para confirmar tu cita.');
    }

    /**
     * Página pública de donaciones: formulario + métodos de pago (cuentas bancarias).
     */
    public function donations(Request $request)
    {
        $tenant = app('currentTenant');

        $bankAccounts = $tenant->bankAccounts()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->get(['id', 'bank_name', 'account_type', 'account_number', 'account_holder']);

        return Inertia::render('Tenant/Church/Public/Donations/Index', [
            'tenant' => $tenant,
            'bankAccounts' => $bankAccounts,
        ]);
    }

    /**
     * Guardar donación (nombre, celular, monto, comprobante opcional).
     */
    public function storeDonation(StoreChurchDonationRequest $request)
    {
        $tenant = app('currentTenant');
        $validated = $request->validated();

        $proofPath = null;
        if ($request->hasFile('proof')) {
            $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenant->slug ?? ''));
            $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenant->id) . '/donation_proofs';
            $proofPath = $request->file('proof')->store($basePath, 'bunny');
        }

        ChurchDonation::create([
            'tenant_id' => $tenant->id,
            'donor_name' => $validated['donor_name'],
            'donor_phone' => $validated['donor_phone'],
            'amount' => $validated['amount'],
            'currency' => 'COP',
            'bank_account_id' => $validated['bank_account_id'] ?? null,
            'proof_path' => $proofPath,
            'status' => ChurchDonation::STATUS_PENDING,
        ]);

        return redirect()->route('tenant.public.donations.thank-you', ['tenant' => $tenant->slug]);
    }

    /**
     * Página de agradecimiento tras donar.
     */
    public function donationsThankYou(Request $request)
    {
        $tenant = app('currentTenant');

        return Inertia::render('Tenant/Church/Public/Donations/ThankYou', [
            'tenant' => $tenant,
        ]);
    }

    /**
     * Listado público de devocionales (solo publicados).
     */
    public function devotionals(Request $request)
    {
        $tenant = app('currentTenant');

        $devotionals = ChurchDevotional::where('is_published', true)
            ->orderBy('date', 'desc')
            ->orderBy('order')
            ->orderBy('id')
            ->withCount([
                'reactions as blessing_count' => fn ($q) => $q->where('reaction_type', ChurchDevotionalReaction::TYPE_BLESSING),
                'reactions as prayer_count' => fn ($q) => $q->where('reaction_type', ChurchDevotionalReaction::TYPE_PRAYER),
            ])
            ->paginate(12, [
                'id', 'title', 'scripture_reference', 'date', 'cover_image', 'excerpt', 'author', 'share_count',
            ]);

        return Inertia::render('Tenant/Church/Public/Devotionals/Index', [
            'tenant' => $tenant,
            'devotionals' => $devotionals,
        ]);
    }

    /**
     * Vista pública de un devocional (detalle con video incrustado y enlace externo).
     */
    public function devotionalShow(Request $request, string $tenant, ChurchDevotional $devotional)
    {
        $tenant = app('currentTenant');

        if (! $devotional->is_published) {
            abort(404);
        }

        $devotional->setHidden([]);
        $data = $devotional->only([
            'id', 'title', 'scripture_reference', 'scripture_text', 'body', 'prayer', 'author',
            'date', 'reflection_question', 'cover_image', 'video_url', 'external_link', 'excerpt',
        ]);

        $blessingCount = ChurchDevotionalReaction::where('church_devotional_id', $devotional->id)
            ->where('reaction_type', ChurchDevotionalReaction::TYPE_BLESSING)
            ->count();
        $prayerCount = ChurchDevotionalReaction::where('church_devotional_id', $devotional->id)
            ->where('reaction_type', ChurchDevotionalReaction::TYPE_PRAYER)
            ->count();

        $visitorId = $request->cookie('devotional_visitor_id');
        $alreadyBlessing = false;
        $alreadyPrayer = false;
        if ($visitorId && strlen($visitorId) <= 64) {
            $alreadyBlessing = ChurchDevotionalReaction::where('church_devotional_id', $devotional->id)
                ->where('visitor_id', $visitorId)
                ->where('reaction_type', ChurchDevotionalReaction::TYPE_BLESSING)
                ->exists();
            $alreadyPrayer = ChurchDevotionalReaction::where('church_devotional_id', $devotional->id)
                ->where('visitor_id', $visitorId)
                ->where('reaction_type', ChurchDevotionalReaction::TYPE_PRAYER)
                ->exists();
        }

        $shareUrl = url()->current();
        $shareTitle = $devotional->title . ' - ' . $tenant->name;
        $shareDescription = $devotional->excerpt
            ?: \Illuminate\Support\Str::limit(strip_tags($devotional->body), 160);
        $shareImage = $devotional->cover_image;
        $shareDate = $devotional->date?->format('d/m/Y');

        $og = [
            'title' => $shareTitle,
            'description' => $shareDate ? "{$shareDescription} · {$shareDate}" : $shareDescription,
            'image' => $shareImage ?: $tenant->logo_url,
            'url' => $shareUrl,
            'type' => 'article',
        ];

        return Inertia::render('Tenant/Church/Public/Devotionals/Show', [
            'tenant' => $tenant,
            'devotional' => $data,
            'blessing_count' => $blessingCount,
            'prayer_count' => $prayerCount,
            'already_blessing' => $alreadyBlessing,
            'already_prayer' => $alreadyPrayer,
            'og' => $og,
        ]);
    }

    /**
     * Estado de reacciones del visitante para un devocional (ya dio bendición / orando).
     */
    public function devotionalReactionsStatus(Request $request, string $tenant, ChurchDevotional $devotional)
    {
        $visitorId = $request->query('visitor_id');
        if (! $visitorId || strlen($visitorId) > 64) {
            return response()->json([
                'already_blessing' => false,
                'already_prayer' => false,
            ]);
        }

        $alreadyBlessing = ChurchDevotionalReaction::where('church_devotional_id', $devotional->id)
            ->where('visitor_id', $visitorId)
            ->where('reaction_type', ChurchDevotionalReaction::TYPE_BLESSING)
            ->exists();
        $alreadyPrayer = ChurchDevotionalReaction::where('church_devotional_id', $devotional->id)
            ->where('visitor_id', $visitorId)
            ->where('reaction_type', ChurchDevotionalReaction::TYPE_PRAYER)
            ->exists();

        return response()->json([
            'already_blessing' => $alreadyBlessing,
            'already_prayer' => $alreadyPrayer,
        ]);
    }

    /**
     * Registrar "Fue de bendición" (1 por visitante por devocional).
     */
    public function devotionalBlessing(Request $request, string $tenant, ChurchDevotional $devotional)
    {
        if (! $devotional->is_published) {
            abort(404);
        }

        $visitorId = $request->input('visitor_id');
        if (! $visitorId || strlen($visitorId) > 64) {
            return response()->json(['error' => 'visitor_id required'], 422);
        }

        $exists = ChurchDevotionalReaction::where('church_devotional_id', $devotional->id)
            ->where('visitor_id', $visitorId)
            ->where('reaction_type', ChurchDevotionalReaction::TYPE_BLESSING)
            ->exists();

        if (! $exists) {
            ChurchDevotionalReaction::create([
                'church_devotional_id' => $devotional->id,
                'visitor_id' => $visitorId,
                'reaction_type' => ChurchDevotionalReaction::TYPE_BLESSING,
            ]);
        }

        $blessingCount = ChurchDevotionalReaction::where('church_devotional_id', $devotional->id)
            ->where('reaction_type', ChurchDevotionalReaction::TYPE_BLESSING)
            ->count();
        $prayerCount = ChurchDevotionalReaction::where('church_devotional_id', $devotional->id)
            ->where('reaction_type', ChurchDevotionalReaction::TYPE_PRAYER)
            ->count();

        return response()->json([
            'blessing_count' => $blessingCount,
            'prayer_count' => $prayerCount,
            'already_blessing' => true,
            'already_prayer' => ChurchDevotionalReaction::where('church_devotional_id', $devotional->id)
                ->where('visitor_id', $visitorId)
                ->where('reaction_type', ChurchDevotionalReaction::TYPE_PRAYER)
                ->exists(),
        ]);
    }

    /**
     * Registrar "Orando" (1 por visitante por devocional).
     */
    public function devotionalPrayer(Request $request, string $tenant, ChurchDevotional $devotional)
    {
        if (! $devotional->is_published) {
            abort(404);
        }

        $visitorId = $request->input('visitor_id');
        if (! $visitorId || strlen($visitorId) > 64) {
            return response()->json(['error' => 'visitor_id required'], 422);
        }

        $exists = ChurchDevotionalReaction::where('church_devotional_id', $devotional->id)
            ->where('visitor_id', $visitorId)
            ->where('reaction_type', ChurchDevotionalReaction::TYPE_PRAYER)
            ->exists();

        if (! $exists) {
            ChurchDevotionalReaction::create([
                'church_devotional_id' => $devotional->id,
                'visitor_id' => $visitorId,
                'reaction_type' => ChurchDevotionalReaction::TYPE_PRAYER,
            ]);
        }

        $blessingCount = ChurchDevotionalReaction::where('church_devotional_id', $devotional->id)
            ->where('reaction_type', ChurchDevotionalReaction::TYPE_BLESSING)
            ->count();
        $prayerCount = ChurchDevotionalReaction::where('church_devotional_id', $devotional->id)
            ->where('reaction_type', ChurchDevotionalReaction::TYPE_PRAYER)
            ->count();

        return response()->json([
            'blessing_count' => $blessingCount,
            'prayer_count' => $prayerCount,
            'already_blessing' => ChurchDevotionalReaction::where('church_devotional_id', $devotional->id)
                ->where('visitor_id', $visitorId)
                ->where('reaction_type', ChurchDevotionalReaction::TYPE_BLESSING)
                ->exists(),
            'already_prayer' => true,
        ]);
    }

    /**
     * Registrar que se compartió el devocional (incrementa share_count).
     */
    public function devotionalShare(Request $request, string $tenant, ChurchDevotional $devotional)
    {
        if (! $devotional->is_published) {
            abort(404);
        }

        $devotional->increment('share_count');

        return response()->json(['ok' => true]);
    }
}
