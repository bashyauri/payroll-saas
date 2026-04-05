<?php

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Laravel\Fortify\Features;

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('onboarding.continue', absolute: false));
});

test('inertia login requests are redirected after authentication', function () {
    $user = User::factory()->create();

    $response = $this
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Requested-With' => 'XMLHttpRequest',
        ])
        ->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
        ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('onboarding.continue', absolute: false));
});

test('onboarding continuation does not send unpaid tenant owners to dashboard', function () {
    $user = User::factory()->create();

    $organization = Organization::create([
        'name' => 'Staff Org',
        'slug' => 'staff-org',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);
    $organization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => 'staff-org.payrollsaas.test',
    ]);
    $organization->users()->attach($user->id, ['role' => 'owner']);

    $plan = SubscriptionPlan::create([
        'name' => 'Essential',
        'slug' => 'essential-unpaid-owner-auth-test',
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
        'paystack_reference' => null,
        'amount_paid' => 0,
        'currency' => 'NGN',
    ]);

    $response = $this->actingAs($user)
        ->get('http://staff-org.payrollsaas.test/onboarding/continue');

    $response->assertRedirect(route('billing.plans'));
});

test('onboarding continuation prefers configured base domain over older stored tenant domains', function () {
    config([
        'app.url' => 'https://payroll-saas.test',
        'tenancy.base_domain' => 'payroll-saas.test',
    ]);

    $user = User::factory()->create();

    $organization = Organization::create([
        'name' => 'Redirect Org',
        'slug' => 'redirect-org',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);
    $organization->domains()->create([
        'id' => (string) Str::ulid(),
        'domain' => 'redirect-org.theniyiconsult.com.ng',
    ]);
    $organization->users()->attach($user->id, ['role' => 'owner']);

    $plan = SubscriptionPlan::create([
        'name' => 'Essential',
        'slug' => 'essential-local-domain-auth-test',
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
        'paystack_reference' => 'ps_local_domain_redirect_test',
        'amount_paid' => 80000,
        'currency' => 'NGN',
    ]);

    $response = $this->actingAs($user)->get(route('onboarding.continue'));

    $response->assertRedirect('https://redirect-org.payroll-saas.test/dashboard');
    $this->assertDatabaseHas('domains', [
        'tenant_id' => $organization->id,
        'domain' => 'redirect-org.payroll-saas.test',
    ]);
});

test('users with two factor enabled are redirected to two factor challenge', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->create();

    $user->forceFill([
        'two_factor_secret' => encrypt('test-secret'),
        'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
        'two_factor_confirmed_at' => now(),
    ])->save();

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('two-factor.login'));
    $response->assertSessionHas('login.id', $user->id);
    $this->assertGuest();
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $this->assertGuest();
    $response->assertRedirect(route('home'));
});

test('users are rate limited', function () {
    $user = User::factory()->create();

    RateLimiter::increment(md5('login'.implode('|', [$user->email, '127.0.0.1'])), amount: 5);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertTooManyRequests();
});
