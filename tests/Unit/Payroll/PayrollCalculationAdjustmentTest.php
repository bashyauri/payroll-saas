<?php

namespace Tests\Unit\Payroll;

use App\Models\Employee;
use App\Services\Payroll\Calculators\NhfCalculator;
use App\Services\Payroll\Calculators\NhisCalculator;
use App\Services\Payroll\Calculators\NsitfCalculator;
use App\Services\Payroll\Calculators\PayeCalculator;
use App\Services\Payroll\Calculators\PensionCalculator;
use App\Services\Payroll\PayrollCalculationService;
use Tests\TestCase;

uses(TestCase::class);

beforeEach(function () {
    $this->service = new PayrollCalculationService(
        new PayeCalculator(),
        new PensionCalculator(),
        new NhfCalculator(),
        new NhisCalculator(),
        new NsitfCalculator(),
    );

    $this->settings = [
        'enabled_deductions' => ['paye', 'pension', 'nhf', 'nhis', 'nsitf'],
        'pension_employee_rate' => 8.0,
        'pension_employer_rate' => 10.0,
        'nhf_rate' => 2.5,
        'nhis_employee_rate' => 5.0,
        'nhis_employer_rate' => 10.0,
        'nsitf_rate' => 1.0,
        'paye_calculation_period' => 'annual',
    ];
});

test('calculateForEmployee handles standard employee calculation', function () {
    $employee = new Employee([
        'employee_number' => 'EMP-001',
        'first_name' => 'Amina',
        'last_name' => 'Bello',
        'monthly_gross_salary' => 300000,
        'basic_salary' => 150000,
        'housing_allowance' => 100000,
        'transport_allowance' => 50000,
        'apply_paye_deduction' => true,
        'apply_pension_deduction' => true,
        'apply_nhf_deduction' => true,
        'apply_nhis_deduction' => true,
        'apply_nsitf_deduction' => true,
    ]);

    $calc = $this->service->calculateForEmployee($employee, $this->settings);

    expect($calc['employee_name'])->toBe('Amina Bello');
    expect($calc['gross_salary'])->toBe(300000.0);
    expect($calc['basic_salary'])->toBe(150000.0);
    expect($calc['total_additional_payments'])->toBe(0.0);
    expect($calc['total_additional_deductions'])->toBe(0.0);
    expect($calc['net_pay'])->toBeGreaterThan(0);
    expect($calc['is_adjusted'])->toBeFalse();
});

test('calculateForEmployee includes addition payments during review', function () {
    $employee = new Employee([
        'employee_number' => 'EMP-002',
        'first_name' => 'Chidi',
        'last_name' => 'Okafor',
        'monthly_gross_salary' => 200000,
        'basic_salary' => 100000,
        'housing_allowance' => 60000,
        'transport_allowance' => 40000,
        'apply_paye_deduction' => true,
        'apply_pension_deduction' => true,
    ]);

    $overrides = [
        'additional_payments' => [
            ['name' => 'Performance Bonus', 'amount' => 50000, 'taxable' => true],
            ['name' => 'Weekend Overtime', 'amount' => 25000, 'taxable' => true],
        ],
    ];

    $calc = $this->service->calculateForEmployee($employee, $this->settings, $overrides);

    expect($calc['total_additional_payments'])->toBe(75000.0);
    expect($calc['total_earnings'])->toBe(275000.0);
    expect($calc['gross_salary'])->toBe(275000.0);
    expect($calc['is_adjusted'])->toBeTrue();
});

test('calculateForEmployee includes addition deductions during review', function () {
    $employee = new Employee([
        'employee_number' => 'EMP-003',
        'first_name' => 'Folake',
        'last_name' => 'Adeyemi',
        'monthly_gross_salary' => 250000,
        'basic_salary' => 120000,
        'housing_allowance' => 80000,
        'transport_allowance' => 50000,
        'apply_paye_deduction' => true,
    ]);

    $standardCalc = $this->service->calculateForEmployee($employee, $this->settings);

    $overrides = [
        'additional_deductions' => [
            ['name' => 'Salary Advance Recovery', 'amount' => 30000],
            ['name' => 'Loan Repayment', 'amount' => 10000],
        ],
    ];

    $adjustedCalc = $this->service->calculateForEmployee($employee, $this->settings, $overrides);

    expect($adjustedCalc['total_additional_deductions'])->toBe(40000.0);
    expect($adjustedCalc['total_deductions'])->toBe($standardCalc['total_deductions'] + 40000.0);
    expect($adjustedCalc['net_pay'])->toBe($standardCalc['net_pay'] - 40000.0);
    expect($adjustedCalc['is_adjusted'])->toBeTrue();
});

test('calculateTotals calculates correct summary for adjusted runs', function () {
    $calculations = [
        [
            'gross_salary' => 200000,
            'total_earnings' => 200000,
            'paye_deduction' => 20000,
            'pension_deduction' => 16000,
            'pension_employer' => 20000,
            'nhf_deduction' => 2500,
            'nhis_deduction' => 5000,
            'nhis_employer' => 10000,
            'nsitf_deduction' => 1000,
            'other_deductions' => 0,
            'total_deductions' => 44500,
            'net_pay' => 155500,
        ],
        [
            'gross_salary' => 350000,
            'total_earnings' => 350000,
            'paye_deduction' => 45000,
            'pension_deduction' => 24000,
            'pension_employer' => 30000,
            'nhf_deduction' => 3500,
            'nhis_deduction' => 7500,
            'nhis_employer' => 15000,
            'nsitf_deduction' => 1500,
            'other_deductions' => 10000,
            'total_deductions' => 101500,
            'net_pay' => 248500,
        ],
    ];

    $totals = $this->service->calculateTotals($calculations);

    expect($totals['employee_count'])->toBe(2);
    expect($totals['total_gross_salary'])->toBe(550000);
    expect($totals['total_net_pay'])->toBe(404000);
    expect($totals['total_deductions'])->toBe(146000);
});
