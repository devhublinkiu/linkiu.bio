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
        Schema::table('gastronomy_order_items', function (Blueprint $table) {
            $table->string('status')->default('active')->after('variant_options');
            $table->unsignedBigInteger('cancelled_by')->nullable()->after('status');
            $table->timestamp('cancelled_at')->nullable()->after('cancelled_by');

            $table->foreign('cancelled_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gastronomy_order_items', function (Blueprint $table) {
            $table->dropForeign(['cancelled_by']);
            $table->dropColumn(['status', 'cancelled_by', 'cancelled_at']);
        });
    }
};
