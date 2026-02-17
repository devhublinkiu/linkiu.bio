<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sliders', function (Blueprint $table) {
            $table->foreignId('location_id')->after('tenant_id')->nullable()->constrained('locations')->cascadeOnDelete();
            $table->string('storage_disk', 10)->default('bunny')->after('image_path_desktop');
        });
        // Existing rows had images on S3
        \DB::table('sliders')->update(['storage_disk' => 'bunny']);
    }

    public function down(): void
    {
        Schema::table('sliders', function (Blueprint $table) {
            $table->dropForeign(['location_id']);
            $table->dropColumn('storage_disk');
        });
    }
};
