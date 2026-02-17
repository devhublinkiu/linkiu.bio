<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // 1. Campo storage_disk en products para BunnyCDN
        Schema::table('products', function (Blueprint $table) {
            $table->string('storage_disk', 20)->default('bunny')->after('image');
        });

        // 2. Tabla pivote product_location (Opción B: productos globales, disponibles en N sedes)
        Schema::create('product_location', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('location_id')->constrained()->onDelete('cascade');
            $table->boolean('is_available')->default(true);
            $table->timestamps();

            $table->unique(['product_id', 'location_id']);
            $table->index('location_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_location');

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('storage_disk');
        });
    }
};
