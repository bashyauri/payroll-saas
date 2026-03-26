<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Inertia\Inertia;
use Inertia\Response;

class PlanSelectionController extends Controller
{
    public function __invoke(): Response
    {
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
