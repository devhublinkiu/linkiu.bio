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
        Schema::create('product_variant_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['radio', 'checkbox'])->default('radio');
            $table->integer('min_selection')->default(0);
            $table->integer('max_selection')->default(1);
            $table->boolean('is_required')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('product_variant_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->references('id')->on('product_variant_groups')->cascadeOnDelete();
            $table->string('name');
            $table->decimal('price_adjustment', 10, 2)->default(0);
            $table->boolean('is_available')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variant_options');
        Schema::dropIfExists('product_variant_groups');
    }
};
