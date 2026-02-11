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
        Schema::table('tenant_payment_methods', function (Blueprint $table) {
            $table->foreignId('location_id')->nullable()->after('tenant_id')->constrained()->nullOnDelete();
        });

        Schema::table('tenant_bank_accounts', function (Blueprint $table) {
            $table->foreignId('location_id')->nullable()->after('tenant_id')->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenant_bank_accounts', function (Blueprint $table) {
            $table->dropConstrainedForeignId('location_id');
        });

        Schema::table('tenant_payment_methods', function (Blueprint $table) {
            $table->dropConstrainedForeignId('location_id');
        });
    }
};
