<?php

namespace App\Services;

use App\Models\Tenant;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BunnyStreamService
{
    protected string $libraryId;

    protected string $apiKey;

    protected string $apiBaseUrl;

    public function __construct()
    {
        $this->libraryId = (string) config('bunny.stream.library_id');
        $this->apiKey = (string) config('bunny.stream.api_key');
        $this->apiBaseUrl = rtrim(config('bunny.stream.api_base_url', 'https://video.bunnycdn.com'), '/');
    }

    /**
     * Check if Stream is configured and enabled.
     */
    public function isEnabled(): bool
    {
        return config('bunny.stream.enabled', false)
            && $this->libraryId !== ''
            && $this->apiKey !== '';
    }

    /**
     * Get or create the Bunny Stream collection for this tenant (Tenant -> Shorts).
     * Returns collection GUID.
     */
    public function getOrCreateCollectionForTenant(Tenant $tenant): ?string
    {
        if (!$this->isEnabled()) {
            return null;
        }

        if ($tenant->bunny_stream_collection_id) {
            return $tenant->bunny_stream_collection_id;
        }

        $name = 'tenant-' . $tenant->id . '-shorts';
        $guid = $this->createCollection($name);
        if (!$guid) {
            return null;
        }

        $tenant->update(['bunny_stream_collection_id' => $guid]);
        return $guid;
    }

    /**
     * Create a collection in Bunny Stream. Returns collection GUID or null.
     */
    protected function createCollection(string $name): ?string
    {
        $url = "{$this->apiBaseUrl}/library/{$this->libraryId}/collections";

        $response = Http::withHeaders([
            'AccessKey' => $this->apiKey,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post($url, ['name' => $name]);

        if (!$response->successful()) {
            Log::error('Bunny Stream create collection failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return null;
        }

        $data = $response->json();
        return $data['guid'] ?? null;
    }

    /**
     * Create a video object in Bunny and upload the file.
     * If $tenant is provided, the video is placed in that tenant's collection (Tenant -> Shorts).
     * Returns the video ID (GUID) on success, null on failure.
     */
    public function createAndUpload(string $title, UploadedFile $file, ?Tenant $tenant = null): ?string
    {
        if (!$this->isEnabled()) {
            Log::warning('Bunny Stream is not enabled or not configured.');
            return null;
        }

        $collectionId = $tenant ? $this->getOrCreateCollectionForTenant($tenant) : null;

        $videoId = $this->createVideo($title, $collectionId);
        if (!$videoId) {
            return null;
        }

        if (!$this->uploadVideoFile($videoId, $file)) {
            return null;
        }

        return $videoId;
    }

    /**
     * Create video object via API. Returns videoId (GUID) or null.
     */
    protected function createVideo(string $title, ?string $collectionId = null): ?string
    {
        $url = "{$this->apiBaseUrl}/library/{$this->libraryId}/videos";

        $body = ['title' => $title];
        if ($collectionId !== null && $collectionId !== '') {
            $body['collectionId'] = $collectionId;
        }

        $response = Http::withHeaders([
            'AccessKey' => $this->apiKey,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post($url, $body);

        if (!$response->successful()) {
            Log::error('Bunny Stream create video failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return null;
        }

        $data = $response->json();
        return $data['guid'] ?? $data['id'] ?? null;
    }

    /**
     * Upload video file (binary) to the created video object.
     */
    protected function uploadVideoFile(string $videoId, UploadedFile $file): bool
    {
        $url = "{$this->apiBaseUrl}/library/{$this->libraryId}/videos/{$videoId}";

        $response = Http::withHeaders([
            'AccessKey' => $this->apiKey,
            'Accept' => 'application/json',
        ])->withBody(
            file_get_contents($file->getRealPath()),
            'application/octet-stream'
        )->put($url);

        if (!$response->successful()) {
            Log::error('Bunny Stream upload file failed', [
                'videoId' => $videoId,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return false;
        }

        return true;
    }

    /**
     * URL de portada lista para el navegador: play data (thumbnailUrl / previewUrl) sin necesitar CDN en .env.
     */
    public function getThumbnailOrPreviewUrlFromPlayApi(string $videoId): ?string
    {
        if (! $this->isEnabled() || $this->libraryId === '') {
            return null;
        }

        $cacheKey = 'bunny.stream.play_thumb.v2.'.md5($this->libraryId.'.'.$videoId);

        $cached = Cache::get($cacheKey);
        if (is_string($cached) && str_starts_with($cached, 'http')) {
            return $this->normalizePublicMediaUrl($cached);
        }

        $url = "{$this->apiBaseUrl}/library/{$this->libraryId}/videos/{$videoId}/play";

        $response = Http::withHeaders([
            'AccessKey' => $this->apiKey,
            'Accept' => 'application/json',
        ])->timeout(15)->get($url);

        if (! $response->successful()) {
            return null;
        }

        $data = $response->json() ?? [];

        $thumb = $data['thumbnailUrl'] ?? null;
        if (is_string($thumb) && $thumb !== '') {
            $thumb = $this->normalizePublicMediaUrl($thumb);
            Cache::put($cacheKey, $thumb, 3600);

            return $thumb;
        }

        $preview = $data['previewUrl'] ?? null;
        if (is_string($preview) && $preview !== '' && $this->isLikelyRasterImageUrl($preview)) {
            $preview = $this->normalizePublicMediaUrl($preview);
            Cache::put($cacheKey, $preview, 3600);

            return $preview;
        }

        return null;
    }

    /**
     * Evita contenido mixto (http en página https) y espacios.
     */
    protected function normalizePublicMediaUrl(string $url): string
    {
        $url = trim($url);
        if (str_starts_with($url, 'http://')) {
            return 'https://'.substr($url, 7);
        }

        return $url;
    }

    /**
     * previewUrl a veces es animación webp (ok en <img>); si es vídeo/playlist, no sirve como poster.
     */
    protected function isLikelyRasterImageUrl(string $url): bool
    {
        $path = (string) parse_url($url, PHP_URL_PATH);
        $lower = strtolower($path);

        if (str_ends_with($lower, '.mp4') || str_ends_with($lower, '.m3u8') || str_contains($lower, '.m3u8')) {
            return false;
        }

        return true;
    }

    /**
     * URL pública de miniatura (thumbnailFileName + CDN). Requiere BUNNY_STREAM_CDN_HOSTNAME si play API no devolvió URL.
     *
     * @see https://docs.bunny.net/docs/stream-video-storage-structure
     */
    public function getPublicThumbnailUrlForVideo(string $videoId): ?string
    {
        if (! $this->isEnabled()) {
            return null;
        }

        $fromPlay = $this->getThumbnailOrPreviewUrlFromPlayApi($videoId);
        if ($fromPlay) {
            return $fromPlay;
        }

        $cdn = config('bunny.stream.cdn_hostname');
        if (! $cdn) {
            return null;
        }

        $url = "{$this->apiBaseUrl}/library/{$this->libraryId}/videos/{$videoId}";
        $response = Http::withHeaders([
            'AccessKey' => $this->apiKey,
            'Accept' => 'application/json',
        ])->timeout(15)->get($url);

        if (! $response->successful()) {
            return null;
        }

        $file = $response->json('thumbnailFileName');
        if (! $file || ! is_string($file)) {
            return null;
        }

        $base = str_starts_with($cdn, 'http') ? rtrim($cdn, '/') : 'https://'.rtrim($cdn, '/');

        return "{$base}/{$videoId}/{$file}";
    }
}
