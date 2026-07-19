<?php

namespace App\Services\Billing;

class RefundResult
{
    public function __construct(
        public readonly bool $success,
        public readonly string $code,
        public readonly string $message,
        public readonly ?string $refundReference = null,
    ) {
    }
}
