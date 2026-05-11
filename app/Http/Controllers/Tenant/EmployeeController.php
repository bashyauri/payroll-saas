<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\StoreEmployeeRequest;
use App\Http\Requests\Tenant\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\Organization;
use App\Services\Employee\EmployeeLimitService;
use App\Services\Payroll\EffectivePayrollSettingsResolver;
use DateTimeInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function __construct(
        private readonly EmployeeLimitService $employeeLimitService,
        private readonly EffectivePayrollSettingsResolver $settingsResolver,
    ) {}

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
        $settings = $this->settingsResolver->resolve(now(), 'default');

        return Inertia::render('employees/create', [
            ...$this->employeeFormProps($employeeUsage, $settings),
            'employee' => null,
        ]);
    }

    public function edit(Employee $employee): Response
    {
        $organization = $this->resolveOrganization();
        $employeeUsage = $this->employeeLimitService->usage($organization);
        $settings = $this->settingsResolver->resolve(now(), 'default');
        $salaryAmountPeriod = (string) ($employee->salary_amount_period
            ?? ($settings['salary_amount_period'] ?? EffectivePayrollSettingsResolver::DEFAULT_SALARY_AMOUNT_PERIOD));
        $salaryAmountMultiplier = $salaryAmountPeriod === 'annual' ? 12 : 1;

        return Inertia::render('employees/create', [
            ...$this->employeeFormProps($employeeUsage, $settings),
            'employee' => [
                'id' => $employee->id,
                'employee_number' => $employee->employee_number,
                'first_name' => $employee->first_name,
                'last_name' => $employee->last_name,
                'middle_name' => $employee->middle_name,
                'work_email' => $employee->work_email,
                'phone' => $employee->phone,
                'nin' => $employee->nin,
                'bvn' => $employee->bvn,
                'tax_identification_number' => $employee->tax_identification_number,
                'pension_pin' => $employee->pension_pin,
                'pfa_name' => $employee->pfa_name,
                'nhis_number' => $employee->nhis_number,
                'nhf_number' => $employee->nhf_number,
                'bank_name' => $employee->bank_name,
                'bank_account_name' => $employee->bank_account_name,
                'bank_account_number' => $employee->bank_account_number,
                'salary_amount_period' => $salaryAmountPeriod,
                'monthly_gross_salary' => (float) $employee->monthly_gross_salary * $salaryAmountMultiplier,
                'annual_gross_salary' => $employee->annual_gross_salary !== null ? (float) $employee->annual_gross_salary : null,
                'salary_input_mode' => $employee->salary_input_mode,
                'basic_salary' => $employee->basic_salary !== null ? (float) $employee->basic_salary * $salaryAmountMultiplier : null,
                'housing_allowance' => $employee->housing_allowance !== null ? (float) $employee->housing_allowance * $salaryAmountMultiplier : null,
                'transport_allowance' => $employee->transport_allowance !== null ? (float) $employee->transport_allowance * $salaryAmountMultiplier : null,
                'monthly_tax_deduction' => (float) $employee->monthly_tax_deduction,
                'apply_paye_deduction' => (bool) ($employee->apply_paye_deduction ?? true),
                'monthly_pension_deduction' => (float) $employee->monthly_pension_deduction,
                'apply_pension_deduction' => (bool) ($employee->apply_pension_deduction ?? true),
                'monthly_nhf_deduction' => (float) $employee->monthly_nhf_deduction,
                'apply_nhf_deduction' => (bool) ($employee->apply_nhf_deduction ?? true),
                'other_monthly_deductions' => (float) $employee->other_monthly_deductions,
                'other_allowance_1' => $employee->other_allowance_1 !== null ? (float) $employee->other_allowance_1 * $salaryAmountMultiplier : null,
                'other_allowance_2' => $employee->other_allowance_2 !== null ? (float) $employee->other_allowance_2 * $salaryAmountMultiplier : null,
                'total_salary' => $employee->total_salary !== null ? (float) $employee->total_salary : null,
                'personal_life_insurance' => $employee->personal_life_insurance !== null ? (float) $employee->personal_life_insurance : null,
                'rent_relief' => $employee->rent_relief !== null ? (float) $employee->rent_relief : null,
                'custom_items' => $this->storedEmployeeCustomItems($employee->custom_items),
                'department' => $employee->department,
                'job_title' => $employee->job_title,
                'location' => $employee->location,
                'date_of_birth' => $employee->date_of_birth instanceof DateTimeInterface
                    ? $employee->date_of_birth->format('Y-m-d')
                    : null,
                'employment_type' => $employee->employment_type,
                'hire_date' => $employee->hire_date instanceof DateTimeInterface
                    ? $employee->hire_date->format('Y-m-d')
                    : null,
                'exit_date' => $employee->exit_date instanceof DateTimeInterface
                    ? $employee->exit_date->format('Y-m-d')
                    : null,
                'status' => $employee->status,
            ],
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

        $validated = $request->validated();
        $settings = $this->settingsResolver->resolve(now(), 'default');
        $validated = $this->normalizeCompensationPayload($validated, $settings);
        $validated = $this->applyDeductionToggleOverrides($validated, $settings);
        $validated['custom_items'] = $this->storedEmployeeCustomItems($validated['custom_items'] ?? null);

        Employee::query()->create($validated);

        return redirect()
            ->route('tenant.employees.index')
            ->with('status', 'employee-created');
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee): RedirectResponse
    {
        $validated = $request->validated();
        $settings = $this->settingsResolver->resolve(now(), 'default');
        $validated = $this->normalizeCompensationPayload($validated, $settings);
        $validated = $this->applyDeductionToggleOverrides($validated, $settings);
        $validated['custom_items'] = $this->storedEmployeeCustomItems($validated['custom_items'] ?? null);

        $employee->update($validated);

        return redirect()
            ->route('tenant.employees.show', $employee)
            ->with('status', 'employee-updated');
    }

    private function resolveOrganization(): Organization
    {
        /** @var Organization $organization */
        $organization = tenant();

        return $organization;
    }

    /**
     * @param  array<string, mixed>  $employeeUsage
     * @param  array<string, mixed>  $settings
     * @return array<string, mixed>
     */
    private function employeeFormProps(array $employeeUsage, array $settings): array
    {
        return [
            'employeeCount' => $employeeUsage['employeeCount'],
            'employeeLimit' => $employeeUsage['employeeLimit'],
            'remainingSlots' => $employeeUsage['remainingSlots'],
            'canCreateEmployee' => ! $employeeUsage['isAtEmployeeLimit'],
            'payrollCustomFields' => $this->configuredPayrollCustomFields($settings['other_items'] ?? null),
            'payrollRates' => [
                'pensionEmployeeRate' => (float) ($settings['pension_employee_rate'] ?? 8),
                'nhfRate' => (float) ($settings['nhf_rate'] ?? 2.5),
                'nhisEmployeeRate' => (float) ($settings['nhis_employee_rate'] ?? 1.75),
                'nsitfRate' => (float) ($settings['nsitf_rate'] ?? 1),
            ],
            'salaryComputation' => [
                'salaryInputMode' => (string) ($settings['salary_input_mode'] ?? EffectivePayrollSettingsResolver::DEFAULT_SALARY_INPUT_MODE),
                'salaryAmountPeriod' => (string) ($settings['salary_amount_period'] ?? EffectivePayrollSettingsResolver::DEFAULT_SALARY_AMOUNT_PERIOD),
                'basicSalaryPercentage' => (float) ($settings['basic_salary_percentage'] ?? 50),
                'housingAllowancePercentage' => (float) ($settings['housing_allowance_percentage'] ?? 20),
                'transportAllowancePercentage' => (float) ($settings['transport_allowance_percentage'] ?? 10),
                'pensionContributionBase' => (string) ($settings['pension_contribution_base'] ?? EffectivePayrollSettingsResolver::DEFAULT_PENSION_CONTRIBUTION_BASE),
                'nhfContributionBase' => (string) ($settings['nhf_contribution_base'] ?? EffectivePayrollSettingsResolver::DEFAULT_NHF_CONTRIBUTION_BASE),
            ],
            'enabledDeductions' => $settings['enabled_deductions'] ?? ['pension', 'nhf', 'nhis', 'nsitf', 'paye'],
            'status' => session('status'),
        ];
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function applyDeductionToggleOverrides(array $payload, array $settings): array
    {
        $orgDeductionDefaults = is_array($settings['enabled_deductions'] ?? null)
            ? $settings['enabled_deductions']
            : ['pension', 'nhf', 'nhis', 'nsitf', 'paye'];

        $payload['apply_paye_deduction'] = (bool) ($payload['apply_paye_deduction'] ?? in_array('paye', $orgDeductionDefaults, true));
        $payload['apply_pension_deduction'] = (bool) ($payload['apply_pension_deduction'] ?? in_array('pension', $orgDeductionDefaults, true));
        $payload['apply_nhf_deduction'] = (bool) ($payload['apply_nhf_deduction'] ?? in_array('nhf', $orgDeductionDefaults, true));

        if (! $payload['apply_paye_deduction']) {
            $payload['monthly_tax_deduction'] = 0;
        }

        if (! $payload['apply_pension_deduction']) {
            $payload['monthly_pension_deduction'] = 0;
        }

        if (! $payload['apply_nhf_deduction']) {
            $payload['monthly_nhf_deduction'] = 0;
        }

        return $payload;
    }

    /**
     * @param  array<string, mixed>  $payload
     * @param  array<string, mixed>  $settings
     * @return array<string, mixed>
     */
    private function normalizeCompensationPayload(array $payload, array $settings): array
    {
        $salaryInputMode = (string) ($payload['salary_input_mode'] ?? $settings['salary_input_mode'] ?? EffectivePayrollSettingsResolver::DEFAULT_SALARY_INPUT_MODE);
        $salaryAmountPeriod = (string) ($payload['salary_amount_period'] ?? $settings['salary_amount_period'] ?? EffectivePayrollSettingsResolver::DEFAULT_SALARY_AMOUNT_PERIOD);
        $multiplier = $salaryAmountPeriod === 'annual' ? 12 : 1;

        $basicSalary = $this->normalizeAmount($payload['basic_salary'] ?? null, $multiplier);
        $housingAllowance = $this->normalizeAmount($payload['housing_allowance'] ?? null, $multiplier);
        $transportAllowance = $this->normalizeAmount($payload['transport_allowance'] ?? null, $multiplier);
        $otherAllowanceOne = $this->normalizeAmount($payload['other_allowance_1'] ?? null, $multiplier);
        $otherAllowanceTwo = $this->normalizeAmount($payload['other_allowance_2'] ?? null, $multiplier);

        if ($salaryInputMode === 'salary_elements') {
            $monthlyGrossSalary = $basicSalary + $housingAllowance + $transportAllowance + $otherAllowanceOne + $otherAllowanceTwo;
        } else {
            $submittedMonthlyGross = (float) ($payload['monthly_gross_salary'] ?? 0);
            $submittedAnnualGross = (float) ($payload['annual_gross_salary'] ?? 0);
            $monthlyGrossSalary = $salaryAmountPeriod === 'annual'
                ? ($submittedAnnualGross / 12)
                : $submittedMonthlyGross;

            $basicSalary = ($monthlyGrossSalary * (float) ($settings['basic_salary_percentage'] ?? 50)) / 100;
            $housingAllowance = ($monthlyGrossSalary * (float) ($settings['housing_allowance_percentage'] ?? 20)) / 100;
            $transportAllowance = ($monthlyGrossSalary * (float) ($settings['transport_allowance_percentage'] ?? 10)) / 100;
            $otherAllowanceOne = 0;
            $otherAllowanceTwo = 0;
        }

        $payload['salary_input_mode'] = $salaryInputMode;
        $payload['salary_amount_period'] = $salaryAmountPeriod;
        $payload['monthly_gross_salary'] = round($monthlyGrossSalary, 2);
        $payload['annual_gross_salary'] = round($monthlyGrossSalary * 12, 2);
        $payload['basic_salary'] = round($basicSalary, 2);
        $payload['housing_allowance'] = round($housingAllowance, 2);
        $payload['transport_allowance'] = round($transportAllowance, 2);
        $payload['other_allowance_1'] = round($otherAllowanceOne, 2);
        $payload['other_allowance_2'] = round($otherAllowanceTwo, 2);

        return $payload;
    }

    private function normalizeAmount(mixed $value, int $multiplier): float
    {
        if ($value === null || $value === '') {
            return 0.0;
        }

        return round(((float) $value) / $multiplier, 2);
    }

    /**
     * @return array<int, array{label: string, category: string, rate: float}>
     */
    private function configuredPayrollCustomFields(mixed $otherItems): array
    {
        if (! is_array($otherItems)) {
            return [];
        }

        return collect($otherItems)
            ->filter(fn (mixed $item): bool => is_array($item))
            ->map(function (array $item): array {
                $category = (string) ($item['category'] ?? 'deduction');

                return [
                    'label' => trim((string) ($item['label'] ?? '')),
                    'category' => in_array($category, ['allowance', 'deduction'], true) ? $category : 'deduction',
                    'rate' => (float) ($item['rate'] ?? 0),
                ];
            })
            ->filter(fn (array $item): bool => $item['label'] !== '')
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, category: string, rate: float, value: float}>
     */
    private function storedEmployeeCustomItems(mixed $customItems): array
    {
        if (! is_array($customItems)) {
            return [];
        }

        return collect($customItems)
            ->filter(fn (mixed $item): bool => is_array($item))
            ->map(function (array $item): array {
                $category = (string) ($item['category'] ?? 'deduction');

                return [
                    'label' => trim((string) ($item['label'] ?? '')),
                    'category' => in_array($category, ['allowance', 'deduction'], true) ? $category : 'deduction',
                    'rate' => (float) ($item['rate'] ?? 0),
                    'value' => (float) ($item['value'] ?? 0),
                ];
            })
            ->filter(fn (array $item): bool => $item['label'] !== '' || $item['value'] > 0)
            ->values()
            ->all();
    }
}
