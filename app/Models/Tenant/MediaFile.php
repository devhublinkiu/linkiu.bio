<?php

namespace App\Models\Tenant;

use App\Models\User;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class MediaFile extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $table = 'media_files';

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
        'is_public',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_public' => 'boolean',
        'size' => 'integer',
    ];

    protected $appends = ['full_url', 'size_human', 'type_icon'];

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getFullUrlAttribute(): ?string
    {
        if ($this->url) {
            return $this->url;
        }
        if ($this->path && $this->disk) {
            return Storage::disk($this->disk)->url($this->path);
        }
        return null;
    }

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
        if (in_array($mimeType, [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
        ])) {
            return 'document';
        }
        if (in_array($mimeType, [
            'application/zip',
            'application/x-rar-compressed',
            'application/x-7z-compressed',
        ])) {
            return 'archive';
        }
        return 'other';
    }

    protected static function booted(): void
    {
        static::deleting(function (MediaFile $mediaFile) {
            if (method_exists($mediaFile, 'isForceDeleting') && !$mediaFile->isForceDeleting()) {
                return;
            }
            if ($mediaFile->path && $mediaFile->disk && Storage::disk($mediaFile->disk)->exists($mediaFile->path)) {
                Storage::disk($mediaFile->disk)->delete($mediaFile->path);
            }
        });
    }
}
