<?php

namespace App\Http\Requests\Tenant\Admin\Gastronomy;

use App\Models\Zone;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class BulkStoreTablesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('tables.create');
    }

    public function rules(): array
    {
        $tenantId = app('currentTenant')->id;
        return [
            'zone_id' => ['required', Rule::exists('zones', 'id')->where('tenant_id', $tenantId)],
            'location_id' => ['required', Rule::exists('locations', 'id')->where('tenant_id', $tenantId)],
            'prefix' => 'nullable|string|max:50',
            'start_number' => 'required|integer|min:1',
            'count' => 'required|integer|min:1|max:50',
            'capacity' => 'nullable|integer|min:1',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v) {
            $zoneId = $this->input('zone_id');
            $locationId = $this->input('location_id');
            if (!$zoneId || !$locationId) return;
            $zone = Zone::withoutGlobalScopes()->where('id', $zoneId)->where('tenant_id', app('currentTenant')->id)->first();
            if ($zone && (int)$zone->location_id !== (int)$locationId) {
                $v->errors()->add('zone_id', 'La zona seleccionada no pertenece a la sede seleccionada.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'zone_id.required' => 'Debes seleccionar una zona.',
            'zone_id.exists' => 'La zona seleccionada no pertenece a este negocio.',
            'location_id.required' => 'Debes seleccionar una sede.',
            'location_id.exists' => 'La sede seleccionada no pertenece a este negocio.',
            'start_number.required' => 'El número inicial es obligatorio.',
            'start_number.min' => 'El número inicial debe ser al menos 1.',
            'count.required' => 'La cantidad es obligatoria.',
            'count.min' => 'Debes crear al menos 1 mesa.',
            'count.max' => 'No puedes crear más de 50 mesas a la vez.',
            'capacity.min' => 'La capacidad debe ser al menos 1.',
        ];
    }
}
