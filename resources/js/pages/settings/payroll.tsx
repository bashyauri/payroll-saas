import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit, update } from '@/routes/payroll/settings';
import type { BreadcrumbItem } from '@/types';

type CustomItem = {
    label: string;
    category: 'allowance' | 'deduction';
    rate: number;
};

type DeductionKey = 'pension' | 'nhf' | 'nhis' | 'nsitf' | 'paye';

const DEDUCTION_OPTIONS: Array<{
    key: DeductionKey;
    label: string;
    description: string;
}> = [
    {
        key: 'paye',
        label: 'PAYE (Income Tax)',
        description: 'Pay As You Earn — statutory income tax deduction',
    },
    {
        key: 'pension',
        label: 'Pension',
        description: 'Employee & employer pension contributions (PFA)',
    },
    {
        key: 'nhf',
        label: 'NHF',
        description: 'National Housing Fund contribution',
    },
    {
        key: 'nhis',
        label: 'NHIS',
        description: 'National Health Insurance Scheme contributions',
    },
    {
        key: 'nsitf',
        label: 'NSITF',
        description: 'Nigeria Social Insurance Trust Fund — employer levy',
    },
];

type PayrollSettingsPageProps = {
    settings: {
        basic_salary_percentage: number;
        housing_allowance_percentage: number;
        transport_allowance_percentage: number;
        other_allowance_percentage: number;
        salary_input_mode: 'gross' | 'salary_elements';
        salary_amount_period: 'monthly' | 'annual';
        pension_employee_rate: number;
        pension_employer_rate: number;
        pension_contribution_base: 'basic' | 'basic_transport_housing';
        nhf_rate: number;
        nhf_contribution_base: 'basic' | 'gross';
        nhis_employee_rate: number;
        nhis_employer_rate: number;
        nsitf_rate: number;
        use_statutory_default_rates: boolean;
        other_items: CustomItem[];
        enabled_deductions: DeductionKey[];
        payroll_type: string | null;
        payroll_month: string | null;
        report_date: string | null;
        project_name: string | null;
        employer_tax_id: string | null;
        employer_pension_id: string | null;
        effective_from: string;
    };
    nextScheduledEffectiveFrom?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payroll settings',
        href: edit(),
    },
];

const MAX_CUSTOM_FIELDS = 5;

const STATUTORY_DEFAULTS = {
    pensionEmployeeRate: 8,
    pensionEmployerRate: 10,
    nhfRate: 2.5,
    nhisEmployeeRate: 5,
    nhisEmployerRate: 10,
    nsitfRate: 1,
} as const;

