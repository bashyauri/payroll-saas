<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdatePayrollSettingsRequest;
use App\Models\PayrollSetting;
use App\Models\PayrollSettingVersion;
use App\Services\Payroll\EffectivePayrollSettingsResolver;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PayrollSettingsController extends Controller
{
    public function __construct(private readonly EffectivePayrollSettingsResolver $settingsResolver) {}

    public function edit(): Response
    {
        $settings = $this->settingsResolver->resolve(now(), 'default');
        $nextScheduledVersion = PayrollSettingVersion::query()
            ->where('profile', 'default')
            ->where('effective_from', '>', now()->toDateString())
            ->orderBy('effective_from', 'asc')
            ->first();

        return Inertia::render('settings/payroll', [
            'settings' => [
                'basic_salary_percentage' => $settings['basic_salary_percentage'],
                'housing_allowance_percentage' => $settings['housing_allowance_percentage'],
                'transport_allowance_percentage' => $settings['transport_allowance_percentage'],
                'other_allowance_percentage' => $settings['other_allowance_percentage'],
                'salary_input_mode' => $settings['salary_input_mode'],
                'pension_employee_rate' => $settings['pension_employee_rate'],
                'pension_employer_rate' => $settings['pension_employer_rate'],
                'pension_contribution_base' => $settings['pension_contribution_base'],
                'nhf_rate' => $settings['nhf_rate'],
                'nhf_contribution_base' => $settings['nhf_contribution_base'],
                'nhis_employee_rate' => $settings['nhis_employee_rate'],
                'nhis_employer_rate' => $settings['nhis_employer_rate'],
                'nsitf_rate' => $settings['nsitf_rate'],
                'use_statutory_default_rates' => $settings['use_statutory_default_rates'],
                'other_items' => $this->sanitizeOtherItems($settings['other_items'] ?? null),
                'enabled_deductions' => $settings['enabled_deductions'],
                'payroll_type' => $settings['payroll_type'],
                'payroll_month' => $settings['payroll_month'],
                'report_date' => $settings['report_date'],
                'project_name' => $settings['project_name'],
                'employer_tax_id' => $settings['employer_tax_id'],
                'employer_pension_id' => $settings['employer_pension_id'],
                'effective_from' => now()->toDateString(),
            ],
            'nextScheduledEffectiveFrom' => $nextScheduledVersion
                ? substr((string) $nextScheduledVersion->getRawOriginal('effective_from'), 0, 10)
                : null,
            'status' => session('status'),
        ]);
    }

    public function update(UpdatePayrollSettingsRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $effectiveFrom = isset($validated['effective_from'])
            ? Carbon::parse($validated['effective_from'])->startOfDay()
            : now()->startOfDay();

        $useStatutoryDefaultRates = (bool) ($validated['use_statutory_default_rates'] ?? true);

        $pensionEmployeeRate = $useStatutoryDefaultRates
            ? EffectivePayrollSettingsResolver::DEFAULT_PENSION_EMPLOYEE_RATE
            : (float) $validated['pension_employee_rate'];

        $pensionEmployerRate = $useStatutoryDefaultRates
            ? EffectivePayrollSettingsResolver::DEFAULT_PENSION_EMPLOYER_RATE
            : (float) $validated['pension_employer_rate'];

        $nhfRate = $useStatutoryDefaultRates
            ? EffectivePayrollSettingsResolver::DEFAULT_NHF_RATE
            : (float) $validated['nhf_rate'];

        $nhisEmployeeRate = $useStatutoryDefaultRates
            ? EffectivePayrollSettingsResolver::DEFAULT_NHIS_EMPLOYEE_RATE
            : (float) $validated['nhis_employee_rate'];

        $nhisEmployerRate = $useStatutoryDefaultRates
            ? EffectivePayrollSettingsResolver::DEFAULT_NHIS_EMPLOYER_RATE
            : (float) $validated['nhis_employer_rate'];

        $nsitfRate = $useStatutoryDefaultRates
            ? EffectivePayrollSettingsResolver::DEFAULT_NSITF_RATE
            : (float) $validated['nsitf_rate'];

        $snapshot = [
            'basic_salary_percentage' => $validated['basic_salary_percentage'],
            'housing_allowance_percentage' => $validated['housing_allowance_percentage'],
            'transport_allowance_percentage' => $validated['transport_allowance_percentage'],
            'other_allowance_percentage' => $validated['other_allowance_percentage'],
            'salary_input_mode' => $validated['salary_input_mode'],
            'pension_employee_rate' => $pensionEmployeeRate,
            'pension_employer_rate' => $pensionEmployerRate,
            'pension_contribution_base' => $validated['pension_contribution_base'],
            'nhf_rate' => $nhfRate,
            'nhf_contribution_base' => $validated['nhf_contribution_base'],
            'nhis_employee_rate' => $nhisEmployeeRate,
            'nhis_employer_rate' => $nhisEmployerRate,
            'nsitf_rate' => $nsitfRate,
            'use_statutory_default_rates' => $useStatutoryDefaultRates,
            'other_items' => $this->sanitizeOtherItems($validated['other_items'] ?? null),
            'enabled_deductions' => $validated['enabled_deductions'] ?? [],
            'payroll_type' => $validated['payroll_type'] ?? null,
            'payroll_month' => $validated['payroll_month'] ?? null,
            'report_date' => $validated['report_date'] ?? null,
            'project_name' => $validated['project_name'] ?? null,
            'employer_tax_id' => $validated['employer_tax_id'] ?? null,
            'employer_pension_id' => $validated['employer_pension_id'] ?? null,
        ];

        DB::transaction(function () use ($request, $snapshot, $effectiveFrom): void {
            PayrollSettingVersion::query()->create([
                'profile' => 'default',
                'effective_from' => $effectiveFrom->toDateString(),
                'snapshot' => $snapshot,
                'updated_by_user_id' => $request->user()?->id,
            ]);

            if ($effectiveFrom->lessThanOrEqualTo(now()->startOfDay())) {
                $settings = PayrollSetting::query()->firstOrNew(['profile' => 'default']);
                $settings->fill($snapshot);
                $settings->profile = 'default';
                $settings->save();
            }
        });

        return back()->with('status', 'payroll-settings-updated');
    }

    /**
     * @return array<int, array{label: string, category: string, rate: float}>
     */
    private function sanitizeOtherItems(mixed $otherItems): array
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
            ->filter(fn (array $item): bool => $item['label'] !== '' || $item['rate'] > 0)
            ->values()
            ->all();
    }
}
