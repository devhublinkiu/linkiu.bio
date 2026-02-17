<?php

namespace App\Http\Controllers\Tenant\Gastronomy;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Gastronomy\StoreCustomerRequest;
use App\Models\Tenant\Gastronomy\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CustomerController extends Controller
{
    /**
     * Busca clientes del tenant actual (AJAX para el selector del POS).
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('pos.view');

        /** @var \App\Models\Tenant $tenant */
        $tenant = app('currentTenant');
        $search = $request->input('search');

        $query = Customer::where('tenant_id', $tenant->id);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('identification_number', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $query->select(['id', 'name', 'phone', 'email', 'identification_number', 'address', 'notes'])
                  ->limit(20)
                  ->get()
        );
    }

    /**
     * Crea un nuevo cliente para el tenant actual.
     */
    public function store(StoreCustomerRequest $request): JsonResponse
    {
        Gate::authorize('pos.create');

        /** @var \App\Models\Tenant $tenant */
        $tenant = app('currentTenant');

        $validated = $request->validated();
        $validated['tenant_id'] = $tenant->id;

        $customer = Customer::create($validated);

        return response()->json($customer, 201);
    }
}
