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
        Schema::create('sliders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();

            $table->string('name')->comment('Internal name or Alt Text');
            $table->string('image_path')->comment('Unified path or Mobile optimized');
            $table->string('image_path_desktop')->nullable()->comment('Optional desktop specific image');

            // Link Logic
            $table->enum('link_type', ['none', 'internal', 'external'])->default('none');
            $table->string('external_url')->nullable();
            $table->nullableMorphs('linkable'); // linkable_id, linkable_type

            // Scheduler
            $table->timestamp('start_at')->nullable();
            $table->timestamp('end_at')->nullable();
            $table->json('active_days')->nullable()->comment('Array of active day indexes [1,3...]');

            // Stats & Order
            $table->integer('clicks_count')->default(0);
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sliders');
    }
};
