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
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('currency', 3)->default('NGN');
            $table->decimal('price_per_employee', 12, 2);
            $table->string('billing_period')->default('annual');
            $table->unsignedInteger('min_employees')->default(1);
            $table->unsignedInteger('max_employees')->nullable();
            $table->json('features')->nullable();
            $table->string('paystack_plan_code')->nullable()->index();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
