<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('church_donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('donor_name');
            $table->string('donor_phone', 50);
            $table->decimal('amount', 14, 2);
            $table->string('currency', 3)->default('COP');
            $table->foreignId('bank_account_id')->nullable()->constrained('tenant_bank_accounts')->nullOnDelete();
            $table->string('proof_path')->nullable();
            $table->string('status', 20)->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('church_donations');
    }
};
