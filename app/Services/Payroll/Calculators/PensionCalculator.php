<?php

namespace App\Services\Payroll\Calculators;

use App\Models\Employee;

class PensionCalculator
{
    /**
     * Calculate pension deduction.
     * Employee contributes 8% of pension base (basic + transport + housing).
     */
    public function calculate(Employee $employee, array $settings): float
    {
        $employeeRate = (float) ($settings['pension_employee_rate'] ?? 8.0);
        $contributionBase = (string) ($settings['pension_contribution_base'] ?? 'basic_transport_housing');

        $base = 0;

        switch ($contributionBase) {
            case 'basic':
                $base = (float) $employee->basic_salary;
                break;
            case 'basic_transport':
                $base = (float) $employee->basic_salary + (float) $employee->transport_allowance;
                break;
            case 'basic_housing':
                $base = (float) $employee->basic_salary + (float) $employee->housing_allowance;
                break;
            case 'basic_transport_housing':
            default:
                $base = (float) $employee->basic_salary
                    + (float) $employee->transport_allowance
                    + (float) $employee->housing_allowance;
                break;
        }

        $deduction = ($base * $employeeRate) / 100;

        return round($deduction, 2);
    }
}
