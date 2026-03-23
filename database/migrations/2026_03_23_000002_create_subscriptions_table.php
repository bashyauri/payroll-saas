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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('organization_id', 26);
            $table->foreignUlid('plan_id')->constrained('subscription_plans')->cascadeOnUpdate()->restrictOnDelete();
            $table->string('status')->index();
            $table->timestamp('trial_end_date')->nullable();
            $table->timestamp('refund_eligible_until')->nullable();
            $table->date('next_billing_date')->nullable();
            $table->timestamp('grace_period_ends_at')->nullable();
            $table->timestamp('canceled_at')->nullable();
            $table->string('paystack_reference')->nullable()->index();
            $table->string('paystack_customer_code')->nullable();
            $table->string('paystack_subscription_code')->nullable();
            $table->decimal('amount_paid', 12, 2)->default(0);
            $table->string('currency', 3)->default('NGN');
            $table->timestamps();

            $table->foreign('organization_id')
                ->references('id')
                ->on('tenants')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->index(['organization_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
