<?php

namespace App\Services\Payroll;

use App\Models\Employee;
use App\Services\Payroll\Calculators\PayeCalculator;
use App\Services\Payroll\Calculators\PensionCalculator;
use App\Services\Payroll\Calculators\NhfCalculator;
use App\Services\Payroll\Calculators\NhisCalculator;
use App\Services\Payroll\Calculators\NsitfCalculator;

class PayrollCalculationService
{
    public function __construct(
        private readonly PayeCalculator $payeCalculator,
        private readonly PensionCalculator $pensionCalculator,
        private readonly NhfCalculator $nhfCalculator,
        private readonly NhisCalculator $nhisCalculator,
        private readonly NsitfCalculator $nsitfCalculator,
    ) {}

    /**
     * Calculate payroll for a single employee.
     *
     * @return array<string, mixed>
     */
    public function calculateForEmployee(Employee $employee, array $settings): array
    {
        $grossSalary = (float) $employee->monthly_gross_salary;
        $basicSalary = (float) $employee->basic_salary;
        $housingAllowance = (float) $employee->housing_allowance;
        $transportAllowance = (float) $employee->transport_allowance;
        $otherAllowance1 = (float) ($employee->other_allowance_1 ?? 0);
        $otherAllowance2 = (float) ($employee->other_allowance_2 ?? 0);

        // Calculate total earnings
        $totalEarnings = $basicSalary + $housingAllowance + $transportAllowance + $otherAllowance1 + $otherAllowance2;

        // Calculate deductions
        $payeDeduction = 0;
        $pensionDeduction = 0;
        $nhfDeduction = 0;
        $nhisDeduction = 0;
        $nsitfDeduction = 0;

        $enabledDeductions = $settings['enabled_deductions'] ?? [];

        // PAYE
        if (in_array('paye', $enabledDeductions, true) && $employee->apply_paye_deduction) {
            $payeDeduction = $this->payeCalculator->calculate($employee, $settings);
        }

        // Pension
        if (in_array('pension', $enabledDeductions, true) && $employee->apply_pension_deduction) {
            $pensionDeduction = $this->pensionCalculator->calculate($employee, $settings);
        }

        // NHF
        if (in_array('nhf', $enabledDeductions, true) && $employee->apply_nhf_deduction) {
            $nhfDeduction = $this->nhfCalculator->calculate($employee, $settings);
        }

        // NHIS
        if (in_array('nhis', $enabledDeductions, true) && $employee->apply_nhis_deduction) {
            $nhisDeduction = $this->nhisCalculator->calculate($employee, $settings);
        }

        // NSITF
        if (in_array('nsitf', $enabledDeductions, true) && $employee->apply_nsitf_deduction) {
            $nsitfDeduction = $this->nsitfCalculator->calculate($employee, $settings);
        }

        // Other deductions
        $otherDeductions = (float) $employee->other_monthly_deductions;

        // Total deductions
        $totalDeductions = $payeDeduction + $pensionDeduction + $nhfDeduction + $nhisDeduction + $nsitfDeduction + $otherDeductions;

        // Net pay
        $netPay = max($grossSalary - $totalDeductions, 0);

        return [
            'employee_id' => $employee->id,
            'employee_number' => $employee->employee_number,
            'employee_name' => trim($employee->first_name.' '.$employee->last_name),
            'gross_salary' => $grossSalary,
            'basic_salary' => $basicSalary,
            'housing_allowance' => $housingAllowance,
            'transport_allowance' => $transportAllowance,
            'other_allowance_1' => $otherAllowance1,
            'other_allowance_2' => $otherAllowance2,
            'total_earnings' => $totalEarnings,
            'paye_deduction' => $payeDeduction,
            'pension_deduction' => $pensionDeduction,
            'nhf_deduction' => $nhfDeduction,
            'nhis_deduction' => $nhisDeduction,
            'nsitf_deduction' => $nsitfDeduction,
            'other_deductions' => $otherDeductions,
            'total_deductions' => $totalDeductions,
            'net_pay' => $netPay,
        ];
    }

    /**
     * Calculate payroll for multiple employees.
     *
     * @param  \Illuminate\Database\Eloquent\Collection<int, Employee>  $employees
     * @return array<int, array<string, mixed>>
     */
    public function calculateForEmployees($employees, array $settings): array
    {
        return $employees->map(fn (Employee $employee) => $this->calculateForEmployee($employee, $settings))->all();
    }

    /**
     * Calculate totals for a payroll run.
     *
     * @param  array<int, array<string, mixed>>  $employeeCalculations
     * @return array<string, mixed>
     */
    public function calculateTotals(array $employeeCalculations): array
    {
        $totalGrossSalary = 0;
        $totalEarnings = 0;
        $totalPayeDeduction = 0;
        $totalPensionDeduction = 0;
        $totalNhfDeduction = 0;
        $totalNhisDeduction = 0;
        $totalNsitfDeduction = 0;
        $totalOtherDeductions = 0;
        $totalDeductions = 0;
        $totalNetPay = 0;

        foreach ($employeeCalculations as $calculation) {
            $totalGrossSalary += $calculation['gross_salary'];
            $totalEarnings += $calculation['total_earnings'];
            $totalPayeDeduction += $calculation['paye_deduction'];
            $totalPensionDeduction += $calculation['pension_deduction'];
            $totalNhfDeduction += $calculation['nhf_deduction'];
            $totalNhisDeduction += $calculation['nhis_deduction'];
            $totalNsitfDeduction += $calculation['nsitf_deduction'];
            $totalOtherDeductions += $calculation['other_deductions'];
            $totalDeductions += $calculation['total_deductions'];
            $totalNetPay += $calculation['net_pay'];
        }

        return [
            'total_gross_salary' => $totalGrossSalary,
            'total_earnings' => $totalEarnings,
            'total_paye_deduction' => $totalPayeDeduction,
            'total_pension_deduction' => $totalPensionDeduction,
            'total_nhf_deduction' => $totalNhfDeduction,
            'total_nhis_deduction' => $totalNhisDeduction,
            'total_nsitf_deduction' => $totalNsitfDeduction,
            'total_other_deductions' => $totalOtherDeductions,
            'total_deductions' => $totalDeductions,
            'total_net_pay' => $totalNetPay,
            'employee_count' => count($employeeCalculations),
        ];
    }
}
