<?php

return [
    // VAT is applied on top of plan rates (rates are VAT-exclusive).
    'vat_rate' => (float) env('BILLING_VAT_RATE', 0.075),
];
