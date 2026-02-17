<?php

namespace App\Http\Requests\Tenant\Admin\Gastronomy;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateLocationReservationSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('reservations.update');
    }

    public function rules(): array
    {
        return [
            'reservation_price_per_person' => 'required|numeric|min:0',
            'reservation_min_anticipation' => 'required|numeric|min:0',
            'reservation_slot_duration' => 'required|integer|min:15|max:240',
            'reservation_payment_proof_required' => 'required|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'reservation_price_per_person.required' => 'El precio por persona es obligatorio.',
            'reservation_price_per_person.min' => 'El precio no puede ser negativo.',
            'reservation_min_anticipation.required' => 'La anticipación mínima es obligatoria.',
            'reservation_min_anticipation.min' => 'La anticipación no puede ser negativa.',
            'reservation_slot_duration.required' => 'La duración es obligatoria.',
            'reservation_slot_duration.min' => 'La duración debe ser al menos 15 minutos.',
            'reservation_slot_duration.max' => 'La duración no puede exceder 240 minutos.',
            'reservation_payment_proof_required.required' => 'Debes indicar si se requiere comprobante.',
        ];
    }
}
