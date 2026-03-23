<?php

namespace App\Services\Billing;

class BillingAccessDecision
{
    public function __construct(
        public readonly bool $allowed,
        public readonly string $code,
        public readonly string $message,
        public readonly ?string $billingStatus = null,
        public readonly ?string $subscriptionStatus = null,
    ) {
    }
}
