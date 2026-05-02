<?php

namespace App\Services\Payroll;

use App\Models\PayrollSetting;
use App\Models\PayrollSettingVersion;
use Carbon\CarbonInterface;

class EffectivePayrollSettingsResolver
{
    /** @var list<string> */
    private const DEFAULT_ENABLED_DEDUCTIONS = ['pension', 'nhf', 'nhis', 'nsitf', 'paye'];

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
            'pension_employee_rate' => (float) ($settings?->pension_employee_rate ?? 8),
            'pension_employer_rate' => (float) ($settings?->pension_employer_rate ?? 10),
            'nhf_rate' => (float) ($settings?->nhf_rate ?? 2.5),
            'nhis_employee_rate' => (float) ($settings?->nhis_employee_rate ?? 5),
            'nhis_employer_rate' => (float) ($settings?->nhis_employer_rate ?? 10),
            'nsitf_rate' => (float) ($settings?->nsitf_rate ?? 1),
            'other_items' => is_array($settings?->other_items) ? $settings->other_items : [],
            'enabled_deductions' => is_array($settings?->enabled_deductions)
                ? $settings->enabled_deductions
                : self::DEFAULT_ENABLED_DEDUCTIONS,
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
            'pension_employee_rate' => (float) ($snapshot['pension_employee_rate'] ?? 8),
            'pension_employer_rate' => (float) ($snapshot['pension_employer_rate'] ?? 10),
            'nhf_rate' => (float) ($snapshot['nhf_rate'] ?? 2.5),
            'nhis_employee_rate' => (float) ($snapshot['nhis_employee_rate'] ?? 5),
            'nhis_employer_rate' => (float) ($snapshot['nhis_employer_rate'] ?? 10),
            'nsitf_rate' => (float) ($snapshot['nsitf_rate'] ?? 1),
            'other_items' => is_array($snapshot['other_items'] ?? null)
                ? $snapshot['other_items']
                : [],
            'enabled_deductions' => is_array($snapshot['enabled_deductions'] ?? null)
                ? array_values($snapshot['enabled_deductions'])
                : self::DEFAULT_ENABLED_DEDUCTIONS,
        ];
    }
}
