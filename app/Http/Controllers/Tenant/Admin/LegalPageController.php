<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Models\TenantLegalPage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class LegalPageController extends Controller
{
    protected function getTenant(): \App\Models\Tenant
    {
        $tenant = app('currentTenant');
        if (!$tenant) {
            abort(404, 'Negocio no encontrado.');
        }
        return $tenant;
    }

    /**
     * Update one legal page content.
     * POST body: slug, content
     */
    public function update(Request $request): RedirectResponse
    {
        Gate::authorize('settings.update');
        $tenant = $this->getTenant();
        $validated = $request->validate([
            'slug' => ['required', 'string', 'max:80'],
            'content' => ['nullable', 'string', 'max:100000'],
        ]);
        $slug = $validated['slug'];
        $slugs = TenantLegalPage::legalSlugs();
        if (!isset($slugs[$slug])) {
            abort(404, 'Página legal no encontrada.');
        }
        $page = TenantLegalPage::firstOrCreate(
            ['tenant_id' => $tenant->id, 'slug' => $slug],
            ['title' => $slugs[$slug]]
        );
        $page->update(['content' => $validated['content'] ?? '']);
        return redirect()->back()->with('success', 'Contenido legal guardado.');
    }
}
