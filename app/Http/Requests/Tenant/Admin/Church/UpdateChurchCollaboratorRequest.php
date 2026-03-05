<?php

namespace App\Http\Requests\Tenant\Admin\Church;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChurchCollaboratorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'photo_file' => 'nullable|image|max:2048',
            'bio' => 'nullable|string|max:2000',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:64',
            'whatsapp' => 'nullable|string|max:64',
            'order' => 'required|integer|min:0',
            'is_published' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'name.max' => 'El nombre no puede exceder 255 caracteres.',
            'photo_file.image' => 'La foto debe ser una imagen.',
            'photo_file.max' => 'La imagen no puede superar 2 MB.',
            'email.email' => 'El correo debe ser una dirección válida.',
            'order.required' => 'El orden es obligatorio.',
            'order.integer' => 'El orden debe ser un número entero.',
            'order.min' => 'El orden no puede ser negativo.',
        ];
    }
}
