<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Services\Payroll\EffectivePayrollSettingsResolver;
use Inertia\Inertia;
use Inertia\Response;

class PayrollController extends Controller
{
    public function __construct(private readonly EffectivePayrollSettingsResolver $settingsResolver) {}

    public function __invoke(): Response
    {
        /** @var Organization $organization */
        $organization = tenant();

        $settings = $this->settingsResolver->resolve(now(), 'default');

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
        ]);
    }
}
