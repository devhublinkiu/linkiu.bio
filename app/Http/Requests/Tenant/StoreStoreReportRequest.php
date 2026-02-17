<?php

namespace App\Http\Requests\Tenant;

use Illuminate\Foundation\Http\FormRequest;

class StoreStoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category' => 'required|string|in:problema_pedido,publicidad_enganosa,trato_indebido,producto_servicio,otro',
            'message' => 'required|string|max:2000',
            'reporter_email' => 'nullable|email|max:255',
            'reporter_whatsapp' => 'nullable|string|max:30',
            'image' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp|max:5120',
            'url_context' => 'nullable|string|max:500',
        ];
    }

    public function attributes(): array
    {
        return [
            'category' => 'categoría',
            'message' => 'mensaje',
            'reporter_email' => 'correo',
            'reporter_whatsapp' => 'WhatsApp',
            'image' => 'imagen',
        ];
    }
}
