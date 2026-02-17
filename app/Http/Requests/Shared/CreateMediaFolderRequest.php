<?php

namespace App\Http\Requests\Shared;

use Illuminate\Foundation\Http\FormRequest;

class CreateMediaFolderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'parent_folder' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la carpeta es obligatorio.',
            'name.max' => 'El nombre no puede exceder 255 caracteres.',
        ];
    }
}
