<?php

namespace App\Services\Billing;

use App\Models\Organization;
use App\Models\Subscription;

class BillingAccessGuard
{
    /**
     * Determine if payroll finalization can proceed.
     */
    public function canFinalizePayroll(Organization $organization, ?Subscription $subscription): \App\Services\Billing\BillingAccessDecision
    {
        $billingStatus = $organization->billing_status ?? Organization::BILLING_ACTIVE;
        $subscriptionStatus = $subscription?->status;

        if (in_array($billingStatus, [Organization::BILLING_SUSPENDED, Organization::BILLING_CANCELED], true)) {
            return new \App\Services\Billing\BillingAccessDecision(
                false,
                'billing_blocked',
                'Billing is suspended or canceled. Resolve billing to finalize payroll.',
                $billingStatus,
                $subscriptionStatus,
            );
        }

        if (
            in_array($subscriptionStatus, [Subscription::STATUS_FAILED, Subscription::STATUS_PAST_DUE], true)
            && $subscription?->grace_period_ends_at
            && now()->greaterThan($subscription->grace_period_ends_at)
        ) {
            return new \App\Services\Billing\BillingAccessDecision(
                false,
                'grace_expired',
                'Grace period has expired for this subscription. Payment is required to continue.',
                $billingStatus,
                $subscriptionStatus,
            );
        }

        if ($billingStatus === Organization::BILLING_GRACE) {
            return new \App\Services\Billing\BillingAccessDecision(
                true,
                'grace_warning',
                'Billing is in grace period. Payroll finalization is currently allowed, but payment is required soon.',
                $billingStatus,
                $subscriptionStatus,
            );
        }

        return new \App\Services\Billing\BillingAccessDecision(
            true,
            'allowed',
            'Billing state allows payroll finalization.',
            $billingStatus,
            $subscriptionStatus,
        );
    }
}
