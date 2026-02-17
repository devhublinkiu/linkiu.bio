<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\TenantLegalPage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Vistas públicas de páginas legales (todas las verticales).
 * GET /{tenant}/legal/{slug}
 */
class LegalController extends Controller
{
    public function show(Request $request, string $slug): Response
    {
        $tenant = Tenant::where('slug', $request->route('tenant'))->firstOrFail();
        $slugs = TenantLegalPage::legalSlugs();
        if (!isset($slugs[$slug])) {
            $slug = $request->segment(3);
            if (!$slug || !isset($slugs[$slug])) {
                abort(404, 'Página no encontrada.');
            }
        }
        $page = TenantLegalPage::where('tenant_id', $tenant->id)->where('slug', $slug)->first();
        $title = $slugs[$slug];
        $content = $page?->content ?? '';

        // Una sola vista pública transversal para todas las verticales (buenas prácticas)
        return Inertia::render('Tenant/Public/Legal/Show', [
            'tenant' => $tenant,
            'legalPage' => [
                'slug' => $slug,
                'title' => $title,
                'content' => $content,
            ],
        ]);
    }
}
