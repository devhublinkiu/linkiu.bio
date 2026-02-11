<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\TenantBankAccount;
use App\Models\TenantPaymentMethod;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentMethodController extends Controller
{
    private function ensureDefaultMethods(Tenant $tenant)
    {
        $defaults = [
            'bank_transfer' => ['is_active' => false, 'settings' => ['require_proof' => true]],
            'cash' => ['is_active' => false, 'settings' => ['ask_change' => true]],
            'dataphone' => ['is_active' => false, 'settings' => []],
        ];

        foreach ($defaults as $type => $data) {
            $tenant->paymentMethods()->firstOrCreate(
                ['type' => $type, 'location_id' => null],
                $data
            );
        }
    }

    public function index(Request $request)
    {
        Gate::authorize('payment_methods.view');

        $tenant = app('currentTenant');
        $this->ensureDefaultMethods($tenant);

        // Get current user's assigned location (Direct DB Query to avoid relation caching)
        $userLocationId = null;
        if (auth()->check()) {
            // Check if user is owner - Owner always sees everything (Global)
            if ($tenant->owner_id === auth()->id()) {
                $userLocationId = null;
            } else {
                $pivot = DB::table('tenant_user')
                    ->where('tenant_id', $tenant->id)
                    ->where('user_id', auth()->id())
                    ->first();
                $userLocationId = $pivot?->location_id;
            }
        }

        $paymentMethodsQuery = $tenant->paymentMethods()->with('location');
        $bankAccountsQuery = $tenant->bankAccounts()->with('location');

        // If user has a specific location assigned, filter to show only Global + Their Location
        if ($userLocationId) {
            $paymentMethodsQuery->where(function ($q) use ($userLocationId) {
                $q->whereNull('location_id')->orWhere('location_id', $userLocationId);
            });
            $bankAccountsQuery->where(function ($q) use ($userLocationId) {
                $q->whereNull('location_id')->orWhere('location_id', $userLocationId);
            });
        }

        return Inertia::render('Tenant/Admin/PaymentMethods/Index', [
            'tenant' => $tenant,
            'paymentMethods' => $paymentMethodsQuery->get(),
            'bankAccounts' => $bankAccountsQuery->get(),
            'locations' => Location::where('tenant_id', $tenant->id)->active()->get(),
            'userLocationId' => $userLocationId,
        ]);
    }

    public function updateMethod(Request $request, $tenant, $method)
    {
        Gate::authorize('payment_methods.update');

        if (!($method instanceof TenantPaymentMethod)) {
            $method = TenantPaymentMethod::findOrFail($method);
        }

        $currentTenant = app('currentTenant');
        if ($method->tenant_id !== $currentTenant->id)
            abort(403);

        $validated = $request->validate([
            'is_active' => 'boolean',
            'location_id' => 'nullable|exists:locations,id',
            'settings' => 'nullable|array',
        ]);

        $method->update($validated);

        return back()->with('success', 'Método de pago actualizado');
    }

    public function storeAccount(Request $request)
    {
        Gate::authorize('payment_methods.create');

        $tenant = app('currentTenant');

        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_type' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'account_holder' => 'required|string|max:255',
            'holder_id' => 'nullable|string|max:255',
            'location_id' => 'nullable|exists:locations,id',
            'is_active' => 'boolean',
        ]);

        $tenant->bankAccounts()->create($validated);

        return back()->with('success', 'Cuenta bancaria agregada exitosamente');
    }

    public function updateAccount(Request $request, $tenant, $account)
    {
        Gate::authorize('payment_methods.update');

        if (!($account instanceof TenantBankAccount)) {
            $account = TenantBankAccount::findOrFail($account);
        }
        $currentTenant = app('currentTenant');

        if ($account->tenant_id !== $currentTenant->id)
            abort(403);

        $validated = $request->validate([
            'bank_name' => 'sometimes|string|max:255',
            'account_type' => 'sometimes|string|max:255',
            'account_number' => 'sometimes|string|max:255',
            'account_holder' => 'sometimes|string|max:255',
            'holder_id' => 'nullable|string|max:255',
            'location_id' => 'nullable|exists:locations,id',
            'is_active' => 'sometimes|boolean',
        ]);

        $account->update($validated);

        return back()->with('success', 'Cuenta bancaria actualizada');
    }

    public function destroyAccount(Request $request, $tenant, $account)
    {
        Gate::authorize('payment_methods.delete');

        if (!($account instanceof TenantBankAccount)) {
            $account = TenantBankAccount::findOrFail($account);
        }
        $currentTenant = app('currentTenant');

        if ($account->tenant_id !== $currentTenant->id)
            abort(403);

        $account->delete();

        return back()->with('success', 'Cuenta bancaria eliminada');
    }
}
