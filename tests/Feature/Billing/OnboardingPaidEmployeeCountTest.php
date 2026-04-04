<?php

use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Services\Onboarding\OnboardingService;

test('onboarding stores paid employee count on subscription', function () {
    $user = User::factory()->create([
        'name' => 'Paid Count User',
    ]);

    $plan = SubscriptionPlan::query()->create([
        'name' => 'Essential',
        'slug' => 'essential-paid-count',
        'currency' => 'NGN',
        'price_per_employee' => 800,
        'billing_period' => 'annual',
        'min_employees' => 6,
        'max_employees' => 50,
        'features' => ['payroll_processing'],
        'is_active' => true,
    ]);

    $organization = app(OnboardingService::class)->setupOrganizationAfterPayment($user, [
        'reference' => 'ps_test_ref_paid_count',
        'amount' => 9288000,
        'metadata' => [
            'plan_slug' => $plan->slug,
            'employee_count' => 12,
            'billing_period' => 'annual',
        ],
    ]);

    $subscription = Subscription::query()
        ->where('organization_id', $organization->id)
        ->firstOrFail();

    expect($subscription->employee_count)->toBe(12);
});

test('onboarding clamps paid employee count to plan band', function () {
    $user = User::factory()->create([
        'name' => 'Plan Band User',
    ]);

    $plan = SubscriptionPlan::query()->create([
        'name' => 'Individual',
        'slug' => 'individual-paid-count',
        'currency' => 'NGN',
        'price_per_employee' => 900,
        'billing_period' => 'annual',
        'min_employees' => 1,
        'max_employees' => 5,
        'features' => ['payroll_processing'],
        'is_active' => true,
    ]);

    $organization = app(OnboardingService::class)->setupOrganizationAfterPayment($user, [
        'reference' => 'ps_test_ref_paid_count_clamped',
        'amount' => 483750,
        'metadata' => [
            'plan_slug' => $plan->slug,
            'employee_count' => 9,
            'billing_period' => 'monthly',
        ],
    ]);

    $subscription = Subscription::query()
        ->where('organization_id', $organization->id)
        ->firstOrFail();

    expect($subscription->employee_count)->toBe(5);
});
