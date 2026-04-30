<?php

namespace App\Services\Billing;

use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Carbon\Carbon;

/**
 * Handles subscription proration calculations for plan upgrades/downgrades.
 */
class SubscriptionProrataionService
{
    /**
     * Calculate proration when upgrading/downgrading a subscription.
     *
     * @return array{
     *     old_plan_daily_rate: float,
     *     days_used: int,
     *     days_in_cycle: int,
     *     credit_amount: float,
     *     new_plan_full_cost: float,
     *     new_plan_cost_remaining_days: float,
     *     final_charge: float,
     *     old_subscription_cost: float,
     *     new_next_billing_date: string,
     *     upgraded_on: string
     * }
     */
    public function calculateUpgradeProration(
        Subscription $oldSubscription,
        SubscriptionPlan $newPlan,
        int $newEmployeeCount,
        string $newBillingPeriod,
    ): array {
        $oldPlan = $oldSubscription->plan;
        $oldBillingPeriod = $oldPlan->billing_period;
        $oldEmployeeCount = $oldSubscription->employee_count;

        // Determine cycle boundaries
        $cycleStartDate = $this->getCycleStartDate($oldSubscription);
        $cycleEndDate = $this->getCycleEndDate($cycleStartDate, $oldBillingPeriod);
        $upgradeDate = now();

        // Calculate days
        $daysInCycle = $cycleStartDate->diffInDays($cycleEndDate);
        $daysUsed = $cycleStartDate->diffInDays($upgradeDate);
        $daysRemaining = $upgradeDate->diffInDays($cycleEndDate);

        // Old plan costs
        $oldPlanFullCycleCost = (float) $oldPlan->price_per_employee * $oldEmployeeCount
            * ($oldBillingPeriod === 'annual' ? 12 : 1);
        $oldPlanDailyRate = $oldPlanFullCycleCost / $daysInCycle;
        $oldPlanUsedCost = $oldPlanDailyRate * $daysUsed;

        // New plan costs
        $newPlanFullCycleCost = (float) $newPlan->price_per_employee * $newEmployeeCount
            * ($newBillingPeriod === 'annual' ? 12 : 1);
        $newPlanDailyRate = $newPlanFullCycleCost / ($newBillingPeriod === 'annual' ? 365 : 30);
        $newPlanRemainingCost = $newPlanDailyRate * $daysRemaining;

        // Calculate credit and final charge
        $credit = $oldPlanUsedCost;
        $finalCharge = max(0, $newPlanRemainingCost - $credit);

        // Determine next billing date based on billing period preference
        $newNextBillingDate = $upgradeDate->clone()->add(
            $newBillingPeriod === 'annual' ? '1 year' : '1 month'
        );

        return [
            'old_plan_daily_rate' => round($oldPlanDailyRate, 2),
            'days_used' => $daysUsed,
            'days_in_cycle' => $daysInCycle,
            'credit_amount' => round($credit, 2),
            'new_plan_full_cost' => round($newPlanFullCycleCost, 2),
            'new_plan_cost_remaining_days' => round($newPlanRemainingCost, 2),
            'final_charge' => round($finalCharge, 2),
            'old_subscription_cost' => round($oldPlanFullCycleCost, 2),
            'new_next_billing_date' => $newNextBillingDate->toDateString(),
            'upgraded_on' => $upgradeDate->toDateString(),
        ];
    }

    /**
     * Get the start date of the current billing cycle for a subscription.
     */
    private function getCycleStartDate(Subscription $subscription): Carbon
    {
        $nextBillingDate = Carbon::parse($subscription->next_billing_date);
        $billingPeriod = $subscription->plan->billing_period;

        if ($billingPeriod === 'annual') {
            return $nextBillingDate->clone()->subYear();
        }

        return $nextBillingDate->clone()->subMonth();
    }

    /**
     * Get the end date of the current billing cycle for a subscription.
     */
    private function getCycleEndDate(Carbon $cycleStartDate, string $billingPeriod): Carbon
    {
        if ($billingPeriod === 'annual') {
            return $cycleStartDate->clone()->addYear();
        }

        return $cycleStartDate->clone()->addMonth();
    }
}
