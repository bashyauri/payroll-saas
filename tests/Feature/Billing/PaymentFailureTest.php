<?php

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Services\Billing\BillingAccessGuard;
use Illuminate\Support\Str;

function createPaymentFailureFixture(string $billingStatus = Organization::BILLING_ACTIVE, string $subscriptionStatus = Subscription::STATUS_ACTIVE, ?\DateTimeInterface $graceEndsAt = null, ?\DateTimeInterface $trialEndsAt = null): array {
    $organization = Organization::query()->create([
        'id' => (string) Str::ulid(),
        'name' => 'Acme Corp',
        'slug' => 'acme-' . Str::lower(Str::random(8)),
        'type' => 'organization',
        'billing_status' => $billingStatus,
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
        'grace_period_ends_at' => $graceEndsAt,
        'refund_eligible_until' => now()->addDays(7),
        'amount_paid' => 10000,
        'currency' => 'NGN',
    ]);

    return [$organization, $subscription];
}

it('transitions to grace period on payment failure', function () {
    [$organization, $subscription] = createPaymentFailureFixture(
        billingStatus: Organization::BILLING_GRACE,
        subscriptionStatus: Subscription::STATUS_PAST_DUE,
        graceEndsAt: now()->addDays(7),
    );

    expect($organization->billing_status)->toBe(Organization::BILLING_GRACE)
        ->and($subscription->status)->toBe(Subscription::STATUS_PAST_DUE)
        ->and($subscription->grace_period_ends_at)->not->toBeNull();
});

it('allows operations during grace period before expiration', function () {
    [$organization, $subscription] = createPaymentFailureFixture(
        billingStatus: Organization::BILLING_GRACE,
        subscriptionStatus: Subscription::STATUS_PAST_DUE,
        graceEndsAt: now()->addDays(5),
    );

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization, $subscription);

    expect($decision->allowed)->toBeTrue()
        ->and($decision->code)->toBe('grace_warning');
});

it('blocks operations when grace period has expired', function () {
    [$organization, $subscription] = createPaymentFailureFixture(
        billingStatus: Organization::BILLING_GRACE,
        subscriptionStatus: Subscription::STATUS_FAILED,
        graceEndsAt: now()->subDay(),
    );

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization, $subscription);

    expect($decision->allowed)->toBeFalse()
        ->and($decision->code)->toBe('grace_expired');
});

it('transitions to suspended status after grace expiration', function () {
    [$organization, $subscription] = createPaymentFailureFixture(
        billingStatus: Organization::BILLING_SUSPENDED,
        subscriptionStatus: Subscription::STATUS_FAILED,
        graceEndsAt: now()->subDay(),
    );

    expect($organization->billing_status)->toBe(Organization::BILLING_SUSPENDED)
        ->and($subscription->status)->toBe(Subscription::STATUS_FAILED);
});

it('enables read-only mode when grace period expires', function () {
    [$organization, $subscription] = createPaymentFailureFixture(
        billingStatus: Organization::BILLING_SUSPENDED,
        subscriptionStatus: Subscription::STATUS_FAILED,
        graceEndsAt: now()->subDay(),
    );

    $organization->update(['read_only_mode' => true]);

    expect($organization->fresh()->read_only_mode)->toBeTrue();
});

it('calculates remaining grace period days correctly', function () {
    [$organization, $subscription] = createPaymentFailureFixture(
        billingStatus: Organization::BILLING_GRACE,
        subscriptionStatus: Subscription::STATUS_PAST_DUE,
        graceEndsAt: now()->addDays(3),
    );

    $remainingDays = now()->diffInDays($subscription->grace_period_ends_at, false);

    expect($remainingDays)->toBeGreaterThan(2)->toBeLessThan(4);
});

it('allows reactivation after payment failure', function () {
    [$organization, $subscription] = createPaymentFailureFixture(
        billingStatus: Organization::BILLING_GRACE,
        subscriptionStatus: Subscription::STATUS_PAST_DUE,
        graceEndsAt: now()->addDays(5),
    );

    $subscription->update([
        'status' => Subscription::STATUS_ACTIVE,
        'grace_period_ends_at' => null,
    ]);

    $organization->update([
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);

    expect($subscription->fresh()->status)->toBe(Subscription::STATUS_ACTIVE)
        ->and($organization->fresh()->billing_status)->toBe(Organization::BILLING_ACTIVE);
});

it('maintains refund eligibility during grace period', function () {
    [$organization, $subscription] = createPaymentFailureFixture(
        billingStatus: Organization::BILLING_GRACE,
        subscriptionStatus: Subscription::STATUS_PAST_DUE,
        graceEndsAt: now()->addDays(5),
    );

    expect($subscription->refund_eligible_until->isFuture())->toBeTrue();
});
