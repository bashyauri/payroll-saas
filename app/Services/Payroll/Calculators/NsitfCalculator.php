<?php

namespace App\Services\Payroll\Calculators;

use App\Models\Employee;

class NsitfCalculator
{
    /**
     * Calculate NSITF (National Social Insurance Trust Fund) deduction.
     * Employee contributes configurable percentage of basic salary.
     */
    public function calculate(Employee $employee, array $settings): float
    {
        $nsitfRate = (float) ($settings['nsitf_rate'] ?? 1.0);
        $base = (float) $employee->basic_salary;

        $deduction = ($base * $nsitfRate) / 100;

        return round($deduction, 2);
    }
}
