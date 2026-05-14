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
            $table->decimal('monthly_nhis_deduction', 12, 2)->default(0)->after('monthly_nhf_deduction');
            $table->boolean('apply_nhis_deduction')->default(true)->after('monthly_nhis_deduction');
            $table->decimal('monthly_nsitf_deduction', 12, 2)->default(0)->after('monthly_nhis_deduction');
            $table->boolean('apply_nsitf_deduction')->default(true)->after('monthly_nsitf_deduction');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'monthly_nhis_deduction',
                'apply_nhis_deduction',
                'monthly_nsitf_deduction',
                'apply_nsitf_deduction',
            ]);
        });
    }
};
