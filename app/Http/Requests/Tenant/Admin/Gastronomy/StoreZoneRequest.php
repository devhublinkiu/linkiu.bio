<?php

namespace App\Http\Requests\Tenant\Admin\Gastronomy;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreZoneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('tables.create');
    }

    public function rules(): array
    {
        $tenantId = app('currentTenant')->id;

        return [
            'name' => 'required|string|max:100',
            'location_id' => [
                'required',
                Rule::exists('locations', 'id')->where('tenant_id', $tenantId),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la zona es obligatorio.',
            'name.max' => 'El nombre no puede exceder 100 caracteres.',
            'location_id.required' => 'Debes seleccionar una sede.',
            'location_id.exists' => 'La sede seleccionada no pertenece a este negocio.',
        ];
    }
}
