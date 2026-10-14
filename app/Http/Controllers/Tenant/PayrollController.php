<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\StorePayrollRunRequest;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\PayrollRun;
use App\Models\User;
use App\Services\Payroll\EffectivePayrollSettingsResolver;
use App\Services\Payroll\PayrollCalculationService;
use App\Services\Payroll\PayrollFinalizationService;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

    public function __invoke(Request $request): Response
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
                'submittedAt' => $run->submitted_at?->toIso8601String(),
                'approvedAt' => $run->approved_at?->toIso8601String(),
                'finalizedAt' => $run->finalized_at?->toIso8601String(),
                'voidRequestedAt' => $run->void_requested_at?->toIso8601String(),
                'voidedAt' => $run->voided_at?->toIso8601String(),
            ])
            ->all();

        $currentUser = $request->user();
        $userRole = $this->getUserRole($currentUser, $organization);

        return Inertia::render('payroll/index', [
            'organization' => [
                'name' => $organization->name,
                'domain' => $organization->domains()->value('domain'),
            ],
            'userRole' => $userRole,
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

        if (PayrollRun::query()->where('period_month', $periodMonth)->where('status', '!=', PayrollRun::STATUS_VOIDED)->exists()) {
            throw ValidationException::withMessages([
                'period_month' => 'An active payroll run already exists for the selected month.',
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

        $user = $request->user();

        $settingsSnapshot['computed_totals'] = [
            'nhis_employer_rate' => $nhisEmployerRate,
            'nhis_employer_base' => 'basic_salary',
            'nhis_employer_contribution' => round($totalNhisEmployerContribution, 2),
            'employee_calculations' => $employeeCalculations,
            'total_pension_employer' => $totals['total_pension_employer'],
            'total_nhis_employer' => $totals['total_nhis_employer'],
        ];

        $settingsSnapshot['employee_overrides'] = [];
        $settingsSnapshot['paye_calculation_period'] = $settings['paye_calculation_period'] ?? 'annual';
        $settingsSnapshot['audit_trail'] = [
            [
                'action' => 'created',
                'user_id' => $user?->id,
                'user_name' => $user?->name ?? 'User',
                'user_email' => $user?->email,
                'timestamp' => now()->toIso8601String(),
                'notes' => 'Draft payroll run created.',
            ],
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
            'created_by_user_id' => (string) $user?->id,
        ]);

        return redirect()
            ->route('tenant.payroll.index')
            ->with('status', 'payroll-run-created');
    }

    public function show(Request $request, PayrollRun $payrollRun): Response
    {
        /** @var Organization $organization */
        $organization = tenant();
        $currentUser = $request->user();
        $userRole = $this->getUserRole($currentUser, $organization);

        $employeeCalculations = data_get($payrollRun->settings_snapshot, 'computed_totals.employee_calculations', []);
        $computedTotals = data_get($payrollRun->settings_snapshot, 'computed_totals', []);
        $auditTrail = data_get($payrollRun->settings_snapshot, 'audit_trail', []);

        // If employee calculations are not in the snapshot, recalculate them
        if (empty($employeeCalculations)) {
            $periodStart = CarbonImmutable::parse((string) $payrollRun->period_start);
            $employees = Employee::query()
                ->where('status', 'active')
                ->get();

            $settingsSnapshot = $this->settingsResolver->resolve($periodStart, 'default');
            $employeeOverrides = data_get($payrollRun->settings_snapshot, 'employee_overrides', []);
            $employeeCalculations = $this->calculationService->calculateForEmployees($employees, $settingsSnapshot, $employeeOverrides);
            $totals = $this->calculationService->calculateTotals($employeeCalculations);

            $nhisEmployerRate = (float) ($settingsSnapshot['nhis_employer_rate'] ?? EffectivePayrollSettingsResolver::DEFAULT_NHIS_EMPLOYER_RATE);
            $totalNhisEmployerContribution = (float) $employees->sum(function (Employee $employee) use ($nhisEmployerRate): float {
                if (! $employee->apply_nhis_deduction) {
                    return 0;
                }

                return ((float) $employee->basic_salary * $nhisEmployerRate) / 100;
            });

            $computedTotals = [
                'nhis_employer_rate' => $nhisEmployerRate,
                'nhis_employer_base' => 'basic_salary',
                'nhis_employer_contribution' => round($totalNhisEmployerContribution, 2),
                'total_pension_employer' => $totals['total_pension_employer'],
                'total_nhis_employer' => $totals['total_nhis_employer'],
            ];
        }

        return Inertia::render('payroll/show', [
            'payrollRun' => [
                'id' => $payrollRun->id,
                'periodMonth' => $payrollRun->period_month,
                'periodStart' => CarbonImmutable::parse((string) $payrollRun->period_start)->toDateString(),
                'periodEnd' => CarbonImmutable::parse((string) $payrollRun->period_end)->toDateString(),
                'status' => $payrollRun->status,
                'employeeCount' => $payrollRun->employee_count,
                'totalGrossSalary' => (float) $payrollRun->total_gross_salary,
                'totalDeductions' => (float) $payrollRun->total_deductions,
                'totalNetPay' => (float) $payrollRun->total_net_pay,
                'createdAt' => $payrollRun->created_at?->toIso8601String(),
                'submittedAt' => $payrollRun->submitted_at?->toIso8601String(),
                'approvedAt' => $payrollRun->approved_at?->toIso8601String(),
                'approvalNotes' => $payrollRun->approval_notes,
                'rejectedAt' => $payrollRun->rejected_at?->toIso8601String(),
                'rejectionReason' => $payrollRun->rejection_reason,
                'finalizedAt' => $payrollRun->finalized_at?->toIso8601String(),
                'voidRequestedAt' => $payrollRun->void_requested_at?->toIso8601String(),
                'voidReason' => $payrollRun->void_reason,
                'voidedAt' => $payrollRun->voided_at?->toIso8601String(),
                'voidApprovalNotes' => $payrollRun->void_approval_notes,
            ],
            'userRole' => $userRole,
            'auditTrail' => $auditTrail,
            'employeeCalculations' => array_values($employeeCalculations),
            'computedTotals' => [
                'nhisEmployerRate' => (float) ($computedTotals['nhis_employer_rate'] ?? 0),
                'nhisEmployerBase' => $computedTotals['nhis_employer_base'] ?? 'basic_salary',
                'nhisEmployerContribution' => (float) ($computedTotals['nhis_employer_contribution'] ?? 0),
                'totalPensionEmployer' => (float) ($computedTotals['total_pension_employer'] ?? 0),
                'totalNhisEmployer' => (float) ($computedTotals['total_nhis_employer'] ?? 0),
            ],
            'status' => session('status'),
        ]);
    }

    public function updateEmployeeCalculation(
        Request $request,
        PayrollRun $payrollRun,
        Employee $employee
    ): RedirectResponse {
        if ($payrollRun->status !== PayrollRun::STATUS_DRAFT) {
            return redirect()
                ->route('tenant.payroll.runs.show', $payrollRun)
                ->with('status', 'payroll-run-not-editable');
        }

        $validated = $request->validate([
            'gross_salary' => ['nullable', 'numeric', 'min:0'],
            'basic_salary' => ['nullable', 'numeric', 'min:0'],
            'housing_allowance' => ['nullable', 'numeric', 'min:0'],
            'transport_allowance' => ['nullable', 'numeric', 'min:0'],
            'other_allowance_1' => ['nullable', 'numeric', 'min:0'],
            'other_allowance_2' => ['nullable', 'numeric', 'min:0'],
            'other_deductions' => ['nullable', 'numeric', 'min:0'],
            'additional_payments' => ['nullable', 'array'],
            'additional_payments.*.name' => ['required_with:additional_payments', 'string', 'max:100'],
            'additional_payments.*.amount' => ['required_with:additional_payments', 'numeric', 'min:0'],
            'additional_payments.*.taxable' => ['nullable', 'boolean'],
            'additional_deductions' => ['nullable', 'array'],
            'additional_deductions.*.name' => ['required_with:additional_deductions', 'string', 'max:100'],
            'additional_deductions.*.amount' => ['required_with:additional_deductions', 'numeric', 'min:0'],
        ]);

        $settingsSnapshot = $payrollRun->settings_snapshot ?? [];
        $employeeOverrides = data_get($settingsSnapshot, 'employee_overrides', []);
        $employeeOverrides[$employee->id] = $validated;
        $settingsSnapshot['employee_overrides'] = $employeeOverrides;

        $periodStart = CarbonImmutable::parse((string) $payrollRun->period_start);
        $employees = Employee::query()->where('status', 'active')->get();

        $employeeCalculations = $this->calculationService->calculateForEmployees($employees, $settingsSnapshot, $employeeOverrides);
        $totals = $this->calculationService->calculateTotals($employeeCalculations);

        $nhisEmployerRate = (float) ($settingsSnapshot['nhis_employer_rate'] ?? EffectivePayrollSettingsResolver::DEFAULT_NHIS_EMPLOYER_RATE);
        $totalNhisEmployerContribution = (float) $employees->sum(function (Employee $emp) use ($nhisEmployerRate, $employeeOverrides): float {
            if (! $emp->apply_nhis_deduction) {
                return 0;
            }

            $baseBasic = isset($employeeOverrides[$emp->id]['basic_salary'])
                ? (float) $employeeOverrides[$emp->id]['basic_salary']
                : (float) $emp->basic_salary;

            return ($baseBasic * $nhisEmployerRate) / 100;
        });

        $settingsSnapshot['computed_totals'] = [
            'nhis_employer_rate' => $nhisEmployerRate,
            'nhis_employer_base' => 'basic_salary',
            'nhis_employer_contribution' => round($totalNhisEmployerContribution, 2),
            'employee_calculations' => $employeeCalculations,
            'total_pension_employer' => $totals['total_pension_employer'],
            'total_nhis_employer' => $totals['total_nhis_employer'],
        ];

        $user = $request->user();
        $auditTrail = data_get($settingsSnapshot, 'audit_trail', []);
        $auditTrail[] = [
            'action' => 'employee_adjusted',
            'user_id' => $user?->id,
            'user_name' => $user?->name ?? 'User',
            'user_email' => $user?->email,
            'timestamp' => now()->toIso8601String(),
            'notes' => sprintf('Adjusted pay and inclusions for %s %s.', $employee->first_name, $employee->last_name),
        ];
        $settingsSnapshot['audit_trail'] = $auditTrail;

        $payrollRun->update([
            'employee_count' => $totals['employee_count'],
            'total_gross_salary' => $totals['total_gross_salary'],
            'total_deductions' => $totals['total_deductions'],
            'total_net_pay' => $totals['total_net_pay'],
            'settings_snapshot' => $settingsSnapshot,
        ]);

        return redirect()
            ->route('tenant.payroll.runs.show', $payrollRun)
            ->with('status', 'payroll-employee-updated');
    }

    public function recalculate(PayrollRun $payrollRun): RedirectResponse
    {
        if ($payrollRun->status !== PayrollRun::STATUS_DRAFT) {
            return redirect()
                ->route('tenant.payroll.runs.show', $payrollRun)
                ->with('status', 'payroll-run-not-editable');
        }

        $periodStart = CarbonImmutable::parse((string) $payrollRun->period_start);
        $employees = Employee::query()
            ->where('status', 'active')
            ->get();

        $settingsSnapshot = $this->settingsResolver->resolve($periodStart, 'default');
        $employeeOverrides = data_get($payrollRun->settings_snapshot, 'employee_overrides', []);
        $settingsSnapshot['employee_overrides'] = $employeeOverrides;

        // Recalculate with current employee data and preserved overrides
        $employeeCalculations = $this->calculationService->calculateForEmployees($employees, $settingsSnapshot, $employeeOverrides);
        $totals = $this->calculationService->calculateTotals($employeeCalculations);

        $nhisEmployerRate = (float) ($settingsSnapshot['nhis_employer_rate'] ?? EffectivePayrollSettingsResolver::DEFAULT_NHIS_EMPLOYER_RATE);
        $totalNhisEmployerContribution = (float) $employees->sum(function (Employee $emp) use ($nhisEmployerRate, $employeeOverrides): float {
            if (! $emp->apply_nhis_deduction) {
                return 0;
            }

            $baseBasic = isset($employeeOverrides[$emp->id]['basic_salary'])
                ? (float) $employeeOverrides[$emp->id]['basic_salary']
                : (float) $emp->basic_salary;

            return ($baseBasic * $nhisEmployerRate) / 100;
        });

        $settingsSnapshot['computed_totals'] = [
            'nhis_employer_rate' => $nhisEmployerRate,
            'nhis_employer_base' => 'basic_salary',
            'nhis_employer_contribution' => round($totalNhisEmployerContribution, 2),
            'employee_calculations' => $employeeCalculations,
            'total_pension_employer' => $totals['total_pension_employer'],
            'total_nhis_employer' => $totals['total_nhis_employer'],
        ];

        $settingsSnapshot['paye_calculation_period'] = $settingsSnapshot['paye_calculation_period'] ?? 'annual';

        $user = request()->user();
        $auditTrail = data_get($payrollRun->settings_snapshot, 'audit_trail', []);
        $auditTrail[] = [
            'action' => 'recalculated',
            'user_id' => $user?->id,
            'user_name' => $user?->name ?? 'User',
            'user_email' => $user?->email,
            'timestamp' => now()->toIso8601String(),
            'notes' => 'Recalculated payroll calculations.',
        ];
        $settingsSnapshot['audit_trail'] = $auditTrail;

        $payrollRun->update([
            'employee_count' => $totals['employee_count'],
            'total_gross_salary' => $totals['total_gross_salary'],
            'total_deductions' => $totals['total_deductions'],
            'total_net_pay' => $totals['total_net_pay'],
            'settings_snapshot' => $settingsSnapshot,
        ]);

        return redirect()
            ->route('tenant.payroll.runs.show', $payrollRun)
            ->with('status', 'payroll-run-recalculated');
    }

    public function submitApproval(Request $request, PayrollRun $payrollRun): RedirectResponse
    {
        if ($payrollRun->status !== PayrollRun::STATUS_DRAFT) {
            return redirect()
                ->route('tenant.payroll.runs.show', $payrollRun)
                ->with('status', 'payroll-run-not-submittable');
        }

        $user = $request->user();
        $settingsSnapshot = $payrollRun->settings_snapshot ?? [];
        $auditTrail = data_get($settingsSnapshot, 'audit_trail', []);
        $auditTrail[] = [
            'action' => 'submitted_for_approval',
            'user_id' => $user?->id,
            'user_name' => $user?->name ?? 'User',
            'user_email' => $user?->email,
            'timestamp' => now()->toIso8601String(),
            'notes' => 'Submitted payroll run for approval.',
        ];
        $settingsSnapshot['audit_trail'] = $auditTrail;

        $payrollRun->update([
            'status' => PayrollRun::STATUS_PENDING_APPROVAL,
            'submitted_at' => now(),
            'submitted_by_user_id' => (string) $user?->id,
            'settings_snapshot' => $settingsSnapshot,
        ]);

        return redirect()
            ->route('tenant.payroll.runs.show', $payrollRun)
            ->with('status', 'payroll-run-submitted');
    }

    public function approve(Request $request, PayrollRun $payrollRun): RedirectResponse
    {
        if ($payrollRun->status !== PayrollRun::STATUS_PENDING_APPROVAL) {
            return redirect()
                ->route('tenant.payroll.runs.show', $payrollRun)
                ->with('status', 'payroll-run-not-pending-approval');
        }

        $notes = (string) $request->input('notes', '');
        $user = $request->user();
        $settingsSnapshot = $payrollRun->settings_snapshot ?? [];
        $auditTrail = data_get($settingsSnapshot, 'audit_trail', []);
        $auditTrail[] = [
            'action' => 'approved',
            'user_id' => $user?->id,
            'user_name' => $user?->name ?? 'User',
            'user_email' => $user?->email,
            'timestamp' => now()->toIso8601String(),
            'notes' => $notes !== '' ? 'Approved payroll run. Notes: '.$notes : 'Approved payroll run.',
        ];
        $settingsSnapshot['audit_trail'] = $auditTrail;

        $payrollRun->update([
            'status' => PayrollRun::STATUS_APPROVED,
            'approved_at' => now(),
            'approved_by_user_id' => (string) $user?->id,
            'approval_notes' => $notes ?: null,
            'settings_snapshot' => $settingsSnapshot,
        ]);

        return redirect()
            ->route('tenant.payroll.runs.show', $payrollRun)
            ->with('status', 'payroll-run-approved');
    }

    public function reject(Request $request, PayrollRun $payrollRun): RedirectResponse
    {
        if ($payrollRun->status !== PayrollRun::STATUS_PENDING_APPROVAL) {
            return redirect()
                ->route('tenant.payroll.runs.show', $payrollRun)
                ->with('status', 'payroll-run-not-pending-approval');
        }

        $validated = $request->validate([
            'reason' => ['required', 'string', 'min:3', 'max:1000'],
        ]);

        $reason = $validated['reason'];
        $user = $request->user();
        $settingsSnapshot = $payrollRun->settings_snapshot ?? [];
        $auditTrail = data_get($settingsSnapshot, 'audit_trail', []);
        $auditTrail[] = [
            'action' => 'rejected',
            'user_id' => $user?->id,
            'user_name' => $user?->name ?? 'User',
            'user_email' => $user?->email,
            'timestamp' => now()->toIso8601String(),
            'notes' => 'Rejected payroll run and sent back to draft. Reason: '.$reason,
        ];
        $settingsSnapshot['audit_trail'] = $auditTrail;

        $payrollRun->update([
            'status' => PayrollRun::STATUS_DRAFT,
            'rejected_at' => now(),
            'rejected_by_user_id' => (string) $user?->id,
            'rejection_reason' => $reason,
            'settings_snapshot' => $settingsSnapshot,
        ]);

        return redirect()
            ->route('tenant.payroll.runs.show', $payrollRun)
            ->with('status', 'payroll-run-rejected');
    }

    public function finalize(PayrollRun $payrollRun): RedirectResponse
    {
        /** @var Organization $organization */
        $organization = tenant();

        $decision = $this->payrollFinalizationService->evaluateBillingForFinalization($organization);

        if (! $decision->allowed) {
            return redirect()
                ->route('tenant.payroll.runs.show', $payrollRun)
                ->with('status', 'payroll-run-finalization-blocked');
        }

        if ($payrollRun->status === PayrollRun::STATUS_FINALIZED) {
            return redirect()
                ->route('tenant.payroll.runs.show', $payrollRun)
                ->with('status', 'payroll-run-already-finalized');
        }

        $user = request()->user();
        $userRole = $this->getUserRole($user, $organization);

        // Can finalize if approved OR if user is owner finalizing directly
        if ($payrollRun->status !== PayrollRun::STATUS_APPROVED && $payrollRun->status !== PayrollRun::STATUS_DRAFT) {
            return redirect()
                ->route('tenant.payroll.runs.show', $payrollRun)
                ->with('status', 'payroll-run-must-be-approved');
        }

        $settingsSnapshot = $payrollRun->settings_snapshot ?? [];
        $auditTrail = data_get($settingsSnapshot, 'audit_trail', []);
        $auditTrail[] = [
            'action' => 'finalized',
            'user_id' => $user?->id,
            'user_name' => $user?->name ?? 'User',
            'user_email' => $user?->email,
            'timestamp' => now()->toIso8601String(),
            'notes' => 'Finalized payroll run.',
        ];
        $settingsSnapshot['audit_trail'] = $auditTrail;

        $payrollRun->update([
            'status' => PayrollRun::STATUS_FINALIZED,
            'finalized_at' => now(),
            'finalized_by_user_id' => (string) $user?->id,
            'settings_snapshot' => $settingsSnapshot,
        ]);

        return redirect()
            ->route('tenant.payroll.runs.show', $payrollRun)
            ->with('status', 'payroll-run-finalized');
    }

    public function requestVoid(Request $request, PayrollRun $payrollRun): RedirectResponse
    {
        if ($payrollRun->status !== PayrollRun::STATUS_FINALIZED) {
            return redirect()
                ->route('tenant.payroll.runs.show', $payrollRun)
                ->with('status', 'payroll-run-cannot-be-voided');
        }

        $validated = $request->validate([
            'reason' => ['required', 'string', 'min:5', 'max:1000'],
        ]);

        $reason = $validated['reason'];
        $user = $request->user();
        $settingsSnapshot = $payrollRun->settings_snapshot ?? [];
        $auditTrail = data_get($settingsSnapshot, 'audit_trail', []);
        $auditTrail[] = [
            'action' => 'void_requested',
            'user_id' => $user?->id,
            'user_name' => $user?->name ?? 'User',
            'user_email' => $user?->email,
            'timestamp' => now()->toIso8601String(),
            'notes' => 'Void requested. Reason: '.$reason,
        ];
        $settingsSnapshot['audit_trail'] = $auditTrail;

        $payrollRun->update([
            'status' => PayrollRun::STATUS_VOID_REQUESTED,
            'void_requested_at' => now(),
            'void_requested_by_user_id' => (string) $user?->id,
            'void_reason' => $reason,
            'settings_snapshot' => $settingsSnapshot,
        ]);

        return redirect()
            ->route('tenant.payroll.runs.show', $payrollRun)
            ->with('status', 'payroll-run-void-requested');
    }

    public function approveVoid(Request $request, PayrollRun $payrollRun): RedirectResponse
    {
        /** @var Organization $organization */
        $organization = tenant();
        $user = $request->user();
        $userRole = $this->getUserRole($user, $organization);

        if ($userRole !== 'owner') {
            abort(403, 'Only the organization owner can approve or execute voiding of a payroll.');
        }

        if (! in_array($payrollRun->status, [PayrollRun::STATUS_VOID_REQUESTED, PayrollRun::STATUS_FINALIZED], true)) {
            return redirect()
                ->route('tenant.payroll.runs.show', $payrollRun)
                ->with('status', 'payroll-run-invalid-void-state');
        }

        $reason = (string) $request->input('reason', $payrollRun->void_reason ?? '');
        if ($payrollRun->status === PayrollRun::STATUS_FINALIZED && empty($reason)) {
            $validated = $request->validate([
                'reason' => ['required', 'string', 'min:5', 'max:1000'],
            ]);
            $reason = $validated['reason'];
        }

        $notes = (string) $request->input('notes', '');
        $settingsSnapshot = $payrollRun->settings_snapshot ?? [];
        $auditTrail = data_get($settingsSnapshot, 'audit_trail', []);
        $auditTrail[] = [
            'action' => 'voided',
            'user_id' => $user?->id,
            'user_name' => $user?->name ?? 'Owner',
            'user_email' => $user?->email,
            'timestamp' => now()->toIso8601String(),
            'notes' => 'Payroll voided. Reason: '.$reason.($notes ? ' | Notes: '.$notes : ''),
        ];
        $settingsSnapshot['audit_trail'] = $auditTrail;

        $payrollRun->update([
            'status' => PayrollRun::STATUS_VOIDED,
            'void_reason' => $reason ?: $payrollRun->void_reason,
            'voided_at' => now(),
            'voided_by_user_id' => (string) $user?->id,
            'void_approval_notes' => $notes ?: null,
            'settings_snapshot' => $settingsSnapshot,
        ]);

        return redirect()
            ->route('tenant.payroll.runs.show', $payrollRun)
            ->with('status', 'payroll-run-voided');
    }

    public function rejectVoid(Request $request, PayrollRun $payrollRun): RedirectResponse
    {
        /** @var Organization $organization */
        $organization = tenant();
        $user = $request->user();
        $userRole = $this->getUserRole($user, $organization);

        if ($userRole !== 'owner') {
            abort(403, 'Only the organization owner can reject a void request.');
        }

        if ($payrollRun->status !== PayrollRun::STATUS_VOID_REQUESTED) {
            return redirect()
                ->route('tenant.payroll.runs.show', $payrollRun)
                ->with('status', 'payroll-run-not-in-void-requested-state');
        }

        $notes = (string) $request->input('notes', 'Void request declined by owner.');
        $settingsSnapshot = $payrollRun->settings_snapshot ?? [];
        $auditTrail = data_get($settingsSnapshot, 'audit_trail', []);
        $auditTrail[] = [
            'action' => 'void_rejected',
            'user_id' => $user?->id,
            'user_name' => $user?->name ?? 'Owner',
            'user_email' => $user?->email,
            'timestamp' => now()->toIso8601String(),
            'notes' => 'Void request rejected by owner. Restored to finalized status. Notes: '.$notes,
        ];
        $settingsSnapshot['audit_trail'] = $auditTrail;

        $payrollRun->update([
            'status' => PayrollRun::STATUS_FINALIZED,
            'void_requested_at' => null,
            'void_requested_by_user_id' => null,
            'settings_snapshot' => $settingsSnapshot,
        ]);

        return redirect()
            ->route('tenant.payroll.runs.show', $payrollRun)
            ->with('status', 'payroll-run-void-rejected');
    }

    private function getUserRole(?User $user, Organization $organization): string
    {
        if (! $user) {
            return 'member';
        }

        return (string) ($user->organizations()
            ->whereKey($organization->id)
            ->value('role') ?? 'member');
    }
}
