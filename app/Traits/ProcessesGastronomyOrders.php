<?php

namespace App\Traits;

use App\Models\Tenant\Gastronomy\Order;
use App\Models\Tenant\Gastronomy\OrderItem;
use App\Models\Tenant\Gastronomy\OrderStatusHistory;
use App\Models\Product;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

trait ProcessesGastronomyOrders
{
    /**
     * Re-using original method name for backward compatibility.
     */
    public function storeGastronomyOrder(Request $request, $defaultStatus = 'pending', $source = 'POS')
    {
        $tenant = app('currentTenant');
        $validated = $request->all();

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
                    'tax_amount' => $itemTaxAmount,
                ];
            }

            $deliveryCost = $validated['delivery_cost'] ?? 0;
            $finalTotal = $orderTotal + $deliveryCost;

            $initialStatus = $defaultStatus;
            if (isset($validated['payment_method']) && $validated['payment_method']) {
                $initialStatus = 'completed';
            }

            $order = null;
            $isNewOrder = false;
            if ($validated['service_type'] === 'dine_in' && $validated['table_id']) {
                $table = Table::find($validated['table_id']);
                $order = $table->activeOrder;
            }

            if (!$order) {
                if (empty($items)) { throw new \Exception("Debes agregar al menos un producto."); }
                $isNewOrder = true;
                $order = Order::create([
                    'tenant_id' => $tenant->id,
                    'location_id' => $validated['location_id'],
                    'status' => $initialStatus,
                    'service_type' => $validated['service_type'],
                    'table_id' => $validated['service_type'] === 'dine_in' ? $validated['table_id'] : null,
                    'customer_id' => $validated['customer_id'] ?? null,
                    'customer_name' => $validated['customer_name'],
                    'customer_phone' => $validated['customer_phone'],
                    'delivery_address' => $validated['service_type'] === 'delivery' ? $validated['delivery_address'] : null,
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

            // Real-time Kitchen logic
            $sendToKitchen = filter_var($validated['send_to_kitchen'] ?? false, FILTER_VALIDATE_BOOLEAN);
            \Illuminate\Support\Facades\Log::info("Kitchen Dispatch Check", [
                'order_id' => $order->id,
                'initialStatus' => $initialStatus,
                'sendToKitchen' => $sendToKitchen,
                'orderStatus' => $order->status
            ]);

            if (($initialStatus === 'confirmed' || $sendToKitchen) && $order->status !== 'completed') {
                // Ensure status is at least 'confirmed' to be visible in KDS
                if ($order->status === 'pending') {
                    $order->update(['status' => 'confirmed']);
                }
                \Illuminate\Support\Facades\Log::info("Dispatching OrderSentToKitchen", ['order_id' => $order->id]);
                \App\Events\OrderSentToKitchen::dispatch($order->fresh(['items.product', 'table', 'creator']));
            }

            DB::commit();
            return $order;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}