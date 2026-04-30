<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class SubscriptionFactory extends Factory
{
    protected $model = Subscription::class;

    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'plan_id' => SubscriptionPlan::factory(),
            'status' => Subscription::STATUS_ACTIVE,
            'trial_end_date' => now()->addDays(7),
            'refund_eligible_until' => now()->addDays(7),
            'next_billing_date' => now()->addMonth(),
            'paystack_reference' => 'ps_'.strtolower((string) Str::ulid()),
            'amount_paid' => $this->faker->numberBetween(100000, 5000000),
            'currency' => 'NGN',
            'employee_count' => $this->faker->numberBetween(1, 100),
        ];
    }
}
