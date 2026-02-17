<?php

namespace App\Http\Requests\Tenant\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSliderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tenantId = app('currentTenant')?->id;

        return [
            'location_id' => [
                'sometimes',
                'required',
                Rule::exists('locations', 'id')->where('tenant_id', $tenantId),
            ],
            'name' => 'required|string|max:255',
            'image_path' => 'nullable|image|max:2048',
            'image_path_desktop' => 'nullable|image|max:4096',
            'link_type' => 'required|in:none,internal,external',
            'external_url' => 'nullable|url|max:255',
            'linkable_type' => 'nullable|string|max:255',
            'linkable_id' => 'nullable|integer',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after_or_equal:start_at',
            'active_days' => 'nullable|array',
            'active_days.*' => 'integer|min:0|max:6',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'location_id.required' => 'Debes seleccionar una sede.',
            'location_id.exists' => 'La sede seleccionada no es válida.',
            'name.required' => 'El nombre del slider es obligatorio.',
            'name.max' => 'El nombre no puede exceder 255 caracteres.',
            'image_path.image' => 'El archivo debe ser una imagen.',
            'image_path.max' => 'La imagen no puede superar 2 MB.',
            'image_path_desktop.image' => 'La imagen de escritorio debe ser una imagen.',
            'image_path_desktop.max' => 'La imagen de escritorio no puede superar 4 MB.',
            'link_type.required' => 'El tipo de enlace es obligatorio.',
            'link_type.in' => 'El tipo de enlace no es válido.',
            'external_url.url' => 'La URL externa no es válida.',
            'start_at.date' => 'La fecha de inicio no es válida.',
            'end_at.date' => 'La fecha de fin no es válida.',
            'end_at.after' => 'La fecha de fin debe ser posterior a la de inicio.',
            'sort_order.integer' => 'El orden debe ser un número entero.',
            'sort_order.min' => 'El orden no puede ser negativo.',
        ];
    }
}
