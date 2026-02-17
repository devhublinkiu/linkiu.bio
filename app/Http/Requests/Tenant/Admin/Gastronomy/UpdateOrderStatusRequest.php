<?php

namespace App\Http\Requests\Tenant\Admin\Gastronomy;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateOrderStatusRequest extends FormRequest
{
    /**
     * Transiciones de estado válidas.
     * key = estado actual, value = estados permitidos.
     */
    public const VALID_TRANSITIONS = [
        'pending'   => ['confirmed', 'cancelled'],
        'confirmed' => ['preparing', 'cancelled'],
        'preparing' => ['ready', 'cancelled'],
        'ready'     => ['completed', 'cancelled'],
        'completed' => [], // estado final
        'cancelled' => [], // estado final
    ];

    public function authorize(): bool
    {
        return Gate::allows('orders.update');
    }

    public function rules(): array
    {
        return [
            'status'  => 'required|string|in:pending,confirmed,preparing,ready,completed,cancelled',
            'comment' => 'nullable|string|max:255',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $order = \App\Models\Tenant\Gastronomy\Order::where('id', $this->route('order'))
                ->where('tenant_id', app('currentTenant')->id)
                ->first();

            if (!$order) {
                $validator->errors()->add('order', 'Pedido no encontrado.');
                return;
            }

            $currentStatus = $order->status;
            $newStatus = $this->input('status');

            $allowed = self::VALID_TRANSITIONS[$currentStatus] ?? [];

            if (!in_array($newStatus, $allowed)) {
                $statusLabels = [
                    'pending' => 'Pendiente', 'confirmed' => 'Confirmado',
                    'preparing' => 'En Cocina', 'ready' => 'Listo',
                    'completed' => 'Entregado', 'cancelled' => 'Cancelado',
                ];
                $from = $statusLabels[$currentStatus] ?? $currentStatus;
                $to = $statusLabels[$newStatus] ?? $newStatus;
                $validator->errors()->add('status', "No se puede cambiar de \"{$from}\" a \"{$to}\".");
            }
        });
    }

    public function messages(): array
    {
        return [
            'status.required' => 'El estado es obligatorio.',
            'status.in'       => 'Estado no válido.',
            'comment.max'     => 'El comentario no puede exceder 255 caracteres.',
        ];
    }
}
