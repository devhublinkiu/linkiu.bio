<?php

namespace App\Http\Requests\Tenant\Admin\Gastronomy;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateInventoryStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('inventory.stocks.update');
    }

    public function rules(): array
    {
        return [
            'min_stock' => 'required|numeric|min:0',
            'max_stock' => 'nullable|numeric|min:0',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $minStock = $this->input('min_stock');
            $maxStock = $this->input('max_stock');
            
            if ($maxStock && $maxStock < $minStock) {
                $validator->errors()->add('max_stock', 'El stock máximo debe ser mayor o igual al stock mínimo.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'min_stock.required' => 'El stock mínimo es obligatorio.',
            'min_stock.min' => 'El stock mínimo no puede ser negativo.',
            'max_stock.min' => 'El stock máximo no puede ser negativo.',
        ];
    }
}
