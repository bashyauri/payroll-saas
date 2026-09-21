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
        // Check if PAYE should be calculated on annual or monthly basis
        $payeCalculationPeriod = (string) ($settings['paye_calculation_period'] ?? 'annual');

        if ($payeCalculationPeriod === 'monthly') {
            return $this->calculateMonthly($employee, $settings);
        }

        return $this->calculateAnnual($employee, $settings);
    }

    /**
     * Calculate PAYE on annual income basis (Nigerian standard)
     */
    private function calculateAnnual(Employee $employee, array $settings): float
    {
        // Convert monthly salary to annual for PAYE calculation
        $annualGrossSalary = (float) $employee->monthly_gross_salary * 12;

        // Consolidated relief allowance - configurable from settings
        $consolidatedReliefPercentage = (float) ($settings['paye_consolidated_relief_percentage'] ?? 20);
        $consolidatedReliefMinimum = (float) ($settings['paye_consolidated_relief_minimum'] ?? 200000);
        $consolidatedRelief = max($annualGrossSalary * ($consolidatedReliefPercentage / 100), $consolidatedReliefMinimum);

        // Taxable income
        $taxableIncome = $annualGrossSalary - $consolidatedRelief;

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

        // Convert annual tax back to monthly
        $monthlyTax = $tax / 12;

        return round($monthlyTax, 2);
    }

    /**
     * Calculate PAYE on monthly income basis (alternative method)
     */
    private function calculateMonthly(Employee $employee, array $settings): float
    {
        $monthlyGrossSalary = (float) $employee->monthly_gross_salary;

        // For monthly calculation, divide annual relief amounts by 12
        $consolidatedReliefPercentage = (float) ($settings['paye_consolidated_relief_percentage'] ?? 20);
        $consolidatedReliefMinimum = (float) ($settings['paye_consolidated_relief_minimum'] ?? 200000) / 12;
        $consolidatedRelief = max($monthlyGrossSalary * ($consolidatedReliefPercentage / 100), $consolidatedReliefMinimum);

        // Taxable income
        $taxableIncome = $monthlyGrossSalary - $consolidatedRelief;

        if ($taxableIncome <= 0) {
            return 0;
        }

        // Progressive tax rates - for monthly calculation, divide annual thresholds by 12
        $taxBrackets = $settings['paye_tax_brackets'] ?? [
            ['threshold' => 300000, 'rate' => 7],
            ['threshold' => 600000, 'rate' => 11],
            ['threshold' => 1100000, 'rate' => 15],
            ['threshold' => 1600000, 'rate' => 19],
            ['threshold' => 3200000, 'rate' => 21],
            ['threshold' => PHP_FLOAT_MAX, 'rate' => 24],
        ];

        // Convert annual thresholds to monthly for monthly calculation
        $monthlyTaxBrackets = array_map(function ($bracket) {
            return [
                'threshold' => $bracket['threshold'] === PHP_FLOAT_MAX ? PHP_FLOAT_MAX : $bracket['threshold'] / 12,
                'rate' => $bracket['rate'],
            ];
        }, $taxBrackets);

        $tax = 0;
        $previousThreshold = 0;

        foreach ($monthlyTaxBrackets as $bracket) {
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
