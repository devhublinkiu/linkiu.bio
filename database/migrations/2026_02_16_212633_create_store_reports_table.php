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
        if (Schema::hasTable('store_reports')) {
            return;
        }
        Schema::create('store_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('category', 80); // problema_pedido, publicidad_enganosa, trato_indebido, producto_servicio, otro
            $table->text('message');
            $table->string('reporter_email', 255)->nullable();
            $table->string('reporter_whatsapp', 50)->nullable();
            $table->string('image_path')->nullable();
            $table->string('url_context', 500)->nullable();
            $table->string('status', 30)->default('new'); // new, in_review, resolved, dismissed
            $table->string('ip', 45)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_reports');
    }
};
