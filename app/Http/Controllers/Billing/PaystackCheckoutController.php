<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class PaystackCheckoutController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $data = $request->validate([
            'plan' => ['required', 'string'],
            'employee_count' => ['nullable', 'integer', 'min:1'],
        ]);

        $plan = SubscriptionPlan::query()
            ->active()
            ->where('slug', $data['plan'])
            ->firstOrFail();

        $employeeCount = (int) ($data['employee_count'] ?? $plan->min_employees);

        if ($employeeCount < (int) $plan->min_employees) {
            return redirect()
                ->route('billing.plans')
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
                ->route('billing.plans')
                ->withErrors([
                    'checkout' => sprintf(
                        '%s plan supports a maximum of %d employees. Choose Professional for larger teams.',
                        $plan->name,
                        (int) $plan->max_employees,
                    ),
                ]);
        }

        $billingCycleMonths = $plan->billing_period === 'annual' ? 12 : 1;
        $amountKobo = (int) round(((float) $plan->price_per_employee * $employeeCount * $billingCycleMonths) * 100);
        $reference = 'ps_' . Str::lower((string) Str::ulid());

        $response = Http::asJson()
            ->withToken((string) config('services.paystack.secret_key'))
            ->acceptJson()
            ->post(rtrim((string) config('services.paystack.base_url'), '/') . '/transaction/initialize', [
                'email' => (string) $request->user()->email,
                'amount' => $amountKobo,
                'currency' => (string) config('services.paystack.currency', 'NGN'),
                'reference' => $reference,
                'callback_url' => (string) config('services.paystack.callback_url'),
                'metadata' => [
                    'plan_slug' => $plan->slug,
                    'employee_count' => $employeeCount,
                    'billing_period' => (string) $plan->billing_period,
                    'billing_cycle_months' => $billingCycleMonths,
                    'user_id' => (string) $request->user()->id,
                ],
                'channels' => ['card', 'bank', 'ussd', 'mobile_money'],
            ]);

        if (! $response->successful() || ! $response->json('status')) {
            return redirect()
                ->route('billing.plans')
                ->withErrors([
                    'checkout' => 'Unable to initialize Paystack checkout. Please try again.',
                ]);
        }

        $authorizationUrl = (string) $response->json('data.authorization_url');

        if ($authorizationUrl === '') {
            return redirect()
                ->route('billing.plans')
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
