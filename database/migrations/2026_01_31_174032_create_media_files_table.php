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
        Schema::create('media_files', function (Blueprint $table) {
            $table->id();

            // File Information
            $table->string('name'); // Original filename
            $table->string('path'); // Storage path
            $table->string('disk')->default('s3'); // Storage disk
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->nullable(); // Size in bytes
            $table->string('extension')->nullable();

            // Metadata
            $table->string('type')->nullable(); // image, document, video, etc.
            $table->string('folder')->default('uploads'); // Organizational folder
            $table->text('description')->nullable();
            $table->json('metadata')->nullable(); // Width, height, duration, etc.

            // Ownership
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();

            // URLs
            $table->text('url')->nullable(); // Public URL

            // Visibility
            $table->boolean('is_public')->default(true);

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('type');
            $table->index('folder');
            $table->index('uploaded_by');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};
