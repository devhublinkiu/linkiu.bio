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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subscription_id')->nullable()->constrained()->onDelete('set null');

            $table->decimal('amount', 10, 2);
            $table->string('status')->default('pending'); // pending, pending_review, paid, void, overdue
            $table->date('due_date');
            $table->timestamp('paid_at')->nullable();

            $table->string('proof_of_payment_path')->nullable(); // Path to screenshot
            $table->text('admin_notes')->nullable(); // Rejection reason or internal notes

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
