<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gastronomy_reservations', function (Blueprint $table) {
            $table->string('payment_proof_storage_disk')->default('bunny')->after('payment_proof');
        });
    }

    public function down(): void
    {
        Schema::table('gastronomy_reservations', function (Blueprint $table) {
            $table->dropColumn('payment_proof_storage_disk');
        });
    }
};
