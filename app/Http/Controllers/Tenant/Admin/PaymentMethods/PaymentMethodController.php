<?php

namespace App\Http\Controllers\Tenant\Admin\PaymentMethods;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\StoreBankAccountRequest;
use App\Http\Requests\Tenant\Admin\UpdateBankAccountRequest;
use App\Http\Requests\Tenant\Admin\UpdatePaymentMethodRequest;
use App\Models\Tenant;
use App\Models\Tenant\Locations\Location;
use App\Models\Tenant\Payments\BankAccount;
use App\Models\Tenant\Payments\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PaymentMethodController extends Controller
{
    private function ensureDefaultMethods(Tenant $tenant): void
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

    private function getUserLocationId(Tenant $tenant): ?int
    {
        if (!auth()->check()) {
            return null;
        }
        if ($tenant->owner_id === auth()->id()) {
            return null;
        }
        $pivot = DB::table('tenant_user')
            ->where('tenant_id', $tenant->id)
            ->where('user_id', auth()->id())
            ->first();

        return $pivot?->location_id;
    }

    public function index(Request $request): Response
    {
        Gate::authorize('payment_methods.view');

        $tenant = app('currentTenant');
        $this->ensureDefaultMethods($tenant);

        $userLocationId = $this->getUserLocationId($tenant);

        $paymentMethodsQuery = $tenant->paymentMethods()
            ->select(['id', 'tenant_id', 'location_id', 'type', 'is_active', 'settings', 'gateway_id'])
            ->with('location:id,name');

        $bankAccountsBaseQuery = $tenant->bankAccounts()
            ->select(['id', 'tenant_id', 'location_id', 'bank_name', 'account_type', 'account_number', 'account_holder', 'holder_id', 'is_active', 'sort_order', 'created_at'])
            ->with('location:id,name');

        if ($userLocationId !== null) {
            $paymentMethodsQuery->where(function ($q) use ($userLocationId) {
                $q->whereNull('location_id')->orWhere('location_id', $userLocationId);
            });
            $bankAccountsBaseQuery->where(function ($q) use ($userLocationId) {
                $q->whereNull('location_id')->orWhere('location_id', $userLocationId);
            });
        }

        $paymentMethods = $paymentMethodsQuery->get();
        $bankAccountsLimit = $tenant->getLimit('payment_methods');
        $bankAccountsCount = (clone $bankAccountsBaseQuery)->count();
        $bankAccounts = $bankAccountsBaseQuery->orderBy('sort_order')->orderBy('created_at')
            ->paginate(10)
            ->appends($request->query());

        $locations = Location::select(['id', 'name'])
            ->where('tenant_id', $tenant->id)
            ->active()
            ->orderBy('name')
            ->get();

        return Inertia::render('Tenant/Admin/PaymentMethods/Index', [
            'tenant' => $tenant,
            'paymentMethods' => $paymentMethods,
            'bankAccounts' => $bankAccounts,
            'bank_accounts_limit' => $bankAccountsLimit,
            'bank_accounts_count' => $bankAccountsCount,
            'locations' => $locations,
            'userLocationId' => $userLocationId,
        ]);
    }

    public function updateMethod(UpdatePaymentMethodRequest $request, string $tenant, PaymentMethod|int $method): RedirectResponse
    {
        Gate::authorize('payment_methods.update');

        $currentTenant = app('currentTenant');
        $methodModel = $method instanceof PaymentMethod
            ? $method
            : PaymentMethod::where('tenant_id', $currentTenant->id)->findOrFail((int) $method);

        $methodModel->update($request->validated());

        return back()->with('success', 'Método de pago actualizado');
    }

    public function storeAccount(StoreBankAccountRequest $request): RedirectResponse
    {
        Gate::authorize('payment_methods.create');

        $tenant = app('currentTenant');
        $limit = $tenant->getLimit('payment_methods');
        if ($limit !== null && $tenant->bankAccounts()->count() >= $limit) {
            return back()->withErrors([
                'limit' => "Has alcanzado el máximo de {$limit} cuentas bancarias permitidas en tu plan.",
            ]);
        }

        $validated = $request->validated();

        try {
            $tenant->bankAccounts()->create($validated);
        } catch (\Throwable $e) {
            return back()->with('error', 'No se pudo agregar la cuenta. Intenta de nuevo.');
        }

        return back()->with('success', 'Cuenta bancaria agregada exitosamente');
    }

    public function updateAccount(UpdateBankAccountRequest $request, string $tenant, BankAccount|int $account): RedirectResponse
    {
        Gate::authorize('payment_methods.update');

        $currentTenant = app('currentTenant');
        $accountModel = $account instanceof BankAccount
            ? $account
            : BankAccount::where('tenant_id', $currentTenant->id)->findOrFail((int) $account);

        $validated = $request->validated();

        try {
            $accountModel->update($validated);
        } catch (\Throwable $e) {
            return back()->with('error', 'No se pudo actualizar la cuenta. Intenta de nuevo.');
        }

        return back()->with('success', 'Cuenta bancaria actualizada');
    }

    public function destroyAccount(Request $request, string $tenant, BankAccount|int $account): RedirectResponse
    {
        Gate::authorize('payment_methods.delete');

        $currentTenant = app('currentTenant');
        $accountModel = $account instanceof BankAccount
            ? $account
            : BankAccount::where('tenant_id', $currentTenant->id)->findOrFail((int) $account);

        try {
            $accountModel->delete();
        } catch (\Throwable $e) {
            return back()->with('error', 'No se pudo eliminar la cuenta. Intenta de nuevo.');
        }

        return back()->with('success', 'Cuenta bancaria eliminada');
    }
}
