<?php

use App\Models\SubscriptionPlan;
use Database\Seeders\SubscriptionPlanSeeder;

it('seeds essential and professional subscription plans', function () {
    (new SubscriptionPlanSeeder())->run();

    expect(SubscriptionPlan::query()->where('slug', SubscriptionPlan::PLAN_ESSENTIAL)->exists())->toBeTrue()
        ->and(SubscriptionPlan::query()->where('slug', SubscriptionPlan::PLAN_PROFESSIONAL)->exists())->toBeTrue();
});
