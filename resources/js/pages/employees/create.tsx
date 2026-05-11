import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { plans as billingPlans } from '@/routes/billing';
import { create, index } from '@/routes/tenant/employees';
import type { BreadcrumbItem } from '@/types';

export default function CreateEmployee({
    employeeCount,
    employeeLimit,
    remainingSlots,
    canCreateEmployee,
    payrollCustomFields,
    payrollRates,
    salaryComputation,
    enabledDeductions,
    employee,
}: {
    employeeCount: number;
    employeeLimit: number | null;
    remainingSlots: number | null;
    canCreateEmployee: boolean;
    payrollCustomFields: Array<{
        label: string;
        category: 'allowance' | 'deduction';
        rate: number;
    }>;
    payrollRates: {
        pensionEmployeeRate: number;
        nhfRate: number;
        nhisEmployeeRate: number;
        nsitfRate: number;
    };
    salaryComputation: {
        salaryInputMode: 'gross' | 'salary_elements';
        salaryAmountPeriod: 'monthly' | 'annual';
        basicSalaryPercentage: number;
        housingAllowancePercentage: number;
        transportAllowancePercentage: number;
        pensionContributionBase: 'basic' | 'basic_transport_housing';
        nhfContributionBase: 'basic' | 'gross';
    };
    enabledDeductions: string[];
    employee: null | {
        id: string;
        employee_number: string;
        first_name: string;
        last_name: string;
        middle_name: string | null;
        work_email: string | null;
        phone: string | null;
        nin: string | null;
        bvn: string | null;
        tax_identification_number: string | null;
        pension_pin: string | null;
        pfa_name: string | null;
        nhis_number: string | null;
        nhf_number: string | null;
        bank_name: string;
        bank_account_name: string;
        bank_account_number: string;
        salary_amount_period: 'monthly' | 'annual' | null;
        monthly_gross_salary: number;
        annual_gross_salary: number | null;
        salary_input_mode: string | null;
        basic_salary: number | null;
        housing_allowance: number | null;
        transport_allowance: number | null;
        monthly_tax_deduction: number;
        apply_paye_deduction: boolean;
        monthly_pension_deduction: number;
        apply_pension_deduction: boolean;
        monthly_nhf_deduction: number;
        apply_nhf_deduction: boolean;
        other_monthly_deductions: number;
        other_allowance_1: number | null;
        other_allowance_2: number | null;
        total_salary: number | null;
        personal_life_insurance: number | null;
        rent_relief: number | null;
        custom_items: Array<{
            label: string;
            category: 'allowance' | 'deduction';
            rate: number;
            value: number;
        }>;
        department: string | null;
        job_title: string | null;
        location: string | null;
        date_of_birth: string | null;
        employment_type:
            | 'full_time'
            | 'part_time'
            | 'contract'
            | 'temporary'
            | 'intern';
        hire_date: string | null;
        exit_date: string | null;
        status: 'active' | 'inactive';
    };
}) {
    const isEditMode = employee !== null;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Employees',
            href: index(),
        },
        {
            title: isEditMode ? 'Edit employee' : 'Add employee',
            href: isEditMode ? `/employees/${employee.id}/edit` : create(),
        },
    ];
    const orgDefaultPension = enabledDeductions.includes('pension');
    const orgDefaultNhf = enabledDeductions.includes('nhf');
    const orgDefaultPaye = enabledDeductions.includes('paye');
    const hasPension = true;
    const hasNhf = true;
    const hasNhis = enabledDeductions.includes('nhis');
    const hasNsitf = enabledDeductions.includes('nsitf');
    const hasPaye = true;
    const { auth } = usePage().props as {
        auth?: { organizationRole?: string | null };
    };
    const isOrganizationAdmin = auth?.organizationRole === 'admin';
    const initialSalaryInputMode =
        (employee?.salary_input_mode as 'gross' | 'salary_elements' | null) ??
        salaryComputation.salaryInputMode ??
        'gross';
    const initialSalaryAmountPeriod =
        employee?.salary_amount_period ??
        salaryComputation.salaryAmountPeriod ??
        'monthly';
    const displayAmount = (
        amount: number | null | undefined,
        period: 'monthly' | 'annual',
    ): string => {
        if (amount === null || amount === undefined) {
            return '';
        }

        return String(period === 'annual' ? amount * 12 : amount);
    };
    const [salaryEntryMode, setSalaryEntryMode] = useState<
        'gross' | 'salary_elements'
    >(initialSalaryInputMode);
    const [salaryAmountPeriod, setSalaryAmountPeriod] = useState<
        'monthly' | 'annual'
    >(initialSalaryAmountPeriod);
    const [grossSalary, setGrossSalary] = useState(
        initialSalaryAmountPeriod === 'annual'
            ? (employee?.annual_gross_salary?.toString() ?? '')
            : (employee?.monthly_gross_salary?.toString() ?? ''),
    );
    const [basicSalary, setBasicSalary] = useState(
        displayAmount(employee?.basic_salary, initialSalaryAmountPeriod),
    );
    const [housingAllowance, setHousingAllowance] = useState(
        displayAmount(employee?.housing_allowance, initialSalaryAmountPeriod),
    );
    const [transportAllowance, setTransportAllowance] = useState(
        displayAmount(employee?.transport_allowance, initialSalaryAmountPeriod),
    );
    const [otherAllowanceOne, setOtherAllowanceOne] = useState(
        displayAmount(employee?.other_allowance_1, initialSalaryAmountPeriod),
    );
    const [otherAllowanceTwo, setOtherAllowanceTwo] = useState(
        displayAmount(employee?.other_allowance_2, initialSalaryAmountPeriod),
    );
    const [pensionDeduction, setPensionDeduction] = useState(
        employee?.monthly_pension_deduction?.toString() ?? '',
    );
    const [nhfDeduction, setNhfDeduction] = useState(
        employee?.monthly_nhf_deduction?.toString() ?? '',
    );
    const [nhisDeduction, setNhisDeduction] = useState('');
    const [applyPayeDeduction, setApplyPayeDeduction] = useState(
        employee?.apply_paye_deduction ?? orgDefaultPaye,
    );
    const [applyPensionDeduction, setApplyPensionDeduction] = useState(
        employee?.apply_pension_deduction ?? orgDefaultPension,
    );
    const [applyNhfDeduction, setApplyNhfDeduction] = useState(
        employee?.apply_nhf_deduction ?? orgDefaultNhf,
    );
    const [hasTouchedCompensation, setHasTouchedCompensation] = useState(
        employee === null,
    );

    const toMonthlyAmount = (value: string): number => {
        const parsed = parseFloat(value || '0');

        if (Number.isNaN(parsed)) {
            return 0;
        }

        return salaryAmountPeriod === 'annual' ? parsed / 12 : parsed;
    };

    const monthlyBasicSalary = toMonthlyAmount(basicSalary);
    const monthlyHousingAllowance = toMonthlyAmount(housingAllowance);
    const monthlyTransportAllowance = toMonthlyAmount(transportAllowance);
    const monthlyOtherAllowanceOne = toMonthlyAmount(otherAllowanceOne);
    const monthlyOtherAllowanceTwo = toMonthlyAmount(otherAllowanceTwo);
    const monthlyGrossSalary =
        salaryEntryMode === 'salary_elements'
            ? monthlyBasicSalary +
              monthlyHousingAllowance +
              monthlyTransportAllowance +
              monthlyOtherAllowanceOne +
              monthlyOtherAllowanceTwo
            : toMonthlyAmount(grossSalary);
    const annualGrossSalary = monthlyGrossSalary * 12;
    const displayedAlternateGross =
        salaryAmountPeriod === 'annual'
            ? monthlyGrossSalary
            : annualGrossSalary;

    function recalculateDeductions(): void {
        const value = monthlyGrossSalary;

        if (!isNaN(value) && value > 0) {
            const basic =
                salaryEntryMode === 'salary_elements'
                    ? monthlyBasicSalary
                    : (value * salaryComputation.basicSalaryPercentage) / 100;

            const transport =
                salaryEntryMode === 'salary_elements'
                    ? monthlyTransportAllowance
                    : (value * salaryComputation.transportAllowancePercentage) /
                      100;

            const housing =
                salaryEntryMode === 'salary_elements'
                    ? monthlyHousingAllowance
                    : (value * salaryComputation.housingAllowancePercentage) /
                      100;

            const pensionBase =
                salaryComputation.pensionContributionBase ===
                'basic_transport_housing'
                    ? basic + transport + housing
                    : basic;

            const nhfBase =
                salaryComputation.nhfContributionBase === 'gross'
                    ? value
                    : basic;

            if (hasPension)
                setPensionDeduction(
                    (
                        (pensionBase * payrollRates.pensionEmployeeRate) /
                        100
                    ).toFixed(2),
                );
            if (hasNhf)
                setNhfDeduction(
                    ((nhfBase * payrollRates.nhfRate) / 100).toFixed(2),
                );
            if (hasNhis)
                setNhisDeduction(
                    ((value * payrollRates.nhisEmployeeRate) / 100).toFixed(2),
                );
        } else {
            setPensionDeduction('');
            setNhfDeduction('');
            setNhisDeduction('');
        }
    }

    useEffect(() => {
        if (!hasTouchedCompensation) {
            return;
        }

        recalculateDeductions();
    }, [
        hasTouchedCompensation,
        salaryEntryMode,
        salaryAmountPeriod,
        grossSalary,
        basicSalary,
        housingAllowance,
        transportAllowance,
        otherAllowanceOne,
        otherAllowanceTwo,
    ]);

    const switchSalaryAmountPeriod = (nextPeriod: 'monthly' | 'annual') => {
        if (salaryAmountPeriod === nextPeriod) {
            return;
        }

        const multiplier = nextPeriod === 'annual' ? 12 : 1 / 12;
        const convertValue = (value: string): string => {
            const parsed = parseFloat(value || '0');

            if (Number.isNaN(parsed) || parsed === 0) {
                return value;
            }

            return (parsed * multiplier).toFixed(2);
        };

        setSalaryAmountPeriod(nextPeriod);
        setHasTouchedCompensation(true);
        setGrossSalary(convertValue(grossSalary));
        setBasicSalary(convertValue(basicSalary));
        setHousingAllowance(convertValue(housingAllowance));
        setTransportAllowance(convertValue(transportAllowance));
        setOtherAllowanceOne(convertValue(otherAllowanceOne));
        setOtherAllowanceTwo(convertValue(otherAllowanceTwo));
    };

    const allowanceCustomFields = payrollCustomFields.filter(
        (field) => field.category === 'allowance',
    );

    const deductionCustomFields = payrollCustomFields.filter(
        (field) => field.category !== 'allowance',
    );

    const resolveCustomItemValue = (
        label: string,
        category: 'allowance' | 'deduction',
    ): string => {
        if (!employee) {
            return '';
        }

        const matchedItem = employee.custom_items.find(
            (item) => item.label === label && item.category === category,
        );

        return matchedItem ? String(matchedItem.value) : '';
    };

    const deductionDefaultMessage = (enabled: boolean): string => {
        return enabled ? 'Org default: enabled' : 'Org default: disabled';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditMode ? 'Edit employee' : 'Add employee'} />

            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 md:p-6">
                <Heading
                    title={isEditMode ? 'Edit employee' : 'Add employee'}
                    description="Capture payroll-ready employee data including Nigerian identifiers, bank details, salary, and deductions."
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Plan usage</CardTitle>
                        <CardDescription>
                            Current employees: {employeeCount} • Limit:{' '}
                            {employeeLimit ?? 'N/A'} • Remaining slots:{' '}
                            {remainingSlots ?? 'Unlimited'}
                        </CardDescription>
                    </CardHeader>
                </Card>

                {!canCreateEmployee && (
                    <Alert>
                        <AlertTitle>Employee limit reached</AlertTitle>
                        <AlertDescription>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <span>Upgrade to add more employees.</span>
                                <Button
                                    asChild
                                    size="sm"
                                    className="w-full sm:w-auto"
                                >
                                    <Link
                                        href={billingPlans({
                                            query: { upgrade: 1 },
                                        })}
                                    >
                                        Upgrade plan
                                    </Link>
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                <Form
                    action={
                        isEditMode ? `/employees/${employee.id}` : '/employees'
                    }
                    method={isEditMode ? 'patch' : 'post'}
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <InputError message={errors.employee_limit} />

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Identity
                                    </CardTitle>
                                    <CardDescription>
                                        Basic employee information used for
                                        payroll and statutory compliance.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="employee_number">
                                            Employee number
                                        </Label>
                                        <Input
                                            id="employee_number"
                                            name="employee_number"
                                            required
                                            placeholder="EMP-0001"
                                            defaultValue={
                                                employee?.employee_number ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.employee_number}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_name">
                                            First name
                                        </Label>
                                        <Input
                                            id="first_name"
                                            name="first_name"
                                            required
                                            placeholder="Amina"
                                            defaultValue={
                                                employee?.first_name ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.first_name}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="last_name">
                                            Last name
                                        </Label>
                                        <Input
                                            id="last_name"
                                            name="last_name"
                                            required
                                            placeholder="Yusuf"
                                            defaultValue={
                                                employee?.last_name ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.last_name}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="middle_name">
                                            Middle name
                                        </Label>
                                        <Input
                                            id="middle_name"
                                            name="middle_name"
                                            placeholder="Optional"
                                            defaultValue={
                                                employee?.middle_name ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.middle_name}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="work_email">
                                            Work email
                                        </Label>
                                        <Input
                                            id="work_email"
                                            name="work_email"
                                            type="email"
                                            placeholder="employee@company.com"
                                            defaultValue={
                                                employee?.work_email ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.work_email}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            placeholder="08012345678"
                                            defaultValue={employee?.phone ?? ''}
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="nin">NIN</Label>
                                        <Input
                                            id="nin"
                                            name="nin"
                                            inputMode="numeric"
                                            placeholder="11 digits"
                                            defaultValue={employee?.nin ?? ''}
                                        />
                                        <InputError message={errors.nin} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="bvn">BVN</Label>
                                        <Input
                                            id="bvn"
                                            name="bvn"
                                            inputMode="numeric"
                                            placeholder="11 digits"
                                            defaultValue={employee?.bvn ?? ''}
                                        />
                                        <InputError message={errors.bvn} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="tax_identification_number">
                                            Tax identification number
                                        </Label>
                                        <Input
                                            id="tax_identification_number"
                                            name="tax_identification_number"
                                            placeholder="Optional"
                                            defaultValue={
                                                employee?.tax_identification_number ??
                                                ''
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors.tax_identification_number
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="pension_pin">
                                            Pension PIN
                                        </Label>
                                        <Input
                                            id="pension_pin"
                                            name="pension_pin"
                                            placeholder="Optional"
                                            defaultValue={
                                                employee?.pension_pin ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.pension_pin}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="pfa_name">PFA</Label>
                                        <Input
                                            id="pfa_name"
                                            name="pfa_name"
                                            placeholder="Optional"
                                            defaultValue={
                                                employee?.pfa_name ?? ''
                                            }
                                        />
                                        <InputError message={errors.pfa_name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="nhis_number">
                                            NHIS number
                                        </Label>
                                        <Input
                                            id="nhis_number"
                                            name="nhis_number"
                                            placeholder="Optional"
                                            defaultValue={
                                                employee?.nhis_number ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.nhis_number}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="nhf_number">
                                            NHF number
                                        </Label>
                                        <Input
                                            id="nhf_number"
                                            name="nhf_number"
                                            placeholder="Optional"
                                            defaultValue={
                                                employee?.nhf_number ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.nhf_number}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Bank details
                                    </CardTitle>
                                    <CardDescription>
                                        Typical Nigerian payroll payout fields.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="bank_name">
                                            Bank name
                                        </Label>
                                        <Input
                                            id="bank_name"
                                            name="bank_name"
                                            required
                                            placeholder="Access Bank"
                                            defaultValue={
                                                employee?.bank_name ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.bank_name}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="bank_account_name">
                                            Bank account name
                                        </Label>
                                        <Input
                                            id="bank_account_name"
                                            name="bank_account_name"
                                            required
                                            placeholder="Amina Yusuf"
                                            defaultValue={
                                                employee?.bank_account_name ??
                                                ''
                                            }
                                        />
                                        <InputError
                                            message={errors.bank_account_name}
                                        />
                                    </div>
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="bank_account_number">
                                            Bank account number
                                        </Label>
                                        <Input
                                            id="bank_account_number"
                                            name="bank_account_number"
                                            required
                                            inputMode="numeric"
                                            placeholder="10 digits"
                                            defaultValue={
                                                employee?.bank_account_number ??
                                                ''
                                            }
                                        />
                                        <InputError
                                            message={errors.bank_account_number}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Salary and deductions
                                    </CardTitle>
                                    <CardDescription>
                                        Capture salary as gross or salary
                                        elements, then apply recurring monthly
                                        deductions.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label>
                                            Employee salary entry mode
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Org default:{' '}
                                            {salaryComputation.salaryInputMode ===
                                            'salary_elements'
                                                ? 'Salary elements'
                                                : 'Gross salary'}
                                            . You can change this employee to a
                                            different mode when needed.
                                        </p>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setHasTouchedCompensation(
                                                        true,
                                                    );
                                                    setSalaryEntryMode('gross');
                                                }}
                                                className={`rounded-lg border p-3 text-left transition-colors ${
                                                    salaryEntryMode === 'gross'
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border'
                                                }`}
                                            >
                                                <p className="text-sm font-medium">
                                                    Gross salary
                                                </p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setHasTouchedCompensation(
                                                        true,
                                                    );
                                                    setSalaryEntryMode(
                                                        'salary_elements',
                                                    );
                                                }}
                                                className={`rounded-lg border p-3 text-left transition-colors ${
                                                    salaryEntryMode ===
                                                    'salary_elements'
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border'
                                                }`}
                                            >
                                                <p className="text-sm font-medium">
                                                    Salary elements
                                                </p>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid gap-2 md:col-span-2">
                                        <Label>Salary amount period</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Org default:{' '}
                                            {
                                                salaryComputation.salaryAmountPeriod
                                            }
                                            . Monthly input multiplies by 12 for
                                            annual remittance calculations;
                                            annual input divides by 12 for
                                            monthly payroll.
                                        </p>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    switchSalaryAmountPeriod(
                                                        'monthly',
                                                    )
                                                }
                                                className={`rounded-lg border p-3 text-left transition-colors ${
                                                    salaryAmountPeriod ===
                                                    'monthly'
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border'
                                                }`}
                                            >
                                                <p className="text-sm font-medium">
                                                    Monthly amounts
                                                </p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    switchSalaryAmountPeriod(
                                                        'annual',
                                                    )
                                                }
                                                className={`rounded-lg border p-3 text-left transition-colors ${
                                                    salaryAmountPeriod ===
                                                    'annual'
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border'
                                                }`}
                                            >
                                                <p className="text-sm font-medium">
                                                    Annual amounts
                                                </p>
                                            </button>
                                        </div>
                                        <input
                                            type="hidden"
                                            name="salary_input_mode"
                                            value={salaryEntryMode}
                                        />
                                        <input
                                            type="hidden"
                                            name="salary_amount_period"
                                            value={salaryAmountPeriod}
                                        />
                                        <input
                                            type="hidden"
                                            name="monthly_gross_salary"
                                            value={monthlyGrossSalary.toFixed(
                                                2,
                                            )}
                                        />
                                        <input
                                            type="hidden"
                                            name="annual_gross_salary"
                                            value={annualGrossSalary.toFixed(2)}
                                        />
                                        <input
                                            type="hidden"
                                            name="basic_salary"
                                            value={monthlyBasicSalary.toFixed(
                                                2,
                                            )}
                                        />
                                        <input
                                            type="hidden"
                                            name="housing_allowance"
                                            value={monthlyHousingAllowance.toFixed(
                                                2,
                                            )}
                                        />
                                        <input
                                            type="hidden"
                                            name="transport_allowance"
                                            value={monthlyTransportAllowance.toFixed(
                                                2,
                                            )}
                                        />
                                        <input
                                            type="hidden"
                                            name="other_allowance_1"
                                            value={monthlyOtherAllowanceOne.toFixed(
                                                2,
                                            )}
                                        />
                                        <input
                                            type="hidden"
                                            name="other_allowance_2"
                                            value={monthlyOtherAllowanceTwo.toFixed(
                                                2,
                                            )}
                                        />
                                    </div>

                                    {salaryEntryMode === 'salary_elements' && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="salary_element_basic">
                                                    Basic salary (
                                                    {salaryAmountPeriod})
                                                </Label>
                                                <Input
                                                    id="salary_element_basic"
                                                    inputMode="decimal"
                                                    value={basicSalary}
                                                    onChange={(e) => {
                                                        setHasTouchedCompensation(
                                                            true,
                                                        );
                                                        setBasicSalary(
                                                            e.target.value,
                                                        );
                                                    }}
                                                    placeholder="150000"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="salary_element_housing">
                                                    Housing allowance (
                                                    {salaryAmountPeriod})
                                                </Label>
                                                <Input
                                                    id="salary_element_housing"
                                                    inputMode="decimal"
                                                    value={housingAllowance}
                                                    onChange={(e) => {
                                                        setHasTouchedCompensation(
                                                            true,
                                                        );
                                                        setHousingAllowance(
                                                            e.target.value,
                                                        );
                                                    }}
                                                    placeholder="50000"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="salary_element_transport">
                                                    Transport allowance (
                                                    {salaryAmountPeriod})
                                                </Label>
                                                <Input
                                                    id="salary_element_transport"
                                                    inputMode="decimal"
                                                    value={transportAllowance}
                                                    onChange={(e) => {
                                                        setHasTouchedCompensation(
                                                            true,
                                                        );
                                                        setTransportAllowance(
                                                            e.target.value,
                                                        );
                                                    }}
                                                    placeholder="30000"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="other_allowance_1">
                                                    Additional income 1 (
                                                    {salaryAmountPeriod})
                                                </Label>
                                                <Input
                                                    id="other_allowance_1"
                                                    inputMode="decimal"
                                                    value={otherAllowanceOne}
                                                    onChange={(e) => {
                                                        setHasTouchedCompensation(
                                                            true,
                                                        );
                                                        setOtherAllowanceOne(
                                                            e.target.value,
                                                        );
                                                    }}
                                                    placeholder="Optional"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="other_allowance_2">
                                                    Additional income 2 (
                                                    {salaryAmountPeriod})
                                                </Label>
                                                <Input
                                                    id="other_allowance_2"
                                                    inputMode="decimal"
                                                    value={otherAllowanceTwo}
                                                    onChange={(e) => {
                                                        setHasTouchedCompensation(
                                                            true,
                                                        );
                                                        setOtherAllowanceTwo(
                                                            e.target.value,
                                                        );
                                                    }}
                                                    placeholder="Optional"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="grid gap-2">
                                        <Label htmlFor="gross_salary_amount">
                                            {salaryAmountPeriod === 'monthly'
                                                ? 'Monthly gross salary'
                                                : 'Annual gross salary'}
                                        </Label>
                                        <Input
                                            id="gross_salary_amount"
                                            required
                                            inputMode="decimal"
                                            placeholder="250000"
                                            value={grossSalary}
                                            readOnly={
                                                salaryEntryMode ===
                                                'salary_elements'
                                            }
                                            onChange={(e) => {
                                                setHasTouchedCompensation(true);
                                                setGrossSalary(e.target.value);
                                            }}
                                        />
                                        {salaryEntryMode ===
                                            'salary_elements' && (
                                            <p className="text-xs text-muted-foreground">
                                                Auto-calculated from salary
                                                elements.
                                            </p>
                                        )}
                                        <InputError
                                            message={
                                                errors.monthly_gross_salary
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="alternate_gross_salary">
                                            {salaryAmountPeriod === 'monthly'
                                                ? 'Annual gross salary'
                                                : 'Monthly gross salary'}
                                        </Label>
                                        <Input
                                            id="alternate_gross_salary"
                                            inputMode="decimal"
                                            value={
                                                displayedAlternateGross > 0
                                                    ? displayedAlternateGross.toFixed(
                                                          2,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                        />
                                        <InputError
                                            message={errors.annual_gross_salary}
                                        />
                                    </div>
                                    {hasPaye && (
                                        <div className="grid gap-2">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="apply_paye_deduction"
                                                    checked={applyPayeDeduction}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        setApplyPayeDeduction(
                                                            checked === true,
                                                        )
                                                    }
                                                />
                                                <Label htmlFor="apply_paye_deduction">
                                                    Apply PAYE for this employee
                                                </Label>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {deductionDefaultMessage(
                                                    orgDefaultPaye,
                                                )}
                                            </p>
                                            <Label htmlFor="monthly_tax_deduction">
                                                Monthly PAYE deduction
                                            </Label>
                                            <Input
                                                id="monthly_tax_deduction"
                                                name="monthly_tax_deduction"
                                                inputMode="decimal"
                                                defaultValue={
                                                    employee?.monthly_tax_deduction ??
                                                    0
                                                }
                                                disabled={!applyPayeDeduction}
                                            />
                                            <input
                                                type="hidden"
                                                name="apply_paye_deduction"
                                                value={
                                                    applyPayeDeduction
                                                        ? '1'
                                                        : '0'
                                                }
                                            />
                                            {!applyPayeDeduction && (
                                                <input
                                                    type="hidden"
                                                    name="monthly_tax_deduction"
                                                    value="0"
                                                />
                                            )}
                                            <InputError
                                                message={
                                                    errors.monthly_tax_deduction
                                                }
                                            />
                                        </div>
                                    )}
                                    {hasPension && (
                                        <div className="grid gap-2">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="apply_pension_deduction"
                                                    checked={
                                                        applyPensionDeduction
                                                    }
                                                    onCheckedChange={(
                                                        checked,
                                                    ) => {
                                                        const shouldApply =
                                                            checked === true;
                                                        setApplyPensionDeduction(
                                                            shouldApply,
                                                        );
                                                        if (!shouldApply) {
                                                            setPensionDeduction(
                                                                '0',
                                                            );
                                                        }
                                                    }}
                                                />
                                                <Label htmlFor="apply_pension_deduction">
                                                    Apply pension for this
                                                    employee
                                                </Label>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {deductionDefaultMessage(
                                                    orgDefaultPension,
                                                )}
                                            </p>
                                            <Label htmlFor="monthly_pension_deduction">
                                                Monthly pension deduction
                                            </Label>
                                            <Input
                                                id="monthly_pension_deduction"
                                                name="monthly_pension_deduction"
                                                inputMode="decimal"
                                                value={pensionDeduction}
                                                disabled={
                                                    !applyPensionDeduction
                                                }
                                                onChange={(e) =>
                                                    setPensionDeduction(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={`${payrollRates.pensionEmployeeRate}% by selected base`}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Auto-calculated at{' '}
                                                {
                                                    payrollRates.pensionEmployeeRate
                                                }
                                                % of{' '}
                                                {salaryComputation.pensionContributionBase ===
                                                'basic_transport_housing'
                                                    ? 'basic + transport + housing'
                                                    : 'basic salary'}{' '}
                                                — override if needed
                                            </p>
                                            {!applyPensionDeduction && (
                                                <input
                                                    type="hidden"
                                                    name="monthly_pension_deduction"
                                                    value="0"
                                                />
                                            )}
                                            <input
                                                type="hidden"
                                                name="apply_pension_deduction"
                                                value={
                                                    applyPensionDeduction
                                                        ? '1'
                                                        : '0'
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.monthly_pension_deduction
                                                }
                                            />
                                        </div>
                                    )}
                                    {hasNhf && (
                                        <div className="grid gap-2">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="apply_nhf_deduction"
                                                    checked={applyNhfDeduction}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) => {
                                                        const shouldApply =
                                                            checked === true;
                                                        setApplyNhfDeduction(
                                                            shouldApply,
                                                        );
                                                        if (!shouldApply) {
                                                            setNhfDeduction(
                                                                '0',
                                                            );
                                                        }
                                                    }}
                                                />
                                                <Label htmlFor="apply_nhf_deduction">
                                                    Apply NHF for this employee
                                                </Label>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {deductionDefaultMessage(
                                                    orgDefaultNhf,
                                                )}
                                            </p>
                                            <Label htmlFor="monthly_nhf_deduction">
                                                Monthly NHF deduction
                                            </Label>
                                            <Input
                                                id="monthly_nhf_deduction"
                                                name="monthly_nhf_deduction"
                                                inputMode="decimal"
                                                value={nhfDeduction}
                                                disabled={!applyNhfDeduction}
                                                onChange={(e) =>
                                                    setNhfDeduction(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={`${payrollRates.nhfRate}% by selected base`}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Auto-calculated at{' '}
                                                {payrollRates.nhfRate}% of{' '}
                                                {salaryComputation.nhfContributionBase ===
                                                'gross'
                                                    ? 'gross salary'
                                                    : 'basic salary'}{' '}
                                                — override if needed
                                            </p>
                                            {!applyNhfDeduction && (
                                                <input
                                                    type="hidden"
                                                    name="monthly_nhf_deduction"
                                                    value="0"
                                                />
                                            )}
                                            <input
                                                type="hidden"
                                                name="apply_nhf_deduction"
                                                value={
                                                    applyNhfDeduction
                                                        ? '1'
                                                        : '0'
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.monthly_nhf_deduction
                                                }
                                            />
                                        </div>
                                    )}
                                    {isOrganizationAdmin &&
                                        (!applyPayeDeduction ||
                                            !applyPensionDeduction ||
                                            !applyNhfDeduction) && (
                                            <div className="md:col-span-2">
                                                <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                                                    <AlertTitle>
                                                        Admin warning
                                                    </AlertTitle>
                                                    <AlertDescription>
                                                        You disabled one or more
                                                        statutory deductions for
                                                        this employee. Confirm
                                                        this override complies
                                                        with your organization
                                                        policy.
                                                    </AlertDescription>
                                                </Alert>
                                            </div>
                                        )}
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="other_monthly_deductions">
                                            Other monthly deductions
                                        </Label>
                                        <Input
                                            id="other_monthly_deductions"
                                            name="other_monthly_deductions"
                                            inputMode="decimal"
                                            defaultValue={
                                                employee?.other_monthly_deductions ??
                                                0
                                            }
                                        />
                                        {grossSalary &&
                                            (hasNhis || hasNsitf) && (
                                                <p className="text-xs text-muted-foreground">
                                                    {hasNhis && (
                                                        <>
                                                            Estimated NHIS (
                                                            {
                                                                payrollRates.nhisEmployeeRate
                                                            }
                                                            %): {nhisDeduction}
                                                        </>
                                                    )}
                                                    {hasNhis && hasNsitf && (
                                                        <> &nbsp;|&nbsp; </>
                                                    )}
                                                    {hasNsitf && (
                                                        <>
                                                            NSITF (
                                                            {
                                                                payrollRates.nsitfRate
                                                            }
                                                            %):{' '}
                                                            {(
                                                                (parseFloat(
                                                                    grossSalary,
                                                                ) *
                                                                    payrollRates.nsitfRate) /
                                                                100
                                                            ).toFixed(2)}
                                                        </>
                                                    )}{' '}
                                                    — include these here if
                                                    applicable
                                                </p>
                                            )}
                                        <InputError
                                            message={
                                                errors.other_monthly_deductions
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="total_salary">
                                            Total salary
                                        </Label>
                                        <Input
                                            id="total_salary"
                                            name="total_salary"
                                            inputMode="decimal"
                                            placeholder="Optional"
                                            defaultValue={
                                                employee?.total_salary ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.total_salary}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="personal_life_insurance">
                                            Personal life insurance
                                        </Label>
                                        <Input
                                            id="personal_life_insurance"
                                            name="personal_life_insurance"
                                            inputMode="decimal"
                                            placeholder="Optional"
                                            defaultValue={
                                                employee?.personal_life_insurance ??
                                                ''
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors.personal_life_insurance
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="rent_relief">
                                            Rent relief (tax purpose)
                                        </Label>
                                        <Input
                                            id="rent_relief"
                                            name="rent_relief"
                                            inputMode="decimal"
                                            placeholder="Optional"
                                            defaultValue={
                                                employee?.rent_relief ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.rent_relief}
                                        />
                                    </div>

                                    {allowanceCustomFields.map(
                                        (field, index) => (
                                            <div
                                                key={`allowance-${field.label}-${index}`}
                                                className="grid gap-2 md:col-span-2"
                                            >
                                                <Label
                                                    htmlFor={`allowance_custom_items_${index}_value`}
                                                >
                                                    {field.label} (allowance,{' '}
                                                    {field.rate}% default)
                                                </Label>
                                                <input
                                                    type="hidden"
                                                    name={`custom_items[${index}][label]`}
                                                    defaultValue={field.label}
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`custom_items[${index}][category]`}
                                                    defaultValue="allowance"
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`custom_items[${index}][rate]`}
                                                    defaultValue={field.rate}
                                                />
                                                <Input
                                                    id={`allowance_custom_items_${index}_value`}
                                                    name={`custom_items[${index}][value]`}
                                                    inputMode="decimal"
                                                    placeholder="Optional"
                                                    defaultValue={resolveCustomItemValue(
                                                        field.label,
                                                        'allowance',
                                                    )}
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `custom_items.${index}.value`
                                                        ]
                                                    }
                                                />
                                            </div>
                                        ),
                                    )}

                                    {deductionCustomFields.map(
                                        (field, fieldIndex) => {
                                            const index =
                                                allowanceCustomFields.length +
                                                fieldIndex;

                                            return (
                                                <div
                                                    key={`deduction-${field.label}-${fieldIndex}`}
                                                    className="grid gap-2 md:col-span-2"
                                                >
                                                    <Label
                                                        htmlFor={`deduction_custom_items_${fieldIndex}_value`}
                                                    >
                                                        {field.label}{' '}
                                                        (deduction, {field.rate}
                                                        % default)
                                                    </Label>
                                                    <input
                                                        type="hidden"
                                                        name={`custom_items[${index}][label]`}
                                                        defaultValue={
                                                            field.label
                                                        }
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name={`custom_items[${index}][category]`}
                                                        defaultValue="deduction"
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name={`custom_items[${index}][rate]`}
                                                        defaultValue={
                                                            field.rate
                                                        }
                                                    />
                                                    <Input
                                                        id={`deduction_custom_items_${fieldIndex}_value`}
                                                        name={`custom_items[${index}][value]`}
                                                        inputMode="decimal"
                                                        placeholder="Optional"
                                                        defaultValue={resolveCustomItemValue(
                                                            field.label,
                                                            'deduction',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `custom_items.${index}.value`
                                                            ]
                                                        }
                                                    />
                                                </div>
                                            );
                                        },
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Employment details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="department">
                                            Department
                                        </Label>
                                        <Input
                                            id="department"
                                            name="department"
                                            placeholder="Finance"
                                            defaultValue={
                                                employee?.department ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.department}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="job_title">
                                            Designation
                                        </Label>
                                        <Input
                                            id="job_title"
                                            name="job_title"
                                            placeholder="Payroll Officer"
                                            defaultValue={
                                                employee?.job_title ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.job_title}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="location">
                                            Location
                                        </Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            placeholder="Optional"
                                            defaultValue={
                                                employee?.location ?? ''
                                            }
                                        />
                                        <InputError message={errors.location} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="date_of_birth">
                                            Date of birth
                                        </Label>
                                        <Input
                                            id="date_of_birth"
                                            name="date_of_birth"
                                            type="date"
                                            defaultValue={
                                                employee?.date_of_birth ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.date_of_birth}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="employment_type">
                                            Employment type
                                        </Label>
                                        <select
                                            id="employment_type"
                                            name="employment_type"
                                            defaultValue={
                                                employee?.employment_type ??
                                                'full_time'
                                            }
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                        >
                                            <option value="full_time">
                                                Full time
                                            </option>
                                            <option value="part_time">
                                                Part time
                                            </option>
                                            <option value="contract">
                                                Contract
                                            </option>
                                            <option value="temporary">
                                                Temporary
                                            </option>
                                            <option value="intern">
                                                Intern
                                            </option>
                                        </select>
                                        <InputError
                                            message={errors.employment_type}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="status">Status</Label>
                                        <select
                                            id="status"
                                            name="status"
                                            defaultValue={
                                                employee?.status ?? 'active'
                                            }
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                        >
                                            <option value="active">
                                                Active
                                            </option>
                                            <option value="inactive">
                                                Inactive
                                            </option>
                                        </select>
                                        <InputError message={errors.status} />
                                    </div>
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="hire_date">
                                            Start date
                                        </Label>
                                        <Input
                                            id="hire_date"
                                            name="hire_date"
                                            type="date"
                                            defaultValue={
                                                employee?.hire_date ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.hire_date}
                                        />
                                    </div>
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="exit_date">
                                            Exit date
                                        </Label>
                                        <Input
                                            id="exit_date"
                                            name="exit_date"
                                            type="date"
                                            defaultValue={
                                                employee?.exit_date ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.exit_date}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex items-center gap-3">
                                <Button
                                    disabled={
                                        processing ||
                                        (!isEditMode && !canCreateEmployee)
                                    }
                                >
                                    {isEditMode
                                        ? 'Save changes'
                                        : 'Save employee'}
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={index()}>Cancel</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
