<?php

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Services\Billing\BillingAccessGuard;
use Illuminate\Support\Str;

function createBillingFixture(string $billingStatus = Organization::BILLING_ACTIVE, string $subscriptionStatus = Subscription::STATUS_ACTIVE, ?\DateTimeInterface $graceEndsAt = null, ?\DateTimeInterface $refundUntil = null): array {
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
        'trial_end_date' => now()->addDays(7),
        'refund_eligible_until' => $refundUntil,
        'grace_period_ends_at' => $graceEndsAt,
        'amount_paid' => 10000,
        'currency' => 'NGN',
    ]);

    return [$organization, $subscription];
}

it('allows finalization in active state', function () {
    [$organization, $subscription] = createBillingFixture();

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization, $subscription);

    expect($decision->allowed)->toBeTrue()
        ->and($decision->code)->toBe('allowed');
});

it('allows with warning in grace state before expiration', function () {
    [$organization, $subscription] = createBillingFixture(
        billingStatus: Organization::BILLING_GRACE,
        subscriptionStatus: Subscription::STATUS_PAST_DUE,
        graceEndsAt: now()->addDay(),
    );

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization, $subscription);

    expect($decision->allowed)->toBeTrue()
        ->and($decision->code)->toBe('grace_warning');
});

it('blocks finalization when grace has expired', function () {
    [$organization, $subscription] = createBillingFixture(
        billingStatus: Organization::BILLING_GRACE,
        subscriptionStatus: Subscription::STATUS_FAILED,
        graceEndsAt: now()->subMinute(),
    );

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization, $subscription);

    expect($decision->allowed)->toBeFalse()
        ->and($decision->code)->toBe('grace_expired');
});

it('blocks finalization when organization is suspended', function () {
    [$organization, $subscription] = createBillingFixture(
        billingStatus: Organization::BILLING_SUSPENDED,
        subscriptionStatus: Subscription::STATUS_FAILED,
    );

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization, $subscription);

    expect($decision->allowed)->toBeFalse()
        ->and($decision->code)->toBe('billing_blocked');
});

it('treats cancellation within 7 days as refund-eligible', function () {
    [$organization, $subscription] = createBillingFixture(
        billingStatus: Organization::BILLING_ACTIVE,
        subscriptionStatus: Subscription::STATUS_ACTIVE,
        refundUntil: now()->addDays(7),
    );

    $subscription->update([
        'status' => Subscription::STATUS_CANCELED,
        'canceled_at' => now(),
    ]);

    $organization->update([
        'billing_status' => Organization::BILLING_CANCELED,
        'read_only_mode' => true,
    ]);

    expect($subscription->fresh()->refund_eligible_until?->isFuture())->toBeTrue()
        ->and($organization->fresh()->read_only_mode)->toBeTrue();
});
