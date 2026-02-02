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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vertical_id')->nullable()->constrained('verticals')->nullOnDelete();

            // Basics
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('cover_path')->nullable();

            // Pricing
            $table->decimal('monthly_price', 10, 2);
            $table->string('currency', 3)->default('COP'); // USD, COP

            // Discounts (Percentages)
            $table->integer('quarterly_discount_percent')->default(0);
            $table->integer('semiannual_discount_percent')->default(0);
            $table->integer('yearly_discount_percent')->default(0);

            // Trial & Access
            $table->integer('trial_days')->default(0);
            $table->boolean('no_initial_payment_required')->default(false);

            // Config
            $table->string('support_level')->default('standard'); // standard, priority, dedicated
            $table->boolean('allow_custom_slug')->default(true);

            // Visibility
            $table->boolean('is_public')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->string('highlight_text')->nullable(); // e.g. "Más Popular"
            $table->integer('sort_order')->default(0);

            // Dynamic Data
            $table->json('features')->nullable(); // Array of strings
            $table->json('limits')->nullable(); // Key-value object

            // Stripe/Payment Gateway IDs (Future proofing)
            $table->string('stripe_product_id')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
