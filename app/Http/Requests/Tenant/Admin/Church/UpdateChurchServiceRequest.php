<?php

namespace App\Http\Requests\Tenant\Admin\Church;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChurchServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'audience' => 'nullable|string|max:255',
            'service_type' => 'nullable|string|max:255',
            'schedule' => 'nullable|string|max:500',
            'frequency' => 'nullable|string|max:100',
            'duration' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:500',
            'modality' => 'nullable|string|max:100',
            'image_file' => 'nullable|image|max:2048',
            'image_url' => 'nullable|url|max:1024',
            'leader' => 'nullable|string|max:255',
            'contact_info' => 'nullable|string|max:500',
            'external_url' => 'nullable|url|max:1024',
            'order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del servicio es obligatorio.',
            'name.max' => 'El nombre no puede exceder 255 caracteres.',
            'description.max' => 'La descripción no puede exceder 5000 caracteres.',
            'schedule.max' => 'El horario no puede exceder 500 caracteres.',
            'location.max' => 'El lugar no puede exceder 500 caracteres.',
            'image_file.image' => 'El archivo debe ser una imagen.',
            'image_file.max' => 'La imagen no puede superar 2 MB.',
            'image_url.url' => 'La imagen debe ser una URL válida.',
            'image_url.max' => 'La URL de la imagen no puede exceder 1024 caracteres.',
            'external_url.url' => 'El enlace externo debe ser una URL válida.',
            'order.required' => 'El orden es obligatorio.',
            'order.integer' => 'El orden debe ser un número entero.',
            'order.min' => 'El orden no puede ser negativo.',
        ];
    }
}
