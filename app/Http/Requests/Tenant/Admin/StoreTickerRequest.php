<?php

namespace App\Http\Requests\Tenant\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTickerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'content' => 'required|string|max:255',
            'link' => 'nullable|url|max:255',
            'background_color' => ['required', 'string', 'max:10', 'regex:/^#[0-9A-Fa-f]{3,8}$/'],
            'text_color' => ['required', 'string', 'max:10', 'regex:/^#[0-9A-Fa-f]{3,8}$/'],
            'order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'content.required' => 'El mensaje del ticker es obligatorio.',
            'content.max' => 'El mensaje no puede exceder 255 caracteres.',
            'link.url' => 'El enlace debe ser una URL válida.',
            'background_color.required' => 'El color de fondo es obligatorio.',
            'background_color.regex' => 'El color de fondo debe ser un código hexadecimal válido.',
            'text_color.required' => 'El color de texto es obligatorio.',
            'text_color.regex' => 'El color de texto debe ser un código hexadecimal válido.',
            'order.required' => 'El orden es obligatorio.',
            'order.integer' => 'El orden debe ser un número entero.',
            'order.min' => 'El orden no puede ser negativo.',
        ];
    }
}
