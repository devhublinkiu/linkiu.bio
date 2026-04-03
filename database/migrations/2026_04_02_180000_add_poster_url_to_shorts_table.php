<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shorts', function (Blueprint $table) {
            $table->string('poster_url', 500)->nullable()->after('short_video_id');
        });
    }

    public function down(): void
    {
        Schema::table('shorts', function (Blueprint $table) {
            $table->dropColumn('poster_url');
        });
    }
};
