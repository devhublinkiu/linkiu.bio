<?php

namespace App\Http\Requests\Tenant\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('products.update');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $tenantId = app('currentTenant')->id;

        return [
            'name' => 'required|string|max:255',
            'category_id' => [
                'required',
                'exists:categories,id',
                function ($attribute, $value, $fail) use ($tenantId) {
                    $exists = \App\Models\Category::where('id', $value)
                        ->where('tenant_id', $tenantId)
                        ->exists();
                    if (!$exists) {
                        $fail('La categoría seleccionada no pertenece a este negocio.');
                    }
                },
            ],
            'short_description' => 'nullable|string|max:150',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'sku' => 'nullable|string|max:100',
            'image_file' => 'nullable|image|max:2048',
            'image' => 'nullable|string',
            'gallery_files' => 'nullable|array|max:5',
            'gallery_files.*' => 'image|max:2048',
            'gallery' => 'nullable|array|max:5',
            'gallery.*' => 'string',
            'preparation_time' => 'nullable|integer|min:0',
            'calories' => 'nullable|integer|min:0',
            'allergens' => 'nullable|array',
            'tags' => 'nullable|array',
            'is_available' => 'boolean',
            'is_featured' => 'boolean',
            'status' => 'required|in:active,inactive',
            // Tax Overrides
            'tax_name' => 'nullable|string|max:255',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'price_includes_tax' => 'nullable|boolean',
            // Locations (Opción B: multi-sede)
            'location_ids' => 'nullable|array',
            'location_ids.*' => [
                'integer',
                'exists:locations,id',
                function ($attribute, $value, $fail) use ($tenantId) {
                    $exists = \App\Models\Tenant\Locations\Location::where('id', $value)
                        ->where('tenant_id', $tenantId)
                        ->exists();
                    if (!$exists) {
                        $fail('La sede seleccionada no pertenece a este negocio.');
                    }
                },
            ],
            // Variants
            'variant_groups' => 'nullable|array',
            'variant_groups.*.name' => 'required_with:variant_groups|string|max:255',
            'variant_groups.*.type' => 'required_with:variant_groups|in:radio,checkbox',
            'variant_groups.*.min_selection' => 'required_with:variant_groups|integer|min:0',
            'variant_groups.*.max_selection' => 'required_with:variant_groups|integer|min:1',
            'variant_groups.*.is_required' => 'boolean',
            'variant_groups.*.sort_order' => 'integer',
            'variant_groups.*.options' => 'present|array',
            'variant_groups.*.options.*.name' => 'required|string|max:255',
            'variant_groups.*.options.*.price_adjustment' => 'numeric|min:0',
            'variant_groups.*.options.*.is_available' => 'boolean',
            'variant_groups.*.options.*.sort_order' => 'integer',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del producto es obligatorio.',
            'category_id.required' => 'La categoría es obligatoria.',
            'category_id.exists' => 'La categoría seleccionada no es válida.',
            'price.required' => 'El precio es obligatorio.',
            'image_file.image' => 'El archivo debe ser una imagen.',
            'image_file.max' => 'La imagen no puede pesar más de 2MB.',
            'gallery_files.max' => 'La galería puede tener un máximo de 5 imágenes.',
            'variant_groups.array' => 'El formato de las variantes no es válido.',
            'variant_groups.*.name.required' => 'El nombre del grupo es obligatorio.',
            'variant_groups.*.name.max' => 'El nombre del grupo no puede exceder 255 caracteres.',
            'variant_groups.*.options.present' => 'El grupo debe tener opciones.',
            'variant_groups.*.options.*.name.required' => 'El nombre de la opción es obligatorio.',
            'variant_groups.*.options.*.price_adjustment.numeric' => 'El precio debe ser un número.',
            'variant_groups.*.options.*.price_adjustment.min' => 'El precio no puede ser negativo.',
            'location_ids.array' => 'Las sedes deben ser un listado válido.',
        ];
    }
}
