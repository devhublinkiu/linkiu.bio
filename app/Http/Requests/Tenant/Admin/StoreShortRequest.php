<?php

namespace App\Http\Requests\Tenant\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreShortRequest extends FormRequest
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
                'required',
                Rule::exists('locations', 'id')->where('tenant_id', $tenantId),
            ],
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:50',
            'link_type' => 'required|in:category,product,external',
            'external_url' => 'nullable|required_if:link_type,external|url|max:500',
            'linkable_type' => 'nullable|required_if:link_type,category,product|string|in:App\Models\Category,App\Models\Product',
            'linkable_id' => [
                'nullable',
                'required_if:link_type,category,product',
                'integer',
                Rule::when($this->input('link_type') === 'category', [
                    Rule::exists('categories', 'id')->where('tenant_id', $tenantId),
                ]),
                Rule::when($this->input('link_type') === 'product', [
                    Rule::exists('products', 'id')->where('tenant_id', $tenantId),
                ]),
            ],
            'short_video' => 'required|file|mimes:mp4,mov|max:51200',
            'sort_order' => 'nullable|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'location_id.required' => 'Debes seleccionar una sede.',
            'name.required' => 'El nombre de la promo es obligatorio.',
            'description.max' => 'La descripción no puede exceder 50 caracteres.',
            'link_type.required' => 'El tipo de enlace es obligatorio.',
            'link_type.in' => 'El tipo de enlace debe ser categoría, producto o URL externa.',
            'external_url.required_if' => 'La URL es obligatoria cuando el enlace es externo.',
            'external_url.url' => 'La URL externa no es válida.',
            'linkable_id.required_if' => 'Debes seleccionar una categoría o producto.',
            'short_video.required' => 'Debes subir el video del short.',
            'short_video.mimes' => 'El video debe ser MP4 o MOV.',
            'short_video.max' => 'El video no puede superar 50 MB.',
        ];
    }
}
