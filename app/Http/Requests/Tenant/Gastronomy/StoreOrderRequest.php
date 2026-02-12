<?php

namespace App\Http\Requests\Tenant\Gastronomy;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Middleware handles auth and tenant
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'location_id' => 'required|exists:locations,id',
            'service_type' => 'required|string|in:dine_in,takeout,delivery',
            'table_id' => 'nullable|required_if:service_type,dine_in|exists:tables,id',
            'customer_id' => 'nullable|integer|exists:gastronomy_customers,id',
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
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.variant_options' => 'nullable|array',
            'send_to_kitchen' => 'nullable|boolean',
        ];
    }

    /**
     * Custom error messages in Spanish.
     */
    public function messages(): array
    {
        return [
            'location_id.required' => 'La sede es obligatoria.',
            'location_id.exists' => 'La sede seleccionada no es válida.',
            'service_type.required' => 'El tipo de servicio es obligatorio.',
            'table_id.required_if' => 'La mesa es obligatoria para pedidos de salón.',
            'customer_name.required' => 'El nombre del cliente es obligatorio.',
            'payment_proof.mimes' => 'El comprobante debe ser una imagen (jpg, png, webp).',
        ];
    }
}
