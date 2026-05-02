<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\StoreEmployeeRequest;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\PayrollSetting;
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
                ->orderBy('last_name', 'asc')
                ->orderBy('first_name', 'asc')
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
        $settings = PayrollSetting::query()->where('profile', 'default')->first();

        return Inertia::render('employees/create', [
            'employeeCount' => $employeeUsage['employeeCount'],
            'employeeLimit' => $employeeUsage['employeeLimit'],
            'remainingSlots' => $employeeUsage['remainingSlots'],
            'canCreateEmployee' => ! $employeeUsage['isAtEmployeeLimit'],
            'payrollCustomFields' => $this->configuredPayrollCustomFields($settings?->other_items),
            'payrollRates' => [
                'pensionEmployeeRate' => (float) ($settings?->pension_employee_rate ?? 8),
                'nhfRate' => (float) ($settings?->nhf_rate ?? 2.5),
                'nhisEmployeeRate' => (float) ($settings?->nhis_employee_rate ?? 1.75),
                'nsitfRate' => (float) ($settings?->nsitf_rate ?? 1),
            ],
            'enabledDeductions' => $settings?->enabled_deductions ?? ['pension', 'nhf', 'nhis', 'nsitf', 'paye'],
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
                'pfaName' => $employee->pfa_name,
                'nhisNumber' => $employee->nhis_number,
                'nhfNumber' => $employee->nhf_number,
                'bankName' => $employee->bank_name,
                'bankAccountName' => $employee->bank_account_name,
                'bankAccountNumber' => str_repeat('*', 6).substr($employee->bank_account_number, -4),
                'monthlyGrossSalary' => $employee->monthly_gross_salary,
                'annualGrossSalary' => $employee->annual_gross_salary,
                'monthlyTaxDeduction' => $employee->monthly_tax_deduction,
                'monthlyPensionDeduction' => $employee->monthly_pension_deduction,
                'monthlyNhfDeduction' => $employee->monthly_nhf_deduction,
                'otherMonthlyDeductions' => $employee->other_monthly_deductions,
                'otherAllowance1' => $employee->other_allowance_1,
                'otherAllowance2' => $employee->other_allowance_2,
                'totalSalary' => $employee->total_salary,
                'personalLifeInsurance' => $employee->personal_life_insurance,
                'rentRelief' => $employee->rent_relief,
                'customItems' => $this->storedEmployeeCustomItems($employee->custom_items),
                'department' => $employee->department,
                'jobTitle' => $employee->job_title,
                'location' => $employee->location,
                'dateOfBirth' => $employee->date_of_birth instanceof DateTimeInterface
                    ? $employee->date_of_birth->format('Y-m-d')
                    : null,
                'employmentType' => $employee->employment_type,
                'hireDate' => $employee->hire_date instanceof DateTimeInterface
                    ? $employee->hire_date->format('Y-m-d')
                    : null,
                'exitDate' => $employee->exit_date instanceof DateTimeInterface
                    ? $employee->exit_date->format('Y-m-d')
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

        $validated = $request->validated();
        $validated['custom_items'] = $this->storedEmployeeCustomItems($validated['custom_items'] ?? null);

        Employee::query()->create($validated);

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

    /**
     * @return array<int, array{label: string, rate: float}>
     */
    private function configuredPayrollCustomFields(mixed $otherItems): array
    {
        if (! is_array($otherItems)) {
            return [];
        }

        return collect($otherItems)
            ->filter(fn (mixed $item): bool => is_array($item))
            ->map(function (array $item): array {
                return [
                    'label' => trim((string) ($item['label'] ?? '')),
                    'rate' => (float) ($item['rate'] ?? 0),
                ];
            })
            ->filter(fn (array $item): bool => $item['label'] !== '')
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, rate: float, value: float}>
     */
    private function storedEmployeeCustomItems(mixed $customItems): array
    {
        if (! is_array($customItems)) {
            return [];
        }

        return collect($customItems)
            ->filter(fn (mixed $item): bool => is_array($item))
            ->map(function (array $item): array {
                return [
                    'label' => trim((string) ($item['label'] ?? '')),
                    'rate' => (float) ($item['rate'] ?? 0),
                    'value' => (float) ($item['value'] ?? 0),
                ];
            })
            ->filter(fn (array $item): bool => $item['label'] !== '' || $item['value'] > 0)
            ->values()
            ->all();
    }
}
