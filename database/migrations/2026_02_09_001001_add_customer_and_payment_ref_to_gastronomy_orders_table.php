<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('gastronomy_orders', function (Blueprint $table) {
            $table->foreignId('customer_id')->nullable()->constrained('gastronomy_customers')->nullOnDelete();
            $table->string('payment_reference')->nullable();

            // Tax Handling preparation
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->json('tax_details')->nullable(); // Stores breakdown: [{"name": "IVA", "rate": 19, "amount": 1000}]
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gastronomy_orders', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
            $table->dropColumn(['customer_id', 'payment_reference', 'subtotal', 'tax_amount', 'tax_details']);
        });
    }
};
