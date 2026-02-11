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
        Schema::create('tenant_shipping_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // pickup, local, national
            $table->string('name')->nullable();
            $table->boolean('is_active')->default(true);
            $table->decimal('cost', 10, 2)->default(0);
            $table->decimal('free_shipping_min_amount', 10, 2)->nullable();
            $table->string('delivery_time')->nullable();
            $table->text('instructions')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        Schema::create('shipping_zones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_shipping_method_id')->constrained('tenant_shipping_methods')->cascadeOnDelete();
            $table->string('department_code'); // DANE
            $table->string('department_name');
            $table->string('city_code')->nullable(); // DANE
            $table->string('city_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_zones');
        Schema::dropIfExists('tenant_shipping_methods');
    }
};
