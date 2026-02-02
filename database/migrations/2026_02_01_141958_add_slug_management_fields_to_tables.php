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
        Schema::table('site_settings', function (Blueprint $table) {
            $table->decimal('slug_change_price', 10, 2)->default(10000.00)->after('favicon_path'); // Default price 10k
        });

        Schema::table('tenants', function (Blueprint $table) {
            $table->timestamp('last_slug_changed_at')->nullable()->after('slug');
            $table->integer('slug_changes_count')->default(0)->after('last_slug_changed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn('slug_change_price');
        });

        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn(['last_slug_changed_at', 'slug_changes_count']);
        });
    }
};
