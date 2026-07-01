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
    private const ALLOWED_TYPES = ['pension', 'paye', 'bank', 'nhf', 'nhis'];

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
                    'key' => 'pension',
                    'label' => 'Pension Schedule',
                    'description' => 'Monthly pension schedule export.',
                    'href' => '/reports?type=pension',
                    'exportHref' => '/reports/export?type=pension',
                ],
                [
                    'key' => 'paye',
                    'label' => 'PAYE Remittance',
                    'description' => 'PAYE remittance report export.',
                    'href' => '/reports?type=paye',
                    'exportHref' => '/reports/export?type=paye',
                ],
                [
                    'key' => 'bank',
                    'label' => 'Bank Transfer Sheet',
                    'description' => 'Bank transfer-ready net pay sheet.',
                    'href' => '/reports?type=bank',
                    'exportHref' => '/reports/export?type=bank',
                ],
                [
                    'key' => 'nhf',
                    'label' => 'NHF Contribution',
                    'description' => 'National Housing Fund contribution report.',
                    'href' => '/reports?type=nhf',
                    'exportHref' => '/reports/export?type=nhf',
                ],
                [
                    'key' => 'nhis',
                    'label' => 'NHIS Contribution',
                    'description' => 'Employer contributes 10% and employee contributes 5% of basic salary.',
                    'href' => '/reports?type=nhis',
                    'exportHref' => '/reports/export?type=nhis',
                ],
            ],
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

    /**
     * @param  Collection<int, Employee>  $employees
     * @return array{0: list<string>, 1: list<list<string|float>>}
     */
    private function buildReportRows(string $type, $employees): array
    {
        $settings = $this->settingsResolver->resolve(now(), 'default');
        $nhisEmployerRate = (float) ($settings['nhis_employer_rate'] ?? EffectivePayrollSettingsResolver::DEFAULT_NHIS_EMPLOYER_RATE);

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
