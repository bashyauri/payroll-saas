<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use App\Services\Billing\ActiveSubscriptionContextResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class PaystackCheckoutController extends Controller
{
    public function __invoke(Request $request, ActiveSubscriptionContextResolver $resolver): Response|RedirectResponse
    {
        $data = $request->validate([
            'plan' => ['required', 'string'],
            'employee_count' => ['nullable', 'integer', 'min:1'],
            'billing_cycle' => ['nullable', 'string', 'in:monthly,annual'],
            'upgrade' => ['nullable', 'boolean'],
        ]);

        $isUpgrade = (bool) ($data['upgrade'] ?? false);
        $billingPlansRoute = $isUpgrade
            ? route('billing.plans', ['upgrade' => 1])
            : route('billing.plans');

        $plan = SubscriptionPlan::query()
            ->active()
            ->where('slug', $data['plan'])
            ->firstOrFail();

        $employeeCount = (int) ($data['employee_count'] ?? $plan->min_employees);
        $currentSubscription = null;

        if ($isUpgrade && $request->user()) {
            $currentSubscription = $resolver->resolveSubscription($request, $request->user());

            if (! $currentSubscription) {
                return redirect()
                    ->to($billingPlansRoute)
                    ->withErrors([
                        'checkout' => 'We could not resolve your current subscription for this upgrade. Please try again from your dashboard.',
                    ]);
            }
        }

        if ($employeeCount < (int) $plan->min_employees) {
            return redirect()
                ->to($billingPlansRoute)
                ->withErrors([
                    'checkout' => sprintf(
                        '%s plan requires at least %d employees.',
                        $plan->name,
                        (int) $plan->min_employees,
                    ),
                ]);
        }

        if ($plan->max_employees !== null && $employeeCount > (int) $plan->max_employees) {
            return redirect()
                ->to($billingPlansRoute)
                ->withErrors([
                    'checkout' => sprintf(
                        '%s plan supports a maximum of %d employees. Choose Professional for larger teams.',
                        $plan->name,
                        (int) $plan->max_employees,
                    ),
                ]);
        }

        if ($currentSubscription && $employeeCount < (int) $currentSubscription->employee_count) {
            return redirect()
                ->to($billingPlansRoute)
                ->withErrors([
                    'checkout' => sprintf(
                        'Employee count cannot be reduced below your current licensed count of %d during an upgrade.',
                        (int) $currentSubscription->employee_count,
                    ),
                ]);
        }

        $selectedBillingCycle = (string) ($data['billing_cycle'] ?? 'annual');
        $billingCycleMonths = $selectedBillingCycle === 'annual' ? 12 : 1;
        $vatRate = (float) config('billing.vat_rate', 0.075);
        $annualDiscountRate = (float) config('billing.annual_discount_rate', 0.10);
        $discountRate = $selectedBillingCycle === 'annual' ? $annualDiscountRate : 0.0;

        $baseSubtotalKobo = (int) round(((float) $plan->price_per_employee * $employeeCount * $billingCycleMonths) * 100);
        $discountAmountKobo = (int) round($baseSubtotalKobo * $discountRate);
        $subtotalKobo = max(0, $baseSubtotalKobo - $discountAmountKobo);
        $vatAmountKobo = (int) round($subtotalKobo * $vatRate);
        $amountKobo = $subtotalKobo + $vatAmountKobo;
        $reference = 'ps_'.Str::lower((string) Str::ulid());

        $response = Http::asJson()
            ->withToken((string) config('services.paystack.secret_key'))
            ->acceptJson()
            ->post(rtrim((string) config('services.paystack.base_url'), '/').'/transaction/initialize', [
                'email' => (string) $request->user()->email,
                'amount' => $amountKobo,
                'currency' => (string) config('services.paystack.currency', 'NGN'),
                'reference' => $reference,
                'callback_url' => (string) config('services.paystack.callback_url'),
                'metadata' => [
                    'plan_slug' => $plan->slug,
                    'employee_count' => $employeeCount,
                    'checkout_mode' => $currentSubscription ? 'upgrade' : 'onboarding',
                    'billing_period' => $selectedBillingCycle,
                    'plan_default_billing_period' => (string) $plan->billing_period,
                    'billing_cycle_months' => $billingCycleMonths,
                    'annual_discount_rate' => $annualDiscountRate,
                    'discount_rate' => $discountRate,
                    'base_subtotal_kobo' => $baseSubtotalKobo,
                    'discount_amount_kobo' => $discountAmountKobo,
                    'vat_rate' => $vatRate,
                    'subtotal_kobo' => $subtotalKobo,
                    'vat_amount_kobo' => $vatAmountKobo,
                    'total_amount_kobo' => $amountKobo,
                    'user_id' => (string) $request->user()->id,
                    'organization_id' => $currentSubscription?->organization_id,
                    'subscription_id' => $currentSubscription?->id,
                ],
                'channels' => ['card', 'bank', 'ussd', 'mobile_money'],
            ]);

        if (! $response->successful() || ! $response->json('status')) {
            return redirect()
                ->to($billingPlansRoute)
                ->withErrors([
                    'checkout' => 'Unable to initialize Paystack checkout. Please try again.',
                ]);
        }

        $authorizationUrl = (string) $response->json('data.authorization_url');

        if ($authorizationUrl === '') {
            return redirect()
                ->to($billingPlansRoute)
                ->withErrors([
                    'checkout' => 'Paystack did not return an authorization URL.',
                ]);
        }

        if ($request->header('X-Inertia')) {
            return Inertia::location($authorizationUrl);
        }

        return redirect()->away($authorizationUrl);
    }
}
