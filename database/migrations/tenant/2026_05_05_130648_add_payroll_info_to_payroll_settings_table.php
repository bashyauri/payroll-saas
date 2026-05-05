<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payroll_settings', function (Blueprint $table) {
            $table->string('payroll_type')->nullable()->after('enabled_deductions');
            $table->string('payroll_month')->nullable()->after('payroll_type');
            $table->date('report_date')->nullable()->after('payroll_month');
            $table->string('project_name')->nullable()->after('report_date');
            $table->string('employer_tax_id')->nullable()->after('project_name');
            $table->string('employer_pension_id')->nullable()->after('employer_tax_id');
        });
    }

    public function down(): void
    {
        Schema::table('payroll_settings', function (Blueprint $table) {
            $table->dropColumn([
                'payroll_type',
                'payroll_month',
                'report_date',
                'project_name',
                'employer_tax_id',
                'employer_pension_id',
            ]);
        });
    }
};
