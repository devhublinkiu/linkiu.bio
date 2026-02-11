<?php

namespace App\Http\Controllers\Tenant\Gastronomy;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Gastronomy\Customer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = app('currentTenant')->id;
        $search = $request->input('search');

        $query = Customer::where('tenant_id', $tenantId);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('identification_number', 'like', "%{$search}%");
            });
        }

        // Limit results for performance if searching via dropdown
        return response()->json($query->limit(20)->get());
    }

    public function store(Request $request)
    {
        $tenantId = app('currentTenant')->id;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'identification_type' => 'nullable|string',
            'identification_number' => 'nullable|string',
            'address' => 'nullable|string', // Simple string for now, or array if frontend sends object
            'city' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $validated['tenant_id'] = $tenantId;

        $customer = Customer::create($validated);

        return response()->json($customer, 201);
    }
}
