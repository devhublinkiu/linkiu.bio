<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Invoice;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        ]);

        $tenant = app('currentTenant');
        $oldSubscription = $tenant->latestSubscription;
        $newPlan = Plan::findOrFail($request->plan_id);

        \Log::info('[ChangePlan] Starting plan change', [
            'tenant_id' => $tenant->id,
            'old_plan_id' => $oldSubscription->plan_id,
            'new_plan_id' => $newPlan->id,
            'old_status' => $oldSubscription->status,
            'billing_cycle' => $request->billing_cycle,
        ]);

        // Same plan and cycle check
        if ($oldSubscription->plan_id == $newPlan->id && $oldSubscription->billing_cycle == $request->billing_cycle) {
            return back()->with('info', 'Ya te encuentras en este plan y ciclo de facturación.');
        }

        // Check if losing custom slug capability
        $willLoseCustomSlug = false;
        $currentSlug = $tenant->slug;
        $newAutoSlug = null;

        \Log::info('[ChangePlan] Checking slug', [
            'new_plan_allow_custom_slug' => $newPlan->allow_custom_slug,
            'tenant_has_custom_slug' => $tenant->hasCustomSlug(),
            'confirm_slug_loss' => $request->confirm_slug_loss,
        ]);

        if (!$newPlan->allow_custom_slug && $tenant->hasCustomSlug()) {
            // New plan doesn't allow custom slug but tenant has one
            if (!$request->confirm_slug_loss) {
                \Log::info('[ChangePlan] Returning slug warning');
                $newAutoSlug = $tenant->generateAutoSlug();
                return back()->with([
                    'slug_warning' => true,
                    'current_slug' => $currentSlug,
                    'new_auto_slug' => $newAutoSlug,
                    'pending_plan_id' => $newPlan->id,
                    'pending_billing_cycle' => $request->billing_cycle,
                ]);
            }
            $willLoseCustomSlug = true;
        }

        \Log::info('[ChangePlan] Passed slug check');

        $months = $request->billing_cycle === 'yearly' ? 12 : 1;
        $newPrice = $newPlan->getPriceForDuration($months);
        $amountToPay = $newPrice;
        $isUpgrade = false;
        $isDowngrade = false;

        // Calculate pricing based on current subscription state
        // Include both 'active' and 'trialing' subscriptions with an existing plan
        if (in_array($oldSubscription->status, ['active', 'trialing']) && $oldSubscription->plan) {
            $oldMonths = $oldSubscription->billing_cycle === 'yearly' ? 12 : 1;
            $oldPrice = $oldSubscription->plan->getPriceForDuration($oldMonths);

            if ($newPrice > $oldPrice) {
                // UPGRADE: User pays difference
                $isUpgrade = true;
                $daysRemaining = $oldSubscription->days_remaining;
                $totalDays = $oldSubscription->total_days ?: 30;

                // Pro-rated calculation
                // If trialing, they haven't paid anything, so value is 0.
                if ($oldSubscription->status === 'trialing') {
                    $alreadyPaidValue = 0;
                } else {
                    $alreadyPaidValue = ($oldPrice / $totalDays) * $daysRemaining;
                }

                $newPlanValue = ($newPrice / $totalDays) * $daysRemaining;

                // For switching to Annual, usually we charge the full difference or full new price?
                // If switching Monthly -> Yearly. 
                // We should probably just charge the Full Yearly Price minus the Unused Days of Monthly.
                // Simplified Logic for Annual Switch:
                if ($request->billing_cycle === 'yearly' && $oldSubscription->billing_cycle === 'monthly') {
                    $amountToPay = $newPrice - $alreadyPaidValue;
                } else {
                    $amountToPay = max(0, $newPlanValue - $alreadyPaidValue);
                }

                // Ensure positive
                $amountToPay = max(5000, $amountToPay);

            } elseif ($newPrice < $oldPrice) {
                // DOWNGRADE: User already paid more, no charge
                $isDowngrade = true;
                $amountToPay = 0;
            }
        }

        // Revert slug if needed BEFORE updating subscription
        if ($willLoseCustomSlug) {
            $tenant->revertToAutoSlug();
            $tenant->refresh(); // Reload to get new slug
        }

        // Update subscription
        $oldSubscription->update([
            'plan_id' => $newPlan->id,
            'billing_cycle' => $request->billing_cycle,
            'trial_ends_at' => null,
        ]);

        \Log::info('[ChangePlan] After update', [
            'subscription_id' => $oldSubscription->id,
            'new_plan_id_in_model' => $oldSubscription->plan_id,
            'amount_to_pay' => $amountToPay,
            'is_downgrade' => $isDowngrade,
        ]);

        // Only create invoice if there's something to pay
        if ($amountToPay > 0) {
            $invoice = Invoice::create([
                'tenant_id' => $tenant->id,
                'subscription_id' => $oldSubscription->id,
                'amount' => $amountToPay,
                'status' => 'pending',
                'due_date' => now()->addDays(3),
                'admin_notes' => $isUpgrade
                    ? "Excedente por cambio de plan (Prorrateo)."
                    : "Cobro por nuevo ciclo/plan.",
            ]);

            $message = "Has solicitado cambiar al plan {$newPlan->name}. Por favor reporta el pago de $"
                . number_format($amountToPay, 0, ',', '.') . " para activarlo.";
        } else {
            // Downgrade - no payment needed
            $message = "¡Cambio de plan exitoso! Ahora tienes el plan {$newPlan->name}. No requiere pago adicional.";
        }

        if ($willLoseCustomSlug) {
            $message .= " Tu URL personalizada ha sido cambiada a: {$tenant->slug}";
        }

        return redirect()->route('tenant.subscription.index', ['tenant' => $tenant->slug])
            ->with('success', $message);
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
}
