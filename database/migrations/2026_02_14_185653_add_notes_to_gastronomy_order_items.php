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
            $table->string('notes', 200)->nullable()->after('variant_options');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gastronomy_order_items', function (Blueprint $table) {
            $table->dropColumn('notes');
        });
    }
};
