<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('church_devotional_reactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('church_devotional_id')->constrained('church_devotionals')->cascadeOnDelete();
            $table->string('visitor_id', 64);
            $table->string('reaction_type', 32);
            $table->timestamps();

            $table->unique(['church_devotional_id', 'visitor_id', 'reaction_type'], 'devotional_reactions_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('church_devotional_reactions');
    }
};
