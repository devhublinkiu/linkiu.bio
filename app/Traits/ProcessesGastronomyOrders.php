<?php

namespace App\Traits;

use App\Models\Tenant\Gastronomy\Order;
use App\Models\Tenant\Gastronomy\OrderItem;
use App\Models\Tenant\Gastronomy\OrderStatusHistory;
use App\Models\Product;
use App\Models\Table;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

trait ProcessesGastronomyOrders
{
    /**
     * Crea o actualiza una orden gastronómica a partir del request validado.
     *
     * @param  Request|FormRequest  $request
     * @param  string               $defaultStatus
     * @param  string               $source
     * @return Order
     *
     * @throws \Exception
     */
    public function storeGastronomyOrder(Request $request, string $defaultStatus = 'pending', string $source = 'POS'): Order
    {
        /** @var \App\Models\Tenant $tenant */
        $tenant = app('currentTenant');

        // CRITICAL: usar validated() para respetar las reglas del FormRequest
        $validated = $request instanceof FormRequest
            ? $request->validated()
            : $request->all();

        try {
            DB::beginTransaction();

            $paymentProofPath = null;
            if ($request->hasFile('payment_proof')) {
                $paymentProofPath = $request->file('payment_proof')->store('payment_proofs', 'bunny');
            }

            $orderTotal = 0;
            $orderSubtotal = 0;
            $orderTaxAmount = 0;
            $taxDetails = [];
            $orderItemsData = [];

            $globalTaxName = $tenant->settings['tax_name'] ?? 'IVA';
            $globalTaxRate = floatval($tenant->settings['tax_rate'] ?? 0);
            $globalPriceIncludesTax = filter_var($tenant->settings['price_includes_tax'] ?? false, FILTER_VALIDATE_BOOLEAN);

            $items = $validated['items'] ?? [];
            foreach ($items as $item) {
                $product = Product::find($item['product_id']);

                // IDOR: verificar que el producto pertenece al tenant actual
                if (!$product || (int) $product->tenant_id !== (int) $tenant->id) {
                    throw new \Exception("Producto #{$item['product_id']} no pertenece a este negocio.");
                }

                $unitPrice = floatval($product->price);

                $variants = $item['variant_options'] ?? [];
                if (is_string($variants)) { $variants = json_decode($variants, true); }
                if (is_array($variants)) {
                    foreach ($variants as $variant) {
                        if (isset($variant['price'])) { $unitPrice += floatval($variant['price']); }
                    }
                }

                $lineTotal = $unitPrice * $item['quantity'];
                $productTaxRate = $product->tax_rate !== null ? floatval($product->tax_rate) : $globalTaxRate;
                $productTaxName = $product->tax_name !== null ? $product->tax_name : $globalTaxName;
                $productIncludesTax = $product->price_includes_tax !== null ? $product->price_includes_tax : $globalPriceIncludesTax;

                if ($productIncludesTax) {
                    $itemBasePrice = $lineTotal / (1 + $productTaxRate / 100);
                    $itemTaxAmount = $lineTotal - $itemBasePrice;
                } else {
                    $itemBasePrice = $lineTotal;
                    $itemTaxAmount = $lineTotal * ($productTaxRate / 100);
                    $lineTotal = $itemBasePrice + $itemTaxAmount;
                }

                $orderTotal += $lineTotal;
                $orderSubtotal += $itemBasePrice;
                $orderTaxAmount += $itemTaxAmount;

                if ($itemTaxAmount > 0) {
                    $key = "$productTaxName ($productTaxRate%)";
                    $taxDetails[$key] = ($taxDetails[$key] ?? 0) + $itemTaxAmount;
                }

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => $item['quantity'],
                    'price' => $unitPrice,
                    'total' => $lineTotal,
                    'variant_options' => $variants,
                    'notes' => $item['notes'] ?? null,
                    'tax_amount' => $itemTaxAmount,
                ];
            }

            $deliveryCost = $validated['delivery_cost'] ?? 0;
            $finalTotal = $orderTotal + $deliveryCost;

            $initialStatus = $defaultStatus;

            $order = null;
            $isNewOrder = false;
            if ($validated['service_type'] === 'dine_in' && $validated['table_id']) {
                $table = Table::find($validated['table_id']);
                $order = $table->activeOrder;
            }

            // Si la orden existente ya fue despachada/preparándose, marcar items actuales como 'served' y resetear
            if ($order && in_array($order->status, ['ready', 'preparing'])) {
                $order->items()->where('status', 'active')->update(['status' => 'served']);
                $order->update(['status' => 'confirmed']);
            }

            if (!$order) {
                if (empty($items)) { throw new \Exception("Debes agregar al menos un producto."); }
                $isNewOrder = true;
                $order = Order::create([
                    'tenant_id' => $tenant->id,
                    'location_id' => $validated['location_id'],
                    'status' => $initialStatus,
                    'service_type' => $validated['service_type'],
                    'table_id' => $validated['service_type'] === 'dine_in' ? ($validated['table_id'] ?? null) : null,
                    'customer_id' => $validated['customer_id'] ?? null,
                    'customer_name' => $validated['customer_name'] ?? 'Cliente',
                    'customer_phone' => $validated['customer_phone'] ?? null,
                    'delivery_address' => $validated['service_type'] === 'delivery' ? ($validated['delivery_address'] ?? null) : null,
                    'delivery_cost' => $validated['service_type'] === 'delivery' ? $deliveryCost : null,
                    'total' => 0,
                    'subtotal' => 0,
                    'tax_amount' => 0,
                    'tax_details' => [],
                    'payment_method' => null,
                    'created_by' => auth()->id(),
                ]);
            }

            if ($isNewOrder) {
                $order->update([
                    'total' => $finalTotal,
                    'subtotal' => $orderSubtotal,
                    'tax_amount' => $orderTaxAmount,
                    'tax_details' => $taxDetails,
                    'payment_method' => $validated['payment_method'] ?? null,
                    'payment_reference' => $validated['payment_reference'] ?? null,
                    'payment_proof' => $paymentProofPath,
                    'cash_change' => $validated['cash_change'] ?? null,
                ]);
            } else {
                $currentTaxDetails = $order->tax_details ?? [];
                foreach ($taxDetails as $key => $amount) { $currentTaxDetails[$key] = ($currentTaxDetails[$key] ?? 0) + $amount; }
                
                $updateData = [
                    'total' => $order->total + $orderTotal,
                    'subtotal' => $order->subtotal + $orderSubtotal,
                    'tax_amount' => $order->tax_amount + $orderTaxAmount,
                    'tax_details' => $currentTaxDetails,
                ];

                // Persist payment info if present
                if (isset($validated['payment_method'])) {
                    $updateData['status'] = $initialStatus;
                    $updateData['payment_method'] = $validated['payment_method'];
                    $updateData['payment_reference'] = $validated['payment_reference'] ?? null;
                    $updateData['payment_proof'] = $paymentProofPath ?? $order->payment_proof;
                    $updateData['cash_change'] = $validated['cash_change'] ?? null;
                }

                $order->update($updateData);
            }

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            if ($isNewOrder && $order->table_id) { 
                $order->table->update(['status' => $order->status === 'completed' ? 'available' : 'occupied']); 
            } else if ($order->table_id && $order->status === 'completed') {
                $order->table->update(['status' => 'available']);
            }

            OrderStatusHistory::create([
                'gastronomy_order_id' => $order->id,
                'user_id' => auth()->id(),
                'from_status' => null,
                'to_status' => $initialStatus,
                'notes' => "Pedido creado desde $source",
            ]);

            // Real-time Kitchen logic — preparar datos pero NO emitir aún
            $sendToKitchen = filter_var($validated['send_to_kitchen'] ?? false, FILTER_VALIDATE_BOOLEAN);
            $order->refresh(); // Asegurar estado actualizado en memoria
            $shouldNotifyKitchen = (($initialStatus === 'confirmed' || $sendToKitchen) && $order->status !== 'completed');

            if ($shouldNotifyKitchen && $order->status === 'pending') {
                $order->update(['status' => 'confirmed']);
            }

            DB::commit();

            // Notificación en tiempo real al admin (toast + sonido en vista Pedidos)
            if ($isNewOrder) {
                \App\Events\OrderCreated::dispatch($order->fresh(['items']));
            }

            // Emitir evento a cocina DESPUÉS del commit para que Ably tenga datos persistidos
            if ($shouldNotifyKitchen) {
                \App\Events\OrderSentToKitchen::dispatch($order->fresh(['items.product', 'table', 'creator']));
            }

            // WhatsApp: alerta admin (PE-01) y confirmación cliente (PE-02)
            if ($isNewOrder && $tenant->hasFeature('whatsapp')) {
                $infobip = app(\App\Services\InfobipService::class);
                $totalFormatted = number_format((float) $order->total, 0, ',', '.');

                $adminPhone = $tenant->settings['whatsapp_admin_phone'] ?? null;
                if ($adminPhone) {
                    $infobip->sendTemplate(
                        $adminPhone,
                        'linkiu_order_alert_v1',
                        [
                            (string) $order->id,
                            $order->customer_name ?? 'Cliente',
                            $totalFormatted,
                        ],
                        null
                    );
                }

                // PE-02: confirmación al cliente (pedido recibido)
                $customerPhone = $order->customer_phone ? trim((string) $order->customer_phone) : null;
                if ($customerPhone) {
                    $infobip->sendTemplate(
                        $customerPhone,
                        'linkiu_order_received_v1',
                        [
                            $order->customer_name ?? 'Cliente',
                            (string) $order->id,
                            $tenant->name,
                            $totalFormatted,
                        ],
                        "{$tenant->slug}/sedes"
                    );
                }
            }

            return $order;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}