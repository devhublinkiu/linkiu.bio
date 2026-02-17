<?php

namespace App\Http\Requests\Tenant\Admin\Gastronomy;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreInventoryItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('inventory.create');
    }

    public function rules(): array
    {
        $tenantId = app('currentTenant')->id;

        return [
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100|unique:inventory_items,sku,NULL,id,tenant_id,' . $tenantId,
            'description' => 'nullable|string|max:1000',
            'unit' => 'required|in:kg,g,l,ml,units,pieces',
            'cost_per_unit' => 'nullable|numeric|min:0',
            'image' => 'nullable|string|max:255',
            'storage_disk' => 'nullable|string|in:s3,bunny',
            'category' => 'nullable|string|max:100',
            'status' => 'required|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del item es obligatorio.',
            'unit.required' => 'La unidad de medida es obligatoria.',
            'unit.in' => 'La unidad de medida no es válida.',
            'sku.unique' => 'El SKU ya está en uso en este negocio.',
            'cost_per_unit.min' => 'El costo no puede ser negativo.',
            'status.required' => 'El estado es obligatorio.',
        ];
    }
}
