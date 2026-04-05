<?php

namespace Tests\Feature\Billing;

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Tests\TestCase;

class PaystackCheckoutControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_adds_vat_to_checkout_amount_sent_to_paystack(): void
    {
        config([
            'billing.vat_rate' => 0.075,
            'billing.annual_discount_rate' => 0.10,
            'services.paystack.secret_key' => 'sk_test_123',
            'services.paystack.base_url' => 'https://api.paystack.test',
            'services.paystack.callback_url' => 'https://payroll-saas.test/billing/paystack/callback',
            'services.paystack.currency' => 'NGN',
        ]);

        /** @var User $user */
        $user = User::factory()->createOne();

        SubscriptionPlan::query()->create([
            'name' => 'Essential',
            'slug' => SubscriptionPlan::PLAN_ESSENTIAL,
            'currency' => 'NGN',
            'price_per_employee' => 800,
            'billing_period' => 'annual',
            'min_employees' => 1,
            'max_employees' => 50,
            'features' => ['payroll_processing'],
            'is_active' => true,
        ]);

        Http::fake([
            'https://api.paystack.test/transaction/initialize' => Http::response([
                'status' => true,
                'data' => [
                    'authorization_url' => 'https://checkout.paystack.test/authorize',
                ],
            ], 200),
        ]);

        $response = $this->actingAs($user)->post(route('billing.checkout'), [
            'plan' => SubscriptionPlan::PLAN_ESSENTIAL,
            'employee_count' => 10,
        ]);

        $response->assertRedirect('https://checkout.paystack.test/authorize');

        Http::assertSent(function (Request $request): bool {
            $payload = $request->data();

            return $request->url() === 'https://api.paystack.test/transaction/initialize'
                && $payload['amount'] === 9288000
                && $payload['metadata']['base_subtotal_kobo'] === 9600000
                && $payload['metadata']['discount_amount_kobo'] === 960000
                && $payload['metadata']['subtotal_kobo'] === 8640000
                && $payload['metadata']['vat_amount_kobo'] === 648000
                && $payload['metadata']['total_amount_kobo'] === 9288000
                && $payload['metadata']['vat_rate'] === 0.075
                && $payload['metadata']['discount_rate'] === 0.10;
        });
    }

    public function test_uses_monthly_cycle_when_selected(): void
    {
        config([
            'billing.vat_rate' => 0.075,
            'billing.annual_discount_rate' => 0.10,
            'services.paystack.secret_key' => 'sk_test_123',
            'services.paystack.base_url' => 'https://api.paystack.test',
            'services.paystack.callback_url' => 'https://payroll-saas.test/billing/paystack/callback',
            'services.paystack.currency' => 'NGN',
        ]);

        /** @var User $user */
        $user = User::factory()->createOne();

        SubscriptionPlan::query()->create([
            'name' => 'Essential',
            'slug' => SubscriptionPlan::PLAN_ESSENTIAL,
            'currency' => 'NGN',
            'price_per_employee' => 800,
            'billing_period' => 'annual',
            'min_employees' => 1,
            'max_employees' => 50,
            'features' => ['payroll_processing'],
            'is_active' => true,
        ]);

        Http::fake([
            'https://api.paystack.test/transaction/initialize' => Http::response([
                'status' => true,
                'data' => [
                    'authorization_url' => 'https://checkout.paystack.test/authorize',
                ],
            ], 200),
        ]);

        $response = $this->actingAs($user)->post(route('billing.checkout'), [
            'plan' => SubscriptionPlan::PLAN_ESSENTIAL,
            'employee_count' => 10,
            'billing_cycle' => 'monthly',
        ]);

        $response->assertRedirect('https://checkout.paystack.test/authorize');

        Http::assertSent(function (Request $request): bool {
            $payload = $request->data();

            return $request->url() === 'https://api.paystack.test/transaction/initialize'
                && $payload['amount'] === 860000
                && $payload['metadata']['base_subtotal_kobo'] === 800000
                && $payload['metadata']['discount_amount_kobo'] === 0
                && $payload['metadata']['subtotal_kobo'] === 800000
                && $payload['metadata']['vat_amount_kobo'] === 60000
                && $payload['metadata']['total_amount_kobo'] === 860000
                && $payload['metadata']['billing_period'] === 'monthly'
                && $payload['metadata']['discount_rate'] === 0.0;
        });
    }

    public function test_upgrade_checkout_includes_existing_subscription_metadata(): void
    {
        config([
            'billing.vat_rate' => 0.075,
            'billing.annual_discount_rate' => 0.10,
            'services.paystack.secret_key' => 'sk_test_123',
            'services.paystack.base_url' => 'https://api.paystack.test',
            'services.paystack.callback_url' => 'https://payroll-saas.test/billing/paystack/callback',
            'services.paystack.currency' => 'NGN',
        ]);

        /** @var User $user */
        $user = User::factory()->createOne();

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

        $plan = SubscriptionPlan::query()->create([
            'name' => 'Essential',
            'slug' => SubscriptionPlan::PLAN_ESSENTIAL,
            'currency' => 'NGN',
            'price_per_employee' => 800,
            'billing_period' => 'annual',
            'min_employees' => 1,
            'max_employees' => 50,
            'features' => ['payroll_processing'],
            'is_active' => true,
        ]);

        $subscription = Subscription::query()->create([
            'organization_id' => $organization->id,
            'plan_id' => $plan->id,
            'status' => Subscription::STATUS_ACTIVE,
            'trial_end_date' => now()->addDays(7),
            'refund_eligible_until' => now()->addDays(7),
            'next_billing_date' => now()->addYear(),
            'paystack_reference' => 'ps_existing_subscription',
            'amount_paid' => 800000,
            'currency' => 'NGN',
            'employee_count' => 10,
        ]);

        Http::fake([
            'https://api.paystack.test/transaction/initialize' => Http::response([
                'status' => true,
                'data' => [
                    'authorization_url' => 'https://checkout.paystack.test/authorize',
                ],
            ], 200),
        ]);

        $response = $this->actingAs($user)->post('http://upgrade-org.payrollsaas.test/billing/checkout', [
            'plan' => SubscriptionPlan::PLAN_ESSENTIAL,
            'employee_count' => 15,
            'billing_cycle' => 'annual',
            'upgrade' => true,
        ]);

        $response->assertRedirect('https://checkout.paystack.test/authorize');

        Http::assertSent(function (Request $request) use ($organization, $subscription): bool {
            $payload = $request->data();

            return $request->url() === 'https://api.paystack.test/transaction/initialize'
                && $payload['metadata']['checkout_mode'] === 'upgrade'
                && $payload['metadata']['organization_id'] === $organization->id
                && $payload['metadata']['subscription_id'] === $subscription->id
                && $payload['metadata']['employee_count'] === 15;
        });
    }
}
