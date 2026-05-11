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
            $table->boolean('apply_paye_deduction')->default(true)->after('monthly_tax_deduction');
            $table->boolean('apply_pension_deduction')->default(true)->after('monthly_pension_deduction');
            $table->boolean('apply_nhf_deduction')->default(true)->after('monthly_nhf_deduction');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'apply_paye_deduction',
                'apply_pension_deduction',
                'apply_nhf_deduction',
            ]);
        });
    }
};
