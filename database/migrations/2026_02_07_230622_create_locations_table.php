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
        Schema::create('locations', function (Blueprint $col) {
            $col->id();
            $col->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $col->string('name');
            $col->string('manager')->nullable();
            $col->string('description')->nullable();
            $col->boolean('is_main')->default(false);
            $col->string('phone')->nullable();
            $col->string('whatsapp')->nullable();
            $col->text('whatsapp_message')->nullable();
            $col->string('state')->nullable();
            $col->string('city')->nullable();
            $col->text('address')->nullable();
            $col->decimal('latitude', 10, 8)->nullable();
            $col->decimal('longitude', 11, 8)->nullable();
            $col->json('opening_hours')->nullable();
            $col->json('social_networks')->nullable();
            $col->boolean('is_active')->default(true);
            $col->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
