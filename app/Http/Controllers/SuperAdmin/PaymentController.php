<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Notifications\PaymentStatusUpdatedNotification;
use App\Events\PaymentStatusUpdatedEvent;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $payments = Invoice::with(['tenant', 'subscription.plan'])
            ->whereIn('status', ['pending', 'pending_review', 'paid', 'rejected', 'overdue'])
            ->orderByRaw("FIELD(status, 'pending_review', 'pending', 'overdue') DESC")
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('SuperAdmin/Billing/Payments/Index', [
            'payments' => $payments
        ]);
    }

    public function update(Request $request, $id) // Accepting ID instead of model binding due to type change
    {
        $invoice = Invoice::with(['subscription', 'tenant'])->findOrFail($id);

        $request->validate([
            'action' => 'required|in:approve,reject',
            'notes' => 'nullable|string'
        ]);

        if ($request->action === 'approve') {
            DB::transaction(function () use ($invoice, $request) {
                // 1. Update Invoice
                $invoice->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                    'admin_notes' => $request->notes
                ]);

                // 2. Extend Subscription
                $subscription = $invoice->subscription;

                if ($subscription) {
                    // Determine duration based on billing cycle
                    $months = match ($subscription->billing_cycle) {
                        'monthly' => 1,
                        'quarterly' => 3,
                        'semiannual' => 6,
                        'yearly' => 12,
                        default => 1
                    };

                    // IMPORTANT: If the subscription already has a valid future ends_at date
                    // (set by processPayment), don't recalculate it. Only extend if truly needed.
                    if ($subscription->ends_at && $subscription->ends_at->isFuture()) {
                        // Subscription already has a valid end date, just activate it
                        $newEnd = $subscription->ends_at;
                        $newStart = $subscription->starts_at ?? now();
                    } elseif (in_array($subscription->status, ['past_due', 'expired', 'trialing', 'on_hold'])) {
                        // Subscription is expired or new, calculate from now
                        $newEnd = now()->addMonths($months);
                        $newStart = now();
                    } else {
                        // Active subscription: extend from current end date
                        $startDate = $subscription->ends_at && $subscription->ends_at->isFuture()
                            ? $subscription->ends_at
                            : now();
                        $newEnd = $startDate->copy()->addMonths($months);
                        $newStart = $subscription->starts_at; // Keep original start
                    }

                    $subscription->update([
                        'status' => 'active',
                        'starts_at' => $newStart,
                        'ends_at' => $newEnd,
                        'next_payment_date' => $newEnd,
                        'trial_ends_at' => null // End trial if paid
                    ]);
                }

                // Notify Tenant Owner (database)
                $owner = $invoice->tenant->users()->wherePivot('role', 'owner')->first();
                if ($owner) {
                    $owner->notify(new PaymentStatusUpdatedNotification($invoice, 'paid', $request->notes));
                }

                // Broadcast real-time event
                broadcast(new PaymentStatusUpdatedEvent($invoice, 'paid', $request->notes));
            });

            return redirect()->back()->with('success', 'Pago aprobado y suscripción extendida exitosamente.');
        }

        if ($request->action === 'reject') {
            $invoice->update([
                'status' => 'pending', // Revert to pending so they can upload again
                'admin_notes' => $request->notes
            ]);

            // Notify Tenant Owner (database)
            $owner = $invoice->tenant->users()->wherePivot('role', 'owner')->first();
            if ($owner) {
                $owner->notify(new PaymentStatusUpdatedNotification($invoice, 'pending', $request->notes));
            }

            // Broadcast real-time event
            broadcast(new PaymentStatusUpdatedEvent($invoice, 'pending', $request->notes));

            return redirect()->back()->with('success', 'Pago rechazado. El cliente puede volver a subir comprobante.');
        }
    }
}
