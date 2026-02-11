<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration 
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Change to VARCHAR to allow any string
        DB::statement("ALTER TABLE tables MODIFY COLUMN status VARCHAR(255)");

        // 2. Map old values to new values
        DB::table('tables')->where('status', 'active')->update(['status' => 'available']);
        DB::table('tables')->where('status', 'inactive')->update(['status' => 'maintenance']);
        // 'maintenance' remains 'maintenance'

        // 3. Change to new ENUM
        DB::statement("ALTER TABLE tables MODIFY COLUMN status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original status enum
        DB::statement("ALTER TABLE tables MODIFY COLUMN status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active'");
    }
};
