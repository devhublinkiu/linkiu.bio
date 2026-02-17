<?php

namespace App\Http\Requests\Tenant\Admin\Gastronomy;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreWaiterOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('waiters.order');
    }

    public function rules(): array
    {
        $tenantId = app('currentTenant')->id;

        return [
            'service_type' => 'required|string|in:dine_in,takeout,delivery',
            'table_id' => [
                'nullable',
                'required_if:service_type,dine_in',
                'integer',
                Rule::exists('tables', 'id')->where('tenant_id', $tenantId),
            ],
            'customer_name' => 'required|string|max:255',
            'customer_id' => [
                'nullable',
                'integer',
                Rule::exists('gastronomy_customers', 'id')->where('tenant_id', $tenantId),
            ],
            'customer_phone' => 'nullable|string|max:50',
            'location_id' => [
                'required',
                'integer',
                Rule::exists('locations', 'id')->where('tenant_id', $tenantId),
            ],
            'items' => 'required|array|min:1',
            'items.*.product_id' => [
                'required',
                'integer',
                Rule::exists('products', 'id')->where('tenant_id', $tenantId),
            ],
            'items.*.quantity' => 'required|integer|min:1|max:100',
            'items.*.variant_options' => 'nullable|array',
            'items.*.notes' => 'nullable|string|max:200',
            'notes' => 'nullable|string|max:500',
            'send_to_kitchen' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'table_id.exists' => 'La mesa seleccionada no pertenece a este negocio.',
            'items.*.product_id.exists' => 'Uno de los productos no pertenece a este negocio.',
            'location_id.exists' => 'La sede no pertenece a este negocio.',
        ];
    }
}
