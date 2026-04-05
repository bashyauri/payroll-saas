<?php

use App\Models\Organization;
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

test('successful upgrade payment updates the existing subscription', function () {
    $user = User::factory()->create([
        'name' => 'Upgrade User',
    ]);

    $currentPlan = SubscriptionPlan::query()->create([
        'name' => 'Essential',
        'slug' => 'essential-upgrade-existing',
        'currency' => 'NGN',
        'price_per_employee' => 800,
        'billing_period' => 'annual',
        'min_employees' => 1,
        'max_employees' => 50,
        'features' => ['payroll_processing'],
        'is_active' => true,
    ]);

    $upgradedPlan = SubscriptionPlan::query()->create([
        'name' => 'Professional',
        'slug' => 'professional-upgrade-existing',
        'currency' => 'NGN',
        'price_per_employee' => 1200,
        'billing_period' => 'annual',
        'min_employees' => 10,
        'max_employees' => null,
        'features' => ['payroll_processing', 'advanced_analytics'],
        'is_active' => true,
    ]);

    $organization = Organization::create([
        'name' => 'Upgrade Org',
        'slug' => 'upgrade-org',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);
    $organization->users()->attach($user->id, ['role' => 'owner']);

    $subscription = Subscription::query()->create([
        'organization_id' => $organization->id,
        'plan_id' => $currentPlan->id,
        'status' => Subscription::STATUS_ACTIVE,
        'trial_end_date' => now()->addDays(7),
        'refund_eligible_until' => now()->addDays(7),
        'next_billing_date' => now()->addYear(),
        'paystack_reference' => 'ps_existing_upgrade_ref',
        'amount_paid' => 9288000,
        'currency' => 'NGN',
        'employee_count' => 12,
    ]);

    $result = app(OnboardingService::class)->completePayment($user, [
        'reference' => 'ps_upgrade_completed_ref',
        'amount' => 3096000,
        'metadata' => [
            'plan_slug' => $upgradedPlan->slug,
            'employee_count' => 24,
            'billing_period' => 'monthly',
            'organization_id' => $organization->id,
            'subscription_id' => $subscription->id,
        ],
    ]);

    $subscription->refresh();

    expect($result->is($organization))->toBeTrue();
    expect($subscription->plan_id)->toBe($upgradedPlan->id);
    expect($subscription->employee_count)->toBe(24);
    expect($subscription->paystack_reference)->toBe('ps_upgrade_completed_ref');
    expect($subscription->status)->toBe(Subscription::STATUS_ACTIVE);
});
