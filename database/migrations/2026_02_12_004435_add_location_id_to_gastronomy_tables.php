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
        Schema::table('zones', function (Blueprint $table) {
            $table->foreignId('location_id')->nullable()->after('tenant_id')->constrained()->onDelete('cascade');
        });

        Schema::table('tables', function (Blueprint $table) {
            $table->foreignId('location_id')->nullable()->after('tenant_id')->constrained()->onDelete('cascade');
        });

        Schema::table('gastronomy_orders', function (Blueprint $table) {
            $table->foreignId('location_id')->nullable()->after('tenant_id')->constrained()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gastronomy_orders', function (Blueprint $table) {
            $table->dropForeign(['location_id']);
            $table->dropColumn('location_id');
        });

        Schema::table('tables', function (Blueprint $table) {
            $table->dropForeign(['location_id']);
            $table->dropColumn('location_id');
        });

        Schema::table('zones', function (Blueprint $table) {
            $table->dropForeign(['location_id']);
            $table->dropColumn('location_id');
        });
    }
};
