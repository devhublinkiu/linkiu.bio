<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('church_audio_config', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('page_title', 255)->default('Audio Dosis');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('church_audio_config');
    }
};
