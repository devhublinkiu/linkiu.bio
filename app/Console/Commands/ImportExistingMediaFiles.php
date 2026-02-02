<?php

namespace App\Console\Commands;

use App\Models\MediaFile;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ImportExistingMediaFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'media:import {--folder=* : Specific folders to import (e.g., plans, uploads)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import existing files from S3 storage into media_files table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $disk = 's3';
        $folders = $this->option('folder') ?: ['plans', 'uploads'];

        $this->info('🔍 Scanning S3 storage for existing files...');
        $this->newLine();

        $totalImported = 0;
        $totalSkipped = 0;

        foreach ($folders as $folder) {
            $this->info("📁 Processing folder: {$folder}");

            try {
                $files = Storage::disk($disk)->allFiles($folder);

                if (empty($files)) {
                    $this->warn("  ⚠️  No files found in {$folder}");
                    continue;
                }

                $this->info("  Found " . count($files) . " file(s)");

                $progressBar = $this->output->createProgressBar(count($files));
                $progressBar->start();

                foreach ($files as $filePath) {
                    // Check if already exists
                    if (MediaFile::where('path', $filePath)->exists()) {
                        $totalSkipped++;
                        $progressBar->advance();
                        continue;
                    }

                    // Get file info
                    $fileName = basename($filePath);
                    $extension = pathinfo($fileName, PATHINFO_EXTENSION);

                    try {
                        $size = Storage::disk($disk)->size($filePath);
                        $mimeType = Storage::disk($disk)->mimeType($filePath);
                        $url = Storage::disk($disk)->url($filePath);
                    } catch (\Exception $e) {
                        $this->warn("\n  ⚠️  Error getting file info for {$fileName}: " . $e->getMessage());
                        $totalSkipped++;
                        $progressBar->advance();
                        continue;
                    }

                    // Determine type
                    $type = MediaFile::determineType($mimeType);

                    // Extract metadata for images
                    $metadata = [];
                    if ($type === 'image') {
                        try {
                            // Try to get image dimensions from S3
                            $tempFile = tempnam(sys_get_temp_dir(), 'img_');
                            file_put_contents($tempFile, Storage::disk($disk)->get($filePath));

                            $imageSize = @getimagesize($tempFile);
                            if ($imageSize) {
                                $metadata = [
                                    'width' => $imageSize[0],
                                    'height' => $imageSize[1],
                                ];
                            }

                            @unlink($tempFile);
                        } catch (\Exception $e) {
                            // Ignore errors
                        }
                    }

                    // Create media file record
                    MediaFile::create([
                        'name' => $fileName,
                        'path' => $filePath,
                        'disk' => $disk,
                        'mime_type' => $mimeType,
                        'size' => $size,
                        'extension' => $extension,
                        'type' => $type,
                        'folder' => $folder,
                        'description' => "Imported from {$folder}",
                        'metadata' => $metadata,
                        'uploaded_by' => null, // Unknown uploader
                        'url' => $url,
                        'is_public' => true,
                    ]);

                    $totalImported++;
                    $progressBar->advance();
                }

                $progressBar->finish();
                $this->newLine(2);

            } catch (\Exception $e) {
                $this->error("  ❌ Error processing folder {$folder}: " . $e->getMessage());
                $this->newLine();
            }
        }

        $this->newLine();
        $this->info('✅ Import completed!');
        $this->table(
            ['Status', 'Count'],
            [
                ['Imported', $totalImported],
                ['Skipped (already exists)', $totalSkipped],
                ['Total', $totalImported + $totalSkipped],
            ]
        );

        return Command::SUCCESS;
    }
}
