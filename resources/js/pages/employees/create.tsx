import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { plans as billingPlans } from '@/routes/billing';
import { create, index, store } from '@/routes/tenant/employees';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: index(),
    },
    {
        title: 'Add employee',
        href: create(),
    },
];

export default function CreateEmployee({
    employeeCount,
    employeeLimit,
    remainingSlots,
    canCreateEmployee,
    payrollCustomFields,
    payrollRates,
    enabledDeductions,
}: {
    employeeCount: number;
    employeeLimit: number | null;
    remainingSlots: number | null;
    canCreateEmployee: boolean;
    payrollCustomFields: Array<{ label: string; rate: number }>;
    payrollRates: {
        pensionEmployeeRate: number;
        nhfRate: number;
        nhisEmployeeRate: number;
        nsitfRate: number;
    };
    enabledDeductions: string[];
}) {
    const hasPension = enabledDeductions.includes('pension');
    const hasNhf = enabledDeductions.includes('nhf');
    const hasNhis = enabledDeductions.includes('nhis');
    const hasNsitf = enabledDeductions.includes('nsitf');
    const hasPaye = enabledDeductions.includes('paye');
    const [grossSalary, setGrossSalary] = useState('');
    const [pensionDeduction, setPensionDeduction] = useState('');
    const [nhfDeduction, setNhfDeduction] = useState('');
    const [nhisDeduction, setNhisDeduction] = useState('');

    function calcFromGross(gross: string) {
        const value = parseFloat(gross);
        if (!isNaN(value) && value > 0) {
            if (hasPension)
                setPensionDeduction(
                    ((value * payrollRates.pensionEmployeeRate) / 100).toFixed(
                        2,
                    ),
                );
            if (hasNhf)
                setNhfDeduction(
                    ((value * payrollRates.nhfRate) / 100).toFixed(2),
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add employee" />

            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 md:p-6">
                <Heading
                    title="Add employee"
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
                    {...store.form()}
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
                                        Gross salary plus recurring monthly
                                        deductions.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="monthly_gross_salary">
                                            Monthly gross salary
                                        </Label>
                                        <Input
                                            id="monthly_gross_salary"
                                            name="monthly_gross_salary"
                                            required
                                            inputMode="decimal"
                                            placeholder="250000"
                                            value={grossSalary}
                                            onChange={(e) => {
                                                setGrossSalary(e.target.value);
                                                calcFromGross(e.target.value);
                                            }}
                                        />
                                        <InputError
                                            message={
                                                errors.monthly_gross_salary
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="annual_gross_salary">
                                            Annual gross salary
                                        </Label>
                                        <Input
                                            id="annual_gross_salary"
                                            name="annual_gross_salary"
                                            inputMode="decimal"
                                            placeholder="Optional"
                                        />
                                        <InputError
                                            message={errors.annual_gross_salary}
                                        />
                                    </div>
                                    {hasPaye && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="monthly_tax_deduction">
                                                Monthly PAYE deduction
                                            </Label>
                                            <Input
                                                id="monthly_tax_deduction"
                                                name="monthly_tax_deduction"
                                                inputMode="decimal"
                                                defaultValue="0"
                                            />
                                            <InputError
                                                message={
                                                    errors.monthly_tax_deduction
                                                }
                                            />
                                        </div>
                                    )}
                                    {hasPension && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="monthly_pension_deduction">
                                                Monthly pension deduction
                                            </Label>
                                            <Input
                                                id="monthly_pension_deduction"
                                                name="monthly_pension_deduction"
                                                inputMode="decimal"
                                                value={pensionDeduction}
                                                onChange={(e) =>
                                                    setPensionDeduction(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={`${payrollRates.pensionEmployeeRate}% of gross`}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Auto-calculated at{' '}
                                                {
                                                    payrollRates.pensionEmployeeRate
                                                }
                                                % of gross — override if needed
                                            </p>
                                            <InputError
                                                message={
                                                    errors.monthly_pension_deduction
                                                }
                                            />
                                        </div>
                                    )}
                                    {hasNhf && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="monthly_nhf_deduction">
                                                Monthly NHF deduction
                                            </Label>
                                            <Input
                                                id="monthly_nhf_deduction"
                                                name="monthly_nhf_deduction"
                                                inputMode="decimal"
                                                value={nhfDeduction}
                                                onChange={(e) =>
                                                    setNhfDeduction(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={`${payrollRates.nhfRate}% of gross`}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Auto-calculated at{' '}
                                                {payrollRates.nhfRate}% of gross
                                                — override if needed
                                            </p>
                                            <InputError
                                                message={
                                                    errors.monthly_nhf_deduction
                                                }
                                            />
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
                                            defaultValue="0"
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
                                        />
                                        <InputError
                                            message={errors.rent_relief}
                                        />
                                    </div>

                                    {payrollCustomFields.map((field, index) => (
                                        <div
                                            key={`${field.label}-${index}`}
                                            className="grid gap-2 md:col-span-2"
                                        >
                                            <Label
                                                htmlFor={`custom_items_${index}_value`}
                                            >
                                                {field.label} ({field.rate}%
                                                default)
                                            </Label>
                                            <input
                                                type="hidden"
                                                name={`custom_items[${index}][label]`}
                                                defaultValue={field.label}
                                            />
                                            <input
                                                type="hidden"
                                                name={`custom_items[${index}][rate]`}
                                                defaultValue={field.rate}
                                            />
                                            <Input
                                                id={`custom_items_${index}_value`}
                                                name={`custom_items[${index}][value]`}
                                                inputMode="decimal"
                                                placeholder="Optional"
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `custom_items.${index}.value`
                                                    ]
                                                }
                                            />
                                        </div>
                                    ))}
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
                                            defaultValue="full_time"
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
                                            defaultValue="active"
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
                                        />
                                        <InputError
                                            message={errors.exit_date}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex items-center gap-3">
                                <Button
                                    disabled={processing || !canCreateEmployee}
                                >
                                    Save employee
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
