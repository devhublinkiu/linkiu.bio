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
     * Common validation rules for gastronomy orders.
     */
    protected function getOrderValidationRules(): array
    {
        return [
            'location_id' => 'required|exists:locations,id',
            'service_type' => 'required|string|in:dine_in,takeout,delivery',
            'table_id' => 'nullable|exists:tables,id',
            'customer_id' => 'nullable|integer|exists:gastronomy_customers,id',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'delivery_address' => 'nullable|array',
            'delivery_cost' => 'nullable|numeric',
            'payment_method' => 'nullable|string|in:cash,transfer,card',
            'payment_reference' => 'nullable|string|max:255',
            'payment_proof' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
            'cash_amount' => 'nullable|numeric',
            'cash_change' => 'nullable|numeric',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.variant_options' => 'nullable|array',
            'send_to_kitchen' => 'nullable|boolean',
        ];
    }

    /**
     * Process and store a gastronomy order.
     */
    protected function storeGastronomyOrder(Request $request, string $initialStatus = 'pending', string $source = 'POS')
    {
        $tenant = app('currentTenant');
        $validated = $request->validate($this->getOrderValidationRules());

        try {
            DB::beginTransaction();

            // Handle file upload
            $paymentProofPath = null;
            if ($request->hasFile('payment_proof')) {
                // Linkiu v2: Siempre usar disco 'bunny'
                $paymentProofPath = $request->file('payment_proof')->store('payment_proofs', 'bunny');
            }

            // Calculations logic
            $orderTotal = 0;
            $orderSubtotal = 0;
            $orderTaxAmount = 0;
            $taxDetails = [];

            $orderItemsData = [];

            // Global Tax Settings
            $globalTaxName = $tenant->settings['tax_name'] ?? 'IVA';
            $globalTaxRate = floatval($tenant->settings['tax_rate'] ?? 0);
            $globalPriceIncludesTax = filter_var($tenant->settings['price_includes_tax'] ?? false, FILTER_VALIDATE_BOOLEAN);

            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                $unitPrice = $product->price;

                // Variants
                $variants = $item['variant_options'] ?? [];
                if (is_string($variants)) {
                    $variants = json_decode($variants, true);
                }

                if (is_array($variants)) {
                    foreach ($variants as $variant) {
                        if (isset($variant['price'])) {
                            $unitPrice += floatval($variant['price']);
                        }
                    }
                }

                $lineTotal = $unitPrice * $item['quantity'];

                // Tax Logic
                $productTaxRate = $product->tax_rate !== null ? floatval($product->tax_rate) : $globalTaxRate;
                $productTaxName = $product->tax_name !== null ? $product->tax_name : $globalTaxName;
                $productIncludesTax = $product->price_includes_tax !== null ? $product->price_includes_tax : $globalPriceIncludesTax;

                $itemBasePrice = 0;
                $itemTaxAmount = 0;

                if ($productIncludesTax) {
                    $itemBasePrice = $lineTotal / (1 + ($productTaxRate / 100));
                    $itemTaxAmount = $lineTotal - $itemBasePrice;
                }
                else {
                    $itemBasePrice = $lineTotal;
                    $itemTaxAmount = $lineTotal * ($productTaxRate / 100);
                    $lineTotal = $itemBasePrice + $itemTaxAmount;
                }

                $orderTotal += $lineTotal;
                $orderSubtotal += $itemBasePrice;
                $orderTaxAmount += $itemTaxAmount;

                if ($itemTaxAmount > 0) {
                    $key = "$productTaxName ($productTaxRate%)";
                    if (!isset($taxDetails[$key])) {
                        $taxDetails[$key] = 0;
                    }
                    $taxDetails[$key] += $itemTaxAmount;
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

            $cashChange = 0;
            if (isset($validated['payment_method']) && $validated['payment_method'] === 'cash' && isset($validated['cash_amount'])) {
                $cashChange = $validated['cash_amount'] - $finalTotal;
            }

            // Create Order v2 (Location Support)
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
                'total' => $finalTotal,
                'subtotal' => $orderSubtotal,
                'tax_amount' => $orderTaxAmount,
                'tax_details' => $taxDetails,
                'payment_method' => $validated['payment_method'] ?? null,
                'payment_reference' => $validated['payment_reference'] ?? null,
                'payment_proof' => $paymentProofPath,
                'cash_change' => $cashChange > 0 ? $cashChange : 0,
                'created_by' => auth()->id(),
            ]);

            // Table Status v2 (Pago Diferido Fix)
            if ($validated['service_type'] === 'dine_in' && $validated['table_id']) {
                // Si hay método de pago, la mesa se libera. Si no, se queda ocupada.
                if (isset($validated['payment_method']) && $validated['payment_method']) {
                    Table::where('id', $validated['table_id'])->update(['status' => 'available']);
                }
                else {
                    Table::where('id', $validated['table_id'])->update(['status' => 'occupied']);
                }
            }

            // Items
            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            // History
            OrderStatusHistory::create([
                'gastronomy_order_id' => $order->id,
                'user_id' => auth()->id(),
                'from_status' => null,
                'to_status' => $initialStatus,
                'notes' => "Pedido creado desde $source por " . (auth()->user()->name ?? 'Usuario'),
            ]);

            // Events v2 (Kitchen Toggle Fix)
            $sendToKitchen = filter_var($validated['send_to_kitchen'] ?? false, FILTER_VALIDATE_BOOLEAN);

            if ($initialStatus === 'confirmed' || $sendToKitchen) {
                \App\Events\OrderSentToKitchen::dispatch($order);
            }
            else {
                \App\Events\OrderCreated::dispatch($order);
            }

            // Database Notification to Admin (Bell)
            $adminUser = $tenant->users()->where('role', 'admin')->first() ?? $tenant->users()->first();
            if ($adminUser) {
                try {
                    $adminUser->notify(new \App\Notifications\NewOrderNotification($order));
                }
                catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error("Failed to notify admin for order #{$order->id}: " . $e->getMessage());
                }
            }

            DB::commit();

            return $order;

        }
        catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
