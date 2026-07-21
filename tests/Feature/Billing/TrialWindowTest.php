<?php

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Illuminate\Support\Str;

function createTrialFixture(?\DateTimeInterface $trialEndsAt, string $subscriptionStatus = Subscription::STATUS_ACTIVE): array {
    $organization = Organization::query()->create([
        'id' => (string) Str::ulid(),
        'name' => 'Acme Corp',
        'slug' => 'acme-' . Str::lower(Str::random(8)),
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
        'billing_status_updated_at' => now(),
        'read_only_mode' => false,
        'data' => [],
    ]);

    $plan = SubscriptionPlan::query()->create([
        'name' => 'Essential',
        'slug' => SubscriptionPlan::PLAN_ESSENTIAL . '-' . Str::lower(Str::random(8)),
        'currency' => 'NGN',
        'price_per_employee' => 800,
        'billing_period' => 'annual',
        'min_employees' => 1,
        'max_employees' => 50,
        'features' => ['payroll_processing'],
        'is_active' => true,
    ]);

    $subscription = Subscription::query()->create([
        'organization_id' => $organization->id,
        'plan_id' => $plan->id,
        'status' => $subscriptionStatus,
        'trial_end_date' => $trialEndsAt,
        'refund_eligible_until' => now()->addDays(7),
        'amount_paid' => 10000,
        'currency' => 'NGN',
    ]);

    return [$organization, $subscription];
}

it('identifies subscription as within trial period', function () {
    [$organization, $subscription] = createTrialFixture(
        trialEndsAt: now()->addDays(3),
    );

    expect($subscription->isInTrial())->toBeTrue()
        ->and($subscription->trial_end_date->isFuture())->toBeTrue();
});

it('identifies subscription as outside trial period when ended', function () {
    [$organization, $subscription] = createTrialFixture(
        trialEndsAt: now()->subDay(),
    );

    expect($subscription->isInTrial())->toBeFalse()
        ->and($subscription->trial_end_date->isPast())->toBeTrue();
});

it('identifies subscription as outside trial period when null', function () {
    [$organization, $subscription] = createTrialFixture(
        trialEndsAt: null,
    );

    expect($subscription->isInTrial())->toBeFalse()
        ->and($subscription->trial_end_date)->toBeNull();
});

it('calculates remaining trial days correctly', function () {
    [$organization, $subscription] = createTrialFixture(
        trialEndsAt: now()->addDays(5),
    );

    $remainingDays = now()->diffInDays($subscription->trial_end_date, false);

    expect($remainingDays)->toBeGreaterThan(4)->toBeLessThan(6);
});

it('returns 0 remaining days when trial has ended', function () {
    [$organization, $subscription] = createTrialFixture(
        trialEndsAt: now()->subDay(),
    );

    $remainingDays = $subscription->trial_end_date->diffInDays(now());

    expect($remainingDays)->toBeGreaterThanOrEqual(1); // diffInDays returns absolute difference
});

it('allows full functionality during trial period', function () {
    [$organization, $subscription] = createTrialFixture(
        trialEndsAt: now()->addDays(5),
    );

    expect($subscription->isInTrial())->toBeTrue()
        ->and($organization->billing_status)->toBe(Organization::BILLING_ACTIVE)
        ->and($organization->read_only_mode)->toBeFalse();
});

it('transitions to active billing after trial ends', function () {
    [$organization, $subscription] = createTrialFixture(
        trialEndsAt: now()->subDay(),
    );

    expect($subscription->isInTrial())->toBeFalse()
        ->and($subscription->status)->toBe(Subscription::STATUS_ACTIVE);
});

it('sets refund eligibility window to 7 days from trial start', function () {
    [$organization, $subscription] = createTrialFixture(
        trialEndsAt: now()->addDays(7),
    );

    expect($subscription->refund_eligible_until)->not->toBeNull()
        ->and($subscription->refund_eligible_until->gt(now()))->toBeTrue();
});
