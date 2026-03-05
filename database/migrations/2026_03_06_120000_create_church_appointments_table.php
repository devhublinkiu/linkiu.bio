<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('church_appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('guest_name', 255);
            $table->string('guest_phone', 50);
            $table->string('guest_email', 255)->nullable();
            $table->string('appointment_type', 100); // oracion, consejeria, reunion_pastor, otro
            $table->date('preferred_date');
            $table->time('assigned_time')->nullable(); // asignado por admin
            $table->text('notes')->nullable();
            $table->string('status', 30)->default('pending'); // pending, confirmed, completed, cancelled
            $table->boolean('consent')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('church_appointments');
    }
};
