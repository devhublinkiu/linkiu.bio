<?php

namespace App\Http\Requests\Tenant\Admin\Gastronomy;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreInventoryMovementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('inventory.movements.create');
    }

    public function rules(): array
    {
        $tenantId = app('currentTenant')->id;

        return [
            'inventory_item_id' => ['required', Rule::exists('inventory_items', 'id')->where('tenant_id', $tenantId)],
            'location_id' => ['required', Rule::exists('locations', 'id')->where('tenant_id', $tenantId)],
            'type' => 'required|in:entry,exit',
            'reason' => 'required|in:purchase,adjustment,consumption,waste,transfer,return,initial',
            'quantity' => 'required|numeric|min:0.0001',
            'unit_cost' => 'nullable|numeric|min:0',
            'total_cost' => 'nullable|numeric|min:0',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $type = $this->input('type');
            $reason = $this->input('reason');
            
            // Validar coherencia tipo-razón
            $entryReasons = ['purchase', 'return', 'initial'];
            $exitReasons = ['consumption', 'waste'];
            $bothReasons = ['adjustment', 'transfer'];
            
            if ($type === 'entry' && in_array($reason, $exitReasons)) {
                $validator->errors()->add('reason', 'El motivo no es válido para entradas.');
            }
            
            if ($type === 'exit' && in_array($reason, $entryReasons)) {
                $validator->errors()->add('reason', 'El motivo no es válido para salidas.');
            }

            // Si es compra, exigir unit_cost
            if ($reason === 'purchase' && !$this->input('unit_cost')) {
                $validator->errors()->add('unit_cost', 'El costo unitario es obligatorio para compras.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'inventory_item_id.required' => 'Debes seleccionar un item.',
            'inventory_item_id.exists' => 'El item seleccionado no pertenece a este negocio.',
            'location_id.required' => 'Debes seleccionar una sede.',
            'location_id.exists' => 'La sede seleccionada no pertenece a este negocio.',
            'type.required' => 'El tipo de movimiento es obligatorio.',
            'reason.required' => 'El motivo es obligatorio.',
            'quantity.required' => 'La cantidad es obligatoria.',
            'quantity.min' => 'La cantidad debe ser mayor a 0.',
        ];
    }
}
