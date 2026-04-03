<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * completed_at para ventanas de reporte (más vendidos); índices alineados al filtro.
     */
    public function up(): void
    {
        Schema::table('gastronomy_orders', function (Blueprint $table) {
            $table->timestamp('completed_at')->nullable()->after('updated_at');
        });

        DB::table('gastronomy_orders')
            ->where('status', 'completed')
            ->whereNull('completed_at')
            ->update(['completed_at' => DB::raw('updated_at')]);

        Schema::table('gastronomy_orders', function (Blueprint $table) {
            $table->index(['tenant_id', 'status', 'completed_at'], 'gastronomy_orders_tenant_status_completed_at_idx');
        });

        Schema::table('gastronomy_order_items', function (Blueprint $table) {
            $table->index(['gastronomy_order_id', 'product_id'], 'gastronomy_order_items_order_product_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gastronomy_order_items', function (Blueprint $table) {
            $table->dropIndex('gastronomy_order_items_order_product_idx');
        });

        Schema::table('gastronomy_orders', function (Blueprint $table) {
            $table->dropIndex('gastronomy_orders_tenant_status_completed_at_idx');
            $table->dropColumn('completed_at');
        });
    }
};
