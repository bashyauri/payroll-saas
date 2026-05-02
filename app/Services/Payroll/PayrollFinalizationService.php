<?php

namespace App\Services\Payroll;

use App\Models\Organization;
use App\Services\Billing\BillingAccessDecision;
use App\Services\Billing\BillingAccessGuard;

class PayrollFinalizationService
{
    public function __construct(
        private readonly BillingAccessGuard $billingAccessGuard,
        private readonly EffectivePayrollSettingsResolver $settingsResolver,
    ) {}

    /**
     * Pre-finalization billing check for payroll finalization.
     */
    public function evaluateBillingForFinalization(Organization $organization): BillingAccessDecision
    {
        $subscription = $organization->subscriptions()
            ->latest('created_at')
            ->first();

        return $this->billingAccessGuard->canFinalizePayroll($organization, $subscription);
    }

    /**
     * @return array<string, mixed>
     */
    public function currentSettingsSnapshot(): array
    {
        return $this->settingsResolver->resolve(now(), 'default');
    }
}
