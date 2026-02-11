<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tables', function (Blueprint $row) {
            $row->id();
            $row->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $row->foreignId('zone_id')->constrained()->onDelete('cascade');
            $row->string('name');
            $row->string('token')->unique();
            $row->integer('capacity')->nullable();
            $row->enum('status', ['active', 'maintenance', 'inactive'])->default('active');
            $row->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tables');
    }
};
