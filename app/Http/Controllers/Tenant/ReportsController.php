<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Organization;
use App\Services\Payroll\EffectivePayrollSettingsResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportsController extends Controller
{
    public function __construct(
        private readonly EffectivePayrollSettingsResolver $settingsResolver,
    ) {}

    /** @var list<string> */
    private const ALLOWED_TYPES = ['pension', 'paye', 'bank', 'nhf', 'nhis', 'payroll-register', 'earnings', 'deductions', 'tax-liability', 'job-costing'];

    public function __invoke(Request $request): Response
    {
        /** @var Organization $organization */
        $organization = tenant();

        $type = (string) $request->query('type', 'pension');

        if (! in_array($type, self::ALLOWED_TYPES, true)) {
            $type = 'pension';
        }

        return Inertia::render('reports/index', [
            'organization' => [
                'name' => $organization->name,
                'domain' => $organization->domains()->value('domain'),
            ],
            'activeType' => $type,
            'reportOptions' => [
                [
                    'key' => 'payroll-register',
                    'label' => 'Payroll Register',
                    'description' => 'Master report showing gross pay, net pay, taxes, and deductions for all employees.',
                    'href' => '/reports/view?type=payroll-register',
                    'exportHref' => '/reports/export?type=payroll-register',
                ],
                [
                    'key' => 'earnings',
                    'label' => 'Earnings Report',
                    'description' => 'Breakdown of earnings including regular pay, overtime, bonuses, commission, and PTO.',
                    'href' => '/reports/view?type=earnings',
                    'exportHref' => '/reports/export?type=earnings',
                ],
                [
                    'key' => 'deductions',
                    'label' => 'Deductions Report',
                    'description' => 'Detailed breakdown of voluntary and involuntary deductions from employee pay.',
                    'href' => '/reports/view?type=deductions',
                    'exportHref' => '/reports/export?type=deductions',
                ],
                [
                    'key' => 'tax-liability',
                    'label' => 'Tax Liability Report',
                    'description' => 'State, local, and federal taxes withheld plus employer matching liabilities.',
                    'href' => '/reports/view?type=tax-liability',
                    'exportHref' => '/reports/export?type=tax-liability',
                ],
                [
                    'key' => 'job-costing',
                    'label' => 'Job Costing Report',
                    'description' => 'Payroll expenses broken down by department, project, location, or team.',
                    'href' => '/reports/view?type=job-costing',
                    'exportHref' => '/reports/export?type=job-costing',
                ],
                [
                    'key' => 'pension',
                    'label' => 'Pension Schedule',
                    'description' => 'Monthly pension schedule export.',
                    'href' => '/reports/view?type=pension',
                    'exportHref' => '/reports/export?type=pension',
                ],
                [
                    'key' => 'paye',
                    'label' => 'PAYE Remittance',
                    'description' => 'PAYE remittance report export.',
                    'href' => '/reports/view?type=paye',
                    'exportHref' => '/reports/export?type=paye',
                ],
                [
                    'key' => 'bank',
                    'label' => 'Bank Transfer Sheet',
                    'description' => 'Bank transfer-ready net pay sheet.',
                    'href' => '/reports/view?type=bank',
                    'exportHref' => '/reports/export?type=bank',
                ],
                [
                    'key' => 'nhf',
                    'label' => 'NHF Contribution',
                    'description' => 'National Housing Fund contribution report.',
                    'href' => '/reports/view?type=nhf',
                    'exportHref' => '/reports/export?type=nhf',
                ],
                [
                    'key' => 'nhis',
                    'label' => 'NHIS Contribution',
                    'description' => 'Employer contributes 10% and employee contributes 5% of basic salary.',
                    'href' => '/reports/view?type=nhis',
                    'exportHref' => '/reports/export?type=nhis',
                ],
            ],
        ]);
    }

    public function view(Request $request): Response
    {
        $type = (string) $request->query('type', 'pension');

        if (! in_array($type, self::ALLOWED_TYPES, true)) {
            $type = 'pension';
        }

        $organization = tenant();
        $employees = Employee::query()
            ->orderBy('last_name', 'asc')
            ->orderBy('first_name', 'asc')
            ->get();

        [$headers, $rows] = $this->buildReportRows($type, $employees);

        // Check if organization is in trial period
        $subscription = $organization->subscriptions()->latest()->first();
        $isTrial = $subscription && $subscription->trial_end_date && now()->lessThan($subscription->trial_end_date);

        $reportLabels = [
            'payroll-register' => 'Payroll Register',
            'earnings' => 'Earnings Report',
            'deductions' => 'Deductions Report',
            'tax-liability' => 'Tax Liability Report',
            'job-costing' => 'Job Costing Report',
            'pension' => 'Pension Schedule',
            'paye' => 'PAYE Remittance',
            'bank' => 'Bank Transfer Sheet',
            'nhf' => 'NHF Contribution',
            'nhis' => 'NHIS Contribution',
        ];

        return Inertia::render('reports/view', [
            'organization' => [
                'name' => $organization->name,
                'domain' => $organization->domains()->value('domain'),
            ],
            'reportType' => $type,
            'reportLabel' => $reportLabels[$type] ?? 'Report',
            'headers' => $headers,
            'rows' => $rows,
            'isTrial' => $isTrial,
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $type = (string) $request->query('type', 'pension');

        if (! in_array($type, self::ALLOWED_TYPES, true)) {
            abort(422, 'Unsupported report type.');
        }

        $employees = Employee::query()
            ->orderBy('last_name', 'asc')
            ->orderBy('first_name', 'asc')
            ->get();

        $fileName = sprintf(
            '%s-report-%s.csv',
            $type,
            now()->format('Ymd-His')
        );

        [$headers, $rows] = $this->buildReportRows($type, $employees);

        return response()->streamDownload(function () use ($headers, $rows): void {
            $output = fopen('php://output', 'w');

            if ($output === false) {
                return;
            }

            fputcsv($output, $headers);

            foreach ($rows as $row) {
                fputcsv($output, $row);
            }

            fclose($output);
        }, $fileName, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function exportPdf(Request $request): \Illuminate\Http\Response
    {
        $type = (string) $request->query('type', 'pension');

        if (! in_array($type, self::ALLOWED_TYPES, true)) {
            abort(422, 'Unsupported report type.');
        }

        $organization = tenant();
        $employees = Employee::query()
            ->orderBy('last_name', 'asc')
            ->orderBy('first_name', 'asc')
            ->get();

        [$headers, $rows] = $this->buildReportRows($type, $employees);

        $reportLabels = [
            'payroll-register' => 'Payroll Register',
            'earnings' => 'Earnings Report',
            'deductions' => 'Deductions Report',
            'tax-liability' => 'Tax Liability Report',
            'job-costing' => 'Job Costing Report',
            'pension' => 'Pension Schedule',
            'paye' => 'PAYE Remittance',
            'bank' => 'Bank Transfer Sheet',
            'nhf' => 'NHF Contribution',
            'nhis' => 'NHIS Contribution',
        ];

        $reportLabel = $reportLabels[$type] ?? 'Report';

        $pdf = \PDF::loadView('reports.pdf', [
            'organization' => $organization,
            'reportLabel' => $reportLabel,
            'headers' => $headers,
            'rows' => $rows,
            'generatedAt' => now()->format('F j, Y, g:i a'),
        ]);

        $fileName = sprintf(
            '%s-report-%s.pdf',
            $type,
            now()->format('Ymd-His')
        );

        return $pdf->download($fileName);
    }

    /**
     * @param  Collection<int, Employee>  $employees
     * @return array{0: list<string>, 1: list<list<string|float>>}
     */
    private function buildReportRows(string $type, $employees): array
    {
        $settings = $this->settingsResolver->resolve(now(), 'default');
        $nhisEmployerRate = (float) ($settings['nhis_employer_rate'] ?? EffectivePayrollSettingsResolver::DEFAULT_NHIS_EMPLOYER_RATE);

        // Payroll Register - Master report
        if ($type === 'payroll-register') {
            $headers = [
                'Employee Number',
                'Employee Name',
                'Department',
                'Job Title',
                'Gross Salary',
                'Basic Salary',
                'Housing Allowance',
                'Transport Allowance',
                'Other Allowance 1',
                'Other Allowance 2',
                'Total Earnings',
                'PAYE Tax',
                'Pension Deduction',
                'NHF Deduction',
                'NHIS Deduction',
                'NSITF Deduction',
                'Other Deductions',
                'Total Deductions',
                'Net Pay',
            ];
            $rows = $employees->map(function (Employee $employee): array {
                $totalEarnings = (float) $employee->basic_salary
                    + (float) $employee->housing_allowance
                    + (float) $employee->transport_allowance
                    + (float) ($employee->other_allowance_1 ?? 0)
                    + (float) ($employee->other_allowance_2 ?? 0);
                
                $totalDeductions = (float) $employee->monthly_tax_deduction
                    + (float) $employee->monthly_pension_deduction
                    + (float) $employee->monthly_nhf_deduction
                    + (float) ($employee->monthly_nhis_deduction ?? 0)
                    + (float) ($employee->monthly_nsitf_deduction ?? 0)
                    + (float) $employee->other_monthly_deductions;

                $netPay = (float) $employee->monthly_gross_salary - $totalDeductions;

                return [
                    $employee->employee_number,
                    trim($employee->first_name.' '.$employee->last_name),
                    (string) ($employee->department ?? ''),
                    (string) ($employee->job_title ?? ''),
                    (float) $employee->monthly_gross_salary,
                    (float) $employee->basic_salary,
                    (float) $employee->housing_allowance,
                    (float) $employee->transport_allowance,
                    (float) ($employee->other_allowance_1 ?? 0),
                    (float) ($employee->other_allowance_2 ?? 0),
                    $totalEarnings,
                    (float) $employee->monthly_tax_deduction,
                    (float) $employee->monthly_pension_deduction,
                    (float) $employee->monthly_nhf_deduction,
                    (float) ($employee->monthly_nhis_deduction ?? 0),
                    (float) ($employee->monthly_nsitf_deduction ?? 0),
                    (float) $employee->other_monthly_deductions,
                    $totalDeductions,
                    max($netPay, 0),
                ];
            })->all();

            return [$headers, $rows];
        }

        // Earnings Report
        if ($type === 'earnings') {
            $headers = [
                'Employee Number',
                'Employee Name',
                'Department',
                'Basic Salary',
                'Housing Allowance',
                'Transport Allowance',
                'Other Allowance 1',
                'Other Allowance 2',
                'Total Regular Pay',
                'Overtime Pay',
                'Bonus',
                'Commission',
                'PTO Pay',
                'Total Earnings',
            ];
            $rows = $employees->map(function (Employee $employee): array {
                $totalRegularPay = (float) $employee->basic_salary
                    + (float) $employee->housing_allowance
                    + (float) $employee->transport_allowance
                    + (float) ($employee->other_allowance_1 ?? 0)
                    + (float) ($employee->other_allowance_2 ?? 0);

                // Parse custom items for overtime, bonus, commission, PTO
                $customItems = $employee->custom_items ?? [];
                $overtimePay = 0;
                $bonus = 0;
                $commission = 0;
                $ptoPay = 0;

                foreach ($customItems as $item) {
                    if (isset($item['type']) && isset($item['amount'])) {
                        switch (strtolower($item['type'])) {
                            case 'overtime':
                                $overtimePay += (float) $item['amount'];
                                break;
                            case 'bonus':
                                $bonus += (float) $item['amount'];
                                break;
                            case 'commission':
                                $commission += (float) $item['amount'];
                                break;
                            case 'pto':
                                $ptoPay += (float) $item['amount'];
                                break;
                        }
                    }
                }

                $totalEarnings = $totalRegularPay + $overtimePay + $bonus + $commission + $ptoPay;

                return [
                    $employee->employee_number,
                    trim($employee->first_name.' '.$employee->last_name),
                    (string) ($employee->department ?? ''),
                    (float) $employee->basic_salary,
                    (float) $employee->housing_allowance,
                    (float) $employee->transport_allowance,
                    (float) ($employee->other_allowance_1 ?? 0),
                    (float) ($employee->other_allowance_2 ?? 0),
                    $totalRegularPay,
                    $overtimePay,
                    $bonus,
                    $commission,
                    $ptoPay,
                    $totalEarnings,
                ];
            })->all();

            return [$headers, $rows];
        }

        // Deductions Report
        if ($type === 'deductions') {
            $headers = [
                'Employee Number',
                'Employee Name',
                'Department',
                'PAYE Tax (Involuntary)',
                'Pension Deduction (Involuntary)',
                'NHF Deduction (Involuntary)',
                'NHIS Deduction (Involuntary)',
                'NSITF Deduction (Involuntary)',
                'Other Involuntary Deductions',
                'Total Involuntary Deductions',
                'Voluntary Deductions',
                'Total Deductions',
            ];
            $rows = $employees->map(function (Employee $employee): array {
                $totalInvoluntary = (float) $employee->monthly_tax_deduction
                    + (float) $employee->monthly_pension_deduction
                    + (float) $employee->monthly_nhf_deduction
                    + (float) ($employee->monthly_nhis_deduction ?? 0)
                    + (float) ($employee->monthly_nsitf_deduction ?? 0);

                // Parse custom items for voluntary deductions
                $customItems = $employee->custom_items ?? [];
                $voluntaryDeductions = 0;

                foreach ($customItems as $item) {
                    if (isset($item['type']) && isset($item['amount']) && isset($item['is_deduction']) && $item['is_deduction']) {
                        $voluntaryDeductions += (float) $item['amount'];
                    }
                }

                $totalDeductions = $totalInvoluntary + $voluntaryDeductions;

                return [
                    $employee->employee_number,
                    trim($employee->first_name.' '.$employee->last_name),
                    (string) ($employee->department ?? ''),
                    (float) $employee->monthly_tax_deduction,
                    (float) $employee->monthly_pension_deduction,
                    (float) $employee->monthly_nhf_deduction,
                    (float) ($employee->monthly_nhis_deduction ?? 0),
                    (float) ($employee->monthly_nsitf_deduction ?? 0),
                    0, // Other involuntary deductions - can be added later
                    $totalInvoluntary,
                    $voluntaryDeductions,
                    $totalDeductions,
                ];
            })->all();

            return [$headers, $rows];
        }

        // Tax Liability Report
        if ($type === 'tax-liability') {
            $headers = [
                'Employee Number',
                'Employee Name',
                'Tax Identification Number',
                'Gross Salary',
                'Federal Tax Withheld',
                'State Tax Withheld',
                'Local Tax Withheld',
                'Total Employee Tax',
                'Employer Federal Tax Match',
                'Employer State Tax Match',
                'Employer Local Tax Match',
                'Total Employer Liability',
                'Total Tax Liability',
            ];
            $rows = $employees->map(function (Employee $employee): array {
                // For now, all PAYE is treated as federal tax
                // This can be split later based on tax configuration
                $federalTax = (float) $employee->monthly_tax_deduction;
                $stateTax = 0;
                $localTax = 0;

                $totalEmployeeTax = $federalTax + $stateTax + $localTax;

                // Employer matching (typically 7.65% for Social Security + Medicare in US)
                // Adjust based on local tax laws
                $employerFederalMatch = $federalTax * 0.0765; // Example rate
                $employerStateMatch = $stateTax * 0.05; // Example rate
                $employerLocalMatch = $localTax * 0.02; // Example rate

                $totalEmployerLiability = $employerFederalMatch + $employerStateMatch + $employerLocalMatch;
                $totalTaxLiability = $totalEmployeeTax + $totalEmployerLiability;

                return [
                    $employee->employee_number,
                    trim($employee->first_name.' '.$employee->last_name),
                    (string) ($employee->tax_identification_number ?? ''),
                    (float) $employee->monthly_gross_salary,
                    $federalTax,
                    $stateTax,
                    $localTax,
                    $totalEmployeeTax,
                    round($employerFederalMatch, 2),
                    round($employerStateMatch, 2),
                    round($employerLocalMatch, 2),
                    round($totalEmployerLiability, 2),
                    round($totalTaxLiability, 2),
                ];
            })->all();

            return [$headers, $rows];
        }

        // Job Costing Report
        if ($type === 'job-costing') {
            $headers = [
                'Employee Number',
                'Employee Name',
                'Department',
                'Job Title',
                'Location',
                'Employment Type',
                'Gross Salary',
                'Total Cost (Gross + Benefits)',
                'Cost Per Department',
                'Cost Per Location',
            ];
            $rows = $employees->map(function (Employee $employee): array {
                // Calculate total cost including benefits (typically 1.2-1.3x gross salary)
                $benefitsMultiplier = 1.25;
                $totalCost = (float) $employee->monthly_gross_salary * $benefitsMultiplier;

                return [
                    $employee->employee_number,
                    trim($employee->first_name.' '.$employee->last_name),
                    (string) ($employee->department ?? 'Unassigned'),
                    (string) ($employee->job_title ?? ''),
                    (string) ($employee->location ?? 'Unassigned'),
                    (string) ($employee->employment_type ?? 'Full-time'),
                    (float) $employee->monthly_gross_salary,
                    round($totalCost, 2),
                    round($totalCost, 2), // Cost per department (same as total for individual)
                    round($totalCost, 2), // Cost per location (same as total for individual)
                ];
            })->all();

            return [$headers, $rows];
        }

        if ($type === 'pension') {
            $headers = ['Employee Number', 'Employee Name', 'PFA Name', 'Pension PIN', 'Gross Salary', 'Employee Pension Deduction'];
            $rows = $employees->map(fn (Employee $employee): array => [
                $employee->employee_number,
                trim($employee->first_name.' '.$employee->last_name),
                (string) ($employee->pfa_name ?? ''),
                (string) ($employee->pension_pin ?? ''),
                (float) $employee->monthly_gross_salary,
                (float) $employee->monthly_pension_deduction,
            ])->all();

            return [$headers, $rows];
        }

        if ($type === 'nhis') {
            $headers = ['Employee Number', 'Employee Name', 'Basic Salary', 'Employee NHIS Deduction', 'Employer NHIS Contribution'];
            $rows = $employees->map(function (Employee $employee) use ($nhisEmployerRate): array {
                $employerNhisContribution = $employee->apply_nhis_deduction
                    ? (((float) $employee->basic_salary * $nhisEmployerRate) / 100)
                    : 0;

                return [
                    $employee->employee_number,
                    trim($employee->first_name.' '.$employee->last_name),
                    (float) $employee->basic_salary,
                    (float) ($employee->monthly_nhis_deduction ?? 0),
                    round($employerNhisContribution, 2),
                ];
            })->all();

            return [$headers, $rows];
        }

        if ($type === 'paye') {
            $headers = ['Employee Number', 'Employee Name', 'Tax Identification Number', 'Gross Salary', 'PAYE Deduction'];
            $rows = $employees->map(fn (Employee $employee): array => [
                $employee->employee_number,
                trim($employee->first_name.' '.$employee->last_name),
                (string) ($employee->tax_identification_number ?? ''),
                (float) $employee->monthly_gross_salary,
                (float) $employee->monthly_tax_deduction,
            ])->all();

            return [$headers, $rows];
        }

        if ($type === 'nhf') {
            $headers = ['Employee Number', 'Employee Name', 'NHF Number', 'Gross Salary', 'NHF Deduction'];
            $rows = $employees->map(fn (Employee $employee): array => [
                $employee->employee_number,
                trim($employee->first_name.' '.$employee->last_name),
                (string) ($employee->nhf_number ?? ''),
                (float) $employee->monthly_gross_salary,
                (float) $employee->monthly_nhf_deduction,
            ])->all();

            return [$headers, $rows];
        }

        $headers = ['Employee Number', 'Employee Name', 'Bank Name', 'Account Name', 'Account Number', 'Net Pay'];
        $rows = $employees->map(function (Employee $employee): array {
            $netPay = (float) $employee->monthly_gross_salary
                - (float) $employee->monthly_tax_deduction
                - (float) $employee->monthly_pension_deduction
                - (float) $employee->monthly_nhf_deduction
                - (float) ($employee->monthly_nhis_deduction ?? 0)
                - (float) ($employee->monthly_nsitf_deduction ?? 0)
                - (float) $employee->other_monthly_deductions;

            return [
                $employee->employee_number,
                trim($employee->first_name.' '.$employee->last_name),
                (string) $employee->bank_name,
                (string) $employee->bank_account_name,
                (string) $employee->bank_account_number,
                max($netPay, 0),
            ];
        })->all();

        return [$headers, $rows];
    }
}
