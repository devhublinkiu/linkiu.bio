<?php

namespace App\Http\Requests\Tenant\Admin\Church;

use Illuminate\Foundation\Http\FormRequest;

class StoreChurchDevotionalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'scripture_reference' => 'nullable|string|max:255',
            'scripture_text' => 'nullable|string|max:2000',
            'body' => 'required|string|max:50000',
            'prayer' => 'nullable|string|max:2000',
            'author' => 'nullable|string|max:255',
            'date' => 'required|date',
            'reflection_question' => 'nullable|string|max:500',
            'cover_image_file' => 'nullable|image|max:2048',
            'video_url' => 'nullable|string|max:1024',
            'external_link' => 'nullable|url|max:1024',
            'excerpt' => 'nullable|string|max:500',
            'order' => 'required|integer|min:0',
            'is_published' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'El título es obligatorio.',
            'title.max' => 'El título no puede exceder 255 caracteres.',
            'body.required' => 'La reflexión es obligatoria.',
            'date.required' => 'La fecha es obligatoria.',
            'date.date' => 'La fecha no es válida.',
            'cover_image_file.image' => 'La portada debe ser una imagen.',
            'cover_image_file.max' => 'La imagen no puede superar 2 MB.',
            'video_url.max' => 'La URL del video no puede exceder 1024 caracteres.',
            'external_link.url' => 'El enlace externo debe ser una URL válida.',
            'order.required' => 'El orden es obligatorio.',
            'order.integer' => 'El orden debe ser un número entero.',
            'order.min' => 'El orden no puede ser negativo.',
        ];
    }
}
