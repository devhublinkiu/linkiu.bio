<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('church_appointments', function (Blueprint $table) {
            $table->date('assigned_date')->nullable()->after('preferred_date');
        });

        Schema::table('church_appointments', function (Blueprint $table) {
            $table->dropColumn('assigned_time');
        });

        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE church_appointments MODIFY preferred_date DATE NULL');
        }
    }

    public function down(): void
    {
        Schema::table('church_appointments', function (Blueprint $table) {
            $table->time('assigned_time')->nullable()->after('preferred_date');
        });
        Schema::table('church_appointments', function (Blueprint $table) {
            $table->dropColumn('assigned_date');
        });
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE church_appointments MODIFY preferred_date DATE NOT NULL');
        }
    }
};
