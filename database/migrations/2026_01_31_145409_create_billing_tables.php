<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Subscriptions: Control the TIME and ACCESS
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('plan_id')->constrained()->onDelete('restrict'); // Don't delete plan if sub exists

            // Status and Cycle
            $table->string('status')->default('trialing'); // trialing, active, past_due, cancelled, expired
            $table->string('billing_cycle')->default('monthly'); // monthly, quarterly, semiannual, yearly

            // Dates
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('next_payment_date')->nullable();
            $table->timestamp('cancelled_at')->nullable();

            $table->timestamps();
        });

        // Payments: Control the MONEY
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');

            // Money
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('COP');

            // Details
            $table->string('payment_method')->default('transfer'); // transfer, stripe, cash
            $table->string('status')->default('pending'); // pending, paid, rejected, refunded
            $table->string('proof_file_path')->nullable(); // For manual transfers
            $table->string('transaction_id')->nullable(); // External ID

            $table->text('notes')->nullable(); // Admin notes involved in approval
            $table->timestamp('paid_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('subscriptions');
    }
};
