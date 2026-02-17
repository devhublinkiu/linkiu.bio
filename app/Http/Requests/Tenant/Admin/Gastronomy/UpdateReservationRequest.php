<?php

namespace App\Http\Requests\Tenant\Admin\Gastronomy;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UpdateReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('reservations.update');
    }

    public function rules(): array
    {
        $tenantId = app('currentTenant')->id;

        return [
            'status' => 'required|in:pending,confirmed,seated,cancelled,no_show',
            'table_id' => [
                'nullable',
                Rule::exists('tables', 'id')->where('tenant_id', $tenantId),
            ],
            'admin_notes' => 'nullable|string|max:1000',
            'reservation_date' => 'nullable|date',
            'reservation_time' => 'nullable|date_format:H:i:s',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'El estado es obligatorio.',
            'status.in' => 'El estado no es válido.',
            'table_id.exists' => 'La mesa seleccionada no pertenece a este negocio.',
            'admin_notes.max' => 'Las notas no pueden exceder 1000 caracteres.',
            'reservation_date.date' => 'La fecha no es válida.',
            'reservation_time.date_format' => 'La hora no es válida.',
        ];
    }
}
