<?php

return [
    // VAT is applied on top of plan rates (rates are VAT-exclusive).
    'vat_rate' => (float) env('BILLING_VAT_RATE', 0.075),

    // Annual billing discount applied before VAT.
    'annual_discount_rate' => (float) env('BILLING_ANNUAL_DISCOUNT_RATE', 0.10),
];
