<?php

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

uses(RefreshDatabase::class);

test('active subscribers can open the plans page in upgrade mode', function () {
    /** @var TestCase $this */
    /** @var User $user */
    $user = User::factory()->create();

    $organization = Organization::create([
        'name' => 'Upgrade Org',
        'slug' => 'upgrade-org',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);
    $organization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => 'upgrade-org.payrollsaas.test',
    ]);
    $organization->users()->attach($user->id, ['role' => 'owner']);

    $plan = SubscriptionPlan::create([
        'name' => 'Essential',
        'slug' => 'essential-upgrade-test',
        'currency' => 'NGN',
        'price_per_employee' => 800,
        'billing_period' => 'annual',
        'min_employees' => 1,
        'max_employees' => 50,
        'features' => ['payroll_processing'],
        'is_active' => true,
    ]);

    Subscription::create([
        'organization_id' => $organization->id,
        'plan_id' => $plan->id,
        'status' => Subscription::STATUS_ACTIVE,
        'trial_end_date' => now()->addDays(7),
        'refund_eligible_until' => now()->addDays(7),
        'next_billing_date' => now()->addYear(),
        'paystack_reference' => 'ps_upgrade_plan_test',
        'amount_paid' => 800000,
        'currency' => 'NGN',
        'employee_count' => 10,
    ]);

    $response = $this->actingAs($user)
        ->get('http://upgrade-org.payrollsaas.test/billing/plans?upgrade=1');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('billing/plans')
        ->where('isUpgrade', true)
        ->where('currentSubscription.organizationName', 'Upgrade Org')
        ->where('currentSubscription.planSlug', 'essential-upgrade-test')
        ->where('currentSubscription.employeeCount', 10)
    );
});
