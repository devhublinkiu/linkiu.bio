<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\SiteSetting;
use App\Traits\StoresImageAsWebp;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Notifications\PaymentReportedNotification;
use App\Events\PaymentReportedEvent;

class InvoiceController extends Controller
{
    use StoresImageAsWebp;
    public function index($tenant)
    {
        $tenant = app('currentTenant');

        $invoices = Invoice::where('tenant_id', $tenant->id)
            ->with('subscription.plan')
            ->orderBy('created_at', 'desc')
            ->get();

        $bankDetails = SiteSetting::select([
            'bank_name',
            'bank_account_type',
            'bank_account_number',
            'bank_account_holder',
            'bank_account_nit'
        ])->first();

        return Inertia::render('Tenant/Admin/Invoices/Index', [
            'invoices' => $invoices,
            'bankDetails' => $bankDetails
        ]);
    }

    public function show($tenant, $id)
    {
        $tenant = app('currentTenant');

        $invoice = Invoice::where('tenant_id', $tenant->id)
            ->with(['subscription.plan'])
            ->findOrFail($id);

        $bankDetails = SiteSetting::select([
            'bank_name',
            'bank_account_type',
            'bank_account_number',
            'bank_account_holder',
            'bank_account_nit'
        ])->first();

        return Inertia::render('Tenant/Admin/Invoices/Show', [
            'invoice' => $invoice,
            'bankDetails' => $bankDetails
        ]);
    }

    public function store(Request $request, $tenant)
    {
        $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'proof' => 'required|file|mimes:jpeg,png,jpg,pdf|max:4096',
        ]);

        $invoice = Invoice::where('tenant_id', app('currentTenant')->id)
            ->findOrFail($request->invoice_id);

        if ($request->hasFile('proof')) {
            $tenant = app('currentTenant');
            $tenantSlug = preg_replace('/[^a-z0-9\-]/', '', strtolower($tenant->slug ?? ''));
            $basePath = 'uploads/' . ($tenantSlug ?: 'tenant-' . $tenant->id) . '/payment-proofs';

            try {
                $path = $this->storeImageAsWebp($request->file('proof'), $basePath);
                $this->registerMedia($path, 'bunny');

                $invoice->update([
                    'proof_of_payment_path' => $path,
                    'status' => 'pending_review',
                'paid_at' => now(), // User claims to have paid now
            ]);

            // Notify SuperAdmins (database notification)
            $invoice->load('tenant');
            $superAdmins = User::where('is_super_admin', true)->get();
            foreach ($superAdmins as $admin) {
                $admin->notify(new PaymentReportedNotification($invoice));
            }

            // Broadcast real-time event for toasts
            broadcast(new PaymentReportedEvent($invoice));

            return redirect()->back()->with('success', 'Comprobante subido correctamente. En revisión.');
            } catch (\Throwable $e) {
                if (isset($path)) {
                    Storage::disk('bunny')->delete($path);
                }
                return redirect()->back()->withErrors(['proof' => 'Error al subir el comprobante. Intenta de nuevo.']);
            }
        }

        return redirect()->back()->with('info', 'No se proporcionó comprobante.');
    }
}
