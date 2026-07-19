<?php

namespace App\Services\Payroll\Calculators;

use App\Models\Employee;

class NhfCalculator
{
    /**
     * Calculate NHF (National Housing Fund) deduction.
     * Employee contributes 2.5% of basic salary.
     */
    public function calculate(Employee $employee, array $settings): float
    {
        $nhfRate = (float) ($settings['nhf_rate'] ?? 2.5);
        $contributionBase = (string) ($settings['nhf_contribution_base'] ?? 'basic');

        $base = 0;

        switch ($contributionBase) {
            case 'basic':
            default:
                $base = (float) $employee->basic_salary;
                break;
            case 'gross':
                $base = (float) $employee->monthly_gross_salary;
                break;
        }

        $deduction = ($base * $nhfRate) / 100;

        return round($deduction, 2);
    }
}
