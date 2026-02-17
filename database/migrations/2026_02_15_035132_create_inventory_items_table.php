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
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug');
            $table->string('sku', 100)->nullable();
            $table->text('description')->nullable();
            $table->enum('unit', ['kg', 'g', 'l', 'ml', 'units', 'pieces'])->default('units');
            $table->decimal('cost_per_unit', 15, 4)->nullable()->comment('Costo promedio por unidad');
            $table->string('image')->nullable();
            $table->string('storage_disk', 50)->default('bunny');
            $table->string('category', 100)->nullable()->comment('Ej: Lácteos, Carnes, Verduras');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            // Indexes
            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'category']);
            $table->unique(['tenant_id', 'slug']);
            $table->unique(['tenant_id', 'sku']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
