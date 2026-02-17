<?php

namespace App\Http\Requests\Tenant\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShippingZonesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'zones' => 'present|array',
            'zones.*.department_code' => 'required|string|max:10',
            'zones.*.department_name' => 'required|string|max:255',
            'zones.*.city_code' => 'nullable|string|max:10',
            'zones.*.city_name' => 'nullable|string|max:255',
            'zones.*.price' => 'nullable|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'zones.present' => 'Debe enviar la lista de zonas.',
            'zones.*.department_code.required' => 'El código del departamento es obligatorio.',
            'zones.*.department_name.required' => 'El nombre del departamento es obligatorio.',
            'zones.*.price.min' => 'El precio de la zona no puede ser negativo.',
        ];
    }
}
