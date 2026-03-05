<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('church_sermons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('youtube_video_id', 32)->index();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('published_at')->nullable();
            $table->string('thumbnail_url', 500)->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->string('status', 20)->default('completed'); // live, upcoming, completed
            $table->timestamp('live_start_at')->nullable();
            $table->timestamps();

            $table->unique(['tenant_id', 'youtube_video_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('church_sermons');
    }
};
