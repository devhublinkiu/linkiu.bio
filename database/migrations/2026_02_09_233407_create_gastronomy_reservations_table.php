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
        Schema::create('gastronomy_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_id')->nullable()->constrained('gastronomy_customers')->onDelete('set null');
            $table->foreignId('table_id')->nullable()->constrained('tables')->onDelete('set null');
            $table->date('reservation_date');
            $table->time('reservation_time');
            $table->integer('party_size');
            $table->string('status')->default('pending'); // pending, confirmed, seated, cancelled, no_show

            // Guest details (fallback if no customer_id)
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable(); // For WhatsApp
            $table->string('customer_email')->nullable();

            $table->text('notes')->nullable(); // Allergies, occasion
            $table->text('admin_notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gastronomy_reservations');
    }
};
