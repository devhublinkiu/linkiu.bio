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
        Schema::create('gastronomy_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('status')->default('pending'); // pending, confirmed, completed, cancelled
            $table->string('service_type'); // dine_in, takeout, delivery

            // Service details
            $table->foreignId('table_id')->nullable()->constrained('tables')->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_phone')->nullable();
            $table->json('delivery_address')->nullable(); // For delivery
            $table->decimal('delivery_cost', 12, 2)->nullable();

            // Financial details
            $table->decimal('total', 12, 2);
            $table->string('payment_method'); // cash, transfer, card
            $table->string('payment_proof')->nullable(); // path to file
            $table->decimal('cash_change', 12, 2)->nullable(); // amount given by customer

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gastronomy_orders');
    }
};
