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
        Schema::create('employees', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('employee_number')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name')->nullable();
            $table->string('work_email')->nullable()->unique();
            $table->string('phone', 20)->nullable();
            $table->string('nin', 11)->nullable()->unique();
            $table->string('bvn', 11)->nullable()->unique();
            $table->string('tax_identification_number', 50)->nullable();
            $table->string('pension_pin', 50)->nullable();
            $table->string('bank_name');
            $table->string('bank_account_name');
            $table->string('bank_account_number', 10);
            $table->decimal('monthly_gross_salary', 12, 2);
            $table->decimal('monthly_tax_deduction', 12, 2)->default(0);
            $table->decimal('monthly_pension_deduction', 12, 2)->default(0);
            $table->decimal('monthly_nhf_deduction', 12, 2)->default(0);
            $table->decimal('other_monthly_deductions', 12, 2)->default(0);
            $table->string('department')->nullable();
            $table->string('job_title')->nullable();
            $table->string('employment_type')->default('full_time');
            $table->date('hire_date')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index(['last_name', 'first_name']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
