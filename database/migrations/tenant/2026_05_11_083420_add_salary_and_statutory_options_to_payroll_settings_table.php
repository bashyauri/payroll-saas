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
        Schema::table('payroll_settings', function (Blueprint $table) {
            $table->string('salary_input_mode')->default('gross')->after('other_allowance_percentage');
            $table->string('pension_contribution_base')->default('basic_transport_housing')->after('pension_employer_rate');
            $table->string('nhf_contribution_base')->default('basic')->after('nhf_rate');
            $table->boolean('use_statutory_default_rates')->default(true)->after('nsitf_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payroll_settings', function (Blueprint $table) {
            $table->dropColumn([
                'salary_input_mode',
                'pension_contribution_base',
                'nhf_contribution_base',
                'use_statutory_default_rates',
            ]);
        });
    }
};
