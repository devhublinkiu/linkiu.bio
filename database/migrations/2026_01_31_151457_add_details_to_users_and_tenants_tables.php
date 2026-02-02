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
        // 1. Add Personal Data to Users
        Schema::table('users', function (Blueprint $table) {
            $table->string('doc_type', 20)->nullable()->after('email'); // CC, CE, PA
            $table->string('doc_number', 50)->nullable()->after('doc_type');
            $table->string('phone', 20)->nullable()->after('doc_number');
            $table->string('address')->nullable()->after('phone');
            $table->string('country')->nullable()->after('address'); // Default Colombia if null
            $table->string('state')->nullable()->after('country'); // Departamento
            $table->string('city')->nullable()->after('state');
        });

        // 2. Add Business Data to Tenants
        Schema::table('tenants', function (Blueprint $table) {
            // Identity
            // Slug is already there usually, but ensure uniqueness if needed.
            // Assumption: 'id' or 'slug' exists.

            // Fiscal
            $table->string('regime', 50)->nullable(); // Comun, Simple, Especial
            $table->string('doc_type', 20)->nullable(); // NIT
            $table->string('doc_number', 50)->nullable();
            $table->string('verification_digit', 5)->nullable();

            // Contact (Business specific)
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('address')->nullable();

            // Geo (Business specific)
            $table->string('state')->nullable();
            $table->string('city')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn([
                'regime',
                'doc_type',
                'doc_number',
                'verification_digit',
                'contact_email',
                'contact_phone',
                'address',
                'state',
                'city'
            ]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'doc_type',
                'doc_number',
                'phone',
                'address',
                'country',
                'state',
                'city'
            ]);
        });
    }
};
