<?php

namespace App\Services\Payroll;

use App\Models\PayrollSetting;
use App\Models\PayrollSettingVersion;
use Carbon\CarbonInterface;

class EffectivePayrollSettingsResolver
{
    /** @var list<string> */
    private const DEFAULT_ENABLED_DEDUCTIONS = ['pension', 'nhf', 'nhis', 'nsitf', 'paye'];

    public const DEFAULT_SALARY_INPUT_MODE = 'gross';

    public const DEFAULT_PENSION_EMPLOYEE_RATE = 8.0;

    public const DEFAULT_PENSION_EMPLOYER_RATE = 10.0;

    public const DEFAULT_NHF_RATE = 2.5;

    public const DEFAULT_NHIS_EMPLOYEE_RATE = 5.0;

    public const DEFAULT_NHIS_EMPLOYER_RATE = 10.0;

    public const DEFAULT_NSITF_RATE = 1.0;

    public const DEFAULT_USE_STATUTORY_DEFAULT_RATES = true;

    public const DEFAULT_PENSION_CONTRIBUTION_BASE = 'basic_transport_housing';

    public const DEFAULT_NHF_CONTRIBUTION_BASE = 'basic';

    /**
     * @return array<string, mixed>
     */
    public function resolve(?CarbonInterface $forDate = null, string $profile = 'default'): array
    {
        $effectiveDate = ($forDate ?? now())->toDateString();

        $version = PayrollSettingVersion::query()
            ->where('profile', $profile)
            ->where('effective_from', '<=', $effectiveDate)
            ->orderByDesc('effective_from')
            ->orderByDesc('created_at')
            ->first();

        if ($version !== null && is_array($version->snapshot)) {
            return $this->normalizeSnapshot($version->snapshot);
        }

        $settings = PayrollSetting::query()->where('profile', $profile)->first();

        return $this->normalizeSnapshot([
            'basic_salary_percentage' => (float) ($settings?->basic_salary_percentage ?? 50),
            'housing_allowance_percentage' => (float) ($settings?->housing_allowance_percentage ?? 20),
            'transport_allowance_percentage' => (float) ($settings?->transport_allowance_percentage ?? 10),
            'other_allowance_percentage' => (float) ($settings?->other_allowance_percentage ?? 20),
            'salary_input_mode' => (string) ($settings?->salary_input_mode ?? self::DEFAULT_SALARY_INPUT_MODE),
            'pension_employee_rate' => (float) ($settings?->pension_employee_rate ?? self::DEFAULT_PENSION_EMPLOYEE_RATE),
            'pension_employer_rate' => (float) ($settings?->pension_employer_rate ?? self::DEFAULT_PENSION_EMPLOYER_RATE),
            'pension_contribution_base' => (string) ($settings?->pension_contribution_base ?? self::DEFAULT_PENSION_CONTRIBUTION_BASE),
            'nhf_rate' => (float) ($settings?->nhf_rate ?? self::DEFAULT_NHF_RATE),
            'nhf_contribution_base' => (string) ($settings?->nhf_contribution_base ?? self::DEFAULT_NHF_CONTRIBUTION_BASE),
            'nhis_employee_rate' => (float) ($settings?->nhis_employee_rate ?? self::DEFAULT_NHIS_EMPLOYEE_RATE),
            'nhis_employer_rate' => (float) ($settings?->nhis_employer_rate ?? self::DEFAULT_NHIS_EMPLOYER_RATE),
            'nsitf_rate' => (float) ($settings?->nsitf_rate ?? self::DEFAULT_NSITF_RATE),
            'use_statutory_default_rates' => (bool) ($settings?->use_statutory_default_rates ?? self::DEFAULT_USE_STATUTORY_DEFAULT_RATES),
            'other_items' => is_array($settings?->other_items) ? $settings->other_items : [],
            'enabled_deductions' => is_array($settings?->enabled_deductions)
                ? $settings->enabled_deductions
                : self::DEFAULT_ENABLED_DEDUCTIONS,
            'payroll_type' => $settings?->payroll_type ?? null,
            'payroll_month' => $settings?->payroll_month ?? null,
            'report_date' => $settings?->report_date !== null
                ? substr((string) $settings->getRawOriginal('report_date'), 0, 10)
                : null,
            'project_name' => $settings?->project_name ?? null,
            'employer_tax_id' => $settings?->employer_tax_id ?? null,
            'employer_pension_id' => $settings?->employer_pension_id ?? null,
        ]);
    }

    /**
     * @param  array<string, mixed>  $snapshot
     * @return array<string, mixed>
     */
    public function normalizeSnapshot(array $snapshot): array
    {
        return [
            'basic_salary_percentage' => (float) ($snapshot['basic_salary_percentage'] ?? 50),
            'housing_allowance_percentage' => (float) ($snapshot['housing_allowance_percentage'] ?? 20),
            'transport_allowance_percentage' => (float) ($snapshot['transport_allowance_percentage'] ?? 10),
            'other_allowance_percentage' => (float) ($snapshot['other_allowance_percentage'] ?? 20),
            'salary_input_mode' => (string) ($snapshot['salary_input_mode'] ?? self::DEFAULT_SALARY_INPUT_MODE),
            'pension_employee_rate' => (float) ($snapshot['pension_employee_rate'] ?? self::DEFAULT_PENSION_EMPLOYEE_RATE),
            'pension_employer_rate' => (float) ($snapshot['pension_employer_rate'] ?? self::DEFAULT_PENSION_EMPLOYER_RATE),
            'pension_contribution_base' => (string) ($snapshot['pension_contribution_base'] ?? self::DEFAULT_PENSION_CONTRIBUTION_BASE),
            'nhf_rate' => (float) ($snapshot['nhf_rate'] ?? self::DEFAULT_NHF_RATE),
            'nhf_contribution_base' => (string) ($snapshot['nhf_contribution_base'] ?? self::DEFAULT_NHF_CONTRIBUTION_BASE),
            'nhis_employee_rate' => (float) ($snapshot['nhis_employee_rate'] ?? self::DEFAULT_NHIS_EMPLOYEE_RATE),
            'nhis_employer_rate' => (float) ($snapshot['nhis_employer_rate'] ?? self::DEFAULT_NHIS_EMPLOYER_RATE),
            'nsitf_rate' => (float) ($snapshot['nsitf_rate'] ?? self::DEFAULT_NSITF_RATE),
            'use_statutory_default_rates' => (bool) ($snapshot['use_statutory_default_rates'] ?? self::DEFAULT_USE_STATUTORY_DEFAULT_RATES),
            'other_items' => is_array($snapshot['other_items'] ?? null)
                ? $snapshot['other_items']
                : [],
            'enabled_deductions' => is_array($snapshot['enabled_deductions'] ?? null)
                ? array_values($snapshot['enabled_deductions'])
                : self::DEFAULT_ENABLED_DEDUCTIONS,
            'payroll_type' => isset($snapshot['payroll_type']) ? (string) $snapshot['payroll_type'] : null,
            'payroll_month' => isset($snapshot['payroll_month']) ? (string) $snapshot['payroll_month'] : null,
            'report_date' => isset($snapshot['report_date']) ? (string) $snapshot['report_date'] : null,
            'project_name' => isset($snapshot['project_name']) ? (string) $snapshot['project_name'] : null,
            'employer_tax_id' => isset($snapshot['employer_tax_id']) ? (string) $snapshot['employer_tax_id'] : null,
            'employer_pension_id' => isset($snapshot['employer_pension_id']) ? (string) $snapshot['employer_pension_id'] : null,
        ];
    }
}
