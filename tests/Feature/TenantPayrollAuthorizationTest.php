<?php

use App\Models\Employee;
use App\Models\Organization;
use App\Models\PayrollRun;
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

test('owner can export csv reports', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollTenantContextWithRole('owner');

    Tenancy::initialize($organization);

    Employee::query()->create([
        'employee_number' => 'EMP-0001',
        'first_name' => 'Amina',
        'last_name' => 'Yusuf',
        'bank_name' => 'Access Bank',
        'bank_account_name' => 'Amina Yusuf',
        'bank_account_number' => '0123456789',
        'monthly_gross_salary' => 250000,
        'monthly_tax_deduction' => 12000,
        'monthly_pension_deduction' => 20000,
        'monthly_nhf_deduction' => 5000,
        'other_monthly_deductions' => 3000,
        'tax_identification_number' => 'TIN-1001',
        'pension_pin' => 'PEN-9001',
        'pfa_name' => 'Premium PFA',
        'nhf_number' => 'NHF-9010',
    ]);

    $response = $this
        ->actingAs($user)
        ->get('http://'.$organization->slug.'.payrollsaas.test/reports/export?type=pension');

    $response->assertOk();
    $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
    $streamed = $response->streamedContent();

    expect($streamed)->toContain('Employee Number');
    expect($streamed)->toContain('EMP-0001');
});

test('member is forbidden from reports export endpoint', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollTenantContextWithRole('member');

    $response = $this
        ->actingAs($user)
        ->get('http://'.$organization->slug.'.payrollsaas.test/reports/export?type=pension');

    $response->assertForbidden();
});

test('reports export rejects invalid type', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollTenantContextWithRole('owner');

    $response = $this
        ->actingAs($user)
        ->get('http://'.$organization->slug.'.payrollsaas.test/reports/export?type=invalid');

    $response->assertStatus(422);
});

test('owner can create a payroll run', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollTenantContextWithRole('owner');

    $response = $this
        ->actingAs($user)
        ->post('http://'.$organization->slug.'.payrollsaas.test/payroll/runs', [
            'period_month' => '2026-05',
        ]);

    $response->assertRedirect('http://'.$organization->slug.'.payrollsaas.test/payroll');

    Tenancy::initialize($organization);

    expect(PayrollRun::query()->where('period_month', '2026-05')->exists())->toBeTrue();
});

test('member is forbidden from creating payroll run', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollTenantContextWithRole('member');

    $response = $this
        ->actingAs($user)
        ->post('http://'.$organization->slug.'.payrollsaas.test/payroll/runs', [
            'period_month' => '2026-05',
        ]);

    $response->assertForbidden();
});

test('owner can finalize a payroll run', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollTenantContextWithRole('owner');

    Tenancy::initialize($organization);

    $run = PayrollRun::query()->create([
        'period_month' => '2026-05',
        'period_start' => '2026-05-01',
        'period_end' => '2026-05-31',
        'status' => PayrollRun::STATUS_DRAFT,
        'employee_count' => 0,
        'total_gross_salary' => 0,
        'total_deductions' => 0,
        'total_net_pay' => 0,
        'settings_snapshot' => ['source' => 'test'],
        'created_by_user_id' => (string) $user->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->post('http://'.$organization->slug.'.payrollsaas.test/payroll/runs/'.$run->id.'/finalize');

    $response->assertRedirect('http://'.$organization->slug.'.payrollsaas.test/payroll');
    $response->assertSessionHas('status', 'payroll-run-finalized');

    expect($run->fresh()->status)->toBe(PayrollRun::STATUS_FINALIZED);
});
