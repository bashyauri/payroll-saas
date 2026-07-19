<?php

namespace App\Services\Payroll\Calculators;

use App\Models\Employee;

class PayeCalculator
{
    /**
     * Calculate PAYE (Pay As You Earn) tax deduction.
     * This implements the Nigerian PAYE tax calculation based on NTA 2025.
     */
    public function calculate(Employee $employee, array $settings): float
    {
        $grossSalary = (float) $employee->monthly_gross_salary;

        // Consolidated relief allowance - configurable from settings
        $consolidatedReliefPercentage = (float) ($settings['paye_consolidated_relief_percentage'] ?? 20);
        $consolidatedReliefMinimum = (float) ($settings['paye_consolidated_relief_minimum'] ?? 200000);
        $consolidatedRelief = max($grossSalary * ($consolidatedReliefPercentage / 100), $consolidatedReliefMinimum);

        // Taxable income
        $taxableIncome = $grossSalary - $consolidatedRelief;

        if ($taxableIncome <= 0) {
            return 0;
        }

        // Progressive tax rates - configurable from settings
        $taxBrackets = $settings['paye_tax_brackets'] ?? [
            ['threshold' => 300000, 'rate' => 7],
            ['threshold' => 600000, 'rate' => 11],
            ['threshold' => 1100000, 'rate' => 15],
            ['threshold' => 1600000, 'rate' => 19],
            ['threshold' => 3200000, 'rate' => 21],
            ['threshold' => PHP_FLOAT_MAX, 'rate' => 24],
        ];

        $tax = 0;
        $previousThreshold = 0;

        foreach ($taxBrackets as $bracket) {
            $threshold = (float) $bracket['threshold'];
            $rate = (float) $bracket['rate'];

            if ($taxableIncome <= $previousThreshold) {
                break;
            }

            if ($taxableIncome <= $threshold) {
                $taxableAmount = $taxableIncome - $previousThreshold;
                $tax += ($taxableAmount * $rate) / 100;
                break;
            }

            $taxableAmount = $threshold - $previousThreshold;
            $tax += ($taxableAmount * $rate) / 100;
            $previousThreshold = $threshold;
        }

        return round($tax, 2);
    }
}
