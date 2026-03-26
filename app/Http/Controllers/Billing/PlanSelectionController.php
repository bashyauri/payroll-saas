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
            $organization = $user->organizations()->first();

            if ($organization) {
                $hasActiveSubscription = Subscription::query()
                    ->where('organization_id', $organization->id)
                    ->whereIn('status', [
                        Subscription::STATUS_ACTIVE,
                        Subscription::STATUS_PAST_DUE,
                    ])
                    ->exists();

                if ($hasActiveSubscription) {
                    return redirect()->route('dashboard');
                }
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
