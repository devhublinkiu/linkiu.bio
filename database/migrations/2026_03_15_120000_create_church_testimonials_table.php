<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('church_testimonials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('video_url', 500)->nullable();
            $table->string('image_url', 1024)->nullable();
            $table->string('title', 255);
            $table->text('body')->nullable();
            $table->string('category', 100)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->string('short_quote', 500)->nullable();
            $table->string('author', 255)->nullable();
            $table->boolean('is_published')->default(false);
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('church_testimonials');
    }
};
