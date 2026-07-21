<?php

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Services\Billing\BillingAccessGuard;
use Illuminate\Support\Str;

function createPayrollFinalizationFixture(string $billingStatus = Organization::BILLING_ACTIVE, string $subscriptionStatus = Subscription::STATUS_ACTIVE, ?\DateTimeInterface $graceEndsAt = null, bool $readOnlyMode = false): array {
    $organization = Organization::query()->create([
        'id' => (string) Str::ulid(),
        'name' => 'Acme Corp',
        'slug' => 'acme-' . Str::lower(Str::random(8)),
        'type' => 'organization',
        'billing_status' => $billingStatus,
        'billing_status_updated_at' => now(),
        'read_only_mode' => $readOnlyMode,
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
        'grace_period_ends_at' => $graceEndsAt,
        'refund_eligible_until' => now()->addDays(7),
        'amount_paid' => 10000,
        'currency' => 'NGN',
    ]);

    return [$organization, $subscription];
}

it('allows payroll finalization in active billing state', function () {
    [$organization, $subscription] = createPayrollFinalizationFixture(
        billingStatus: Organization::BILLING_ACTIVE,
        subscriptionStatus: Subscription::STATUS_ACTIVE,
    );

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization, $subscription);

    expect($decision->allowed)->toBeTrue()
        ->and($decision->code)->toBe('allowed');
});

it('allows payroll finalization with warning during grace period', function () {
    [$organization, $subscription] = createPayrollFinalizationFixture(
        billingStatus: Organization::BILLING_GRACE,
        subscriptionStatus: Subscription::STATUS_PAST_DUE,
        graceEndsAt: now()->addDays(3),
    );

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization, $subscription);

    expect($decision->allowed)->toBeTrue()
        ->and($decision->code)->toBe('grace_warning')
        ->and($decision->message)->toContain('grace period');
});

it('blocks payroll finalization when grace period has expired', function () {
    [$organization, $subscription] = createPayrollFinalizationFixture(
        billingStatus: Organization::BILLING_GRACE,
        subscriptionStatus: Subscription::STATUS_FAILED,
        graceEndsAt: now()->subDay(),
    );

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization, $subscription);

    expect($decision->allowed)->toBeFalse()
        ->and($decision->code)->toBe('grace_expired');
});

it('blocks payroll finalization when organization is suspended', function () {
    [$organization, $subscription] = createPayrollFinalizationFixture(
        billingStatus: Organization::BILLING_SUSPENDED,
        subscriptionStatus: Subscription::STATUS_FAILED,
    );

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization, $subscription);

    expect($decision->allowed)->toBeFalse()
        ->and($decision->code)->toBe('billing_blocked');
});

it('blocks payroll finalization when organization is canceled', function () {
    [$organization, $subscription] = createPayrollFinalizationFixture(
        billingStatus: Organization::BILLING_CANCELED,
        subscriptionStatus: Subscription::STATUS_CANCELED,
        readOnlyMode: true,
    );

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization, $subscription);

    expect($decision->allowed)->toBeFalse()
        ->and($decision->code)->toBe('billing_blocked');
});

it('blocks payroll finalization when read-only mode is enabled', function () {
    [$organization, $subscription] = createPayrollFinalizationFixture(
        billingStatus: Organization::BILLING_SUSPENDED,
        subscriptionStatus: Subscription::STATUS_FAILED,
        readOnlyMode: true,
    );

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization, $subscription);

    expect($decision->allowed)->toBeFalse()
        ->and($decision->code)->toBe('billing_blocked');
});

it('allows payroll finalization when subscription is active but in trial', function () {
    [$organization, $subscription] = createPayrollFinalizationFixture(
        billingStatus: Organization::BILLING_ACTIVE,
        subscriptionStatus: Subscription::STATUS_ACTIVE,
    );

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization, $subscription);

    expect($decision->allowed)->toBeTrue()
        ->and($decision->code)->toBe('allowed');
});

it('blocks payroll finalization when subscription status is invalid', function () {
    [$organization, $subscription] = createPayrollFinalizationFixture(
        billingStatus: Organization::BILLING_CANCELED,
        subscriptionStatus: Subscription::STATUS_CANCELED,
    );

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization, $subscription);

    expect($decision->allowed)->toBeFalse()
        ->and($decision->code)->toBe('billing_blocked');
});

it('provides descriptive error message for blocked finalization', function () {
    [$organization, $subscription] = createPayrollFinalizationFixture(
        billingStatus: Organization::BILLING_SUSPENDED,
        subscriptionStatus: Subscription::STATUS_FAILED,
    );

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization, $subscription);

    expect($decision->allowed)->toBeFalse()
        ->and($decision->message)->not->toBeEmpty();
});

it('allows payroll finalization after reactivation from grace period', function () {
    [$organization, $subscription] = createPayrollFinalizationFixture(
        billingStatus: Organization::BILLING_GRACE,
        subscriptionStatus: Subscription::STATUS_PAST_DUE,
        graceEndsAt: now()->addDays(5),
    );

    // Simulate reactivation
    $subscription->update([
        'status' => Subscription::STATUS_ACTIVE,
        'grace_period_ends_at' => null,
    ]);

    $organization->update([
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);

    $decision = app(BillingAccessGuard::class)->canFinalizePayroll($organization->fresh(), $subscription->fresh());

    expect($decision->allowed)->toBeTrue()
        ->and($decision->code)->toBe('allowed');
});
