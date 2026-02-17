<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('inventory_item_id')->constrained()->onDelete('cascade');
            $table->foreignId('location_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['entry', 'exit']);
            $table->enum('reason', ['purchase', 'adjustment', 'consumption', 'waste', 'transfer', 'return', 'initial']);
            $table->decimal('quantity', 15, 4)->comment('Siempre positivo, type define +/-');
            $table->decimal('unit_cost', 15, 4)->nullable()->comment('Costo unitario en compras');
            $table->decimal('total_cost', 15, 4)->nullable()->comment('Costo total del movimiento');
            $table->decimal('previous_stock', 15, 4)->comment('Stock antes del movimiento');
            $table->decimal('new_stock', 15, 4)->comment('Stock después del movimiento');
            $table->string('reference')->nullable()->comment('Ej: Factura #123, Pedido #456');
            $table->text('notes')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null')->comment('Quién registró el movimiento');
            $table->timestamps();

            // Indexes
            $table->index(['tenant_id', 'inventory_item_id', 'location_id'], 'idx_mov_tenant_item_loc');
            $table->index(['tenant_id', 'location_id', 'created_at'], 'idx_mov_tenant_loc_date');
            $table->index(['type', 'reason'], 'idx_mov_type_reason');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};
