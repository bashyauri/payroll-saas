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
        Schema::create('payroll_setting_versions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('profile')->default('default');
            $table->date('effective_from');
            $table->json('snapshot');
            $table->ulid('updated_by_user_id')->nullable();

            $table->index(['profile', 'effective_from']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_setting_versions');
    }
};
