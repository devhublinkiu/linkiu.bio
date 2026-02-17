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
            $table->boolean('waiter_collected')->default(false)->after('payment_proof');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gastronomy_orders', function (Blueprint $table) {
            $table->dropColumn('waiter_collected');
        });
    }
};
