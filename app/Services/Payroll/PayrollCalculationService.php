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
    /**
     * Calculate payroll for a single employee with optional adjustments.
     *
     * @param  array<string, mixed>  $settings
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    public function calculateForEmployee(Employee $employee, array $settings, array $overrides = []): array
    {
        $basicSalary = isset($overrides['basic_salary']) ? (float) $overrides['basic_salary'] : (float) $employee->basic_salary;
        $housingAllowance = isset($overrides['housing_allowance']) ? (float) $overrides['housing_allowance'] : (float) $employee->housing_allowance;
        $transportAllowance = isset($overrides['transport_allowance']) ? (float) $overrides['transport_allowance'] : (float) $employee->transport_allowance;
        $otherAllowance1 = isset($overrides['other_allowance_1']) ? (float) $overrides['other_allowance_1'] : (float) ($employee->other_allowance_1 ?? 0);
        $otherAllowance2 = isset($overrides['other_allowance_2']) ? (float) $overrides['other_allowance_2'] : (float) ($employee->other_allowance_2 ?? 0);
        $baseOtherDeductions = isset($overrides['other_deductions']) ? (float) $overrides['other_deductions'] : (float) $employee->other_monthly_deductions;

        // Additional payments (bonuses, overtime, commissions, etc.)
        $additionalPayments = is_array($overrides['additional_payments'] ?? null) ? $overrides['additional_payments'] : [];
        $totalAdditionalPayments = 0.0;
        $taxableAdditionalPayments = 0.0;
        foreach ($additionalPayments as $item) {
            $amount = (float) ($item['amount'] ?? 0);
            $totalAdditionalPayments += $amount;
            if ($item['taxable'] ?? true) {
                $taxableAdditionalPayments += $amount;
            }
        }

        // Additional deductions (loans, advances, discipline, etc.)
        $additionalDeductions = is_array($overrides['additional_deductions'] ?? null) ? $overrides['additional_deductions'] : [];
        $totalAdditionalDeductions = 0.0;
        foreach ($additionalDeductions as $item) {
            $totalAdditionalDeductions += (float) ($item['amount'] ?? 0);
        }

        // Base total earnings from salary components
        $baseEarnings = $basicSalary + $housingAllowance + $transportAllowance + $otherAllowance1 + $otherAllowance2;
        $totalEarnings = $baseEarnings + $totalAdditionalPayments;

        // Gross salary calculation
        $baseGross = isset($overrides['gross_salary'])
            ? (float) $overrides['gross_salary']
            : max((float) $employee->monthly_gross_salary, $baseEarnings);
        $grossSalary = $baseGross + $totalAdditionalPayments;
        $taxableGrossSalary = $baseGross + $taxableAdditionalPayments;

        // Clone employee with overridden attributes for calculators
        $calcEmployee = clone $employee;
        $calcEmployee->basic_salary = $basicSalary;
        $calcEmployee->housing_allowance = $housingAllowance;
        $calcEmployee->transport_allowance = $transportAllowance;
        $calcEmployee->other_allowance_1 = $otherAllowance1;
        $calcEmployee->other_allowance_2 = $otherAllowance2;
        $calcEmployee->monthly_gross_salary = $grossSalary;

        // Deductions
        $payeDeduction = 0.0;
        $pensionDeduction = 0.0;
        $nhfDeduction = 0.0;
        $nhisDeduction = 0.0;
        $nsitfDeduction = 0.0;

        $enabledDeductions = $settings['enabled_deductions'] ?? [];

        // PAYE
        if (in_array('paye', $enabledDeductions, true) && $employee->apply_paye_deduction) {
            $payeDeduction = $this->payeCalculator->calculate($calcEmployee, $settings, $taxableGrossSalary);
        }

        // Pension
        if (in_array('pension', $enabledDeductions, true) && $employee->apply_pension_deduction) {
            $pensionDeduction = $this->pensionCalculator->calculate($calcEmployee, $settings);
        }

        // NHF
        if (in_array('nhf', $enabledDeductions, true) && $employee->apply_nhf_deduction) {
            $nhfDeduction = $this->nhfCalculator->calculate($calcEmployee, $settings);
        }

        // NHIS
        if (in_array('nhis', $enabledDeductions, true) && $employee->apply_nhis_deduction) {
            $nhisDeduction = $this->nhisCalculator->calculate($calcEmployee, $settings);
        }

        // NSITF
        if (in_array('nsitf', $enabledDeductions, true) && $employee->apply_nsitf_deduction) {
            $nsitfDeduction = $this->nsitfCalculator->calculate($calcEmployee, $settings);
        }

        // Combine standard other deductions and one-off additional deductions
        $allOtherDeductions = $baseOtherDeductions + $totalAdditionalDeductions;

        // Total deductions
        $totalDeductions = $payeDeduction + $pensionDeduction + $nhfDeduction + $nhisDeduction + $nsitfDeduction + $allOtherDeductions;

        // Net pay
        $netPay = max($totalEarnings - $totalDeductions, 0);

        // Calculate employer contributions
        $pensionEmployerRate = (float) ($settings['pension_employer_rate'] ?? 10.0);
        $nhisEmployerRate = (float) ($settings['nhis_employer_rate'] ?? 10.0);
        $pensionEmployeeRate = (float) ($settings['pension_employee_rate'] ?? 8.0);

        $pensionEmployerContribution = $pensionEmployeeRate > 0
            ? ($pensionDeduction / $pensionEmployeeRate) * $pensionEmployerRate
            : 0.0;
        $nhisEmployerContribution = ($basicSalary * $nhisEmployerRate) / 100;

        return [
            'employee_id' => $employee->id,
            'employee_number' => $employee->employee_number,
            'employee_name' => trim($employee->first_name.' '.$employee->last_name),
            'gross_salary' => round($grossSalary, 2),
            'basic_salary' => round($basicSalary, 2),
            'housing_allowance' => round($housingAllowance, 2),
            'transport_allowance' => round($transportAllowance, 2),
            'other_allowance_1' => round($otherAllowance1, 2),
            'other_allowance_2' => round($otherAllowance2, 2),
            'additional_payments' => $additionalPayments,
            'total_additional_payments' => round($totalAdditionalPayments, 2),
            'additional_deductions' => $additionalDeductions,
            'total_additional_deductions' => round($totalAdditionalDeductions, 2),
            'total_earnings' => round($totalEarnings, 2),
            'paye_deduction' => round($payeDeduction, 2),
            'pension_deduction' => round($pensionDeduction, 2),
            'pension_employer' => round($pensionEmployerContribution, 2),
            'nhf_deduction' => round($nhfDeduction, 2),
            'nhis_deduction' => round($nhisDeduction, 2),
            'nhis_employer' => round($nhisEmployerContribution, 2),
            'nsitf_deduction' => round($nsitfDeduction, 2),
            'other_deductions' => round($allOtherDeductions, 2),
            'base_other_deductions' => round($baseOtherDeductions, 2),
            'total_deductions' => round($totalDeductions, 2),
            'net_pay' => round($netPay, 2),
            'is_adjusted' => ! empty($overrides),
        ];
    }

    /**
     * Calculate payroll for multiple employees.
     *
     * @param  \Illuminate\Database\Eloquent\Collection<int, Employee>  $employees
     * @param  array<string, mixed>  $settings
     * @param  array<string, array<string, mixed>>  $employeeOverrides
     * @return array<int, array<string, mixed>>
     */
    public function calculateForEmployees($employees, array $settings, array $employeeOverrides = []): array
    {
        return $employees->map(function (Employee $employee) use ($settings, $employeeOverrides) {
            $overrides = $employeeOverrides[$employee->id] ?? [];
            return $this->calculateForEmployee($employee, $settings, $overrides);
        })->all();
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
        $totalPensionEmployer = 0;
        $totalNhfDeduction = 0;
        $totalNhisDeduction = 0;
        $totalNhisEmployer = 0;
        $totalNsitfDeduction = 0;
        $totalOtherDeductions = 0;
        $totalDeductions = 0;
        $totalNetPay = 0;

        foreach ($employeeCalculations as $calculation) {
            $totalGrossSalary += $calculation['gross_salary'];
            $totalEarnings += $calculation['total_earnings'];
            $totalPayeDeduction += $calculation['paye_deduction'];
            $totalPensionDeduction += $calculation['pension_deduction'];
            $totalPensionEmployer += $calculation['pension_employer'];
            $totalNhfDeduction += $calculation['nhf_deduction'];
            $totalNhisDeduction += $calculation['nhis_deduction'];
            $totalNhisEmployer += $calculation['nhis_employer'];
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
            'total_pension_employer' => $totalPensionEmployer,
            'total_nhf_deduction' => $totalNhfDeduction,
            'total_nhis_deduction' => $totalNhisDeduction,
            'total_nhis_employer' => $totalNhisEmployer,
            'total_nsitf_deduction' => $totalNsitfDeduction,
            'total_other_deductions' => $totalOtherDeductions,
            'total_deductions' => $totalDeductions,
            'total_net_pay' => $totalNetPay,
            'employee_count' => count($employeeCalculations),
        ];
    }
}
