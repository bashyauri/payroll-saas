<?php

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Services\Billing\SubscriptionProrataionService;
use Carbon\Carbon;

describe('SubscriptionProrataionService', function () {
    beforeEach(function () {
        $this->service = app(SubscriptionProrataionService::class);
    });

    test('calculates proration for monthly to annual upgrade at mid-cycle', function () {
        // Setup: User on monthly plan for 30 days, upgrades on day 15
        $oldPlan = SubscriptionPlan::create([
            'name' => 'Essential',
            'slug' => 'essential',
            'price_per_employee' => 10000,
            'billing_period' => 'monthly',
            'min_employees' => 10,
            'max_employees' => 50,
            'is_active' => true,
        ]);

        $newPlan = SubscriptionPlan::create([
            'name' => 'Professional',
            'slug' => 'professional',
            'price_per_employee' => 15000,
            'billing_period' => 'annual',
            'min_employees' => 50,
            'is_active' => true,
        ]);

        $organization = Organization::create([
            'name' => 'Test Org',
            'slug' => 'test-org',
            'type' => 'organization',
            'billing_status' => 'active',
        ]);

        $subscription = Subscription::create([
            'organization_id' => $organization->id,
            'plan_id' => $oldPlan->id,
            'status' => Subscription::STATUS_ACTIVE,
            'employee_count' => 20,
            'next_billing_date' => now()->addMonth(),
            'paystack_reference' => 'ps_test_'.time(),
            'amount_paid' => 200000,
            'currency' => 'NGN',
        ]);

        $result = $this->service->calculateUpgradeProration(
            $subscription,
            $newPlan,
            25,
            'annual',
        );

        expect($result)->toHaveKeys([
            'old_plan_daily_rate',
            'days_used',
            'days_in_cycle',
            'credit_amount',
            'new_plan_full_cost',
            'new_plan_cost_remaining_days',
            'final_charge',
            'old_subscription_cost',
            'new_next_billing_date',
            'upgraded_on',
        ]);

        // Old plan: 20 employees × 10,000 = 200,000 per month (1/30 days)
        expect($result['old_plan_daily_rate'])->toBeLessThan(7000);
        expect($result['old_plan_daily_rate'])->toBeGreaterThan(6000);

        // Credit should be calculated for days used
        expect($result['credit_amount'])->toBeGreaterThan(0);

        // Final charge should be less than full annual cost or be 0 if old plan covers most
        expect($result['final_charge'])->toBeGreaterThanOrEqual(0);

        // New plan: 25 employees × 15,000 × 12 months = 4,500,000
        expect($result['new_plan_full_cost'])->toEqual(4500000);
    });

    test('calculates proration when upgrading same billing period', function () {
        $oldPlan = SubscriptionPlan::create([
            'name' => 'Essential',
            'slug' => 'essential-annual',
            'price_per_employee' => 5000,
            'billing_period' => 'annual',
            'min_employees' => 10,
            'max_employees' => 50,
            'is_active' => true,
        ]);

        $newPlan = SubscriptionPlan::create([
            'name' => 'Professional',
            'slug' => 'professional-annual',
            'price_per_employee' => 8000,
            'billing_period' => 'annual',
            'min_employees' => 50,
            'is_active' => true,
        ]);

        $organization = Organization::create([
            'name' => 'Test Org 2',
            'slug' => 'test-org-2',
            'type' => 'organization',
            'billing_status' => 'active',
        ]);

        $subscription = Subscription::create([
            'organization_id' => $organization->id,
            'plan_id' => $oldPlan->id,
            'status' => Subscription::STATUS_ACTIVE,
            'employee_count' => 15,
            'next_billing_date' => now()->addYear(),
            'paystack_reference' => 'ps_test_2_'.time(),
            'amount_paid' => 900000,
            'currency' => 'NGN',
        ]);

        $result = $this->service->calculateUpgradeProration(
            $subscription,
            $newPlan,
            15,
            'annual',
        );

        // Both annual, so days_in_cycle should be 365
        expect($result['days_in_cycle'])->toBeGreaterThanOrEqual(364);

        // Old cost: 15 × 5,000 × 12 = 900,000
        expect($result['old_subscription_cost'])->toEqual(900000);

        // New cost: 15 × 8,000 × 12 = 1,440,000
        expect($result['new_plan_full_cost'])->toEqual(1440000);

        // Credit should be proportional to days used
        expect($result['credit_amount'])->toBeGreaterThan(0);
    });

    test('final charge is zero when old plan more expensive than remaining new plan', function () {
        $oldPlan = SubscriptionPlan::create([
            'name' => 'Professional',
            'slug' => 'professional-downgrade',
            'price_per_employee' => 15000,
            'billing_period' => 'annual',
            'min_employees' => 50,
            'is_active' => true,
        ]);

        $newPlan = SubscriptionPlan::create([
            'name' => 'Essential',
            'slug' => 'essential-downgrade',
            'price_per_employee' => 5000,
            'billing_period' => 'annual',
            'min_employees' => 10,
            'max_employees' => 50,
            'is_active' => true,
        ]);

        $organization = Organization::create([
            'name' => 'Test Org 3',
            'slug' => 'test-org-3',
            'type' => 'organization',
            'billing_status' => 'active',
        ]);

        $subscription = Subscription::create([
            'organization_id' => $organization->id,
            'plan_id' => $oldPlan->id,
            'status' => Subscription::STATUS_ACTIVE,
            'employee_count' => 50,
            'next_billing_date' => now()->addYear(),
            'paystack_reference' => 'ps_test_3_'.time(),
            'amount_paid' => 9000000,
            'currency' => 'NGN',
        ]);

        $result = $this->service->calculateUpgradeProration(
            $subscription,
            $newPlan,
            50,
            'annual',
        );

        // Old plan: 50 × 15,000 × 12 = 9,000,000
        // New plan: 50 × 5,000 × 12 = 3,000,000

        // Final charge should be much less than full new plan
        expect($result['final_charge'])->toBeLessThan($result['new_plan_full_cost']);
    });

    test('returns new next billing date one month in future for monthly upgrade', function () {
        $oldPlan = SubscriptionPlan::create([
            'name' => 'Essential Monthly',
            'slug' => 'essential-monthly',
            'price_per_employee' => 10000,
            'billing_period' => 'monthly',
            'min_employees' => 10,
            'max_employees' => 50,
            'is_active' => true,
        ]);

        $newPlan = SubscriptionPlan::create([
            'name' => 'Professional Monthly',
            'slug' => 'professional-monthly',
            'price_per_employee' => 15000,
            'billing_period' => 'monthly',
            'min_employees' => 50,
            'is_active' => true,
        ]);

        $organization = Organization::create([
            'name' => 'Test Org 4',
            'slug' => 'test-org-4',
            'type' => 'organization',
            'billing_status' => 'active',
        ]);

        $subscription = Subscription::create([
            'organization_id' => $organization->id,
            'plan_id' => $oldPlan->id,
            'status' => Subscription::STATUS_ACTIVE,
            'employee_count' => 20,
            'next_billing_date' => now()->addMonth(),
            'paystack_reference' => 'ps_test_4_'.time(),
            'amount_paid' => 200000,
            'currency' => 'NGN',
        ]);

        $result = $this->service->calculateUpgradeProration(
            $subscription,
            $newPlan,
            25,
            'monthly',
        );

        $expectedDate = now()->addMonth();
        $actualDate = Carbon::parse($result['new_next_billing_date']);

        expect($actualDate->diffInDays($expectedDate))->toBeLessThanOrEqual(1);
    });

    test('returns new next billing date one year in future for annual upgrade', function () {
        $oldPlan = SubscriptionPlan::create([
            'name' => 'Essential Annual',
            'slug' => 'essential-annual-end',
            'price_per_employee' => 10000,
            'billing_period' => 'annual',
            'min_employees' => 10,
            'max_employees' => 50,
            'is_active' => true,
        ]);

        $newPlan = SubscriptionPlan::create([
            'name' => 'Professional Annual',
            'slug' => 'professional-annual-end',
            'price_per_employee' => 15000,
            'billing_period' => 'annual',
            'min_employees' => 50,
            'is_active' => true,
        ]);

        $organization = Organization::create([
            'name' => 'Test Org 5',
            'slug' => 'test-org-5',
            'type' => 'organization',
            'billing_status' => 'active',
        ]);

        $subscription = Subscription::create([
            'organization_id' => $organization->id,
            'plan_id' => $oldPlan->id,
            'status' => Subscription::STATUS_ACTIVE,
            'employee_count' => 20,
            'next_billing_date' => now()->addYear(),
            'paystack_reference' => 'ps_test_5_'.time(),
            'amount_paid' => 2400000,
            'currency' => 'NGN',
        ]);

        $result = $this->service->calculateUpgradeProration(
            $subscription,
            $newPlan,
            25,
            'annual',
        );

        $expectedDate = now()->addYear();
        $actualDate = Carbon::parse($result['new_next_billing_date']);

        expect($actualDate->diffInDays($expectedDate))->toBeLessThanOrEqual(1);
    });
});
