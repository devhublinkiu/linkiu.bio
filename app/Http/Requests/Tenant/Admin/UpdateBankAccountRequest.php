<?php

namespace App\Http\Requests\Tenant\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBankAccountRequest extends FormRequest
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
            'bank_name' => 'sometimes|string|max:255',
            'account_type' => 'sometimes|string|max:255',
            'account_number' => 'sometimes|string|max:255',
            'account_holder' => 'sometimes|string|max:255',
            'holder_id' => 'nullable|string|max:255',
            'location_id' => [
                'nullable',
                Rule::exists('locations', 'id')->where('tenant_id', $tenantId),
            ],
            'is_active' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'bank_name.max' => 'El nombre del banco no puede exceder 255 caracteres.',
            'account_type.max' => 'El tipo de cuenta no puede exceder 255 caracteres.',
            'account_number.max' => 'El número de cuenta no puede exceder 255 caracteres.',
            'account_holder.max' => 'El titular no puede exceder 255 caracteres.',
            'holder_id.max' => 'La cédula o NIT no puede exceder 255 caracteres.',
            'location_id.exists' => 'La sede seleccionada no es válida.',
        ];
    }
}
