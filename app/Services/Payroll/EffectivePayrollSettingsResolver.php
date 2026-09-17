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

    public const DEFAULT_SALARY_AMOUNT_PERIOD = 'monthly';

    public const DEFAULT_PENSION_EMPLOYEE_RATE = 8.0;

    public const DEFAULT_PENSION_EMPLOYER_RATE = 10.0;

    public const DEFAULT_NHF_RATE = 2.5;

    public const DEFAULT_NHIS_EMPLOYEE_RATE = 5.0;

    public const DEFAULT_NHIS_EMPLOYER_RATE = 10.0;

    public const DEFAULT_NSITF_RATE = 1.0;

    public const DEFAULT_USE_STATUTORY_DEFAULT_RATES = true;

    public const DEFAULT_PAYE_CONSOLIDATED_RELIEF_PERCENTAGE = 20.0;

    public const DEFAULT_PAYE_CONSOLIDATED_RELIEF_MINIMUM = 200000.0;

    /** @var list<array{threshold: float, rate: float}> */
    public const DEFAULT_PAYE_TAX_BRACKETS = [
        ['threshold' => 300000, 'rate' => 7],
        ['threshold' => 600000, 'rate' => 11],
        ['threshold' => 1100000, 'rate' => 15],
        ['threshold' => 1600000, 'rate' => 19],
        ['threshold' => 3200000, 'rate' => 21],
        ['threshold' => PHP_FLOAT_MAX, 'rate' => 24],
    ];

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
            'salary_amount_period' => (string) ($settings?->salary_amount_period ?? self::DEFAULT_SALARY_AMOUNT_PERIOD),
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
            'paye_consolidated_relief_percentage' => (float) ($settings?->paye_consolidated_relief_percentage ?? self::DEFAULT_PAYE_CONSOLIDATED_RELIEF_PERCENTAGE),
            'paye_consolidated_relief_minimum' => (float) ($settings?->paye_consolidated_relief_minimum ?? self::DEFAULT_PAYE_CONSOLIDATED_RELIEF_MINIMUM),
            'paye_tax_brackets' => is_array($settings?->paye_tax_brackets) && count($settings->paye_tax_brackets) > 0 ? $settings->paye_tax_brackets : self::DEFAULT_PAYE_TAX_BRACKETS,
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
            'salary_amount_period' => (string) ($snapshot['salary_amount_period'] ?? self::DEFAULT_SALARY_AMOUNT_PERIOD),
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
            'paye_consolidated_relief_percentage' => (float) ($snapshot['paye_consolidated_relief_percentage'] ?? self::DEFAULT_PAYE_CONSOLIDATED_RELIEF_PERCENTAGE),
            'paye_consolidated_relief_minimum' => (float) ($snapshot['paye_consolidated_relief_minimum'] ?? self::DEFAULT_PAYE_CONSOLIDATED_RELIEF_MINIMUM),
            'paye_tax_brackets' => is_array($snapshot['paye_tax_brackets'] ?? null) && count($snapshot['paye_tax_brackets'] ?? []) > 0 ? $snapshot['paye_tax_brackets'] : self::DEFAULT_PAYE_TAX_BRACKETS,
        ];
    }
}
