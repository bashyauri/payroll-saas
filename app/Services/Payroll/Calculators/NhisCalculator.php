<?php

namespace App\Services\Payroll\Calculators;

use App\Models\Employee;

class NhisCalculator
{
    /**
     * Calculate NHIS (National Health Insurance Scheme) deduction.
     * Employee contributes configurable percentage of basic salary.
     */
    public function calculate(Employee $employee, array $settings): float
    {
        $employeeRate = (float) ($settings['nhis_employee_rate'] ?? 5.0);
        $base = (float) $employee->basic_salary;

        $deduction = ($base * $employeeRate) / 100;

        return round($deduction, 2);
    }
}
