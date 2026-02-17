<?php

namespace App\Http\Requests\Shared;

use Illuminate\Foundation\Http\FormRequest;

class StoreMediaFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => 'required|file|max:10240',
            'alt_text' => 'nullable|string|max:255',
            'folder' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Debes seleccionar un archivo.',
            'file.max' => 'El archivo no puede superar 10 MB.',
        ];
    }
}
