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
            $table->decimal('paye_consolidated_relief_percentage', 5, 2)->default(20)->after('nsitf_rate');
            $table->decimal('paye_consolidated_relief_minimum', 12, 2)->default(200000)->after('paye_consolidated_relief_percentage');
            $table->json('paye_tax_brackets')->nullable()->after('paye_consolidated_relief_minimum');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payroll_settings', function (Blueprint $table) {
            $table->dropColumn([
                'paye_consolidated_relief_percentage',
                'paye_consolidated_relief_minimum',
                'paye_tax_brackets',
            ]);
        });
    }
};
