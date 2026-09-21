<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

use Stancl\Tenancy\Tenant;
use Stancl\Tenancy\Facades\Tenancy;

// Initialize tenancy
$tenant = Tenant::find('01kr8vpjff0zagd0er6yytma54');
if (!$tenant) {
    echo "Tenant not found\n";
    exit(1);
}

Tenancy::initialize($tenant);

echo "Checking EMP-1010 data...\n\n";

$employee = \App\Models\Employee::where('employee_number', 'EMP-1010')->first();

if (!$employee) {
    echo "Employee EMP-1010 not found\n";
    exit(1);
}

echo "Employee Found: " . $employee->first_name . " " . $employee->last_name . "\n";
echo "Gross Salary: " . $employee->monthly_gross_salary . "\n";
echo "Basic Salary: " . $employee->basic_salary . "\n";
echo "Apply PAYE Deduction: " . ($employee->apply_paye_deduction ? 'true' : 'false') . "\n";
echo "Apply Pension Deduction: " . ($employee->apply_pension_deduction ? 'true' : 'false') . "\n";
echo "Apply NHF Deduction: " . ($employee->apply_nhf_deduction ? 'true' : 'false') . "\n";
echo "Apply NHIS Deduction: " . ($employee->apply_nhis_deduction ? 'true' : 'false') . "\n";

echo "\nPayroll Settings:\n";
$settings = app(\App\Services\Payroll\EffectivePayrollSettingsResolver::class)->resolve(now(), 'default');
echo "PAYE in enabled_deductions: " . (in_array('paye', $settings['enabled_deductions'] ?? [], true) ? 'true' : 'false') . "\n";
echo "Enabled deductions: " . json_encode($settings['enabled_deductions'] ?? []) . "\n";
echo "PAYE consolidated relief percentage: " . ($settings['paye_consolidated_relief_percentage'] ?? 'not set') . "\n";
echo "PAYE consolidated relief minimum: " . ($settings['paye_consolidated_relief_minimum'] ?? 'not set') . "\n";
echo "Tax brackets count: " . count($settings['paye_tax_brackets'] ?? []) . "\n";

echo "\nPayroll Calculation:\n";
$calculation = app(\App\Services\Payroll\PayrollCalculationService::class)->calculateForEmployee($employee, $settings);
echo "Calculated PAYE: " . $calculation['paye_deduction'] . "\n";
echo "Calculated Pension: " . $calculation['pension_deduction'] . "\n";
echo "Calculated NHF: " . $calculation['nhf_deduction'] . "\n";
echo "Calculated NHIS: " . $calculation['nhis_deduction'] . "\n";
echo "Calculated Net Pay: " . $calculation['net_pay'] . "\n";