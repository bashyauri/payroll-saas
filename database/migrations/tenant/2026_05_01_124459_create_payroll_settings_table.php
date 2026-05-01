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
        Schema::create('payroll_settings', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('profile')->default('default')->unique();
            $table->decimal('basic_salary_percentage', 5, 2)->default(50);
            $table->decimal('housing_allowance_percentage', 5, 2)->default(20);
            $table->decimal('transport_allowance_percentage', 5, 2)->default(10);
            $table->decimal('other_allowance_percentage', 5, 2)->default(20);
            $table->decimal('pension_employee_rate', 5, 2)->default(8);
            $table->decimal('pension_employer_rate', 5, 2)->default(10);
            $table->decimal('nhf_rate', 5, 2)->default(2.5);
            $table->decimal('nhis_employee_rate', 5, 2)->default(5);
            $table->decimal('nhis_employer_rate', 5, 2)->default(10);
            $table->decimal('nsitf_rate', 5, 2)->default(1);
            $table->json('other_items')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_settings');
    }
};
