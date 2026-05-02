<?php

use App\Models\Employee;
use App\Models\Organization;
use App\Models\PayrollSetting;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
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

function createTenantContext(int $employeeLimit = 3): array
{
    $user = User::factory()->create();
    $organization = Organization::create([
        'name' => 'Acme Payroll',
        'slug' => 'acme-payroll',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);

    $organization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => 'acme-payroll.payrollsaas.test',
    ]);

    $organization->users()->attach($user->id, ['role' => 'owner']);

    $plan = SubscriptionPlan::create([
        'name' => 'Essential',
        'slug' => 'essential-employee-'.Str::lower(Str::random(8)),
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
        'paystack_reference' => 'employee-ref-'.Str::lower(Str::random(10)),
        'amount_paid' => 80000,
        'currency' => 'NGN',
        'employee_count' => $employeeLimit,
    ]);

    return [$user, $organization];
}

function createTenantContextWithRole(string $role, int $employeeLimit = 3): array
{
    $user = User::factory()->create();
    $organization = Organization::create([
        'name' => 'Acme Payroll Role '.Str::lower(Str::random(4)),
        'slug' => 'acme-payroll-role-'.Str::lower(Str::random(8)),
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
        'slug' => 'essential-employee-role-'.Str::lower(Str::random(8)),
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
        'paystack_reference' => 'employee-role-ref-'.Str::lower(Str::random(10)),
        'amount_paid' => 80000,
        'currency' => 'NGN',
        'employee_count' => $employeeLimit,
    ]);

    return [$user, $organization];
}

test('tenant users can view the add employee form', function () {
    /** @var TestCase $this */
    [$user] = createTenantContext();

    $response = $this
        ->actingAs($user)
        ->get('http://acme-payroll.payrollsaas.test/employees/create');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('employees/create')
        ->where('employeeCount', 0)
        ->where('employeeLimit', 3)
        ->where('canCreateEmployee', true)
        ->where('payrollCustomFields', [])
    );
});

test('add employee form includes configured payroll custom fields', function () {
    /** @var TestCase $this */
    [$user, $organization] = createTenantContext();

    Tenancy::initialize($organization);
    PayrollSetting::query()->create([
        'profile' => 'default',
        'other_items' => [
            ['label' => 'Union Dues', 'rate' => 3],
        ],
    ]);
    Tenancy::end();

    $response = $this
        ->actingAs($user)
        ->get('http://'.$organization->slug.'.payrollsaas.test/employees/create');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('employees/create')
        ->where('payrollCustomFields.0.label', 'Union Dues')
        ->where('payrollCustomFields.0.rate', 3)
    );
});

test('tenant users can add employees within plan limit', function () {
    /** @var TestCase $this */
    [$user, $organization] = createTenantContext(2);

    $response = $this
        ->actingAs($user)
        ->post('http://acme-payroll.payrollsaas.test/employees', [
            'employee_number' => 'EMP-0001',
            'first_name' => 'Amina',
            'last_name' => 'Yusuf',
            'middle_name' => 'B.',
            'work_email' => 'amina.yusuf@example.com',
            'phone' => '08012345678',
            'nin' => '12345678901',
            'bvn' => '10987654321',
            'tax_identification_number' => 'TIN-0001',
            'pension_pin' => 'PEN-0001',
            'pfa_name' => 'Leadway Pensure',
            'nhis_number' => 'NHIS-00231',
            'nhf_number' => 'NHF-00510',
            'bank_name' => 'Access Bank',
            'bank_account_name' => 'Amina Yusuf',
            'bank_account_number' => '0123456789',
            'monthly_gross_salary' => '250000',
            'annual_gross_salary' => '3000000',
            'monthly_tax_deduction' => '15000',
            'monthly_pension_deduction' => '20000',
            'monthly_nhf_deduction' => '2500',
            'other_monthly_deductions' => '1000',
            'other_allowance_1' => '5000',
            'other_allowance_2' => '2000',
            'total_salary' => '278500',
            'personal_life_insurance' => '1200',
            'rent_relief' => '25000',
            'custom_items' => [
                [
                    'label' => 'Union Dues',
                    'rate' => '3',
                    'value' => '3500',
                ],
            ],
            'department' => 'Finance',
            'job_title' => 'Payroll Officer',
            'location' => 'Lagos',
            'date_of_birth' => '1995-08-14',
            'employment_type' => 'full_time',
            'hire_date' => '2026-04-01',
            'exit_date' => null,
            'status' => 'active',
        ]);

    $response->assertRedirect('http://acme-payroll.payrollsaas.test/employees');

    Tenancy::initialize($organization);

    expect(Employee::query()->count('*'))->toBe(1);
    expect(Employee::query()->firstOrFail()->nin)->toBe('12345678901');
    expect(Employee::query()->firstOrFail()->custom_items)->toBe([
        [
            'label' => 'Union Dues',
            'rate' => 3.0,
            'value' => 3500.0,
        ],
    ]);
});

