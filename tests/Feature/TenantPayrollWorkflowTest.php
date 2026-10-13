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

function createWorkflowTenant(string $role): array
{
    $user = User::factory()->create();
    $organization = Organization::create([
        'name' => 'Workflow Org '.Str::lower(Str::random(4)),
        'slug' => 'wf-org-'.Str::lower(Str::random(8)),
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);

    $organization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => $organization->slug.'.payrollsaas.test',
    ]);

    $organization->users()->attach($user->id, ['role' => $role]);

    $plan = SubscriptionPlan::create([
        'name' => 'Essential Plan',
        'slug' => 'essential-wf-'.Str::lower(Str::random(8)),
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
        'paystack_reference' => 'wf-ref-'.Str::lower(Str::random(10)),
        'amount_paid' => 80000,
        'currency' => 'NGN',
        'employee_count' => 5,
    ]);

    return [$user, $organization];
}

test('editing employee adjustments saves and recalculates in draft payroll run', function () {
    /** @var TestCase $this */
    [$user, $organization] = createWorkflowTenant('admin');

    Tenancy::initialize($organization);

    $employee = Employee::query()->create([
        'employee_number' => 'EMP-WF-01',
        'first_name' => 'Tunde',
        'last_name' => 'Bakare',
        'bank_name' => 'Zenith Bank',
        'bank_account_name' => 'Tunde Bakare',
        'bank_account_number' => '1234567890',
        'monthly_gross_salary' => 200000,
        'basic_salary' => 100000,
        'housing_allowance' => 60000,
        'transport_allowance' => 40000,
        'apply_paye_deduction' => true,
        'apply_pension_deduction' => true,
        'employment_type' => 'full_time',
        'status' => 'active',
    ]);

    $run = PayrollRun::query()->create([
        'period_month' => '2026-06',
        'period_start' => '2026-06-01',
        'period_end' => '2026-06-30',
        'status' => PayrollRun::STATUS_DRAFT,
        'employee_count' => 1,
        'total_gross_salary' => 200000,
        'total_deductions' => 20000,
        'total_net_pay' => 180000,
        'settings_snapshot' => [
            'computed_totals' => [
                'employee_calculations' => [],
            ],
            'employee_overrides' => [],
        ],
        'created_by_user_id' => (string) $user->id,
    ]);

    Tenancy::end();

    // Submit employee adjustments (bonus + advance recovery)
    $response = $this
        ->actingAs($user)
        ->patch('http://'.$organization->slug.'.payrollsaas.test/payroll/runs/'.$run->id.'/employees/'.$employee->id, [
            'basic_salary' => 100000,
            'housing_allowance' => 60000,
            'transport_allowance' => 40000,
            'additional_payments' => [
                ['name' => 'Quarterly Bonus', 'amount' => 50000, 'taxable' => true],
            ],
            'additional_deductions' => [
                ['name' => 'Salary Advance Recovery', 'amount' => 15000],
            ],
        ]);

    $response->assertRedirect('http://'.$organization->slug.'.payrollsaas.test/payroll/runs/'.$run->id);

    Tenancy::initialize($organization);
    $freshRun = $run->fresh();

    expect((float) $freshRun->total_gross_salary)->toBe(250000.0);
    expect(data_get($freshRun->settings_snapshot, 'employee_overrides.'.$employee->id))->not->toBeNull();

    $calc = collect(data_get($freshRun->settings_snapshot, 'computed_totals.employee_calculations'))
        ->firstWhere('employee_id', $employee->id);

    expect($calc)->not->toBeNull();
    expect($calc['total_additional_payments'])->toEqual(50000);
    expect($calc['total_additional_deductions'])->toEqual(15000);
    expect($calc['total_earnings'])->toEqual(250000);
    expect($calc['is_adjusted'])->toBeTrue();
});

