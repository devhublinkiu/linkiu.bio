<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('church_devotionals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('scripture_reference', 255)->nullable();
            $table->text('scripture_text')->nullable();
            $table->text('body');
            $table->text('prayer')->nullable();
            $table->string('author', 255)->nullable();
            $table->date('date');
            $table->string('reflection_question', 500)->nullable();
            $table->string('cover_image', 1024)->nullable();
            $table->string('video_url', 1024)->nullable();
            $table->string('external_link', 1024)->nullable();
            $table->string('excerpt', 500)->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('church_devotionals');
    }
};
