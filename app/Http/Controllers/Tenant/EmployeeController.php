<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\StoreEmployeeRequest;
use App\Models\Employee;
use App\Models\Organization;
use App\Services\Employee\EmployeeLimitService;
use DateTimeInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function __construct(private readonly EmployeeLimitService $employeeLimitService) {}

    public function index(Request $request): Response
    {
        $organization = $this->resolveOrganization();
        $employeeUsage = $this->employeeLimitService->usage($organization);

        return Inertia::render('employees/index', [
            'employees' => Employee::query()
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->get()
                ->map(fn (Employee $employee): array => [
                    'id' => $employee->id,
                    'employeeNumber' => $employee->employee_number,
                    'name' => trim($employee->first_name.' '.$employee->last_name),
                    'department' => $employee->department,
                    'jobTitle' => $employee->job_title,
                    'bankName' => $employee->bank_name,
                    'bankAccountNumber' => str_repeat('*', 6).substr($employee->bank_account_number, -4),
                    'monthlyGrossSalary' => $employee->monthly_gross_salary,
                    'status' => $employee->status,
                ])
                ->all(),
            'employeeCount' => $employeeUsage['employeeCount'],
            'employeeLimit' => $employeeUsage['employeeLimit'],
            'remainingSlots' => $employeeUsage['remainingSlots'],
            'isNearEmployeeLimit' => $employeeUsage['isNearEmployeeLimit'],
            'isAtEmployeeLimit' => $employeeUsage['isAtEmployeeLimit'],
            'status' => $request->session()->get('status'),
            'organizationName' => $organization->name,
        ]);
    }

    public function create(): Response
    {
        $organization = $this->resolveOrganization();
        $employeeUsage = $this->employeeLimitService->usage($organization);

        return Inertia::render('employees/create', [
            'employeeCount' => $employeeUsage['employeeCount'],
            'employeeLimit' => $employeeUsage['employeeLimit'],
            'remainingSlots' => $employeeUsage['remainingSlots'],
            'canCreateEmployee' => ! $employeeUsage['isAtEmployeeLimit'],
            'status' => session('status'),
        ]);
    }

    public function show(Employee $employee): Response
    {
        return Inertia::render('employees/show', [
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
                'bankName' => $employee->bank_name,
                'bankAccountName' => $employee->bank_account_name,
                'bankAccountNumber' => str_repeat('*', 6).substr($employee->bank_account_number, -4),
                'monthlyGrossSalary' => $employee->monthly_gross_salary,
                'monthlyTaxDeduction' => $employee->monthly_tax_deduction,
                'monthlyPensionDeduction' => $employee->monthly_pension_deduction,
                'monthlyNhfDeduction' => $employee->monthly_nhf_deduction,
                'otherMonthlyDeductions' => $employee->other_monthly_deductions,
                'department' => $employee->department,
                'jobTitle' => $employee->job_title,
                'employmentType' => $employee->employment_type,
                'hireDate' => $employee->hire_date instanceof DateTimeInterface
                    ? $employee->hire_date->format('Y-m-d')
                    : null,
                'status' => $employee->status,
            ],
        ]);
    }

    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $organization = $this->resolveOrganization();
        $employeeUsage = $this->employeeLimitService->usage($organization);

        if ($employeeUsage['isAtEmployeeLimit']) {
            throw ValidationException::withMessages([
                'employee_limit' => 'Upgrade to add more employees. Your organization has reached its current employee limit.',
            ]);
        }

        Employee::query()->create($request->validated());

        return redirect()
            ->route('tenant.employees.index')
            ->with('status', 'employee-created');
    }

    private function resolveOrganization(): Organization
    {
        /** @var Organization $organization */
        $organization = tenant();

        return $organization;
    }
}