test('multi-step approval workflow: submit, approve, and finalize', function () {
    /** @var TestCase $this */
    [$owner, $organization] = createWorkflowTenant('owner');

    Tenancy::initialize($organization);

    $run = PayrollRun::query()->create([
        'period_month' => '2026-07',
        'period_start' => '2026-07-01',
        'period_end' => '2026-07-31',
        'status' => PayrollRun::STATUS_DRAFT,
        'employee_count' => 1,
        'total_gross_salary' => 300000,
        'total_deductions' => 30000,
        'total_net_pay' => 270000,
        'settings_snapshot' => [],
        'created_by_user_id' => (string) $owner->id,
    ]);

    Tenancy::end();

    // 1. Submit for approval
    $submitResponse = $this
        ->actingAs($owner)
        ->post('http://'.$organization->slug.'.payrollsaas.test/payroll/runs/'.$run->id.'/submit-approval');

    $submitResponse->assertRedirect('http://'.$organization->slug.'.payrollsaas.test/payroll/runs/'.$run->id);
    expect($run->fresh()->status)->toBe(PayrollRun::STATUS_PENDING_APPROVAL);

    // 2. Approve
    $approveResponse = $this
        ->actingAs($owner)
        ->post('http://'.$organization->slug.'.payrollsaas.test/payroll/runs/'.$run->id.'/approve', [
            'notes' => 'Calculations verified by Finance lead.',
        ]);

    $approveResponse->assertRedirect('http://'.$organization->slug.'.payrollsaas.test/payroll/runs/'.$run->id);
    expect($run->fresh()->status)->toBe(PayrollRun::STATUS_APPROVED);
    expect($run->fresh()->approval_notes)->toBe('Calculations verified by Finance lead.');

    // 3. Finalize
    $finalizeResponse = $this
        ->actingAs($owner)
        ->post('http://'.$organization->slug.'.payrollsaas.test/payroll/runs/'.$run->id.'/finalize');

    $finalizeResponse->assertRedirect('http://'.$organization->slug.'.payrollsaas.test/payroll/runs/'.$run->id);
    expect($run->fresh()->status)->toBe(PayrollRun::STATUS_FINALIZED);
});

test('rejection sends pending payroll back to draft with reason', function () {
    /** @var TestCase $this */
    [$admin, $organization] = createWorkflowTenant('admin');

    Tenancy::initialize($organization);

    $run = PayrollRun::query()->create([
        'period_month' => '2026-08',
        'period_start' => '2026-08-01',
        'period_end' => '2026-08-31',
        'status' => PayrollRun::STATUS_PENDING_APPROVAL,
        'employee_count' => 1,
        'total_gross_salary' => 200000,
        'total_deductions' => 20000,
        'total_net_pay' => 180000,
        'settings_snapshot' => [],
        'created_by_user_id' => (string) $admin->id,
    ]);

    Tenancy::end();

    $rejectResponse = $this
        ->actingAs($admin)
        ->post('http://'.$organization->slug.'.payrollsaas.test/payroll/runs/'.$run->id.'/reject', [
            'reason' => 'Missing overtime deduction for sales team.',
        ]);

    $rejectResponse->assertRedirect('http://'.$organization->slug.'.payrollsaas.test/payroll/runs/'.$run->id);
    expect($run->fresh()->status)->toBe(PayrollRun::STATUS_DRAFT);
    expect($run->fresh()->rejection_reason)->toBe('Missing overtime deduction for sales team.');
});

test('strict void workflow: request void and owner approve void', function () {
    /** @var TestCase $this */
    [$owner, $organization] = createWorkflowTenant('owner');

    Tenancy::initialize($organization);

    $run = PayrollRun::query()->create([
        'period_month' => '2026-09',
        'period_start' => '2026-09-01',
        'period_end' => '2026-09-30',
        'status' => PayrollRun::STATUS_FINALIZED,
        'employee_count' => 1,
        'total_gross_salary' => 200000,
        'total_deductions' => 20000,
        'total_net_pay' => 180000,
        'settings_snapshot' => [],
        'finalized_at' => now(),
    ]);

    Tenancy::end();

    // 1. Request void
    $requestVoidResponse = $this
        ->actingAs($owner)
        ->post('http://'.$organization->slug.'.payrollsaas.test/payroll/runs/'.$run->id.'/request-void', [
            'reason' => 'Wrong tax table version applied.',
        ]);

    $requestVoidResponse->assertRedirect('http://'.$organization->slug.'.payrollsaas.test/payroll/runs/'.$run->id);
    expect($run->fresh()->status)->toBe(PayrollRun::STATUS_VOID_REQUESTED);
    expect($run->fresh()->void_reason)->toBe('Wrong tax table version applied.');

    // 2. Owner approves void
    $approveVoidResponse = $this
        ->actingAs($owner)
        ->post('http://'.$organization->slug.'.payrollsaas.test/payroll/runs/'.$run->id.'/approve-void', [
            'notes' => 'Void authorized per board resolution.',
        ]);

    $approveVoidResponse->assertRedirect('http://'.$organization->slug.'.payrollsaas.test/payroll/runs/'.$run->id);
    expect($run->fresh()->status)->toBe(PayrollRun::STATUS_VOIDED);
    expect($run->fresh()->void_approval_notes)->toBe('Void authorized per board resolution.');

    // 3. Verify reports reject voided run
    $reportResponse = $this
        ->actingAs($owner)
        ->get('http://'.$organization->slug.'.payrollsaas.test/reports/view?type=pension&payroll_run='.$run->id);

    $reportResponse->assertNotFound();
});
