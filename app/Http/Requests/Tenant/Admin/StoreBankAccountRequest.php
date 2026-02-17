<?php

namespace App\Http\Requests\Tenant\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBankAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $lid = $this->input('location_id');
        if ($lid === '' || $lid === 'all') {
            $this->merge(['location_id' => null]);
        }
    }

    public function rules(): array
    {
        $tenantId = app('currentTenant')?->id;

        return [
            'bank_name' => ['required', 'string', 'max:255'],
            'account_type' => ['required', 'string', 'max:255'],
            'account_number' => ['required', 'string', 'max:255'],
            'account_holder' => ['required', 'string', 'max:255'],
            'holder_id' => ['nullable', 'string', 'max:255'],
            'location_id' => [
                'nullable',
                Rule::exists('locations', 'id')->where('tenant_id', $tenantId),
            ],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'bank_name.required' => 'El banco es obligatorio.',
            'bank_name.max' => 'El nombre del banco no puede exceder 255 caracteres.',
            'account_type.required' => 'El tipo de cuenta es obligatorio.',
            'account_type.max' => 'El tipo de cuenta no puede exceder 255 caracteres.',
            'account_number.required' => 'El número de cuenta es obligatorio.',
            'account_number.max' => 'El número de cuenta no puede exceder 255 caracteres.',
            'account_holder.required' => 'El titular de la cuenta es obligatorio.',
            'account_holder.max' => 'El titular no puede exceder 255 caracteres.',
            'holder_id.max' => 'La cédula o NIT no puede exceder 255 caracteres.',
            'location_id.exists' => 'La sede seleccionada no es válida.',
        ];
    }
}
