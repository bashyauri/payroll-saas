<?php

use App\Models\Organization;
use App\Models\PayrollSetting;
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

function createPayrollSettingsContextWithRole(string $role): array
{
    $user = User::factory()->create();

    $organization = Organization::create([
        'name' => 'Payroll Settings Org '.Str::lower(Str::random(4)),
        'slug' => 'payroll-settings-org-'.Str::lower(Str::random(8)),
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
        'slug' => 'essential-payroll-settings-'.Str::lower(Str::random(8)),
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
        'paystack_reference' => 'payroll-settings-ref-'.Str::lower(Str::random(10)),
        'amount_paid' => 80000,
        'currency' => 'NGN',
        'employee_count' => 5,
    ]);

    return [$user, $organization];
}

/**
 * @return array<string, mixed>
 */
function validPayrollSettingsPayload(array $overrides = []): array
{
    return array_merge([
        'basic_salary_percentage' => 50,
        'housing_allowance_percentage' => 20,
        'transport_allowance_percentage' => 10,
        'other_allowance_percentage' => 20,
        'pension_employee_rate' => 8,
        'pension_employer_rate' => 10,
        'nhf_rate' => 2.5,
        'nhis_employee_rate' => 5,
        'nhis_employer_rate' => 10,
        'nsitf_rate' => 1,
        'other_items' => [
            ['label' => 'Union dues', 'rate' => 1.5],
        ],
    ], $overrides);
}

test('owner can view payroll settings page with default values', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollSettingsContextWithRole('owner');

    $response = $this
        ->actingAs($user)
        ->get('http://'.$organization->slug.'.payrollsaas.test/settings/payroll');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('settings/payroll')
        ->where('settings.basic_salary_percentage', 50)
        ->where('settings.pension_employee_rate', 8)
        ->where('settings.other_items', []),
    );
});

test('admin can update payroll settings', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollSettingsContextWithRole('admin');

    $response = $this
        ->actingAs($user)
        ->from('http://'.$organization->slug.'.payrollsaas.test/settings/payroll')
        ->patch('http://'.$organization->slug.'.payrollsaas.test/settings/payroll', validPayrollSettingsPayload([
            'basic_salary_percentage' => 45,
            'housing_allowance_percentage' => 25,
            'transport_allowance_percentage' => 15,
            'other_allowance_percentage' => 15,
            'nhf_rate' => 3,
            'other_items' => [
                ['label' => 'Cooperative', 'rate' => 2],
            ],
        ]));

    $response->assertSessionHasNoErrors();
    $response->assertSessionHas('status', 'payroll-settings-updated');

    Tenancy::initialize($organization);

    $settings = PayrollSetting::query()->where('profile', 'default')->first();

    expect($settings)->not->toBeNull();
    expect((float) $settings->basic_salary_percentage)->toBe(45.0);
    expect((float) $settings->nhf_rate)->toBe(3.0);
    expect($settings->other_items)->toBe([
        ['label' => 'Cooperative', 'rate' => 2],
    ]);
});

test('member cannot view payroll settings page', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollSettingsContextWithRole('member');

    $response = $this
        ->actingAs($user)
        ->get('http://'.$organization->slug.'.payrollsaas.test/settings/payroll');

    $response->assertForbidden();
});

test('member cannot update payroll settings', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollSettingsContextWithRole('member');

    $response = $this
        ->actingAs($user)
        ->patch('http://'.$organization->slug.'.payrollsaas.test/settings/payroll', validPayrollSettingsPayload());

    $response->assertForbidden();
});

test('payroll settings update validates rates and custom item limits', function () {
    /** @var TestCase $this */
    [$user, $organization] = createPayrollSettingsContextWithRole('owner');

    $response = $this
        ->actingAs($user)
        ->from('http://'.$organization->slug.'.payrollsaas.test/settings/payroll')
        ->patch('http://'.$organization->slug.'.payrollsaas.test/settings/payroll', validPayrollSettingsPayload([
            'pension_employee_rate' => 120,
            'other_items' => [
                ['label' => 'A', 'rate' => 1],
                ['label' => 'B', 'rate' => 1],
                ['label' => 'C', 'rate' => 1],
                ['label' => 'D', 'rate' => 1],
                ['label' => 'E', 'rate' => 1],
                ['label' => 'F', 'rate' => 1],
            ],
        ]));

    $response->assertRedirect('http://'.$organization->slug.'.payrollsaas.test/settings/payroll');
    $response->assertSessionHasErrors([
        'pension_employee_rate',
        'other_items',
    ]);

    Tenancy::initialize($organization);
    expect(PayrollSetting::query()->count())->toBe(0);
});
