<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('church_services', function (Blueprint $table) {
            $table->string('frequency', 100)->nullable()->after('schedule');
            $table->string('duration', 100)->nullable()->after('frequency');
            $table->string('modality', 100)->nullable()->after('location');
            $table->string('audience', 255)->nullable()->after('description');
            $table->string('service_type', 255)->nullable()->after('audience');
            $table->string('leader', 255)->nullable()->after('image_url');
            $table->string('contact_info', 500)->nullable()->after('leader');
            $table->string('external_url', 1024)->nullable()->after('contact_info');
        });
    }

    public function down(): void
    {
        Schema::table('church_services', function (Blueprint $table) {
            $table->dropColumn([
                'frequency', 'duration', 'modality', 'audience',
                'service_type', 'leader', 'contact_info', 'external_url',
            ]);
        });
    }
};
