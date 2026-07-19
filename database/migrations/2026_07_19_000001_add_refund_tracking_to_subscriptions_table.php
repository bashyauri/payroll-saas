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
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->timestamp('refunded_at')->nullable()->after('canceled_at');
            $table->string('refund_reference')->nullable()->after('refunded_at');
            $table->decimal('refund_amount', 12, 2)->nullable()->after('refund_reference');
            $table->text('refund_reason')->nullable()->after('refund_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn([
                'refunded_at',
                'refund_reference',
                'refund_amount',
                'refund_reason',
            ]);
        });
    }
};
