<?php

namespace App\Http\Requests\Tenant\Gastronomy;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('pos.create');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $tenantId = app('currentTenant')->id;

        return [
            'location_id' => [
                'required',
                Rule::exists('locations', 'id')->where('tenant_id', $tenantId),
            ],
            'service_type' => 'required|string|in:dine_in,takeout,delivery',
            'table_id' => [
                'nullable',
                'required_if:service_type,dine_in',
                Rule::exists('tables', 'id')->where('tenant_id', $tenantId),
            ],
            'customer_id' => [
                'nullable',
                'integer',
                Rule::exists('gastronomy_customers', 'id')->where('tenant_id', $tenantId),
            ],
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'delivery_address' => 'nullable|required_if:service_type,delivery|array',
            'delivery_cost' => 'nullable|numeric|min:0',
            'payment_method' => 'nullable|string|in:cash,transfer,card',
            'payment_reference' => 'nullable|string|max:255',
            'payment_proof' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
            'cash_amount' => 'nullable|numeric|min:0',
            'cash_change' => 'nullable|numeric|min:0',
            'items' => 'nullable|array',
            'items.*.product_id' => [
                'required',
                Rule::exists('products', 'id')->where('tenant_id', $tenantId),
            ],
            'items.*.quantity' => 'required|integer|min:1|max:100',
            'items.*.variant_options' => 'nullable|array',
            'send_to_kitchen' => 'nullable|boolean',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'location_id.required' => 'La sede es obligatoria.',
            'location_id.exists' => 'La sede seleccionada no pertenece a este negocio.',
            'service_type.required' => 'El tipo de servicio es obligatorio.',
            'table_id.required_if' => 'La mesa es obligatoria para pedidos de salón.',
            'table_id.exists' => 'La mesa no pertenece a este negocio.',
            'customer_id.exists' => 'El cliente no pertenece a este negocio.',
            'customer_name.required' => 'El nombre del cliente es obligatorio.',
            'payment_proof.mimes' => 'El comprobante debe ser una imagen (jpg, png, webp).',
            'items.*.product_id.exists' => 'Uno de los productos no pertenece a este negocio.',
            'items.*.quantity.max' => 'La cantidad máxima por producto es 100.',
        ];
    }
}
