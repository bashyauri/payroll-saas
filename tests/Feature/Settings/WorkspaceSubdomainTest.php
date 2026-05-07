<?php

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Support\Str;
use Stancl\Tenancy\Facades\Tenancy;
use Tests\TestCase;

afterEach(function () {
    Tenancy::end();
});

test('organization owner can update workspace subdomain', function () {
    /** @var TestCase $this */
    /** @var User $owner */
    $owner = User::factory()->create();

    $organization = Organization::create([
        'name' => 'Alpha Org',
        'slug' => 'alpha-org',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);

    $organization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => 'alpha-org.payrollsaas.test',
    ]);

    $organization->users()->attach($owner->id, ['role' => 'owner']);

    $plan = SubscriptionPlan::create([
        'name' => 'Essential',
        'slug' => 'essential-workspace-test-'.Str::lower(Str::random(8)),
        'currency' => 'NGN',
        'price_per_employee' => 800,
        'billing_period' => 'annual',
        'min_employees' => 1,
        'max_employees' => 50,
        'features' => ['payroll'],
        'is_active' => true,
    ]);

    Subscription::create([
        'organization_id' => $organization->id,
        'plan_id' => $plan->id,
        'status' => Subscription::STATUS_ACTIVE,
        'trial_end_date' => now()->addDays(7),
        'refund_eligible_until' => now()->addDays(7),
        'next_billing_date' => now()->addYear(),
        'paystack_reference' => 'workspace-ref-'.Str::lower(Str::random(10)),
        'amount_paid' => 80000,
        'currency' => 'NGN',
    ]);

    $response = $this
        ->actingAs($owner)
        ->patch('http://alpha-org.payrollsaas.test/settings/workspace', [
            'subdomain' => 'alpha-updated',
        ]);

    $response->assertRedirect('https://alpha-updated.payroll-saas.test/settings/workspace');

    $this->assertDatabaseHas('domains', [
        'tenant_id' => $organization->id,
        'domain' => 'alpha-updated.payroll-saas.test',
    ]);

    $this->assertDatabaseHas('domains', [
        'tenant_id' => $organization->id,
        'domain' => 'alpha-org.payrollsaas.test',
    ]);
});

test('non-owner cannot update workspace subdomain', function () {
    /** @var TestCase $this */
    /** @var User $member */
    $member = User::factory()->create();

    $organization = Organization::create([
        'name' => 'Beta Org',
        'slug' => 'beta-org',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);

    $organization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => 'beta-org.payrollsaas.test',
    ]);

    $organization->users()->attach($member->id, ['role' => 'member']);

    $plan = SubscriptionPlan::create([
        'name' => 'Essential',
        'slug' => 'essential-workspace-test-'.Str::lower(Str::random(8)),
        'currency' => 'NGN',
        'price_per_employee' => 800,
        'billing_period' => 'annual',
        'min_employees' => 1,
        'max_employees' => 50,
        'features' => ['payroll'],
        'is_active' => true,
    ]);

    Subscription::create([
        'organization_id' => $organization->id,
        'plan_id' => $plan->id,
        'status' => Subscription::STATUS_ACTIVE,
        'trial_end_date' => now()->addDays(7),
        'refund_eligible_until' => now()->addDays(7),
        'next_billing_date' => now()->addYear(),
        'paystack_reference' => 'workspace-ref-'.Str::lower(Str::random(10)),
        'amount_paid' => 80000,
        'currency' => 'NGN',
    ]);

    $response = $this
        ->actingAs($member)
        ->patch('http://beta-org.payrollsaas.test/settings/workspace', [
            'subdomain' => 'beta-updated',
        ]);

    $response->assertForbidden();

    $this->assertDatabaseHas('domains', [
        'tenant_id' => $organization->id,
        'domain' => 'beta-org.payrollsaas.test',
    ]);
});

