<?php

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users without onboarding are redirected to billing plans', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('billing.plans'));
});

test('authenticated users with active subscription can visit the dashboard', function () {
    $user = User::factory()->create();
    $organization = Organization::create([
        'name' => 'Test Org',
        'slug' => 'test-org',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);

    $plan = SubscriptionPlan::create([
        'name' => 'Essential',
        'slug' => 'essential-test',
        'currency' => 'NGN',
        'price_per_employee' => 800,
        'billing_period' => 'annual',
        'min_employees' => 1,
        'max_employees' => 50,
        'features' => ['payroll'],
        'is_active' => true,
    ]);

    $organization->users()->attach($user->id, ['role' => 'owner']);

    Subscription::create([
        'organization_id' => $organization->id,
        'plan_id' => $plan->id,
        'status' => Subscription::STATUS_ACTIVE,
        'trial_end_date' => now()->addDays(7),
        'refund_eligible_until' => now()->addDays(7),
        'next_billing_date' => now()->addYear(),
        'paystack_reference' => 'test-ref-123',
        'amount_paid' => 80000,
        'currency' => 'NGN',
    ]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});
