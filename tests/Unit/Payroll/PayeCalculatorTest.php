<?php

namespace Tests\Unit\Payroll;

use App\Models\Employee;
use App\Services\Payroll\Calculators\PayeCalculator;
use Tests\TestCase;

test('paye calculator calculates tax correctly with default settings', function () {
    $employee = new Employee([
        'monthly_gross_salary' => 500000,
    ]);

    $calculator = new PayeCalculator();
    $settings = [];

    $paye = $calculator->calculate($employee, $settings);

    // With 500k gross salary and default 20% relief:
    // Relief = max(500000 * 0.2, 200000) = max(100000, 200000) = 200000
    // Taxable income = 500000 - 200000 = 300000
    // First bracket: 300000 at 7% = 21000
    expect($paye)->toBe(21000.0);
});

test('paye calculator returns zero for zero taxable income', function () {
    $employee = new Employee([
        'monthly_gross_salary' => 100000,
    ]);

    $calculator = new PayeCalculator();
    $settings = [];

    $paye = $calculator->calculate($employee, $settings);

    // With 100k gross salary and default 20% relief:
    // Relief = max(100000 * 0.2, 200000) = max(20000, 200000) = 200000
    // Taxable income = 100000 - 200000 = -100000 (negative, so zero tax)
    expect($paye)->toBe(0.0);
});

test('paye calculator uses custom tax brackets from settings', function () {
    $employee = new Employee([
        'monthly_gross_salary' => 500000,
    ]);

    $calculator = new PayeCalculator();
    $settings = [
        'paye_tax_brackets' => [
            ['threshold' => 1000000, 'rate' => 10],
            ['threshold' => PHP_FLOAT_MAX, 'rate' => 20],
        ],
    ];

    $paye = $calculator->calculate($employee, $settings);

    // With custom brackets: first 1M at 10%
    // Relief = max(500000 * 0.2, 200000) = 200000
    // Taxable income = 500000 - 200000 = 300000
    // Tax = 300000 * 10% = 30000
    expect($paye)->toBe(30000.0);
});

test('paye calculator uses custom relief settings', function () {
    $employee = new Employee([
        'monthly_gross_salary' => 500000,
    ]);

    $calculator = new PayeCalculator();
    $settings = [
        'paye_consolidated_relief_percentage' => 25,
        'paye_consolidated_relief_minimum' => 150000,
    ];

    $paye = $calculator->calculate($employee, $settings);

    // With custom relief:
    // Relief = max(500000 * 0.25, 150000) = max(125000, 150000) = 150000
    // Taxable income = 500000 - 150000 = 350000
    // First bracket: 300000 at 7% = 21000
    // Second bracket: 50000 at 11% = 5500
    // Total = 26500
    expect($paye)->toBe(26500.0);
});
