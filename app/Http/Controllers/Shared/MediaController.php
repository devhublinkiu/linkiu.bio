<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index()
    {
        $tenant = app()->bound('currentTenant') ? app('currentTenant') : null;

        if (!$tenant && !auth()->user()->is_super_admin && !auth()->user()->hasGlobalPermission('sa.media.view')) {
            abort(403, 'Acceso denegado.');
        }

        // If Tenant, use tenant API. If Global (SuperAdmin), use global API.
        $apiRoute = $tenant ? route('tenant.media.list', $tenant->slug) : route('media.list');

        return \Inertia\Inertia::render('Shared/Media/Index', [
            'api_route' => $apiRoute
        ]);
    }

    public function list(Request $request)
    {
        $tenant = app()->bound('currentTenant') ? app('currentTenant') : null;

        // Security Check
        if (!$tenant && !auth()->user()->is_super_admin && !auth()->user()->hasGlobalPermission('sa.media.view')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = MediaFile::query();

        if ($tenant) {
            $query->where('tenant_id', $tenant->id);
        } else {
            // Global view: Only show global files (SuperAdmin files)
            // Strict isolation: SuperAdmin sees only global files here.
            $query->whereNull('tenant_id');
        }

        // Folder Logic
        $currentFolder = $request->input('folder');

        if ($currentFolder) {
            $query->where('folder', $currentFolder);
        } else {
            $query->whereNull('folder');
        }

        $files = $query->latest()->get();

        return response()->json([
            'data' => $files,
            'current_folder' => $currentFolder
        ]);
    }

    public function createFolder(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $tenant = app()->bound('currentTenant') ? app('currentTenant') : null;

        if (!$tenant && !auth()->user()->is_super_admin && !auth()->user()->hasGlobalPermission('sa.media.upload')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Prevent duplicate folders in same parent
        $exists = MediaFile::where('type', 'folder')
            ->where('name', $request->name)
            ->where('folder', $request->input('parent_folder')) // Parent of this folder
            ->when($tenant, fn($q) => $q->where('tenant_id', $tenant->id))
            ->when(!$tenant, fn($q) => $q->whereNull('tenant_id'))
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Carpeta ya existe'], 422);
        }

        $folder = MediaFile::create([
            'tenant_id' => $tenant ? $tenant->id : null,
            'name' => $request->name,
            'type' => 'folder',
            'folder' => $request->input('parent_folder'), // The parent this folder belongs to
            'disk' => 'public', // Placeholder, folders don't really have a disk
            'path' => null, // Virtual folder, no physical path
            'is_public' => true,
        ]);

        return response()->json($folder);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'alt_text' => 'nullable|string',
            'folder' => 'nullable|string',
        ]);

        $tenant = app()->bound('currentTenant') ? app('currentTenant') : null;

        if ($tenant) {
            // Check permission for tenant users
            if (!$request->user()->can('media.upload')) {
                abort(403, 'No tienes permisos para subir archivos.');
            }
        } elseif (!auth()->user()->is_super_admin && !auth()->user()->hasGlobalPermission('sa.media.upload')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $file = $request->file('file');
        $tenantId = $tenant ? $tenant->id : null;

        // Path structure: uploads/{tenant_id}/filename.ext
        $directory = 'uploads/' . ($tenantId ?: 'global');

        $path = $file->store($directory, 'public');
        $url = Storage::disk('public')->url($path);

        $media = MediaFile::create([
            'tenant_id' => $tenantId,
            'name' => $file->getClientOriginalName(), // Required by DB
            'path' => $path,
            'url' => $url,
            'disk' => 'public',
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'extension' => $file->getClientOriginalExtension(),
            'type' => MediaFile::determineType($file->getMimeType()),
            'alt_text' => $request->input('alt_text', $file->getClientOriginalName()),
            'folder' => $request->input('folder'),
        ]);

        return response()->json($media, 201);
    }

    public function destroy($id)
    {
        $media = MediaFile::findOrFail($id);
        $tenant = app()->bound('currentTenant') ? app('currentTenant') : null;

        // Strict Ownership Check
        if ($tenant) {
            // Tenant Permission Check
            if (!auth()->user()->can('media.delete')) {
                abort(403, 'No tienes permisos para eliminar archivos.');
            }

            // Tenant can only delete their own files
            if ($media->tenant_id !== $tenant->id) {
                abort(403, 'No tienes permiso para eliminar este archivo.');
            }
        } else {
            // Global (SuperAdmin)
            if (!auth()->user()->is_super_admin && !auth()->user()->hasGlobalPermission('sa.media.delete')) {
                abort(403, 'Unauthorized');
            }
            // SuperAdmin can delete Global files.
            // Strict isolation: Should they be able to delete Tenant files here?
            // User said "ni las de superadmin entre las tiendas".
            // If I am in Global View, I should see Global Files. So I should delete Global Files.
            // If I try to delete a Tenant file by ID (maliciously), I should probably block it if I'm expecting to manage global.
            // But SuperAdmin technically owns everything.
            // However, to keep it safe and avoid accidental deletion of user data:
            if ($media->tenant_id !== null) {
                // abort(403, 'Desde la vista global solo puedes gestionar archivos globales.');
                // Actually, let's allow SuperAdmin to be god if needed, BUT MediaManager only shows filtered list.
                // The risk is low if list is scoped.
                // Let's enforce strict scope to match list().
                abort(403, 'Esta vista solo permite gestionar archivos globales.');
            }
        }

        if (Storage::disk($media->disk)->exists($media->path)) {
            Storage::disk($media->disk)->delete($media->path);
        }

        $media->delete();

        return response()->json(['message' => 'File deleted']);
    }

    /**
     * Proxy to serve files from S3 when using local URLs (e.g. /media/path/to/file).
     */
    public function file($path)
    {
        // Security: Prevent accessing files outside allowed directories? 
        // For now, S3 is flat, but good to be careful.
        // We will assume "s3" disk is used for all these proxy requests.

        if (!Storage::disk('s3')->exists($path)) {
            abort(404);
        }

        return Storage::disk('s3')->response($path);
    }
}
