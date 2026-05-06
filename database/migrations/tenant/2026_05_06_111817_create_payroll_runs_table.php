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
        Schema::create('payroll_runs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('period_month', 7);
            $table->date('period_start');
            $table->date('period_end');
            $table->string('status')->default('draft');
            $table->unsignedInteger('employee_count')->default(0);
            $table->decimal('total_gross_salary', 14, 2)->default(0);
            $table->decimal('total_deductions', 14, 2)->default(0);
            $table->decimal('total_net_pay', 14, 2)->default(0);
            $table->json('settings_snapshot');
            $table->string('created_by_user_id')->nullable();
            $table->timestamp('finalized_at')->nullable();
            $table->string('finalized_by_user_id')->nullable();
            $table->timestamps();

            $table->unique('period_month');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_runs');
    }
};
