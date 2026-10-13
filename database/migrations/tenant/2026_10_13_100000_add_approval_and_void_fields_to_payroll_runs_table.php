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
        Schema::table('payroll_runs', function (Blueprint $table) {
            $table->dropUnique(['period_month']);
            $table->index('period_month');

            $table->timestamp('submitted_at')->nullable()->after('created_by_user_id');
            $table->string('submitted_by_user_id')->nullable()->after('submitted_at');
            $table->timestamp('approved_at')->nullable()->after('submitted_by_user_id');
            $table->string('approved_by_user_id')->nullable()->after('approved_at');
            $table->text('approval_notes')->nullable()->after('approved_by_user_id');
            $table->timestamp('rejected_at')->nullable()->after('approval_notes');
            $table->string('rejected_by_user_id')->nullable()->after('rejected_at');
            $table->text('rejection_reason')->nullable()->after('rejected_by_user_id');
            $table->timestamp('void_requested_at')->nullable()->after('finalized_by_user_id');
            $table->string('void_requested_by_user_id')->nullable()->after('void_requested_at');
            $table->text('void_reason')->nullable()->after('void_requested_by_user_id');
            $table->timestamp('voided_at')->nullable()->after('void_reason');
            $table->string('voided_by_user_id')->nullable()->after('voided_at');
            $table->text('void_approval_notes')->nullable()->after('voided_by_user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payroll_runs', function (Blueprint $table) {
            $table->dropIndex(['period_month']);
            $table->unique('period_month');

            $table->dropColumn([
                'submitted_at',
                'submitted_by_user_id',
                'approved_at',
                'approved_by_user_id',
                'approval_notes',
                'rejected_at',
                'rejected_by_user_id',
                'rejection_reason',
                'void_requested_at',
                'void_requested_by_user_id',
                'void_reason',
                'voided_at',
                'voided_by_user_id',
                'void_approval_notes',
            ]);
        });
    }
};
