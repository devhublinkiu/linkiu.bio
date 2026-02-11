<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class MediaFile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'name',
        'path',
        'url',
        'disk',
        'mime_type',
        'size',
        'extension',
        'type',
        'folder',
        'alt_text',
        'description',
        'metadata',
        'uploaded_by',
        'url',
        'is_public',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_public' => 'boolean',
        'size' => 'integer',
    ];

    protected $appends = ['full_url', 'size_human', 'type_icon'];

    /**
     * Get the user who uploaded the file
     */
    public function uploader()
    {
        return $this->belongsTo(User::class , 'uploaded_by');
    }

    /**
     * Get the full URL of the file
     */
    public function getFullUrlAttribute(): ?string
    {
        if ($this->url) {
            return $this->url;
        }

        if ($this->path) {
            return Storage::disk($this->disk)->url($this->path);
        }

        return null;
    }

    /**
     * Get human-readable file size
     */
    public function getSizeHumanAttribute(): string
    {
        if (!$this->size) {
            return 'Unknown';
        }

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = $this->size;
        $i = 0;

        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Get icon based on file type
     */
    public function getTypeIconAttribute(): string
    {
        return match ($this->type) {
                'image' => 'image',
                'video' => 'video',
                'document' => 'file-text',
                'audio' => 'music',
                'archive' => 'archive',
                default => 'file',
            };
    }

    /**
     * Determine file type from mime type
     */
    public static function determineType(?string $mimeType): string
    {
        if (!$mimeType) {
            return 'other';
        }

        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        }

        if (str_starts_with($mimeType, 'video/')) {
            return 'video';
        }

        if (str_starts_with($mimeType, 'audio/')) {
            return 'audio';
        }

        if (
        in_array($mimeType, [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        ])
        ) {
            return 'document';
        }

        if (
        in_array($mimeType, [
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        ])
        ) {
            return 'archive';
        }

        return 'other';
    }

    /**
     * Delete file from storage when model is deleted (Force Delete)
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($mediaFile) {
            // ONLY delete the physical file if it's a force delete or if soft deletes aren't available
            if (method_exists($mediaFile, 'isForceDeleting') && !$mediaFile->isForceDeleting()) {
                return;
            }

            if ($mediaFile->path && Storage::disk($mediaFile->disk)->exists($mediaFile->path)) {
                Storage::disk($mediaFile->disk)->delete($mediaFile->path);
            }
        });
    }
}