test('employee creation is blocked when plan limit is reached', function () {
    /** @var TestCase $this */
    [$user, $organization] = createTenantContext(1);

    Tenancy::initialize($organization);
    Employee::query()->create([
        'employee_number' => 'EMP-0001',
        'first_name' => 'Existing',
        'last_name' => 'Employee',
        'bank_name' => 'GTBank',
        'bank_account_name' => 'Existing Employee',
        'bank_account_number' => '1234567890',
        'monthly_gross_salary' => 100000,
        'employment_type' => 'full_time',
        'status' => 'active',
    ]);
    Tenancy::end();

    $response = $this
        ->actingAs($user)
        ->from('http://acme-payroll.payrollsaas.test/employees/create')
        ->post('http://acme-payroll.payrollsaas.test/employees', [
            'employee_number' => 'EMP-0002',
            'first_name' => 'Second',
            'last_name' => 'Employee',
            'bank_name' => 'Access Bank',
            'bank_account_name' => 'Second Employee',
            'bank_account_number' => '0123456789',
            'monthly_gross_salary' => '250000',
            'employment_type' => 'full_time',
            'status' => 'active',
        ]);

    $response->assertSessionHasErrors('employee_limit');

    Tenancy::initialize($organization);
    expect(Employee::query()->count('*'))->toBe(1);
});

test('organization member cannot view the add employee form', function () {
    /** @var TestCase $this */
    [$user, $organization] = createTenantContextWithRole('member');

    $response = $this
        ->actingAs($user)
        ->get('http://'.$organization->slug.'.payrollsaas.test/employees/create');

    $response->assertForbidden();
});

test('organization member cannot create employees', function () {
    /** @var TestCase $this */
    [$user, $organization] = createTenantContextWithRole('member');

    $response = $this
        ->actingAs($user)
        ->post('http://'.$organization->slug.'.payrollsaas.test/employees', [
            'employee_number' => 'EMP-0101',
            'first_name' => 'Member',
            'last_name' => 'Blocked',
            'bank_name' => 'Access Bank',
            'bank_account_name' => 'Member Blocked',
            'bank_account_number' => '0123456789',
            'monthly_gross_salary' => '250000',
            'employment_type' => 'full_time',
            'status' => 'active',
        ]);

    $response->assertForbidden();

    Tenancy::initialize($organization);
    expect(Employee::query()->count('*'))->toBe(0);
});
expect(Employee::query()->firstOrFail()->pfa_name)->toBe('Leadway Pensure');
expect((string) Employee::query()->firstOrFail()->annual_gross_salary)->toBe('3000000.00');

test('organization member cannot view employees listing', function () {
    /** @var TestCase $this */
    [$user, $organization] = createTenantContextWithRole('member');

    $response = $this
        ->actingAs($user)
        ->get('http://'.$organization->slug.'.payrollsaas.test/employees');

    $response->assertForbidden();
});

test('organization hr can view the add employee form', function () {
    /** @var TestCase $this */
    [$user, $organization] = createTenantContextWithRole('hr');

    $response = $this
        ->actingAs($user)
        ->get('http://'.$organization->slug.'.payrollsaas.test/employees/create');

    $response->assertOk();
});

