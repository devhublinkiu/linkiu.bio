<?php

namespace App\Http\Requests\Tenant\Gastronomy;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('pos.create');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'identification_type' => 'nullable|string|in:CC,NIT,CE,PP,TI',
            'identification_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del cliente es obligatorio.',
            'name.max' => 'El nombre no puede superar 255 caracteres.',
            'email.email' => 'El correo electrónico no es válido.',
            'phone.max' => 'El teléfono no puede superar 20 caracteres.',
        ];
    }
}
