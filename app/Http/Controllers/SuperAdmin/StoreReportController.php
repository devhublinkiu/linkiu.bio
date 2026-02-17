<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\StoreReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StoreReportController extends Controller
{
    public function index(Request $request): Response
    {
        $reports = StoreReport::with('tenant:id,name,slug')
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->tenant_id, fn ($q, $id) => $q->where('tenant_id', $id))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $reports->getCollection()->transform(function (StoreReport $report) {
            return [
                'id' => $report->id,
                'tenant_id' => $report->tenant_id,
                'tenant' => $report->tenant ? [
                    'id' => $report->tenant->id,
                    'name' => $report->tenant->name,
                    'slug' => $report->tenant->slug,
                ] : null,
                'category' => $report->category,
                'category_label' => (StoreReport::categories())[$report->category] ?? $report->category,
                'message' => $report->message,
                'message_preview' => \Str::limit($report->message, 80),
                'reporter_email' => $report->reporter_email,
                'reporter_whatsapp' => $report->reporter_whatsapp,
                'image_path' => $report->image_path,
                'image_url' => $report->image_url,
                'url_context' => $report->url_context,
                'status' => $report->status,
                'status_label' => (StoreReport::statuses())[$report->status] ?? $report->status,
                'ip' => $report->ip,
                'created_at' => $report->created_at->toIso8601String(),
            ];
        });

        return Inertia::render('SuperAdmin/StoreReports/Index', [
            'reports' => $reports,
            'filters' => $request->only(['status', 'tenant_id']),
            'statuses' => StoreReport::statuses(),
            'categories' => StoreReport::categories(),
        ]);
    }

    public function updateStatus(Request $request, StoreReport $storeReport): RedirectResponse
    {
        $request->validate([
            'status' => 'required|string|in:new,in_review,resolved,dismissed',
        ]);

        $storeReport->update(['status' => $request->status]);

        return back()->with('success', 'Estado del reporte actualizado.');
    }
}
