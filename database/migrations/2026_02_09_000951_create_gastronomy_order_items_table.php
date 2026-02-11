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
        Schema::create('gastronomy_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gastronomy_order_id')->constrained('gastronomy_orders')->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete(); // Keep history even if product deleted
            $table->string('product_name'); // Snapshot of name
            $table->integer('quantity');
            $table->decimal('price', 12, 2); // Snapshot of unit price
            $table->decimal('total', 12, 2); // quantity * price
            $table->json('variant_options')->nullable(); // Snapshot of choices
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gastronomy_order_items');
    }
};
