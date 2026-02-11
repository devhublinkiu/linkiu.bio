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
        Schema::table('gastronomy_reservations', function (Blueprint $table) {
            $table->string('payment_proof')->nullable()->after('notes');
            $table->string('payment_method')->nullable()->after('payment_proof'); // e.g., 'transfer', 'cash'
            $table->string('payment_reference')->nullable()->after('payment_method');
        });

        Schema::table('locations', function (Blueprint $table) {
            $table->boolean('reservation_payment_proof_required')->default(false)->after('reservation_price_per_person');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gastronomy_reservations', function (Blueprint $table) {
            $table->dropColumn(['payment_proof', 'payment_method', 'payment_reference']);
        });

        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn('reservation_payment_proof_required');
        });
    }
};
