<?php

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Support\Str;
use Stancl\Tenancy\Bootstrappers\CacheTenancyBootstrapper;
use Stancl\Tenancy\Bootstrappers\DatabaseTenancyBootstrapper;
use Stancl\Tenancy\Bootstrappers\FilesystemTenancyBootstrapper;
use Stancl\Tenancy\Bootstrappers\QueueTenancyBootstrapper;
use Stancl\Tenancy\Facades\Tenancy;
use Tests\TestCase;

beforeEach(function () {
    config([
        'tenancy.bootstrappers' => [
            DatabaseTenancyBootstrapper::class,
            CacheTenancyBootstrapper::class,
            FilesystemTenancyBootstrapper::class,
            QueueTenancyBootstrapper::class,
        ],
    ]);
});

afterEach(function () {
    Tenancy::end();
});

function createPayrollTenantContextWithRole(string $role): array
{
    $user = User::factory()->create();
    $organization = Organization::create([
        'name' => 'Payroll Auth Org '.Str::lower(Str::random(4)),
        'slug' => 'payroll-auth-org-'.Str::lower(Str::random(8)),
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);

    $organization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => $organization->slug.'.payrollsaas.test',
    ]);

    $organization->users()->attach($user->id, ['role' => $role]);

    $plan = SubscriptionPlan::create([
        'name' => 'Essential',
        'slug' => 'essential-payroll-auth-'.Str::lower(Str::random(8)),
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
        'paystack_reference' => 'payroll-auth-ref-'.Str::lower(Str::random(10)),
        'amount_paid' => 80000,
        'currency' => 'NGN',
        'employee_count' => 5,
    ]);

    return [$user, $organization];
}

test('owner can access payroll finalization endpoint', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollTenantContextWithRole('owner');

    $response = $this
        ->actingAs($user)
        ->post('http://'.$organization->slug.'.payrollsaas.test/payroll/finalize');

    $response->assertOk();
    $response->assertJsonPath('allowed', true);
});

test('admin can access payroll finalization endpoint', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollTenantContextWithRole('admin');

    $response = $this
        ->actingAs($user)
        ->post('http://'.$organization->slug.'.payrollsaas.test/payroll/finalize');

    $response->assertOk();
    $response->assertJsonPath('allowed', true);
});

test('member is forbidden from payroll finalization endpoint', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollTenantContextWithRole('member');

    $response = $this
        ->actingAs($user)
        ->post('http://'.$organization->slug.'.payrollsaas.test/payroll/finalize');

    $response->assertForbidden();
});

test('owner can access payroll and reports pages', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollTenantContextWithRole('owner');

    $payrollResponse = $this
        ->actingAs($user)
        ->get('http://'.$organization->slug.'.payrollsaas.test/payroll');

    $reportsResponse = $this
        ->actingAs($user)
        ->get('http://'.$organization->slug.'.payrollsaas.test/reports');

    $payrollResponse->assertOk();
    $reportsResponse->assertOk();
});

test('member is forbidden from payroll and reports pages', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollTenantContextWithRole('member');

    $payrollResponse = $this
        ->actingAs($user)
        ->get('http://'.$organization->slug.'.payrollsaas.test/payroll');

    $reportsResponse = $this
        ->actingAs($user)
        ->get('http://'.$organization->slug.'.payrollsaas.test/reports');

    $payrollResponse->assertForbidden();
    $reportsResponse->assertForbidden();
});
