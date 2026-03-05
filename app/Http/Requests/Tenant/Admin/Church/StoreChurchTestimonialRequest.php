<?php

namespace App\Http\Requests\Tenant\Admin\Church;

use Illuminate\Foundation\Http\FormRequest;

class StoreChurchTestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'body' => 'nullable|string|max:5000',
            'video_url' => 'nullable|string|url|max:500',
            'image_file' => 'nullable|image|max:2048',
            'image_url' => 'nullable|string|max:1024',
            'category' => 'nullable|string|max:100',
            'is_featured' => 'boolean',
            'short_quote' => 'nullable|string|max:500',
            'author' => 'nullable|string|max:255',
            'is_published' => 'boolean',
            'order' => 'required|integer|min:0',
        ];
    }
}
