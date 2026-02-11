<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->decimal('reservation_price_per_person', 10, 2)->default(0)->after('opening_hours');
            $table->integer('reservation_min_anticipation')->default(2)->comment('Anticipation in hours')->after('reservation_price_per_person');
            $table->integer('reservation_slot_duration')->default(60)->comment('Duration in minutes')->after('reservation_min_anticipation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn([
                'reservation_price_per_person',
                'reservation_min_anticipation',
                'reservation_slot_duration'
            ]);
        });
    }
};
