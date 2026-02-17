<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

/**
 * Proxy para servir archivos desde Bunny (uploads/, sliders/) o S3 (legacy).
 * Las rutas tenant.media.* están en Tenant\Admin\Media\MediaController.
 */
class MediaController extends Controller
{
    public function file(string $path)
    {
        $path = ltrim($path, '/');

        $onBunny = str_contains($path, '/sliders/') || str_starts_with($path, 'uploads/');
        if ($onBunny && Storage::disk('bunny')->exists($path)) {
            return Storage::disk('bunny')->response($path);
        }

        if (Storage::disk('bunny')->exists($path)) {
            return Storage::disk('bunny')->response($path);
        }

        abort(404);
    }
}
