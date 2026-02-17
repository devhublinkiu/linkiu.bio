<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use App\Models\TenantLegalPage;
use Illuminate\Console\Command;
use Illuminate\Http\Request;

class DebugLegalRoute extends Command
{
    protected $signature = 'legal:debug {tenant : Slug del tenant} {slug=terminos-y-condiciones : Slug de la página legal}';
    protected $description = 'Comprueba por qué falla la ruta legal: tenant, slug y respuesta HTTP';

    public function handle(): int
    {
        $tenantSlug = $this->argument('tenant');
        $slug = $this->argument('slug');

        $this->line('');
        $this->info("Diagnóstico: /{$tenantSlug}/legal/{$slug}");
        $this->line('---');

        $tenant = Tenant::where('slug', $tenantSlug)->first();
        if (!$tenant) {
            $this->error("Tenant no encontrado: no existe ningún tenant con slug \"{$tenantSlug}\" en la base de datos.");
            return self::FAILURE;
        }
        $this->info("✓ Tenant encontrado: id={$tenant->id}, name=\"{$tenant->name}\"");

        $slugs = TenantLegalPage::legalSlugs();
        if (!isset($slugs[$slug])) {
            $this->error("Slug legal no válido: \"{$slug}\". Válidos: " . implode(', ', array_keys($slugs)));
            return self::FAILURE;
        }
        $this->info("✓ Slug legal válido: \"{$slugs[$slug]}\"");

        $url = "/{$tenantSlug}/legal/{$slug}";
        $request = Request::create($url, 'GET');
        $request->headers->set('Accept', 'text/html');

        try {
            $response = app()->handle($request);
            $status = $response->getStatusCode();
            if ($status === 200) {
                $this->info("✓ Petición HTTP: {$status} OK");
            } else {
                $this->warn("Petición HTTP: {$status}");
            }
        } catch (\Throwable $e) {
            $this->error($e::class . ': ' . $e->getMessage());
            $this->line($e->getFile() . ':' . $e->getLine());
            return self::FAILURE;
        }

        $this->line('---');
        $this->line('');
        return $status === 200 ? self::SUCCESS : self::FAILURE;
    }
}
