<?php

namespace App\Http\Controllers\Tenant\Admin\Media;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shared\CreateMediaFolderRequest;
use App\Http\Requests\Shared\StoreMediaFileRequest;
use App\Models\Tenant\MediaFile;
use App\Traits\StoresImageAsWebp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    use StoresImageAsWebp;

    private const FILES_PER_PAGE = 24;
    private const LIST_SELECT = [
        'id', 'tenant_id', 'name', 'path', 'url', 'disk', 'mime_type', 'size',
        'extension', 'type', 'folder', 'alt_text', 'uploaded_by', 'created_at',
    ];

    public function index(string $tenant): Response
    {
        Gate::authorize('media.view');
        $tenantModel = app('currentTenant');
        $apiRoute = route('tenant.media.list', $tenantModel->slug);

        return Inertia::render('Tenant/Admin/Media/Index', [
            'api_route' => $apiRoute,
        ]);
    }

    public function show(string $tenant, int $id): Response
    {
        Gate::authorize('media.view');
        $media = MediaFile::select(array_merge(self::LIST_SELECT, ['description', 'metadata']))
            ->findOrFail($id);

        return Inertia::render('Tenant/Admin/Media/Show', [
            'media' => $media,
        ]);
    }

    /**
     * Descarga el archivo con Content-Disposition: attachment (misma pestaña, sin abrir).
     */
    public function download(string $tenant, int $id): StreamedResponse
    {
        Gate::authorize('media.view');
        $media = MediaFile::findOrFail($id);

        if (!$media->path || !$media->disk || !Storage::disk($media->disk)->exists($media->path)) {
            abort(404);
        }

        $filename = $media->name ?? basename($media->path) ?: 'download';

        return Storage::disk($media->disk)->download($media->path, $filename, [
            'Content-Type' => $media->mime_type ?? 'application/octet-stream',
        ]);
    }

    public function list(string $tenant, Request $request): JsonResponse
    {
        Gate::authorize('media.view');

        $query = MediaFile::query()->select(self::LIST_SELECT);
        $currentFolder = $request->input('folder');
        if ($currentFolder) {
            $query->where('folder', $currentFolder);
        }

        $paginator = $query->latest()->paginate(self::FILES_PER_PAGE);

        return response()->json([
            'data' => $paginator->items(),
            'current_folder' => $currentFolder,
            'links' => $paginator->linkCollection()->toArray(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function createFolder(string $tenant, CreateMediaFolderRequest $request): JsonResponse
    {
        Gate::authorize('media.upload');

        $exists = MediaFile::where('type', 'folder')
            ->where('name', $request->validated('name'))
            ->where('folder', $request->input('parent_folder'))
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Carpeta ya existe'], 422);
        }

        try {
            $folder = MediaFile::create([
                'name' => $request->validated('name'),
                'type' => 'folder',
                'folder' => $request->input('parent_folder'),
                'disk' => 'bunny',
                'path' => null,
                'uploaded_by' => auth()->id(),
                'is_public' => true,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error al crear la carpeta. Intenta de nuevo.'], 500);
        }

        return response()->json($folder);
    }

    public function store(string $tenant, StoreMediaFileRequest $request): JsonResponse
    {
        Gate::authorize('media.upload');

        $tenantModel = app('currentTenant');
        $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenantModel->slug ?? ''));
        $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenantModel->id) . '/files';

        $file = $request->file('file');
        try {
            $mimeType = $file->getMimeType();
            $isImage = str_starts_with((string) $mimeType, 'image/');

            if ($isImage) {
                $path = $this->storeImageAsWebp($file, $basePath, 'bunny');
            } else {
                $path = $file->store($basePath, 'bunny');
            }

            $url = Storage::disk('bunny')->url($path);

            $media = MediaFile::create([
                'name' => $file->getClientOriginalName(),
                'path' => $path,
                'url' => $url,
                'disk' => 'bunny',
                'mime_type' => $mimeType,
                'size' => $file->getSize(),
                'extension' => $isImage ? 'webp' : $file->getClientOriginalExtension(),
                'type' => MediaFile::determineType($mimeType),
                'alt_text' => $request->input('alt_text', $file->getClientOriginalName()),
                'folder' => $request->input('folder'),
                'uploaded_by' => auth()->id(),
            ]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error al subir el archivo. Intenta de nuevo.'], 500);
        }

        return response()->json($media, 201);
    }

    public function destroy(string $tenant, int $id): JsonResponse
    {
        Gate::authorize('media.delete');
        $media = MediaFile::findOrFail($id);

        try {
            if ($media->path && $media->disk) {
                try {
                    if (Storage::disk($media->disk)->exists($media->path)) {
                        Storage::disk($media->disk)->delete($media->path);
                    }
                } catch (\Throwable $e) {
                    report($e);
                }
            }
            $media->delete();
        } catch (\Throwable $e) {
            report($e);
            return response()->json(['message' => 'Error al eliminar. Intenta de nuevo.'], 500);
        }

        return response()->json(['message' => 'Archivo eliminado']);
    }
}
