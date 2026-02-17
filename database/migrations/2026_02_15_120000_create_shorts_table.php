<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shorts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('location_id')->constrained('locations')->cascadeOnDelete();

            $table->string('name')->comment('Nombre de la promo a mostrar');
            $table->string('description', 50)->nullable();

            $table->string('link_type'); // 'category', 'product', 'external'
            $table->string('external_url')->nullable();
            $table->nullableMorphs('linkable'); // linkable_type, linkable_id (Category o Product)

            $table->string('short_video_id')->nullable()->comment('Bunny Stream video GUID');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shorts');
    }
};
