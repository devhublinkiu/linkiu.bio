<?php

namespace App\Http\Requests\Tenant\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateShippingMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $lid = $this->input('location_id');
        if ($lid === '' || $lid === 'all') {
            $this->merge(['location_id' => null]);
        }
    }

    public function rules(): array
    {
        $tenantId = app('currentTenant')?->id;

        return [
            'is_active' => 'sometimes|boolean',
            'cost' => 'sometimes|numeric|min:0',
            'free_shipping_min_amount' => 'nullable|numeric|min:0',
            'delivery_time' => 'nullable|string|max:255',
            'instructions' => 'nullable|string',
            'settings' => 'nullable|array',
            'location_id' => [
                'nullable',
                Rule::exists('locations', 'id')->where('tenant_id', $tenantId),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'cost.min' => 'El costo no puede ser negativo.',
            'cost.numeric' => 'El costo debe ser un número.',
            'free_shipping_min_amount.min' => 'El monto mínimo para envío gratis no puede ser negativo.',
            'delivery_time.max' => 'El tiempo de entrega no puede exceder 255 caracteres.',
            'location_id.exists' => 'La sede seleccionada no es válida.',
        ];
    }
}
