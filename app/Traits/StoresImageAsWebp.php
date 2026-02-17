<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

/**
 * Convierte una imagen subida a WebP y la guarda en el disco indicado (p. ej. bunny).
 * Cumple con la regla de optimización: imágenes en formato WebP.
 */
trait StoresImageAsWebp
{
    /**
     * Guarda la imagen como WebP en el disco dado.
     *
     * @param  string  $disk  Disco de almacenamiento (ej: 'bunny').
     * @param  int  $maxWidth  Ancho máximo (scaleDown). 0 = no redimensionar.
     * @param  int  $quality  Calidad WebP (1-100).
     */
    protected function storeImageAsWebp(
        UploadedFile $file,
        string $basePath,
        string $disk = 'bunny',
        int $maxWidth = 1920,
        int $quality = 85
    ): string {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeName = substr(preg_replace('/[^a-z0-9\-_]/', '', Str::slug($originalName)), 0, 80) ?: 'image';
        $filename = $safeName . '-' . Str::random(6) . '.webp';
        $path = $basePath . '/' . $filename;

        try {
            $manager = new ImageManager(new Driver());
            $image = $manager->read($file->get());
            if ($maxWidth > 0) {
                $image->scaleDown(width: $maxWidth);
            }
            $encoded = $image->toWebp($quality);
            Storage::disk($disk)->put($path, (string) $encoded);
            return $path;
        } catch (\Throwable $e) {
            return $file->store($basePath, $disk);
        }
    }

    /**
     * Registra el archivo en la tabla media_files para auditoría.
     *
     * @param  string  $path  Ruta del archivo en Bunny
     * @param  string  $disk  Disco de almacenamiento (ej: 'bunny')
     */
    protected function registerMedia(string $path, string $disk = 'bunny'): void
    {
        try {
            $tenant = app('currentTenant');
            if (!$tenant) {
                return;
            }

            $storage = Storage::disk($disk);
            
            \App\Models\Tenant\MediaFile::firstOrCreate(
                ['path' => $path],
                [
                    'tenant_id' => $tenant->id,
                    'name' => basename($path),
                    'disk' => $disk,
                    'size' => $storage->exists($path) ? $storage->size($path) : 0,
                    'mime_type' => $storage->exists($path) ? $storage->mimeType($path) : 'image/webp',
                    'extension' => pathinfo($path, PATHINFO_EXTENSION),
                    'type' => 'image',
                    'folder' => dirname($path),
                    'uploaded_by' => auth()->id(),
                    'url' => $storage->url($path),
                ]
            );
        } catch (\Throwable $e) {
            // Silent fail - no bloquear el proceso si falla el registro
            \Log::warning('No se pudo registrar archivo en media_files: ' . $e->getMessage());
        }
    }
}
