<?php

namespace App\Http\Requests\Tenant\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePaymentMethodRequest extends FormRequest
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
            'is_active' => 'nullable|boolean',
            'location_id' => [
                'nullable',
                Rule::exists('locations', 'id')->where('tenant_id', $tenantId),
            ],
            'settings' => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'location_id.exists' => 'La sede seleccionada no es válida.',
        ];
    }
}
