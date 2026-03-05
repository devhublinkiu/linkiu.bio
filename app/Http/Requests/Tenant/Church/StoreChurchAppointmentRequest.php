<?php

namespace App\Http\Requests\Tenant\Church;

use App\Models\Tenant\Church\ChurchAppointment;
use Illuminate\Foundation\Http\FormRequest;

class StoreChurchAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'guest_name' => 'required|string|max:255',
            'guest_phone' => 'required|string|max:50',
            'guest_email' => 'nullable|email|max:255',
            'appointment_type' => 'required|string|in:' . implode(',', [
                ChurchAppointment::TYPE_ORACION,
                ChurchAppointment::TYPE_CONSEJERIA,
                ChurchAppointment::TYPE_REUNION_PASTOR,
                ChurchAppointment::TYPE_OTRO,
            ]),
            'notes' => 'nullable|string|max:2000',
            'consent' => 'required|accepted',
        ];
    }

    public function messages(): array
    {
        return [
            'guest_name.required' => 'El nombre es obligatorio.',
            'guest_phone.required' => 'El teléfono o WhatsApp es obligatorio.',
            'appointment_type.required' => 'Elige un tipo de cita.',
            'consent.accepted' => 'Debes aceptar el uso de tus datos para contactarte.',
        ];
    }
}
