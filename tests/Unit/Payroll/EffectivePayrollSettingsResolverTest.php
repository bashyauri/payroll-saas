<?php

namespace Tests\Unit\Payroll;

use App\Services\Payroll\EffectivePayrollSettingsResolver;
use Tests\TestCase;

test('effective payroll settings resolver has default paye constants', function () {
    expect(EffectivePayrollSettingsResolver::DEFAULT_PAYE_CONSOLIDATED_RELIEF_PERCENTAGE)->toBe(20.0);
    expect(EffectivePayrollSettingsResolver::DEFAULT_PAYE_CONSOLIDATED_RELIEF_MINIMUM)->toBe(200000.0);
    expect(EffectivePayrollSettingsResolver::DEFAULT_PAYE_TAX_BRACKETS)->toBeArray();
    expect(count(EffectivePayrollSettingsResolver::DEFAULT_PAYE_TAX_BRACKETS))->toBe(6);
});

test('effective payroll settings resolver default paye tax brackets are correct', function () {
    $expectedBrackets = [
        ['threshold' => 300000, 'rate' => 7],
        ['threshold' => 600000, 'rate' => 11],
        ['threshold' => 1100000, 'rate' => 15],
        ['threshold' => 1600000, 'rate' => 19],
        ['threshold' => 3200000, 'rate' => 21],
        ['threshold' => PHP_FLOAT_MAX, 'rate' => 24],
    ];

    expect(EffectivePayrollSettingsResolver::DEFAULT_PAYE_TAX_BRACKETS)->toBe($expectedBrackets);
});
