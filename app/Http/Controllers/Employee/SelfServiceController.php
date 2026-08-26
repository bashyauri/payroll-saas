<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\UpdateProfileRequest;
use App\Models\Employee;
use App\Models\PayrollRun;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SelfServiceController extends Controller
{
    /**
     * Display the employee self-service dashboard.
     */
    public function dashboard(): Response
    {
        $user = auth()->user();
        $employee = $user->employee();

        if (! $employee) {
            abort(403, 'No employee record found.');
        }

        // Get recent payroll calculations for this employee
        $recentPayrollRuns = PayrollRun::query()
            ->where('status', PayrollRun::STATUS_FINALIZED)
            ->orderByDesc('period_month')
            ->limit(6)
            ->get()
            ->map(function (PayrollRun $run) use ($employee) {
                $employeeCalc = data_get($run->settings_snapshot, 'computed_totals.employee_calculations.'.$employee->id);
                
                return [
                    'id' => $run->id,
                    'periodMonth' => $run->period_month,
                    'periodStart' => $run->period_start,
                    'periodEnd' => $run->period_end,
                    'status' => $run->status,
                    'finalizedAt' => $run->finalized_at?->toIso8601String(),
                    'calculation' => $employeeCalc ? [
                        'grossSalary' => $employeeCalc['gross_salary'] ?? 0,
                        'totalDeductions' => $employeeCalc['total_deductions'] ?? 0,
                        'netPay' => $employeeCalc['net_pay'] ?? 0,
                        'paye' => $employeeCalc['paye'] ?? 0,
                        'pension' => $employeeCalc['pension'] ?? 0,
                        'nhf' => $employeeCalc['nhf'] ?? 0,
                        'nhis' => $employeeCalc['nhis'] ?? 0,
                        'nsitf' => $employeeCalc['nsitf'] ?? 0,
                    ] : null,
                ];
            });

        return Inertia::render('employee/dashboard', [
            'employee' => [
                'id' => $employee->id,
                'employeeNumber' => $employee->employee_number,
                'firstName' => $employee->first_name,
                'lastName' => $employee->last_name,
                'middleName' => $employee->middle_name,
                'workEmail' => $employee->work_email,
                'phone' => $employee->phone,
                'department' => $employee->department,
                'jobTitle' => $employee->job_title,
                'location' => $employee->location,
                'employmentType' => $employee->employment_type,
                'hireDate' => $employee->hire_date?->toIso8601String(),
                'status' => $employee->status,
                'monthlyGrossSalary' => (float) $employee->monthly_gross_salary,
            ],
            'recentPayrollRuns' => $recentPayrollRuns,
        ]);
    }

    /**
     * Display the employee profile for self-service updates.
     */
    public function profile(): Response
    {
        $user = auth()->user();
        $employee = $user->employee();

        if (! $employee) {
            abort(403, 'No employee record found.');
        }

        return Inertia::render('employee/profile', [
            'employee' => [
                'id' => $employee->id,
                'employeeNumber' => $employee->employee_number,
                'firstName' => $employee->first_name,
                'lastName' => $employee->last_name,
                'middleName' => $employee->middle_name,
                'workEmail' => $employee->work_email,
                'phone' => $employee->phone,
                'nin' => $employee->nin,
                'bvn' => $employee->bvn,
                'taxIdentificationNumber' => $employee->tax_identification_number,
                'pensionPin' => $employee->pension_pin,
                'pfaName' => $employee->pfa_name,
                'nhisNumber' => $employee->nhis_number,
                'nhfNumber' => $employee->nhf_number,
                'bankName' => $employee->bank_name,
                'bankAccountName' => $employee->bank_account_name,
                'bankAccountNumber' => $employee->bank_account_number,
                'department' => $employee->department,
                'jobTitle' => $employee->job_title,
                'location' => $employee->location,
                'dateOfBirth' => $employee->date_of_birth?->toIso8601String(),
                'employmentType' => $employee->employment_type,
                'hireDate' => $employee->hire_date?->toIso8601String(),
                'status' => $employee->status,
            ],
        ]);
    }

    /**
     * Update the employee profile (self-service).
     */
    public function updateProfile(UpdateProfileRequest $request, Employee $employee): RedirectResponse
    {
        $employee->update($request->validated());

        return redirect()
            ->route('employee.profile')
            ->with('status', 'profile-updated');
    }

    /**
     * Display detailed payslip for a specific payroll run.
     */
    public function payslip(PayrollRun $payrollRun): Response
    {
        $user = auth()->user();
        $employee = $user->employee();

        if (! $employee) {
            abort(403, 'No employee record found.');
        }

        if ($payrollRun->status !== PayrollRun::STATUS_FINALIZED) {
            abort(403, 'Payslips are only available for finalized payroll runs.');
        }

        $employeeCalc = data_get($payrollRun->settings_snapshot, 'computed_totals.employee_calculations.'.$employee->id);

        if (! $employeeCalc) {
            abort(404, 'Payslip calculation not found for this employee in this payroll run.');
        }

        return Inertia::render('employee/payslip', [
            'payrollRun' => [
                'id' => $payrollRun->id,
                'periodMonth' => $payrollRun->period_month,
                'periodStart' => $payrollRun->period_start,
                'periodEnd' => $payrollRun->period_end,
                'finalizedAt' => $payrollRun->finalized_at?->toIso8601String(),
            ],
            'employee' => [
                'id' => $employee->id,
                'employeeNumber' => $employee->employee_number,
                'firstName' => $employee->first_name,
                'lastName' => $employee->last_name,
                'middleName' => $employee->middle_name,
                'workEmail' => $employee->work_email,
                'department' => $employee->department,
                'jobTitle' => $employee->job_title,
                'bankName' => $employee->bank_name,
                'bankAccountName' => $employee->bank_account_name,
                'bankAccountNumber' => $employee->bank_account_number,
            ],
            'calculation' => [
                'grossSalary' => $employeeCalc['gross_salary'] ?? 0,
                'basicSalary' => $employeeCalc['basic_salary'] ?? 0,
                'housingAllowance' => $employeeCalc['housing_allowance'] ?? 0,
                'transportAllowance' => $employeeCalc['transport_allowance'] ?? 0,
                'otherAllowances' => $employeeCalc['other_allowances'] ?? 0,
                'totalDeductions' => $employeeCalc['total_deductions'] ?? 0,
                'netPay' => $employeeCalc['net_pay'] ?? 0,
                'paye' => $employeeCalc['paye'] ?? 0,
                'pensionEmployee' => $employeeCalc['pension_employee'] ?? 0,
                'pensionEmployer' => $employeeCalc['pension_employer'] ?? 0,
                'nhf' => $employeeCalc['nhf'] ?? 0,
                'nhisEmployee' => $employeeCalc['nhis_employee'] ?? 0,
                'nhisEmployer' => $employeeCalc['nhis_employer'] ?? 0,
                'nsitf' => $employeeCalc['nsitf'] ?? 0,
                'otherDeductions' => $employeeCalc['other_deductions'] ?? 0,
            ],
        ]);
    }
}