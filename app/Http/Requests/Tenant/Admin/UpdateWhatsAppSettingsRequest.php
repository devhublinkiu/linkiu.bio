<?php

namespace App\Http\Requests\Tenant\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWhatsAppSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'whatsapp_admin_phone' => ['nullable', 'string', 'max:20', 'regex:/^\+?[1-9]\d{1,14}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'whatsapp_admin_phone.regex' => 'El formato del número debe ser internacional (ej: +57310...).',
            'whatsapp_admin_phone.max' => 'El número no puede exceder 20 caracteres.',
        ];
    }
}
