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
                'pension_employee_rate' => $settings['pension_employee_rate'],
                'pension_employer_rate' => $settings['pension_employer_rate'],
                'nhf_rate' => $settings['nhf_rate'],
                'nhis_employee_rate' => $settings['nhis_employee_rate'],
                'nhis_employer_rate' => $settings['nhis_employer_rate'],
                'nsitf_rate' => $settings['nsitf_rate'],
                'other_items' => $this->sanitizeOtherItems($settings['other_items'] ?? null),
                'enabled_deductions' => $settings['enabled_deductions'],
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

        $snapshot = [
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
