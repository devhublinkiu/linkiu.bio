<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;
use Illuminate\Http\Request;

class InvoiceVerificationController extends Controller
{
    public function verify($invoiceId)
    {
        // Find the invoice with its tenant, subscription, and plan
        $invoice = Invoice::with(['tenant', 'subscription.plan'])
            ->where('id', $invoiceId)
            ->first();

        if (!$invoice) {
            return Inertia::render('Public/Invoice/Verify', [
                'isValid' => false,
                'message' => 'No se pudo encontrar un comprobante con este identificador.'
            ]);
        }

        return Inertia::render('Public/Invoice/Verify', [
            'isValid' => true,
            'invoice' => $invoice,
            'tenant' => $invoice->tenant,
            'plan' => $invoice->subscription?->plan,
            'status' => $invoice->status,
        ]);
    }
}
