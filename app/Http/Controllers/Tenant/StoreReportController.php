<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\StoreStoreReportRequest;
use App\Models\StoreReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class StoreReportController extends Controller
{
    public function store(StoreStoreReportRequest $request): RedirectResponse
    {
        $tenant = app('currentTenant');
        $validated = $request->validated();

        $imagePath = null;
        if ($request->hasFile('image')) {
            $slug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenant->slug ?? ''));
            $basePath = 'uploads/' . ($slug ?: 'tenant-' . $tenant->id) . '/store_reports';
            $imagePath = $request->file('image')->store($basePath, 'bunny');
        }

        StoreReport::create([
            'tenant_id' => $tenant->id,
            'category' => $validated['category'],
            'message' => $validated['message'],
            'reporter_email' => $validated['reporter_email'] ?? null,
            'reporter_whatsapp' => $validated['reporter_whatsapp'] ?? null,
            'image_path' => $imagePath,
            'url_context' => $validated['url_context'] ?? $request->fullUrl(),
            'status' => 'new',
            'ip' => $request->ip(),
        ]);

        return back()->with('success', 'Gracias, hemos recibido tu reporte. Lo revisaremos a la brevedad.');
    }
}
