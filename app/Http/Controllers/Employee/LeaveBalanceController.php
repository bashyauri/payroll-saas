<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveBalanceController extends Controller
{
    /**
     * Display the employee's leave balance information.
     */
    public function index(): Response
    {
        $user = auth()->user();
        $employee = $user->employee();

        if (! $employee) {
            abort(403, 'No employee record found.');
        }

        // For now, this is a placeholder implementation
        // In the full leave management system, this would query actual leave balances
        // from leave tables and calculate remaining balances based on leave type and accrual

        $currentYear = now()->year;
        
        // Placeholder leave balances - these would come from a proper leave management system
        $leaveBalances = [
            [
                'type' => 'Annual Leave',
                'totalDays' => 21,
                'usedDays' => 5,
                'remainingDays' => 16,
                'accrualPeriod' => 'Yearly',
                'carriedOver' => 0,
            ],
            [
                'type' => 'Sick Leave',
                'totalDays' => 10,
                'usedDays' => 2,
                'remainingDays' => 8,
                'accrualPeriod' => 'Yearly',
                'carriedOver' => 0,
            ],
            [
                'type' => 'Maternity Leave',
                'totalDays' => 90,
                'usedDays' => 0,
                'remainingDays' => 90,
                'accrualPeriod' => 'Per pregnancy',
                'carriedOver' => 0,
            ],
            [
                'type' => 'Paternity Leave',
                'totalDays' => 14,
                'usedDays' => 0,
                'remainingDays' => 14,
                'accrualPeriod' => 'Per birth',
                'carriedOver' => 0,
            ],
        ];

        // Placeholder recent leave requests
        $recentRequests = [
            [
                'id' => '1',
                'type' => 'Annual Leave',
                'startDate' => '2026-08-15',
                'endDate' => '2026-08-19',
                'days' => 5,
                'status' => 'approved',
                'requestedAt' => '2026-08-01',
            ],
            [
                'id' => '2',
                'type' => 'Sick Leave',
                'startDate' => '2026-07-10',
                'endDate' => '2026-07-11',
                'days' => 2,
                'status' => 'approved',
                'requestedAt' => '2026-07-10',
            ],
        ];

        return Inertia::render('employee/leave-balance', [
            'employee' => [
                'id' => $employee->id,
                'employeeNumber' => $employee->employee_number,
                'firstName' => $employee->first_name,
                'lastName' => $employee->last_name,
                'department' => $employee->department,
                'jobTitle' => $employee->job_title,
                'hireDate' => $employee->hire_date?->toIso8601String(),
                'employmentType' => $employee->employment_type,
            ],
            'leaveBalances' => $leaveBalances,
            'recentRequests' => $recentRequests,
            'currentYear' => $currentYear,
            'leaveManagementEnabled' => false, // Will be true when full leave system is implemented
        ]);
    }
}