<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlanSelectionController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user) {
            $activeStatuses = [
                Subscription::STATUS_ACTIVE,
                Subscription::STATUS_PAST_DUE,
            ];

            $sessionOrganizationId = (string) $request->session()->get('tenant_id', '');

            if ($sessionOrganizationId !== '') {
                $sessionOrganization = $user->organizations()->whereKey($sessionOrganizationId)->first();

                if ($sessionOrganization) {
                    $hasActiveSessionSubscription = Subscription::query()
                        ->where('organization_id', $sessionOrganization->id)
                        ->whereIn('status', $activeStatuses)
                        ->exists();

                    if ($hasActiveSessionSubscription) {
                        return redirect()->route('dashboard');
                    }
                }
            }

            $activeOrganization = $user->organizations()
                ->whereHas('subscriptions', function ($query) use ($activeStatuses): void {
                    $query->whereIn('status', $activeStatuses);
                })
                ->first();

            if ($activeOrganization) {
                $request->session()->put('tenant_id', $activeOrganization->id);

                return redirect()->route('dashboard');
            }
        }

        $plans = SubscriptionPlan::query()
            ->active()
            ->orderBy('min_employees')
            ->get([
                'name',
                'slug',
                'currency',
                'price_per_employee',
                'billing_period',
                'min_employees',
                'max_employees',
                'features',
            ])
            ->map(fn (SubscriptionPlan $plan): array => [
                'name' => $plan->name,
                'slug' => $plan->slug,
                'currency' => $plan->currency,
                'price_per_employee' => (float) $plan->price_per_employee,
                'billing_period' => $plan->billing_period,
                'min_employees' => $plan->min_employees,
                'max_employees' => $plan->max_employees,
                'features' => $plan->features ?? [],
            ])
            ->values();

        return Inertia::render('billing/plans', [
            'plans' => $plans,
            'hasPlans' => $plans->isNotEmpty(),
            'paymentMethods' => ['Card', 'Bank Transfer', 'USSD', 'Mobile Money'],
            'guaranteeDays' => 7,
            'currency' => 'NGN',
            'vatRate' => (float) config('billing.vat_rate', 0.075),
            'annualDiscountRate' => (float) config('billing.annual_discount_rate', 0.10),
        ]);
    }
}
