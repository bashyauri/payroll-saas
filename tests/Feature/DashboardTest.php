<?php

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Support\Str;

test('guests are redirected to the login page', function () {
    $organization = Organization::create([
        'name' => 'Guest Org',
        'slug' => 'guest-org',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);
    $organization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => 'guest-org.payrollsaas.test',
    ]);

    $response = $this->get('http://guest-org.payrollsaas.test/dashboard');

    $response->assertRedirect(route('login'));
});

test('authenticated users without onboarding are redirected to billing plans', function () {
    $user = User::factory()->create();
    $organization = Organization::create([
        'name' => 'No Billing Org',
        'slug' => 'no-billing-org',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_SUSPENDED,
    ]);
    $organization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => 'no-billing-org.payrollsaas.test',
    ]);
    $organization->users()->attach($user->id, ['role' => 'owner']);

    $this->actingAs($user);

    $response = $this->get('http://no-billing-org.payrollsaas.test/dashboard');

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
    $organization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => 'test-org.payrollsaas.test',
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

    $response = $this->get('http://test-org.payrollsaas.test/dashboard');

    $response->assertOk();
});

test('users with an unpaid org and a paid org are routed to dashboard using paid org context', function () {
    $user = User::factory()->create();

    $unpaidOrganization = Organization::create([
        'name' => 'Unpaid Org',
        'slug' => 'unpaid-org',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_SUSPENDED,
    ]);

    $paidOrganization = Organization::create([
        'name' => 'Paid Org',
        'slug' => 'paid-org',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);
    $unpaidOrganization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => 'unpaid-org.payrollsaas.test',
    ]);
    $paidOrganization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => 'paid-org.payrollsaas.test',
    ]);

    $plan = SubscriptionPlan::create([
        'name' => 'Essential',
        'slug' => 'essential-paid-org-test',
        'currency' => 'NGN',
        'price_per_employee' => 800,
        'billing_period' => 'annual',
        'min_employees' => 1,
        'max_employees' => 50,
        'features' => ['payroll'],
        'is_active' => true,
    ]);

    $unpaidOrganization->users()->attach($user->id, ['role' => 'owner']);
    $paidOrganization->users()->attach($user->id, ['role' => 'owner']);

    Subscription::create([
        'organization_id' => $paidOrganization->id,
        'plan_id' => $plan->id,
        'status' => Subscription::STATUS_ACTIVE,
        'trial_end_date' => now()->addDays(7),
        'refund_eligible_until' => now()->addDays(7),
        'next_billing_date' => now()->addYear(),
        'paystack_reference' => 'test-ref-paid-org',
        'amount_paid' => 80000,
        'currency' => 'NGN',
    ]);

    $this->actingAs($user);

    $response = $this->get('http://paid-org.payrollsaas.test/dashboard');

    $response->assertOk();
});
