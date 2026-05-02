<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdatePayrollSettingsRequest;
use App\Models\PayrollSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PayrollSettingsController extends Controller
{
    /** @var list<string> */
    private const DEFAULT_ENABLED_DEDUCTIONS = ['pension', 'nhf', 'nhis', 'nsitf', 'paye'];

    public function edit(): Response
    {
        $settings = PayrollSetting::query()->where('profile', 'default')->first();

        return Inertia::render('settings/payroll', [
            'settings' => [
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
                'other_items' => $this->sanitizeOtherItems($settings?->other_items),
                'enabled_deductions' => $settings?->enabled_deductions ?? self::DEFAULT_ENABLED_DEDUCTIONS,
            ],
            'status' => session('status'),
        ]);
    }

    public function update(UpdatePayrollSettingsRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $payload = [
            'basic_salary_percentage' => $validated['basic_salary_percentage'],
            'housing_allowance_percentage' => $validated['housing_allowance_percentage'],
            'transport_allowance_percentage' => $validated['transport_allowance_percentage'],
            'other_allowance_percentage' => $validated['other_allowance_percentage'],
            'pension_employee_rate' => $validated['pension_employee_rate'],
            'pension_employer_rate' => $validated['pension_employer_rate'],
            'nhf_rate' => $validated['nhf_rate'],
            'nhis_employee_rate' => $validated['nhis_employee_rate'],
            'nhis_employer_rate' => $validated['nhis_employer_rate'],
            'nsitf_rate' => $validated['nsitf_rate'],
            'other_items' => $this->sanitizeOtherItems($validated['other_items'] ?? null),
            'enabled_deductions' => $validated['enabled_deductions'] ?? [],
        ];

        $settings = PayrollSetting::query()->firstOrNew(['profile' => 'default']);
        $settings->fill($payload);
        $settings->profile = 'default';
        $settings->save();

        return back()->with('status', 'payroll-settings-updated');
    }

    /**
     * @return array<int, array{label: string, rate: float}>
     */
    private function sanitizeOtherItems(mixed $otherItems): array
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
            ->filter(fn (array $item): bool => $item['label'] !== '' || $item['rate'] > 0)
            ->values()
            ->all();
    }
}
