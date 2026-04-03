<?php

namespace App\Console\Commands;

use App\Models\Tenant\All\Short;
use App\Services\BunnyStreamService;
use Illuminate\Console\Command;

class SyncShortsPostersCommand extends Command
{
    protected $signature = 'shorts:sync-posters
                            {--dry-run : Solo mostrar qué se actualizaría, sin guardar}
                            {--force : Sobrescribir poster_url aunque ya exista (si la API devuelve URL)}';

    protected $description = 'Sincroniza poster_url de los shorts desde la API de Bunny Stream (miniatura del vídeo).';

    public function handle(BunnyStreamService $bunny): int
    {
        if (! $bunny->isEnabled()) {
            $this->error('Bunny Stream no está habilitado o falta configuración (BUNNY_STREAM_*).');

            return self::FAILURE;
        }

        if (! config('bunny.stream.cdn_hostname')) {
            $this->warn('Falta BUNNY_STREAM_CDN_HOSTNAME en .env; la API igual puede devolver thumbnailFileName.');
        }

        $dry = $this->option('dry-run');
        $force = $this->option('force');

        $query = Short::query()->whereNotNull('short_video_id');
        $total = $query->count();

        if ($total === 0) {
            $this->info('No hay shorts con short_video_id.');

            return self::SUCCESS;
        }

        $this->info("Procesando {$total} short(s)…");
        $updated = 0;
        $skipped = 0;

        foreach ($query->cursor() as $short) {
            $url = $bunny->getPublicThumbnailUrlForVideo($short->short_video_id);

            if (! $url) {
                $this->line("  [{$short->id}] tenant={$short->tenant_id}: sin miniatura en API (¿vídeo aún procesándose?)");
                $skipped++;

                continue;
            }

            if ($short->poster_url === $url) {
                $skipped++;

                continue;
            }

            if ($short->poster_url && ! $force) {
                $this->line("  [{$short->id}] tenant={$short->tenant_id}: ya tiene portada manual o distinta (omite o usa --force)");
                $skipped++;

                continue;
            }

            if ($dry) {
                $this->info("  [DRY] [{$short->id}] tenant={$short->tenant_id} → {$url}");
                $updated++;
            } else {
                $short->update(['poster_url' => $url]);
                $this->info("  [{$short->id}] tenant={$short->tenant_id}: actualizado");
                $updated++;
            }
        }

        $this->newLine();
        $this->info($dry ? "Dry-run: {$updated} actualización(es) posible(s), {$skipped} omitido(s)." : "Listo: {$updated} actualizado(s), {$skipped} omitido(s).");

        return self::SUCCESS;
    }
}