export default function PayrollSettings({
    settings,
    nextScheduledEffectiveFrom,
}: PayrollSettingsPageProps) {
    const [customItems, setCustomItems] = useState<CustomItem[]>(
        (settings.other_items ?? []).map((item) => ({
            ...item,
            category: item.category ?? 'deduction',
        })),
    );

    const [salaryInputMode, setSalaryInputMode] = useState<
        'gross' | 'salary_elements'
    >(settings.salary_input_mode ?? 'gross');

    const [salaryAmountPeriod, setSalaryAmountPeriod] = useState<
        'monthly' | 'annual'
    >(settings.salary_amount_period ?? 'monthly');

    const [useStatutoryDefaultRates, setUseStatutoryDefaultRates] =
        useState<boolean>(settings.use_statutory_default_rates ?? true);

    const [enabledDeductions, setEnabledDeductions] = useState<DeductionKey[]>(
        settings.enabled_deductions ?? [
            'pension',
            'nhf',
            'nhis',
            'nsitf',
            'paye',
        ],
    );

    const toggleDeduction = (key: DeductionKey): void => {
        setEnabledDeductions((current) =>
            current.includes(key)
                ? current.filter((d) => d !== key)
                : [...current, key],
        );
    };

    const addCustomItem = (): void => {
        setCustomItems((current) => {
            if (current.length >= MAX_CUSTOM_FIELDS) {
                return current;
            }

            return [...current, { label: '', category: 'deduction', rate: 0 }];
        });
    };

    const removeCustomItem = (index: number): void => {
        setCustomItems((current) => {
            return current.filter((_, itemIndex) => itemIndex !== index);
        });
    };

    const generateMonthOptions = () => {
        const options = [];
        const currentDate = new Date();
        
        // Generate options for current year and next year
        for (let year = currentDate.getFullYear(); year <= currentDate.getFullYear() + 1; year++) {
            for (let month = 0; month < 12; month++) {
                const date = new Date(year, month, 1);
                const value = `${year}-${String(month + 1).padStart(2, '0')}`;
                const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                
                // Show all months including past ones for settings
                options.push({ value, label });
            }
        }
        
        return options.sort((a, b) => a.value.localeCompare(b.value));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payroll settings" />

            <h1 className="sr-only">Payroll settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Payroll deductions and salary structure"
                        description="Configure default percentages used when preparing payroll."
                    />

                    <Alert>
                        <AlertTitle>Admin-only configuration</AlertTitle>
                        <AlertDescription>
                            Changes here affect payroll calculations for your
                            whole organization.
                        </AlertDescription>
                    </Alert>

                    {nextScheduledEffectiveFrom && (
                        <Alert>
                            <AlertTitle>Scheduled update pending</AlertTitle>
                            <AlertDescription>
                                A future payroll settings snapshot is scheduled
                                for {nextScheduledEffectiveFrom}.
                            </AlertDescription>
                        </Alert>
                    )}

                    <Form
                        {...update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-8"
                    >
                        {({ processing, errors }) => (
                            <>
                                <section className="space-y-4">
                                    <Heading
                                        variant="small"
                                        title="Payroll information"
                                        description="Organisation-level details used on payroll reports and remittance schedules."
                                    />

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="payroll_type">
                                                Payroll type
                                            </Label>
                                            <Input
                                                id="payroll_type"
                                                name="payroll_type"
                                                type="text"
                                                placeholder="e.g. Monthly"
                                                defaultValue={
                                                    settings.payroll_type ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.payroll_type}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="payroll_month">
                                                Payroll month
                                            </Label>
                                            <select
                                                id="payroll_month"
                                                name="payroll_month"
                                                defaultValue={settings.payroll_month ?? ''}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                            >
                                                <option value="">Select a month</option>
                                                {generateMonthOptions().map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError
                                                message={errors.payroll_month}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="report_date">
                                                Report date
                                            </Label>
                                            <Input
                                                id="report_date"
                                                name="report_date"
                                                type="date"
                                                defaultValue={
                                                    settings.report_date ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.report_date}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="project_name">
                                                Project name
                                            </Label>
                                            <Input
                                                id="project_name"
                                                name="project_name"
                                                type="text"
                                                placeholder="e.g. Head Office Payroll"
                                                defaultValue={
                                                    settings.project_name ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.project_name}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="employer_tax_id">
                                                Employer Tax ID (TIN)
                                            </Label>
                                            <Input
                                                id="employer_tax_id"
                                                name="employer_tax_id"
                                                type="text"
                                                placeholder="e.g. 1234567-0001"
                                                defaultValue={
                                                    settings.employer_tax_id ??
                                                    ''
                                                }
                                            />
                                            <InputError
                                                message={errors.employer_tax_id}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="employer_pension_id">
                                                Employer Pension ID
                                            </Label>
                                            <Input
                                                id="employer_pension_id"
                                                name="employer_pension_id"
                                                type="text"
                                                placeholder="e.g. PEN-00123456"
                                                defaultValue={
                                                    settings.employer_pension_id ??
                                                    ''
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.employer_pension_id
                                                }
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <Heading
                                        variant="small"
                                        title="When this takes effect"
                                        description="Use today's date for immediate updates, or a future date to schedule the change."
                                    />

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="effective_from">
                                                Effective from
                                            </Label>
                                            <Input
                                                id="effective_from"
                                                name="effective_from"
                                                type="date"
                                                defaultValue={
                                                    settings.effective_from
                                                }
                                            />
                                            <InputError
                                                message={errors.effective_from}
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <Heading
                                        variant="small"
                                        title="Salary structure"
                                        description="Set how salaries are captured and the percentage split for gross-to-allowance structure."
                                    />

                                    <div className="space-y-2">
                                        <Label>Salary entry mode</Label>
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <button
                                                type="button"
                                                className={`rounded-lg border p-3 text-left ${
                                                    salaryInputMode === 'gross'
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border'
                                                }`}
                                                onClick={() =>
                                                    setSalaryInputMode('gross')
                                                }
                                            >
                                                <p className="text-sm font-medium">
                                                    Monthly/annual gross
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Users enter gross salary,
                                                    and deductions can be
                                                    auto-calculated.
                                                </p>
                                            </button>
                                            <button
                                                type="button"
                                                className={`rounded-lg border p-3 text-left ${
                                                    salaryInputMode ===
                                                    'salary_elements'
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border'
                                                }`}
                                                onClick={() =>
                                                    setSalaryInputMode(
                                                        'salary_elements',
                                                    )
                                                }
                                            >
                                                <p className="text-sm font-medium">
                                                    Salary elements
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Users enter basic,
                                                    transport, housing and extra
                                                    income values.
                                                </p>
                                            </button>
                                        </div>
                                        <input
                                            type="hidden"
                                            name="salary_input_mode"
                                            value={salaryInputMode}
                                        />
                                        <InputError
                                            message={errors.salary_input_mode}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            Default salary amount period
                                        </Label>
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <button
                                                type="button"
                                                className={`rounded-lg border p-3 text-left ${
                                                    salaryAmountPeriod ===
                                                    'monthly'
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border'
                                                }`}
                                                onClick={() =>
                                                    setSalaryAmountPeriod(
                                                        'monthly',
                                                    )
                                                }
                                            >
                                                <p className="text-sm font-medium">
                                                    Monthly amounts
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Employee monthly inputs are
                                                    multiplied by 12 for annual
                                                    gross and remittance
                                                    calculations.
                                                </p>
                                            </button>
                                            <button
                                                type="button"
                                                className={`rounded-lg border p-3 text-left ${
                                                    salaryAmountPeriod ===
                                                    'annual'
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border'
                                                }`}
                                                onClick={() =>
                                                    setSalaryAmountPeriod(
                                                        'annual',
                                                    )
                                                }
                                            >
                                                <p className="text-sm font-medium">
                                                    Annual amounts
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Employee annual inputs are
                                                    divided by 12 for monthly
                                                    payroll processing.
                                                </p>
                                            </button>
                                        </div>
                                        <input
                                            type="hidden"
                                            name="salary_amount_period"
                                            value={salaryAmountPeriod}
                                        />
                                        <InputError
                                            message={
                                                errors.salary_amount_period
                                            }
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="basic_salary_percentage">
                                                Basic salary (%)
                                            </Label>
                                            <Input
                                                id="basic_salary_percentage"
                                                name="basic_salary_percentage"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                defaultValue={
                                                    settings.basic_salary_percentage
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.basic_salary_percentage
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="housing_allowance_percentage">
                                                Housing allowance (%)
                                            </Label>
                                            <Input
                                                id="housing_allowance_percentage"
                                                name="housing_allowance_percentage"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                defaultValue={
                                                    settings.housing_allowance_percentage
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.housing_allowance_percentage
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="transport_allowance_percentage">
                                                Transport allowance (%)
                                            </Label>
                                            <Input
                                                id="transport_allowance_percentage"
                                                name="transport_allowance_percentage"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                defaultValue={
                                                    settings.transport_allowance_percentage
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.transport_allowance_percentage
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="other_allowance_percentage">
                                                Other allowance (%)
                                            </Label>
                                            <Input
                                                id="other_allowance_percentage"
                                                name="other_allowance_percentage"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                defaultValue={
                                                    settings.other_allowance_percentage
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.other_allowance_percentage
                                                }
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <Heading
                                        variant="small"
                                        title="Active deductions"
                                        description="Set the organization default deduction policy. Individual employees can still be changed where policy exceptions are needed."
                                    />

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {DEDUCTION_OPTIONS.map((option) => (
                                            <div
                                                key={option.key}
                                                className="flex items-start gap-3 rounded-lg border p-3"
                                            >
                                                <Checkbox
                                                    id={`deduction_${option.key}`}
                                                    checked={enabledDeductions.includes(
                                                        option.key,
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleDeduction(
                                                            option.key,
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`enabled_deductions[]`}
                                                    value={option.key}
                                                    disabled={
                                                        !enabledDeductions.includes(
                                                            option.key,
                                                        )
                                                    }
                                                />
                                                <div className="grid gap-0.5">
                                                    <Label
                                                        htmlFor={`deduction_${option.key}`}
                                                        className="cursor-pointer font-medium"
                                                    >
                                                        {option.label}
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        {option.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <Heading
                                        variant="small"
                                        title="Statutory deductions"
                                        description="Configure deduction rates and the salary base used for pension/NHF calculations."
                                    />

                                    <div className="rounded-lg border p-4">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="use_statutory_default_rates"
                                                checked={
                                                    useStatutoryDefaultRates
                                                }
                                                onCheckedChange={(checked) =>
                                                    setUseStatutoryDefaultRates(
                                                        checked === true,
                                                    )
                                                }
                                            />
                                            <div className="grid gap-0.5">
                                                <Label
                                                    htmlFor="use_statutory_default_rates"
                                                    className="cursor-pointer font-medium"
                                                >
                                                    Use statutory default rates
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Keeps rates at Pension 8% /
                                                    10%, NHF 2.5%, NHIS 5% /
                                                    10%, and NSITF 1%.
                                                </p>
                                            </div>
                                        </div>
                                        <input
                                            type="hidden"
                                            name="use_statutory_default_rates"
                                            value={
                                                useStatutoryDefaultRates
                                                    ? '1'
                                                    : '0'
                                            }
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="pension_contribution_base">
                                                Pension contribution base
                                            </Label>
                                            <select
                                                id="pension_contribution_base"
                                                name="pension_contribution_base"
                                                defaultValue={
                                                    settings.pension_contribution_base
                                                }
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                            >
                                                <option value="basic_transport_housing">
                                                    Basic + transport + housing
                                                </option>
                                                <option value="basic">
                                                    Basic only
                                                </option>
                                            </select>
                                            <InputError
                                                message={
                                                    errors.pension_contribution_base
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="nhf_contribution_base">
                                                NHF contribution base
                                            </Label>
                                            <select
                                                id="nhf_contribution_base"
                                                name="nhf_contribution_base"
                                                defaultValue={
                                                    settings.nhf_contribution_base
                                                }
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                            >
                                                <option value="basic">
                                                    Basic only
                                                </option>
                                                <option value="gross">
                                                    Gross salary
                                                </option>
                                            </select>
                                            <InputError
                                                message={
                                                    errors.nhf_contribution_base
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="pension_employee_rate">
                                                Pension employee rate (%)
                                            </Label>
                                            <Input
                                                id="pension_employee_rate"
                                                name="pension_employee_rate"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                disabled={
                                                    useStatutoryDefaultRates
                                                }
                                                defaultValue={
                                                    useStatutoryDefaultRates
                                                        ? STATUTORY_DEFAULTS.pensionEmployeeRate
                                                        : settings.pension_employee_rate
                                                }
                                            />
                                            {useStatutoryDefaultRates && (
                                                <input
                                                    type="hidden"
                                                    name="pension_employee_rate"
                                                    value={
                                                        STATUTORY_DEFAULTS.pensionEmployeeRate
                                                    }
                                                />
                                            )}
                                            <InputError
                                                message={
                                                    errors.pension_employee_rate
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="pension_employer_rate">
                                                Pension employer rate (%)
                                            </Label>
                                            <Input
                                                id="pension_employer_rate"
                                                name="pension_employer_rate"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                disabled={
                                                    useStatutoryDefaultRates
                                                }
                                                defaultValue={
                                                    useStatutoryDefaultRates
                                                        ? STATUTORY_DEFAULTS.pensionEmployerRate
                                                        : settings.pension_employer_rate
                                                }
                                            />
                                            {useStatutoryDefaultRates && (
                                                <input
                                                    type="hidden"
                                                    name="pension_employer_rate"
                                                    value={
                                                        STATUTORY_DEFAULTS.pensionEmployerRate
                                                    }
                                                />
                                            )}
                                            <InputError
                                                message={
                                                    errors.pension_employer_rate
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="nhf_rate">
                                                NHF rate (%)
                                            </Label>
                                            <Input
                                                id="nhf_rate"
                                                name="nhf_rate"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                disabled={
                                                    useStatutoryDefaultRates
                                                }
                                                defaultValue={
                                                    useStatutoryDefaultRates
                                                        ? STATUTORY_DEFAULTS.nhfRate
                                                        : settings.nhf_rate
                                                }
                                            />
                                            {useStatutoryDefaultRates && (
                                                <input
                                                    type="hidden"
                                                    name="nhf_rate"
                                                    value={
                                                        STATUTORY_DEFAULTS.nhfRate
                                                    }
                                                />
                                            )}
                                            <InputError
                                                message={errors.nhf_rate}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="nhis_employee_rate">
                                                NHIS employee rate (%)
                                            </Label>
                                            <Input
                                                id="nhis_employee_rate"
                                                name="nhis_employee_rate"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                disabled={
                                                    useStatutoryDefaultRates
                                                }
                                                defaultValue={
                                                    useStatutoryDefaultRates
                                                        ? STATUTORY_DEFAULTS.nhisEmployeeRate
                                                        : settings.nhis_employee_rate
                                                }
                                            />
                                            {useStatutoryDefaultRates && (
                                                <input
                                                    type="hidden"
                                                    name="nhis_employee_rate"
                                                    value={
                                                        STATUTORY_DEFAULTS.nhisEmployeeRate
                                                    }
                                                />
                                            )}
                                            <InputError
                                                message={
                                                    errors.nhis_employee_rate
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="nhis_employer_rate">
                                                NHIS employer rate (%)
                                            </Label>
                                            <Input
                                                id="nhis_employer_rate"
                                                name="nhis_employer_rate"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                disabled={
                                                    useStatutoryDefaultRates
                                                }
                                                defaultValue={
                                                    useStatutoryDefaultRates
                                                        ? STATUTORY_DEFAULTS.nhisEmployerRate
                                                        : settings.nhis_employer_rate
                                                }
                                            />
                                            {useStatutoryDefaultRates && (
                                                <input
                                                    type="hidden"
                                                    name="nhis_employer_rate"
                                                    value={
                                                        STATUTORY_DEFAULTS.nhisEmployerRate
                                                    }
                                                />
                                            )}
                                            <InputError
                                                message={
                                                    errors.nhis_employer_rate
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="nsitf_rate">
                                                NSITF rate (%)
                                            </Label>
                                            <Input
                                                id="nsitf_rate"
                                                name="nsitf_rate"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                disabled={
                                                    useStatutoryDefaultRates
                                                }
                                                defaultValue={
                                                    useStatutoryDefaultRates
                                                        ? STATUTORY_DEFAULTS.nsitfRate
                                                        : settings.nsitf_rate
                                                }
                                            />
                                            {useStatutoryDefaultRates && (
                                                <input
                                                    type="hidden"
                                                    name="nsitf_rate"
                                                    value={
                                                        STATUTORY_DEFAULTS.nsitfRate
                                                    }
                                                />
                                            )}
                                            <InputError
                                                message={errors.nsitf_rate}
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <Heading
                                        variant="small"
                                        title="Optional payroll fields"
                                        description="Add optional allowance/income or deduction fields with percentage rates (maximum 5)."
                                    />

                                    <div className="space-y-4">
                                        {customItems.length === 0 && (
                                            <p className="text-sm text-muted-foreground">
                                                No custom percentage fields
                                                configured.
                                            </p>
                                        )}
                                        {customItems.map((item, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-[1fr_180px_160px]"
                                                >
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`other_items_${index}_label`}
                                                        >
                                                            Label
                                                        </Label>
                                                        <Input
                                                            id={`other_items_${index}_label`}
                                                            name={`other_items[${index}][label]`}
                                                            defaultValue={
                                                                item.label
                                                            }
                                                            placeholder="Union dues"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `other_items.${index}.label`
                                                                ]
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`other_items_${index}_category`}
                                                        >
                                                            Type
                                                        </Label>
                                                        <select
                                                            id={`other_items_${index}_category`}
                                                            name={`other_items[${index}][category]`}
                                                            defaultValue={
                                                                item.category
                                                            }
                                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                                        >
                                                            <option value="allowance">
                                                                Allowance/Income
                                                            </option>
                                                            <option value="deduction">
                                                                Deduction
                                                            </option>
                                                        </select>
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `other_items.${index}.category`
                                                                ]
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`other_items_${index}_rate`}
                                                        >
                                                            Rate (%)
                                                        </Label>
                                                        <Input
                                                            id={`other_items_${index}_rate`}
                                                            name={`other_items[${index}][rate]`}
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            max="100"
                                                            defaultValue={
                                                                item.rate
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `other_items.${index}.rate`
                                                                ]
                                                            }
                                                        />
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeCustomItem(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            Remove field
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addCustomItem}
                                        disabled={
                                            customItems.length >=
                                            MAX_CUSTOM_FIELDS
                                        }
                                    >
                                        Add custom field
                                    </Button>

                                    <InputError message={errors.other_items} />
                                </section>

                                <div className="flex items-center gap-4">
                                    <Button disabled={processing}>
                                        Save payroll settings
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
