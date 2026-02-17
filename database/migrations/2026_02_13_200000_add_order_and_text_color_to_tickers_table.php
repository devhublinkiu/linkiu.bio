<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('tickers', function (Blueprint $table) {
            $table->string('text_color', 10)->default('#FFFFFF')->after('background_color');
            $table->unsignedInteger('order')->default(0)->after('text_color');
        });
    }

    public function down(): void
    {
        Schema::table('tickers', function (Blueprint $table) {
            $table->dropColumn(['text_color', 'order']);
        });
    }
};
