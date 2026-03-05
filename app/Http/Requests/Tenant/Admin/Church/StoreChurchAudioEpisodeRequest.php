<?php

namespace App\Http\Requests\Tenant\Admin\Church;

use Illuminate\Foundation\Http\FormRequest;

class StoreChurchAudioEpisodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'audio_file' => 'required|file|mimes:mp3,mpeg,wav,ogg,m4a|max:102400',
            'duration_seconds' => 'required|integer|min:0',
            'sort_order' => 'required|integer|min:0',
            'is_published' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'El título es obligatorio.',
            'audio_file.required' => 'Debes subir un archivo de audio.',
            'audio_file.mimes' => 'El audio debe ser MP3, WAV, OGG o M4A.',
            'audio_file.max' => 'El archivo no puede superar 100 MB.',
            'duration_seconds.required' => 'Indica la duración en segundos.',
        ];
    }
}
