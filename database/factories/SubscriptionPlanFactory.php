<?php

namespace Database\Factories;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubscriptionPlanFactory extends Factory
{
    protected $model = SubscriptionPlan::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'slug' => $this->faker->slug(),
            'currency' => 'NGN',
            'price_per_employee' => $this->faker->numberBetween(5000, 20000),
            'billing_period' => $this->faker->randomElement(['monthly', 'annual']),
            'min_employees' => $this->faker->numberBetween(1, 10),
            'max_employees' => $this->faker->randomElement([null, 50, 100]),
            'features' => ['payroll', 'employee_management'],
            'is_active' => true,
        ];
    }
}
