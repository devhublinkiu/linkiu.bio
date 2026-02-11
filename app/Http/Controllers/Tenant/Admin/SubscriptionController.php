<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Invoice;
use App\Models\Subscription;
use App\Models\User;
use App\Notifications\PaymentReportedNotification;
use App\Notifications\PaymentPendingReviewNotification;
use App\Events\PaymentReportedEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SubscriptionController extends Controller
{
    public function index($tenant)
    {
        \Illuminate\Support\Facades\Gate::authorize('billing.view');
        $tenant = app('currentTenant')->load(['latestSubscription.plan', 'vertical']);

        // If tenant has a vertical, filter by it. Otherwise show all public plans.
        $plans = Plan::where('is_public', true)
            ->when($tenant->vertical_id, function ($query) use ($tenant) {
                return $query->where('vertical_id', $tenant->vertical_id);
            })
            ->get();

        $pendingInvoice = Invoice::where('tenant_id', $tenant->id)
            ->whereIn('status', ['pending', 'overdue', 'pending_review'])
            ->latest()
            ->first();

        return Inertia::render('Tenant/Admin/Subscription/Index', [
            'tenant' => $tenant,
            'plans' => $plans,
            'pendingInvoice' => $pendingInvoice,
        ]);
    }

    public function changePlan(Request $request, $tenant)
    {
        \Illuminate\Support\Facades\Gate::authorize('billing.update');
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
            'confirm_slug_loss' => 'sometimes|boolean',
            'slug' => 'sometimes|nullable|string|max:255|alpha_dash',
        ]);

        $tenant = app('currentTenant');
        $oldSubscription = $tenant->latestSubscription;
        $newPlan = Plan::findOrFail($request->plan_id);

        // Same plan and cycle check
        if ($oldSubscription && $oldSubscription->plan_id == $newPlan->id && $oldSubscription->billing_cycle == $request->billing_cycle) {
            return back()->with('info', 'Ya te encuentras en este plan y ciclo de facturación.');
        }

        // Check if losing custom slug capability
        if (!$newPlan->allow_custom_slug && $tenant->hasCustomSlug() && !$request->confirm_slug_loss) {
            return back()->with([
                'slug_warning' => true,
                'current_slug' => $tenant->slug,
                'new_auto_slug' => $tenant->generateAutoSlug(),
                'pending_plan_id' => $newPlan->id,
                'pending_billing_cycle' => $request->billing_cycle,
            ]);
        }

        $months = $request->billing_cycle === 'yearly' ? 12 : 1;
        $newPrice = $newPlan->getPriceForDuration($months);
        $amountToPay = $newPrice;
        $prorationCredit = 0;

        if ($oldSubscription && in_array($oldSubscription->status, ['active', 'trialing']) && $oldSubscription->plan) {
            $oldMonths = $oldSubscription->billing_cycle === 'yearly' ? 12 : 1;
            $oldPrice = $oldSubscription->plan->getPriceForDuration($oldMonths);

            if ($newPrice > $oldPrice) {
                // UPGRADE: Calculate proration
                if ($oldSubscription->status !== 'trialing') {
                    $daysRemaining = $oldSubscription->days_remaining;
                    $totalDays = $oldSubscription->total_days ?: 30;
                    $prorationCredit = ($oldPrice / $totalDays) * $daysRemaining;
                    $amountToPay = max(5000, $newPrice - $prorationCredit);
                }
            } else {
                // DOWNGRADE: Immediate effect, no charge
                $amountToPay = 0;
            }
        }

        // If it's a downgrade or same-price change (rare), apply immediately
        if ($amountToPay <= 0) {
            if ($oldSubscription) {
                $oldSubscription->update([
                    'plan_id' => $newPlan->id,
                    'billing_cycle' => $request->billing_cycle,
                ]);
            } else {
                Subscription::create([
                    'tenant_id' => $tenant->id,
                    'plan_id' => $newPlan->id,
                    'status' => 'active',
                    'billing_cycle' => $request->billing_cycle,
                    'starts_at' => now(),
                    'ends_at' => $request->billing_cycle === 'yearly' ? now()->addYear() : now()->addMonth(),
                ]);
            }

            if (!$newPlan->allow_custom_slug && $tenant->hasCustomSlug()) {
                $tenant->revertToAutoSlug();
            }

            return redirect()->route('tenant.subscription.success', ['tenant' => $tenant->slug]);
        }

        // REDIRECT TO CHECKOUT for upgrades or new plans
        return redirect()->route('tenant.subscription.checkout', [
            'tenant' => $tenant->slug,
            'plan_id' => $newPlan->id,
            'billing_cycle' => $request->billing_cycle,
            'slug' => $request->slug
        ]);
    }

    public function checkout(Request $request, $tenant)
    {
        $tenant = app('currentTenant')->load('latestSubscription.plan');
        $plan = Plan::findOrFail($request->plan_id);
        $billingCycle = $request->billing_cycle;
        $oldSubscription = $tenant->latestSubscription;
        $siteSettings = \App\Models\SiteSetting::first();

        $months = $billingCycle === 'yearly' ? 12 : ($billingCycle === 'quarterly' ? 3 : 1);
        $newPrice = $plan->getPriceForDuration($months);
        $amount = $newPrice;
        $prorationCredit = 0;

        if ($oldSubscription && in_array($oldSubscription->status, ['active', 'trialing']) && $oldSubscription->plan) {
            $oldMonths = $oldSubscription->billing_cycle === 'yearly' ? 12 : ($oldSubscription->billing_cycle === 'quarterly' ? 3 : 1);
            $oldPrice = $oldSubscription->plan->getPriceForDuration($oldMonths);

            if ($newPrice > $oldPrice && $oldSubscription->status !== 'trialing') {
                $daysRemaining = $oldSubscription->days_remaining;
                $totalDays = $oldSubscription->total_days ?: 30;
                $prorationCredit = ($oldPrice / $totalDays) * $daysRemaining;
                $amount = max(5000, $newPrice - $prorationCredit);
            }
        }

        return Inertia::render('Tenant/Admin/Subscription/Checkout', [
            'tenant' => $tenant,
            'plan' => $plan,
            'billing_cycle' => $billingCycle,
            'amount' => $amount,
            'proration_credit' => $prorationCredit,
            'reserved_slug' => $request->slug,
            'bank_details' => [
                'bank_name' => $siteSettings?->bank_name,
                'account_type' => $siteSettings?->bank_account_type,
                'account_number' => $siteSettings?->bank_account_number,
                'account_holder' => $siteSettings?->bank_account_holder,
                'nit' => $siteSettings?->bank_account_nit,
            ]
        ]);
    }

    public function processPayment(Request $request, $tenant)
    {
        $tenant = app('currentTenant');
        $plan = Plan::findOrFail($request->plan_id);

        // 1. Finalize Plan Change (Logic simplified for design phase)
        $subscription = $tenant->latestSubscription;
        if ($subscription) {
            $newEndsAt = $this->calculateEndDate($request->billing_cycle, $subscription->trial_ends_at);

            $subscription->update([
                'plan_id' => $plan->id,
                'billing_cycle' => $request->billing_cycle,
                'status' => 'active', // Assuming success for now
                'ends_at' => $newEndsAt,
            ]);
        } else {
            $newEndsAt = $this->calculateEndDate($request->billing_cycle, $tenant->trial_ends_at);

            $subscription = Subscription::create([
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
                'status' => 'active',
                'billing_cycle' => $request->billing_cycle,
                'starts_at' => now(),
                'ends_at' => $newEndsAt,
            ]);
        }

        // 2. Create Invoice
        $invoice = Invoice::create([
            'tenant_id' => $tenant->id,
            'subscription_id' => $subscription->id,
            'amount' => $request->amount ?? $plan->getPriceForDuration($request->billing_cycle === 'yearly' ? 12 : 1),
            'status' => $request->payment_method === 'transfer' ? 'pending' : 'paid',
            'payment_method' => $request->payment_method,
            'due_date' => now(),
        ]);

        // 3. Handle Receipt Upload if provided (direct from Checkout)
        if ($request->hasFile('proof')) {
            // Using 'public' disk instead of 's3' for better local compatibility
            $path = $request->file('proof')->store('payment-proofs', ['disk' => 'public']);

            $invoice->update([
                'proof_of_payment_path' => $path,
                'status' => 'pending_review',
                'paid_at' => now(),
            ]);

            // Notify SuperAdmins (Safely check if tenant is loaded)
            $superAdmins = User::where('is_super_admin', true)->get();
            /** @var User $admin */
            foreach ($superAdmins as $admin) {
                try {
                    $admin->notify(new PaymentReportedNotification($invoice));
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error("Error notifying SA: " . $e->getMessage());
                }
            }

            // Notify Tenant Owner - Payment Pending Review
            $owner = $tenant->users()->wherePivot('role', 'owner')->first();
            if ($owner) {
                try {
                    $owner->notify(new PaymentPendingReviewNotification($invoice));
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error("Error notifying tenant owner: " . $e->getMessage());
                }
            }

            // Real-time event
            try {
                broadcast(new PaymentReportedEvent($invoice));
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Error broadcasting: " . $e->getMessage());
            }
        }

        // 4. Update Slug if provided
        if ($request->filled('slug') && $plan->allow_custom_slug) {
            $tenant->update(['slug' => $request->slug]);
        }

        // Explicitly using the current tenant's slug for redirect
        return redirect()->to("/{$tenant->slug}/admin/subscription/success?invoice_id={$invoice->id}");
    }

    public function success(Request $request, $tenantSlug)
    {
        $tenant = app('currentTenant')->load('latestSubscription.plan');

        // Fetch invoice safely (check both route param, query and request)
        $invoiceId = $request->invoice_id ?? $request->query('invoice_id');

        $invoice = Invoice::where('tenant_id', $tenant->id)
            ->with(['subscription.plan'])
            ->when($invoiceId, function ($q) use ($invoiceId) {
                return $q->where('id', $invoiceId);
            })
            ->latest()
            ->first();

        if (!$invoice) {
            return redirect()->route('tenant.subscription.index', ['tenant' => $tenant->slug])
                ->with('error', 'No se encontró la factura relacionada.');
        }

        return Inertia::render('Tenant/Admin/Subscription/Success', [
            'tenant' => $tenant,
            'plan' => $tenant->latestSubscription->plan ?? $invoice->subscription?->plan,
            'invoice' => $invoice
        ]);
    }

    public function generateAdvanceInvoice(Request $request, $tenant)
    {
        $tenant = app('currentTenant');
        $subscription = $tenant->latestSubscription;

        if (!$subscription) {
            return back()->with('error', 'No tienes una suscripción activa.');
        }

        $existingPending = Invoice::where('tenant_id', $tenant->id)
            ->whereIn('status', ['pending', 'pending_review', 'overdue'])
            ->exists();

        if ($existingPending) {
            return back()->with('info', 'Ya tienes una factura pendiente o en revisión. Por favor gestiónala en la sección de Facturas.');
        }

        $months = $subscription->billing_cycle === 'yearly' ? 12 : 1;
        $plan = $subscription->plan;

        $invoice = Invoice::create([
            'tenant_id' => $tenant->id,
            'subscription_id' => $subscription->id,
            'amount' => $plan->getPriceForDuration($months),
            'status' => 'pending',
            'due_date' => now()->addDays(3),
        ]);

        return redirect()->route('tenant.invoices.index', ['tenant' => $tenant->slug])
            ->with('success', 'Factura generada correctamente. Ya puedes reportar tu pago anticipado.');
    }

    /**
     * Update tenant slug (reclaim professional URL)
     */
    public function updateSlug(Request $request)
    {
        $tenant = app('currentTenant');
        $subscription = $tenant->latestSubscription;

        // 1. Check if the plan allows custom slugs
        if (!$subscription || !$subscription->plan->allow_custom_slug) {
            return back()->with('error', 'Tu plan actual no permite personalizar la URL. Por favor, mejora tu plan.');
        }

        // 2. Validate the new slug
        $request->validate([
            'slug' => 'required|string|max:255|unique:tenants,slug|alpha_dash',
        ], [
            'slug.unique' => 'Esta URL ya está en uso por otra tienda.',
            'slug.alpha_dash' => 'La URL solo puede contener letras, números y guiones.',
        ]);

        // 3. Update the slug
        $oldSlug = $tenant->slug;
        $tenant->update([
            'slug' => $request->slug,
            'last_slug_changed_at' => now(),
            'slug_changes_count' => $tenant->slug_changes_count + 1,
        ]);

        return redirect()->route('tenant.dashboard', ['tenant' => $tenant->slug])
            ->with('success', "URL actualizada de {$oldSlug} a {$tenant->slug} correctamente.");
    }

    /**
     * Calculate subscription end date based on billing cycle
     */
    private function calculateEndDate($billingCycle, $trialEndsAt = null)
    {
        // Always start from now when activating a paid subscription
        // The trial period is separate and already consumed
        $startDate = now();

        // Add the appropriate duration based on billing cycle
        return match ($billingCycle) {
            'yearly' => $startDate->copy()->addYear(),
            'quarterly' => $startDate->copy()->addMonths(3),
            default => $startDate->copy()->addMonth(),
        };
    }
}
