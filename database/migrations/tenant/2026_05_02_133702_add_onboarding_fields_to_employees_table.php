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
        Schema::table('employees', function (Blueprint $table) {
            $table->string('pfa_name', 150)->nullable()->after('pension_pin');
            $table->string('nhis_number', 50)->nullable()->after('pfa_name');
            $table->string('nhf_number', 50)->nullable()->after('nhis_number');
            $table->string('location', 150)->nullable()->after('job_title');
            $table->date('date_of_birth')->nullable()->after('location');
            $table->date('exit_date')->nullable()->after('hire_date');
            $table->decimal('annual_gross_salary', 14, 2)->nullable()->after('monthly_gross_salary');
            $table->decimal('other_allowance_1', 12, 2)->nullable()->after('other_monthly_deductions');
            $table->decimal('other_allowance_2', 12, 2)->nullable()->after('other_allowance_1');
            $table->decimal('total_salary', 14, 2)->nullable()->after('other_allowance_2');
            $table->decimal('personal_life_insurance', 12, 2)->nullable()->after('total_salary');
            $table->decimal('rent_relief', 12, 2)->nullable()->after('personal_life_insurance');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'pfa_name',
                'nhis_number',
                'nhf_number',
                'location',
                'date_of_birth',
                'exit_date',
                'annual_gross_salary',
                'other_allowance_1',
                'other_allowance_2',
                'total_salary',
                'personal_life_insurance',
                'rent_relief',
            ]);
        });
    }
};
