<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\StorePayrollRunRequest;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\PayrollRun;
use App\Services\Payroll\EffectivePayrollSettingsResolver;
use App\Services\Payroll\PayrollCalculationService;
use App\Services\Payroll\PayrollFinalizationService;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PayrollController extends Controller
{
    public function __construct(
        private readonly EffectivePayrollSettingsResolver $settingsResolver,
        private readonly PayrollFinalizationService $payrollFinalizationService,
        private readonly PayrollCalculationService $calculationService,
    ) {}

    public function __invoke(): Response
    {
        /** @var Organization $organization */
        $organization = tenant();

        $settings = $this->settingsResolver->resolve(now(), 'default');
        $payrollRuns = PayrollRun::query()
            ->orderByDesc('period_month')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (PayrollRun $run): array => [
                'id' => $run->id,
                'periodMonth' => $run->period_month,
                'periodStart' => CarbonImmutable::parse((string) $run->period_start)->toDateString(),
                'periodEnd' => CarbonImmutable::parse((string) $run->period_end)->toDateString(),
                'status' => $run->status,
                'employeeCount' => $run->employee_count,
                'totalGrossSalary' => (float) $run->total_gross_salary,
                'totalDeductions' => (float) $run->total_deductions,
                'totalNetPay' => (float) $run->total_net_pay,
                'nhisEmployerContribution' => (float) data_get($run->settings_snapshot, 'computed_totals.nhis_employer_contribution', 0),
                'createdAt' => $run->created_at?->toIso8601String(),
                'finalizedAt' => $run->finalized_at?->toIso8601String(),
            ])
            ->all();

        return Inertia::render('payroll/index', [
            'organization' => [
                'name' => $organization->name,
                'domain' => $organization->domains()->value('domain'),
            ],
            'settingsSummary' => [
                'pensionEmployeeRate' => (float) ($settings['pension_employee_rate'] ?? 8),
                'pensionEmployerRate' => (float) ($settings['pension_employer_rate'] ?? 10),
                'nhfRate' => (float) ($settings['nhf_rate'] ?? 2.5),
                'nhisEmployeeRate' => (float) ($settings['nhis_employee_rate'] ?? 5),
                'nhisEmployerRate' => (float) ($settings['nhis_employer_rate'] ?? 10),
            ],
            'payrollRuns' => $payrollRuns,
            'status' => session('status'),
        ]);
    }

    public function store(StorePayrollRunRequest $request): RedirectResponse
    {
        $periodMonth = (string) $request->validated('period_month');

        if (PayrollRun::query()->where('period_month', $periodMonth)->exists()) {
            throw ValidationException::withMessages([
                'period_month' => 'A payroll run already exists for the selected month.',
            ]);
        }

        $periodStart = CarbonImmutable::createFromFormat('Y-m', $periodMonth)->startOfMonth();
        $periodEnd = $periodStart->endOfMonth();

        $employees = Employee::query()
            ->where('status', 'active')
            ->get();

        $settingsSnapshot = $this->settingsResolver->resolve($periodStart, 'default');

        // Use calculation service for accurate payroll calculations
        $employeeCalculations = $this->calculationService->calculateForEmployees($employees, $settingsSnapshot);
        $totals = $this->calculationService->calculateTotals($employeeCalculations);

        $nhisEmployerRate = (float) ($settingsSnapshot['nhis_employer_rate'] ?? EffectivePayrollSettingsResolver::DEFAULT_NHIS_EMPLOYER_RATE);
        $totalNhisEmployerContribution = (float) $employees->sum(function (Employee $employee) use ($nhisEmployerRate): float {
            if (! $employee->apply_nhis_deduction) {
                return 0;
            }

            return ((float) $employee->basic_salary * $nhisEmployerRate) / 100;
        });

        $settingsSnapshot['computed_totals'] = [
            'nhis_employer_rate' => $nhisEmployerRate,
            'nhis_employer_base' => 'basic_salary',
            'nhis_employer_contribution' => round($totalNhisEmployerContribution, 2),
            'employee_calculations' => $employeeCalculations,
        ];

        PayrollRun::query()->create([
            'period_month' => $periodMonth,
            'period_start' => $periodStart->toDateString(),
            'period_end' => $periodEnd->toDateString(),
            'status' => PayrollRun::STATUS_DRAFT,
            'employee_count' => $totals['employee_count'],
            'total_gross_salary' => $totals['total_gross_salary'],
            'total_deductions' => $totals['total_deductions'],
            'total_net_pay' => $totals['total_net_pay'],
            'settings_snapshot' => $settingsSnapshot,
            'created_by_user_id' => (string) $request->user()->id,
        ]);

        return redirect()
            ->route('tenant.payroll.index')
            ->with('status', 'payroll-run-created');
    }

    public function finalize(PayrollRun $payrollRun): RedirectResponse
    {
        /** @var Organization $organization */
        $organization = tenant();

        $decision = $this->payrollFinalizationService->evaluateBillingForFinalization($organization);

        if (! $decision->allowed) {
            return redirect()
                ->route('tenant.payroll.index')
                ->with('status', 'payroll-run-finalization-blocked');
        }

        if ($payrollRun->status === PayrollRun::STATUS_FINALIZED) {
            return redirect()
                ->route('tenant.payroll.index')
                ->with('status', 'payroll-run-already-finalized');
        }

        $payrollRun->update([
            'status' => PayrollRun::STATUS_FINALIZED,
            'finalized_at' => now(),
            'finalized_by_user_id' => request()->user()?->id,
        ]);

        return redirect()
            ->route('tenant.payroll.index')
            ->with('status', 'payroll-run-finalized');
    }
}
