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
        Schema::create('tenant_bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('bank_name'); // 'Nequi', 'Bancolombia', 'Daviplata'
            $table->string('account_type'); // 'Ahorros', 'Corriente', 'Depósito'
            $table->string('account_number');
            $table->string('account_holder');
            $table->string('holder_id')->nullable(); // Cédula o NIT
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenant_bank_accounts');
    }
};
