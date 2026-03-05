<?php

namespace App\Http\Requests\Tenant\Church;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreChurchDonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tenantId = app()->bound('currentTenant') ? app('currentTenant')->id : null;

        return [
            'donor_name' => 'required|string|max:255',
            'donor_phone' => 'required|string|max:50',
            'amount' => 'required|numeric|min:1',
            'bank_account_id' => [
                'nullable',
                'integer',
                $tenantId ? Rule::exists('tenant_bank_accounts', 'id')->where('tenant_id', $tenantId) : 'exists:tenant_bank_accounts,id',
            ],
            'proof' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'donor_name.required' => 'El nombre es obligatorio.',
            'donor_phone.required' => 'El celular es obligatorio para poder agradecerte.',
            'amount.required' => 'Indica el monto de tu ofrenda.',
            'amount.min' => 'El monto debe ser mayor a cero.',
            'proof.mimes' => 'El comprobante debe ser imagen (JPG, PNG) o PDF.',
            'proof.max' => 'El comprobante no debe superar 5 MB.',
        ];
    }
}
