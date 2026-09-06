<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\PayrollRun;
use Illuminate\Http\Request;

class PayslipPdfController extends Controller
{
    /**
     * Generate PDF payslip for a specific payroll run.
     */
    public function __invoke(PayrollRun $payrollRun)
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

        $organization = tenant();

        $pdf = \PDF::loadView('employee.payslip-pdf', [
            'organization' => $organization,
            'payrollRun' => $payrollRun,
            'employee' => $employee,
            'calculation' => $employeeCalc,
            'generatedAt' => now()->format('F j, Y, g:i a'),
        ]);

        $fileName = sprintf(
            'payslip-%s-%s.pdf',
            $employee->employee_number,
            $payrollRun->period_month
        );

        return $pdf->download($fileName);
    }
}