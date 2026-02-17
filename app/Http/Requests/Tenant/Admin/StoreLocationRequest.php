<?php

namespace App\Http\Requests\Tenant\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'manager' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:500',
            'is_main' => 'required|boolean',
            'phone' => 'nullable|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'whatsapp_message' => 'nullable|string',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'opening_hours' => 'nullable|array',
            'social_networks' => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la sede es obligatorio.',
            'name.max' => 'El nombre no puede exceder 255 caracteres.',
            'manager.max' => 'El encargado no puede exceder 255 caracteres.',
            'description.max' => 'La descripción no puede exceder 500 caracteres.',
            'is_main.required' => 'Debes indicar si es la sede principal.',
            'phone.max' => 'El teléfono no puede exceder 20 caracteres.',
            'whatsapp.max' => 'El WhatsApp no puede exceder 20 caracteres.',
            'state.max' => 'El departamento no puede exceder 100 caracteres.',
            'city.max' => 'La ciudad no puede exceder 100 caracteres.',
            'latitude.between' => 'La latitud debe estar entre -90 y 90.',
            'longitude.between' => 'La longitud debe estar entre -180 y 180.',
        ];
    }
}
