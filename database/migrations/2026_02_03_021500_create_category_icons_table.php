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
        Schema::create('category_icons', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('path'); // Path to the icon file
            $table->foreignId('vertical_id')->nullable()->constrained('business_categories')->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_global')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_icons');
    }
};
