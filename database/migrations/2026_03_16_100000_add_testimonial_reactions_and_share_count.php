<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('church_testimonials', function (Blueprint $table) {
            if (!Schema::hasColumn('church_testimonials', 'share_count')) {
                $table->unsignedInteger('share_count')->default(0)->after('order');
            }
        });

        Schema::create('church_testimonial_reactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('church_testimonial_id')->constrained('church_testimonials')->cascadeOnDelete();
            $table->string('visitor_id', 64);
            $table->string('reaction_type', 32);
            $table->timestamps();

            $table->unique(['church_testimonial_id', 'visitor_id', 'reaction_type'], 'testimonial_reactions_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('church_testimonial_reactions');
        Schema::table('church_testimonials', function (Blueprint $table) {
            if (Schema::hasColumn('church_testimonials', 'share_count')) {
                $table->dropColumn('share_count');
            }
        });
    }
};
