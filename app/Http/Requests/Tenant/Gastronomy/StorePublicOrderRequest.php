<?php

namespace App\Http\Requests\Tenant\Gastronomy;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validación para crear un pedido desde la tienda pública (checkout cliente).
 * No exige permiso POS; cualquier visitante puede enviar el pedido.
 */
class StorePublicOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $tenantId = app('currentTenant')->id;

        return [
            'location_id' => [
                'nullable',
                'required_unless:service_type,dine_in',
                Rule::exists('locations', 'id')->where('tenant_id', $tenantId),
            ],
            'service_type' => 'required|string|in:dine_in,takeout,delivery',
            'table_id' => [
                'nullable',
                'required_if:service_type,dine_in',
                Rule::exists('tables', 'id')->where('tenant_id', $tenantId),
            ],
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'delivery_address' => 'nullable|required_if:service_type,delivery|array',
            'delivery_address.neighborhood' => 'nullable|string|max:255',
            'delivery_address.address' => 'nullable|string',
            'delivery_cost' => 'nullable|numeric|min:0',
            'payment_method' => 'nullable|string|in:cash,transfer,card',
            'payment_proof' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
            'cash_amount' => 'nullable|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.product_id' => [
                'required',
                Rule::exists('products', 'id')->where('tenant_id', $tenantId),
            ],
            'items.*.quantity' => 'required|integer|min:1|max:100',
            'items.*.variant_options' => 'nullable|array',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'location_id.required_unless' => 'La sede es obligatoria para este tipo de pedido.',
            'location_id.exists' => 'La sede no pertenece a este negocio.',
            'service_type.required' => 'El tipo de servicio es obligatorio.',
            'table_id.required_if' => 'La mesa es obligatoria para pedidos en mesa.',
            'table_id.exists' => 'La mesa no pertenece a este negocio.',
            'customer_name.required' => 'Tu nombre es obligatorio.',
            'payment_proof.mimes' => 'El comprobante debe ser una imagen (jpg, png, webp).',
            'items.required' => 'Debes agregar al menos un producto al carrito.',
            'items.*.product_id.exists' => 'Uno de los productos no está disponible.',
            'items.*.quantity.max' => 'La cantidad máxima por producto es 100.',
        ];
    }
}