test('organization hr can create employees', function () {
    /** @var TestCase $this */
    [$user, $organization] = createTenantContextWithRole('hr', 3);

    $response = $this
        ->actingAs($user)
        ->post('http://'.$organization->slug.'.payrollsaas.test/employees', [
            'employee_number' => 'EMP-0777',
            'first_name' => 'Halima',
            'last_name' => 'Ibrahim',
            'bank_name' => 'Access Bank',
            'bank_account_name' => 'Halima Ibrahim',
            'bank_account_number' => '0123456789',
            'monthly_gross_salary' => '350000',
            'employment_type' => 'full_time',
            'status' => 'active',
        ]);

    $response->assertRedirect('http://'.$organization->slug.'.payrollsaas.test/employees');

    Tenancy::initialize($organization);
    expect(Employee::query()->where('employee_number', 'EMP-0777')->exists())->toBeTrue();
});

test('owner can view employee detail page', function () {
    /** @var TestCase $this */
    [$user, $organization] = createTenantContext();

    Tenancy::initialize($organization);
    $employee = Employee::query()->create([
        'employee_number' => 'EMP-0202',
        'first_name' => 'Binta',
        'last_name' => 'Okafor',
        'bank_name' => 'GTBank',
        'bank_account_name' => 'Binta Okafor',
        'bank_account_number' => '1234567890',
        'monthly_gross_salary' => 275000,
        'employment_type' => 'full_time',
        'status' => 'active',
    ]);
    Tenancy::end();

    $response = $this
        ->actingAs($user)
        ->get('http://'.$organization->slug.'.payrollsaas.test/employees/'.$employee->id);

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('employees/show')
        ->where('employee.id', $employee->id)
        ->where('employee.employeeNumber', 'EMP-0202')
        ->where('employee.firstName', 'Binta')
        ->where('employee.lastName', 'Okafor')
    );
});

test('organization member cannot view employee detail page', function () {
    /** @var TestCase $this */
    [$user, $organization] = createTenantContext();

    /** @var User $member */
    $member = User::factory()->create();
    $organization->users()->attach($member->id, ['role' => 'member']);

    Tenancy::initialize($organization);
    $employee = Employee::query()->create([
        'employee_number' => 'EMP-0999',
        'first_name' => 'Shola',
        'last_name' => 'Adewale',
        'bank_name' => 'UBA',
        'bank_account_name' => 'Shola Adewale',
        'bank_account_number' => '1234567890',
        'monthly_gross_salary' => 180000,
        'employment_type' => 'full_time',
        'status' => 'active',
    ]);
    Tenancy::end();

    $response = $this
        ->actingAs($member)
        ->get('http://'.$organization->slug.'.payrollsaas.test/employees/'.$employee->id);

    $response->assertForbidden();
});

test('owner role is synced to spatie admin role after hitting a protected route', function () {
    /** @var TestCase $this */
    [$user, $organization] = createTenantContextWithRole('owner');

    Role::query()->firstOrCreate([
        'name' => 'admin',
        'guard_name' => 'web',
    ]);

    Tenancy::initialize($organization);
    Role::query()->firstOrCreate([
        'name' => 'admin',
        'guard_name' => 'web',
    ]);
    Tenancy::end();

    $response = $this
        ->actingAs($user)
        ->get('http://'.$organization->slug.'.payrollsaas.test/employees/create');

    $response->assertOk();

    $centralCount = DB::connection((string) config('tenancy.database.central_connection'))
        ->table('model_has_roles')
        ->where('model_id', $user->id)
        ->where('model_type', User::class)
        ->count();

    Tenancy::initialize($organization);
    $tenantCount = DB::connection('tenant')
        ->table('model_has_roles')
        ->where('model_id', $user->id)
        ->where('model_type', User::class)
        ->count();
    Tenancy::end();

    expect($centralCount + $tenantCount)->toBeGreaterThan(0);
});
