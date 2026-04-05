<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\StoreEmployeeRequest;
use App\Models\Employee;
use App\Models\Organization;
use App\Services\Employee\EmployeeLimitService;
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
