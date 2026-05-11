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
            $table->string('salary_amount_period')->nullable()->after('salary_input_mode');
            $table->decimal('basic_salary', 12, 2)->nullable()->after('annual_gross_salary');
            $table->decimal('housing_allowance', 12, 2)->nullable()->after('basic_salary');
            $table->decimal('transport_allowance', 12, 2)->nullable()->after('housing_allowance');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'salary_amount_period',
                'basic_salary',
                'housing_allowance',
                'transport_allowance',
            ]);
        });
    }
};
