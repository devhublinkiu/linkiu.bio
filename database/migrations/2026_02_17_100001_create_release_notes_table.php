<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('release_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('release_note_category_id')->constrained('release_note_categories')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('type')->default('new'); // new, fix, improvement, security, performance
            $table->string('icon_name')->nullable(); // Lucide icon name
            $table->string('cover_path')->nullable();
            $table->string('hero_path')->nullable();
            $table->text('snippet')->nullable();
            $table->longText('body')->nullable();
            $table->date('published_at')->nullable();
            $table->string('status')->default('draft'); // draft, published
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('release_notes');
    }
};
