<?php

namespace App\Http\Requests\Tenant\Admin;

use App\Models\Category;
use App\Models\CategoryIcon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('categories.update');
    }

    public function rules(): array
    {
        $tenant = app('currentTenant');
        $categoryId = (int) $this->route('category');

        if (!$tenant) {
            return [];
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
            ->toArray();

        return [
            'name' => 'required|string|max:255',
            'category_icon_id' => ['required', 'integer', Rule::in($allowedIconIds)],
            'parent_id' => [
                'nullable',
                'integer',
                'different:' . $categoryId,
                function ($attribute, $value, $fail) use ($tenant, $categoryId) {
                    if (!$value) {
                        return;
                    }
                    $parentExists = Category::where('id', $value)->where('tenant_id', $tenant->id)->exists();
                    if (!$parentExists) {
                        $fail('La categoría padre no es válida.');
                        return;
                    }
                    // Evitar ciclo: el padre no puede ser un descendiente de la categoría actual
                    $walkId = (int) $value;
                    while ($walkId) {
                        if ($walkId === $categoryId) {
                            $fail('No puedes elegir una subcategoría como padre (crearía un ciclo).');
                            return;
                        }
                        $node = Category::where('tenant_id', $tenant->id)->find($walkId);
                        $walkId = $node ? (int) $node->parent_id : 0;
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
            'parent_id.different' => 'Una categoría no puede ser su propio padre.',
        ];
    }
}
