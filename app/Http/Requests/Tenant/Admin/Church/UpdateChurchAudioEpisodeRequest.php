<?php

namespace App\Http\Requests\Tenant\Admin\Church;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChurchAudioEpisodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'audio_file' => 'nullable|file|mimes:mp3,mpeg,wav,ogg,m4a|max:102400',
            'duration_seconds' => 'required|integer|min:0',
            'sort_order' => 'required|integer|min:0',
            'is_published' => 'boolean',
        ];
    }
}