test('organization admin can update workspace subdomain', function () {
    /** @var TestCase $this */
    /** @var User $admin */
    $admin = User::factory()->create();

    $organization = Organization::create([
        'name' => 'Gamma Org',
        'slug' => 'gamma-org',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);

    $organization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => 'gamma-org.payrollsaas.test',
    ]);

    $organization->users()->attach($admin->id, ['role' => 'admin']);

    $plan = SubscriptionPlan::create([
        'name' => 'Essential',
        'slug' => 'essential-workspace-admin-test-'.Str::lower(Str::random(8)),
        'currency' => 'NGN',
        'price_per_employee' => 800,
        'billing_period' => 'annual',
        'min_employees' => 1,
        'max_employees' => 50,
        'features' => ['payroll'],
        'is_active' => true,
    ]);

    Subscription::create([
        'organization_id' => $organization->id,
        'plan_id' => $plan->id,
        'status' => Subscription::STATUS_ACTIVE,
        'trial_end_date' => now()->addDays(7),
        'refund_eligible_until' => now()->addDays(7),
        'next_billing_date' => now()->addYear(),
        'paystack_reference' => 'workspace-admin-ref-'.Str::lower(Str::random(10)),
        'amount_paid' => 80000,
        'currency' => 'NGN',
    ]);

    $response = $this
        ->actingAs($admin)
        ->patch('http://gamma-org.payrollsaas.test/settings/workspace', [
            'subdomain' => 'gamma-updated',
        ]);

    $response->assertRedirect('https://gamma-updated.payroll-saas.test/settings/workspace');

    $this->assertDatabaseHas('domains', [
        'tenant_id' => $organization->id,
        'domain' => 'gamma-updated.payroll-saas.test',
    ]);
});

test('workspace subdomain update works while tenancy is initialized', function () {
    /** @var TestCase $this */
    /** @var User $owner */
    $owner = User::factory()->create();

    $organization = Organization::create([
        'name' => 'Delta Org',
        'slug' => 'delta-org',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);

    $organization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => 'delta-org.payrollsaas.test',
    ]);

    $organization->users()->attach($owner->id, ['role' => 'owner']);

    $plan = SubscriptionPlan::create([
        'name' => 'Essential',
        'slug' => 'essential-workspace-tenant-context-'.Str::lower(Str::random(8)),
        'currency' => 'NGN',
        'price_per_employee' => 800,
        'billing_period' => 'annual',
        'min_employees' => 1,
        'max_employees' => 50,
        'features' => ['payroll'],
        'is_active' => true,
    ]);

    Subscription::create([
        'organization_id' => $organization->id,
        'plan_id' => $plan->id,
        'status' => Subscription::STATUS_ACTIVE,
        'trial_end_date' => now()->addDays(7),
        'refund_eligible_until' => now()->addDays(7),
        'next_billing_date' => now()->addYear(),
        'paystack_reference' => 'workspace-tenant-context-ref-'.Str::lower(Str::random(10)),
        'amount_paid' => 80000,
        'currency' => 'NGN',
    ]);

    Tenancy::initialize($organization);

    $response = $this
        ->actingAs($owner)
        ->patch('http://delta-org.payrollsaas.test/settings/workspace', [
            'subdomain' => 'delta-updated',
        ]);

    $response->assertRedirect('https://delta-updated.payroll-saas.test/settings/workspace');
    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('domains', [
        'tenant_id' => $organization->id,
        'domain' => 'delta-updated.payroll-saas.test',
    ]);
});

test('old tenant alias redirects to canonical domain after subdomain change', function () {
    /** @var TestCase $this */
    /** @var User $owner */
    $owner = User::factory()->create();

    $organization = Organization::create([
        'name' => 'Epsilon Org',
        'slug' => 'epsilon-org',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);

    $organization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => 'epsilon-org.payrollsaas.test',
    ]);

    $organization->users()->attach($owner->id, ['role' => 'owner']);

    $plan = SubscriptionPlan::create([
        'name' => 'Essential',
        'slug' => 'essential-workspace-alias-redirect-'.Str::lower(Str::random(8)),
        'currency' => 'NGN',
        'price_per_employee' => 800,
        'billing_period' => 'annual',
        'min_employees' => 1,
        'max_employees' => 50,
        'features' => ['payroll'],
        'is_active' => true,
    ]);

    Subscription::create([
        'organization_id' => $organization->id,
        'plan_id' => $plan->id,
        'status' => Subscription::STATUS_ACTIVE,
        'trial_end_date' => now()->addDays(7),
        'refund_eligible_until' => now()->addDays(7),
        'next_billing_date' => now()->addYear(),
        'paystack_reference' => 'workspace-alias-redirect-ref-'.Str::lower(Str::random(10)),
        'amount_paid' => 80000,
        'currency' => 'NGN',
    ]);

    $this
        ->actingAs($owner)
        ->patch('http://epsilon-org.payrollsaas.test/settings/workspace', [
            'subdomain' => 'epsilon-renamed',
        ])
        ->assertRedirect('https://epsilon-renamed.payroll-saas.test/settings/workspace');

    $aliasResponse = $this
        ->actingAs($owner)
        ->get('http://epsilon-org.payrollsaas.test/settings/workspace');

    $aliasResponse->assertRedirect('http://epsilon-renamed.payroll-saas.test/settings/workspace');
});
