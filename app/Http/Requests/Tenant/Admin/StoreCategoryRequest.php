<?php

namespace App\Http\Requests\Tenant\Admin;

use App\Models\Category;
use App\Models\CategoryIcon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('categories.create');
    }

    public function rules(): array
    {
        $tenant = app('currentTenant');
        if (!$tenant) {
            return [
                'name' => 'required|string|max:255',
                'category_icon_id' => 'required|exists:category_icons,id',
                'parent_id' => 'nullable|exists:categories,id',
            ];
        }

        $allowedIconIds = CategoryIcon::where('is_active', true)
            ->where(function ($query) use ($tenant) {
                $query->where('is_global', true)
                    ->orWhere(function ($q) use ($tenant) {
                        $q->where('vertical_id', $tenant->vertical_id)
                            ->where(function ($sq) use ($tenant) {
                                $sq->whereNull('business_category_id')
                                    ->orWhere('business_category_id', $tenant->category_id);
                            });
                    });
            })
            ->pluck('id')
            ->all();

        return [
            'name' => 'required|string|max:255',
            'category_icon_id' => ['required', 'integer', Rule::in($allowedIconIds)],
            'parent_id' => [
                'nullable',
                'integer',
                function ($attribute, $value, $fail) use ($tenant) {
                    $exists = Category::where('id', $value)->where('tenant_id', $tenant->id)->exists();
                    if (!$exists) {
                        $fail('La categoría padre no es válida.');
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la categoría es obligatorio.',
            'name.max' => 'El nombre no puede exceder 255 caracteres.',
            'category_icon_id.required' => 'Debes seleccionar un icono.',
            'category_icon_id.in' => 'El icono seleccionado no está disponible.',
        ];
    }
}
