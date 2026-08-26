<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\PayrollRun;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaxDocumentsController extends Controller
{
    /**
     * Display available tax documents for the employee.
     */
    public function index(): Response
    {
        $user = auth()->user();
        $employee = $user->employee();

        if (! $employee) {
            abort(403, 'No employee record found.');
        }

        // Get finalized payroll runs for this employee
        $payrollRuns = PayrollRun::query()
            ->where('status', PayrollRun::STATUS_FINALIZED)
            ->orderByDesc('period_month')
            ->limit(12) // Last 12 months
            ->get()
            ->map(function (PayrollRun $run) use ($employee) {
                $employeeCalc = data_get($run->settings_snapshot, 'computed_totals.employee_calculations.'.$employee->id);
                
                return [
                    'id' => $run->id,
                    'periodMonth' => $run->period_month,
                    'periodStart' => $run->period_start,
                    'periodEnd' => $run->period_end,
                    'finalizedAt' => $run->finalized_at?->toIso8601String(),
                    'hasCalculation' => $employeeCalc !== null,
                    'paye' => $employeeCalc['paye'] ?? 0,
                    'pensionEmployee' => $employeeCalc['pension_employee'] ?? 0,
                    'nhf' => $employeeCalc['nhf'] ?? 0,
                    'nhisEmployee' => $employeeCalc['nhis_employee'] ?? 0,
                    'nsitf' => $employeeCalc['nsitf'] ?? 0,
                ];
            });

        // Calculate year-to-date totals
        $currentYear = now()->year;
        $ytdPayrollRuns = PayrollRun::query()
            ->where('status', PayrollRun::STATUS_FINALIZED)
            ->where('period_month', 'like', $currentYear.'-%')
            ->get();

        $ytdTotals = [
            'paye' => 0,
            'pensionEmployee' => 0,
            'nhf' => 0,
            'nhisEmployee' => 0,
            'nsitf' => 0,
            'grossSalary' => 0,
        ];

        foreach ($ytdPayrollRuns as $run) {
            $employeeCalc = data_get($run->settings_snapshot, 'computed_totals.employee_calculations.'.$employee->id);
            if ($employeeCalc) {
                $ytdTotals['paye'] += $employeeCalc['paye'] ?? 0;
                $ytdTotals['pensionEmployee'] += $employeeCalc['pension_employee'] ?? 0;
                $ytdTotals['nhf'] += $employeeCalc['nhf'] ?? 0;
                $ytdTotals['nhisEmployee'] += $employeeCalc['nhis_employee'] ?? 0;
                $ytdTotals['nsitf'] += $employeeCalc['nsitf'] ?? 0;
                $ytdTotals['grossSalary'] += $employeeCalc['gross_salary'] ?? 0;
            }
        }

        return Inertia::render('employee/tax-documents', [
            'employee' => [
                'id' => $employee->id,
                'employeeNumber' => $employee->employee_number,
                'firstName' => $employee->first_name,
                'lastName' => $employee->last_name,
                'taxIdentificationNumber' => $employee->tax_identification_number,
                'pensionPin' => $employee->pension_pin,
                'nhfNumber' => $employee->nhf_number,
                'nhisNumber' => $employee->nhis_number,
            ],
            'payrollRuns' => $payrollRuns,
            'ytdTotals' => $ytdTotals,
            'currentYear' => $currentYear,
        ]);
    }

    /**
     * Generate PAYE certificate for a specific period.
     */
    public function payeCertificate(PayrollRun $payrollRun)
    {
        $user = auth()->user();
        $employee = $user->employee();

        if (! $employee) {
            abort(403, 'No employee record found.');
        }

        if ($payrollRun->status !== PayrollRun::STATUS_FINALIZED) {
            abort(403, 'Tax documents are only available for finalized payroll runs.');
        }

        $employeeCalc = data_get($payrollRun->settings_snapshot, 'computed_totals.employee_calculations.'.$employee->id);

        if (! $employeeCalc) {
            abort(404, 'Payroll calculation not found for this employee.');
        }

        // In a real implementation, this would generate a PDF
        // For now, return the data that would be used for PDF generation
        return response()->json([
            'employee' => [
                'name' => $employee->first_name . ' ' . $employee->last_name,
                'employeeNumber' => $employee->employee_number,
                'taxId' => $employee->tax_identification_number,
            ],
            'period' => [
                'month' => $payrollRun->period_month,
                'start' => $payrollRun->period_start,
                'end' => $payrollRun->period_end,
            ],
            'calculation' => [
                'grossSalary' => $employeeCalc['gross_salary'] ?? 0,
                'paye' => $employeeCalc['paye'] ?? 0,
                'taxableIncome' => $employeeCalc['taxable_income'] ?? 0,
            ],
        ]);
    }

    /**
     * Generate pension contribution statement.
     */
    public function pensionStatement()
    {
        $user = auth()->user();
        $employee = $user->employee();

        if (! $employee) {
            abort(403, 'No employee record found.');
        }

        $currentYear = now()->year;
        $payrollRuns = PayrollRun::query()
            ->where('status', PayrollRun::STATUS_FINALIZED)
            ->where('period_month', 'like', $currentYear.'-%')
            ->get();

        $contributions = [];
        $totalEmployee = 0;
        $totalEmployer = 0;

        foreach ($payrollRuns as $run) {
            $employeeCalc = data_get($run->settings_snapshot, 'computed_totals.employee_calculations.'.$employee->id);
            if ($employeeCalc) {
                $contributions[] = [
                    'period' => $run->period_month,
                    'employeeContribution' => $employeeCalc['pension_employee'] ?? 0,
                    'employerContribution' => $employeeCalc['pension_employer'] ?? 0,
                    'total' => ($employeeCalc['pension_employee'] ?? 0) + ($employeeCalc['pension_employer'] ?? 0),
                ];
                $totalEmployee += $employeeCalc['pension_employee'] ?? 0;
                $totalEmployer += $employeeCalc['pension_employer'] ?? 0;
            }
        }

        return response()->json([
            'employee' => [
                'name' => $employee->first_name . ' ' . $employee->last_name,
                'employeeNumber' => $employee->employee_number,
                'pensionPin' => $employee->pension_pin,
                'pfaName' => $employee->pfa_name,
            ],
            'year' => $currentYear,
            'contributions' => $contributions,
            'totals' => [
                'employee' => $totalEmployee,
                'employer' => $totalEmployer,
                'total' => $totalEmployee + $totalEmployer,
            ],
        ]);
    }
}