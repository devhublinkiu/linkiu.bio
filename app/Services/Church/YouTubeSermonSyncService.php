<?php

namespace App\Services\Church;

use App\Models\Tenant\Church\ChurchSermon;
use App\Models\Tenant\Church\ChurchYoutubeConfig;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class YouTubeSermonSyncService
{
    protected string $baseUrl = 'https://www.googleapis.com/youtube/v3';

    public function sync(ChurchYoutubeConfig $config): array
    {
        $channelId = $config->youtube_channel_id;
        if (empty($channelId)) {
            return ['success' => false, 'message' => 'No hay canal de YouTube configurado.', 'synced' => 0];
        }

        $apiKey = config('services.youtube.api_key');
        if (empty($apiKey)) {
            return ['success' => false, 'message' => 'Falta configurar YOUTUBE_API_KEY en .env', 'synced' => 0];
        }

        $uploadsPlaylistId = $this->getUploadsPlaylistId($channelId, $apiKey);
        if (!$uploadsPlaylistId) {
            return ['success' => false, 'message' => 'No se pudo obtener el canal de YouTube. Revisa el ID del canal.', 'synced' => 0];
        }

        $videos = $this->fetchPlaylistItems($uploadsPlaylistId, $apiKey);
        if (empty($videos)) {
            $config->update(['last_synced_at' => now()]);
            return ['success' => true, 'message' => 'No hay vídeos en el canal.', 'synced' => 0];
        }

        $videoIds = array_column($videos, 'videoId');
        $videoDetails = $this->fetchVideoDetails($videoIds, $apiKey);

        $synced = 0;
        foreach ($videos as $item) {
            $videoId = $item['videoId'] ?? null;
            if (!$videoId) {
                continue;
            }
            $publishedAt = $item['publishedAt'] ?? null;
            $title = $item['title'] ?? 'Sin título';
            $description = $item['description'] ?? null;
            $thumbnails = $item['thumbnails'] ?? [];
            $thumbUrl = $thumbnails['maxres']['url'] ?? $thumbnails['high']['url'] ?? $thumbnails['medium']['url'] ?? $thumbnails['default']['url'] ?? null;

            $details = $videoDetails[$videoId] ?? [];
            $durationSeconds = $details['duration_seconds'] ?? null;
            $liveBroadcastContent = $details['live_broadcast_content'] ?? 'none';
            $scheduledStartTime = $details['scheduled_start_time'] ?? null;

            $status = match ($liveBroadcastContent) {
                'live' => ChurchSermon::STATUS_LIVE,
                'upcoming' => ChurchSermon::STATUS_UPCOMING,
                default => ChurchSermon::STATUS_COMPLETED,
            };
            $liveStartAt = in_array($liveBroadcastContent, ['live', 'upcoming'], true) && $scheduledStartTime
                ? $scheduledStartTime
                : null;

            ChurchSermon::updateOrCreate(
                [
                    'tenant_id' => $config->tenant_id,
                    'youtube_video_id' => $videoId,
                ],
                [
                    'title' => $title,
                    'description' => $description,
                    'published_at' => $publishedAt ? substr($publishedAt, 0, 10) : null,
                    'thumbnail_url' => $thumbUrl,
                    'duration_seconds' => $durationSeconds,
                    'status' => $status,
                    'live_start_at' => $liveStartAt,
                ]
            );
            $synced++;
        }

        $config->update(['last_synced_at' => now()]);

        return ['success' => true, 'message' => "Se sincronizaron {$synced} predicas.", 'synced' => $synced];
    }

    protected function getUploadsPlaylistId(string $channelId, string $apiKey): ?string
    {
        $response = Http::get($this->baseUrl . '/channels', [
            'part' => 'contentDetails',
            'id' => $channelId,
            'key' => $apiKey,
        ]);

        if (!$response->successful()) {
            Log::warning('YouTube API channels error', ['response' => $response->json(), 'channelId' => $channelId]);
            return null;
        }

        $items = $response->json('items');
        if (empty($items)) {
            return null;
        }

        return $items[0]['contentDetails']['relatedPlaylists']['uploads'] ?? null;
    }

    protected function fetchPlaylistItems(string $playlistId, string $apiKey, int $maxResults = 50): array
    {
        $all = [];
        $pageToken = null;

        do {
            $response = Http::get($this->baseUrl . '/playlistItems', [
                'part' => 'snippet,contentDetails',
                'playlistId' => $playlistId,
                'maxResults' => min(50, $maxResults - count($all)),
                'pageToken' => $pageToken,
                'key' => $apiKey,
            ]);

            if (!$response->successful()) {
                Log::warning('YouTube API playlistItems error', ['response' => $response->json()]);
                break;
            }

            $items = $response->json('items', []);
            foreach ($items as $item) {
                $videoId = $item['contentDetails']['videoId'] ?? null;
                if ($videoId) {
                    $snippet = $item['snippet'] ?? [];
                    $all[] = array_merge($snippet, ['videoId' => $videoId]);
                }
            }
            $pageToken = $response->json('nextPageToken');
        } while ($pageToken && count($all) < $maxResults);

        return $all;
    }

    /**
     * Obtiene por cada vídeo: duración, estado de transmisión (live/upcoming/none) y hora programada.
     * Así el estado "en vivo" / "próxima" se actualiza automáticamente desde el canal.
     */
    protected function fetchVideoDetails(array $videoIds, string $apiKey): array
    {
        if (empty($videoIds)) {
            return [];
        }
        $chunks = array_chunk($videoIds, 50);
        $result = [];
        foreach ($chunks as $ids) {
            $response = Http::get($this->baseUrl . '/videos', [
                'part' => 'contentDetails,snippet,liveStreamingDetails',
                'id' => implode(',', $ids),
                'key' => $apiKey,
            ]);
            if (!$response->successful()) {
                continue;
            }
            foreach ($response->json('items', []) as $video) {
                $vid = $video['id'] ?? null;
                if (!$vid) {
                    continue;
                }
                $duration = $video['contentDetails']['duration'] ?? null;
                $liveBroadcastContent = $video['snippet']['liveBroadcastContent'] ?? 'none';
                $liveDetails = $video['liveStreamingDetails'] ?? [];
                $scheduledStart = $liveDetails['scheduledStartTime'] ?? $liveDetails['actualStartTime'] ?? null;

                $result[$vid] = [
                    'duration_seconds' => $duration ? $this->parseIso8601Duration($duration) : null,
                    'live_broadcast_content' => $liveBroadcastContent,
                    'scheduled_start_time' => $scheduledStart ? (\Carbon\Carbon::parse($scheduledStart)->format('Y-m-d H:i:s')) : null,
                ];
            }
        }
        return $result;
    }

    protected function parseIso8601Duration(string $duration): int
    {
        $seconds = 0;
        if (preg_match('/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/', $duration, $m)) {
            $seconds = (int) ($m[1] ?? 0) * 3600 + (int) ($m[2] ?? 0) * 60 + (int) ($m[3] ?? 0);
        }
        return $seconds;
    }
}
