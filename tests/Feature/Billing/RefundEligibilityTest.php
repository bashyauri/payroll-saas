<?php

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Services\Billing\RefundService;
use Illuminate\Support\Str;

function createRefundFixture(string $subscriptionStatus = Subscription::STATUS_ACTIVE, ?\DateTimeInterface $trialEndsAt = null, ?\DateTimeInterface $refundUntil = null, ?\DateTimeInterface $canceledAt = null, ?string $refundedAt = null): array {
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
        'refund_eligible_until' => $refundUntil,
        'canceled_at' => $canceledAt,
        'refunded_at' => $refundedAt,
        'paystack_reference' => 'paystack_ref_' . Str::random(10),
        'amount_paid' => 10000,
        'currency' => 'NGN',
    ]);

    return [$organization, $subscription];
}

it('allows refund within 7-day window after payment', function () {
    [$organization, $subscription] = createRefundFixture(
        subscriptionStatus: Subscription::STATUS_ACTIVE,
        refundUntil: now()->addDays(7),
    );

    $result = app(RefundService::class)->isRefundEligible($subscription);

    expect($result)->toBeTrue();
});

it('blocks refund after 7-day window has expired', function () {
    [$organization, $subscription] = createRefundFixture(
        subscriptionStatus: Subscription::STATUS_ACTIVE,
        refundUntil: now()->subDay(),
    );

    $result = app(RefundService::class)->isRefundEligible($subscription);

    expect($result)->toBeFalse();
});

it('blocks refund for already refunded subscription', function () {
    [$organization, $subscription] = createRefundFixture(
        subscriptionStatus: Subscription::STATUS_CANCELED,
        refundUntil: now()->addDays(7),
        refundedAt: now()->toDateTimeString(),
    );

    $result = app(RefundService::class)->isRefundEligible($subscription);

    expect($result)->toBeFalse();
});

it('blocks refund for canceled subscription outside refund window', function () {
    [$organization, $subscription] = createRefundFixture(
        subscriptionStatus: Subscription::STATUS_CANCELED,
        refundUntil: now()->subDays(8),
        canceledAt: now()->subDays(10),
    );

    $result = app(RefundService::class)->isRefundEligible($subscription);

    expect($result)->toBeFalse();
});

it('blocks refund for canceled subscription within refund window', function () {
    [$organization, $subscription] = createRefundFixture(
        subscriptionStatus: Subscription::STATUS_CANCELED,
        refundUntil: now()->addDays(5),
        canceledAt: now()->subDay(),
    );

    $result = app(RefundService::class)->isRefundEligible($subscription);

    expect($result)->toBeFalse();
});

it('blocks refund for failed payment subscription', function () {
    [$organization, $subscription] = createRefundFixture(
        subscriptionStatus: Subscription::STATUS_FAILED,
    );

    $result = app(RefundService::class)->isRefundEligible($subscription);

    expect($result)->toBeFalse();
});

it('blocks refund for past due subscription', function () {
    [$organization, $subscription] = createRefundFixture(
        subscriptionStatus: Subscription::STATUS_PAST_DUE,
    );

    $result = app(RefundService::class)->isRefundEligible($subscription);

    expect($result)->toBeFalse();
});

it('blocks refund when refund_eligible_until is null', function () {
    [$organization, $subscription] = createRefundFixture(
        subscriptionStatus: Subscription::STATUS_ACTIVE,
        refundUntil: null,
    );

    $result = app(RefundService::class)->isRefundEligible($subscription);

    expect($result)->toBeFalse();
});
