<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MediaController extends Controller
{
    public function __construct()
    {
        $this->middleware('sa.permission:sa.media.view')->only(['index']);
        $this->middleware('sa.permission:sa.media.upload')->only(['createFolder']); // Folder creation = upload/structure
        $this->middleware('sa.permission:sa.media.update')->only(['moveToFolder']);
    }

    /**
     * Display a listing of media files
     */
    public function index(Request $request)
    {
        // Exclude system files like .keep
        $query = MediaFile::where('name', '!=', '.keep')
            ->with('uploader:id,name,email')
            ->orderBy('created_at', 'desc');

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by folder
        if ($request->filled('folder')) {
            $query->where('folder', $request->folder);
        }

        // Search
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $files = $query->paginate(24)->withQueryString();

        // Get statistics (excluding hidden files)
        $stats = [
            'total' => MediaFile::where('name', '!=', '.keep')->count(),
            'total_size' => MediaFile::where('name', '!=', '.keep')->sum('size'),
            'by_type' => MediaFile::where('name', '!=', '.keep')
                ->selectRaw('type, count(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type'),
        ];

        // Get available folders (including those with only .keep files)
        $folders = MediaFile::select('folder')
            ->distinct()
            ->orderBy('folder')
            ->pluck('folder');

        return Inertia::render('SuperAdmin/Media/Index', [
            'files' => $files,
            'stats' => $stats,
            'folders' => $folders,
            'filters' => $request->only(['type', 'folder', 'search']),
        ]);
    }

    /**
     * Create a new folder
     */
    public function createFolder(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|regex:/^[a-zA-Z0-9_-]+$/',
        ]);

        $folderName = Str::slug($request->name);

        // Check if folder already exists in DB
        if (MediaFile::where('folder', $folderName)->exists()) {
            return back()->withErrors(['name' => 'Esta carpeta ya existe.']);
        }

        try {
            // Create a .keep file to persist the folder structure
            $filename = '.keep';
            $path = $folderName . '/' . $filename;

            // Create empty file in S3
            Storage::disk('s3')->put($path, '');

            // Register in DB so the folder appears in queries
            MediaFile::create([
                'name' => $filename,
                'path' => $path,
                'disk' => 's3',
                'mime_type' => 'application/x-empty',
                'size' => 0,
                'extension' => '',
                'type' => 'other',
                'folder' => $folderName, // This is key for it to appear in the list
                'description' => 'System file to keep folder',
                'uploaded_by' => auth()->id(),
                'url' => Storage::disk('s3')->url($path),
                'is_public' => false,
            ]);

            return back()->with('success', 'Carpeta creada correctamente.');

        } catch (\Exception $e) {
            return back()->withErrors(['name' => 'Error al crear la carpeta: ' . $e->getMessage()]);
        }
    }

    /**
     * Move file to another folder
     */
    public function moveToFolder(Request $request, MediaFile $mediaFile)
    {
        $request->validate([
            'folder' => 'required|string|max:255',
        ]);

        $oldPath = $mediaFile->path;
        $newFolder = $request->folder;
        $filename = basename($oldPath);
        $newPath = $newFolder . '/' . $filename;

        try {
            // Copy file to new location in S3
            Storage::disk('s3')->copy($oldPath, $newPath);

            // Delete old file
            Storage::disk('s3')->delete($oldPath);

            // Update database record
            $mediaFile->update([
                'folder' => $newFolder,
                'path' => $newPath,
                'url' => Storage::disk('s3')->url($newPath),
            ]);

            return back()->with('success', 'Archivo movido correctamente.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al mover el archivo: ' . $e->getMessage()]);
        }
    }
}
