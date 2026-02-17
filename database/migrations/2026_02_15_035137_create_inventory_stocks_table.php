<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('inventory_item_id')->constrained()->onDelete('cascade');
            $table->foreignId('location_id')->constrained()->onDelete('cascade');
            $table->decimal('quantity', 15, 4)->default(0)->comment('Stock actual');
            $table->decimal('min_stock', 15, 4)->default(0)->comment('Stock mínimo para alerta');
            $table->decimal('max_stock', 15, 4)->nullable()->comment('Stock máximo recomendado');
            $table->timestamp('last_movement_at')->nullable()->comment('Último movimiento registrado');
            $table->timestamps();

            // Indexes
            $table->unique(['inventory_item_id', 'location_id']);
            $table->index(['tenant_id', 'location_id']);
            $table->index(['tenant_id', 'location_id', 'min_stock'], 'idx_low_stock');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_stocks');
    }
};
