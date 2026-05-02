import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/tenant/employees';
import type { BreadcrumbItem } from '@/types';

type EmployeeDetail = {
    id: string;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    middleName: string | null;
    workEmail: string | null;
    phone: string | null;
    nin: string | null;
    bvn: string | null;
    taxIdentificationNumber: string | null;
    pensionPin: string | null;
    pfaName: string | null;
    nhisNumber: string | null;
    nhfNumber: string | null;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    monthlyGrossSalary: string | number;
    annualGrossSalary: string | number | null;
    monthlyTaxDeduction: string | number;
    monthlyPensionDeduction: string | number;
    monthlyNhfDeduction: string | number;
    otherMonthlyDeductions: string | number;
    otherAllowance1: string | number | null;
    otherAllowance2: string | number | null;
    totalSalary: string | number | null;
    personalLifeInsurance: string | number | null;
    rentRelief: string | number | null;
    customItems: Array<{
        label: string;
        rate: number;
        value: number;
    }>;
    department: string | null;
    jobTitle: string | null;
    location: string | null;
    dateOfBirth: string | null;
    employmentType: string;
    hireDate: string | null;
    exitDate: string | null;
    status: string;
};

function formatMoney(amount: string | number): string {
    const numericAmount =
        typeof amount === 'string' ? Number.parseFloat(amount) : amount;

    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 2,
    }).format(numericAmount);
}

export default function EmployeeShow({
    employee,
}: {
    employee: EmployeeDetail;
}) {
    const fullName = [
        employee.firstName,
        employee.middleName,
        employee.lastName,
    ]
        .filter(Boolean)
        .join(' ');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Employees',
            href: index(),
        },
        {
            title: fullName,
            href: `/employees/${employee.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${fullName} - Employee`} />

            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {fullName}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Employee number: {employee.employeeNumber}
                        </p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                        {employee.status}
                    </Badge>
                </div>

                <div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={index()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to employees
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Identity</CardTitle>
                        <CardDescription>
                            Core payroll identity and statutory details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <p className="text-sm text-muted-foreground">
                            Work email:{' '}
                            <span className="font-medium text-foreground">
                                {employee.workEmail ?? 'N/A'}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Phone:{' '}
                            <span className="font-medium text-foreground">
                                {employee.phone ?? 'N/A'}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            NIN:{' '}
                            <span className="font-medium text-foreground">
                                {employee.nin ?? 'N/A'}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            BVN:{' '}
                            <span className="font-medium text-foreground">
                                {employee.bvn ?? 'N/A'}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            TIN:{' '}
                            <span className="font-medium text-foreground">
                                {employee.taxIdentificationNumber ?? 'N/A'}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Pension PIN:{' '}
                            <span className="font-medium text-foreground">
                                {employee.pensionPin ?? 'N/A'}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            PFA:{' '}
                            <span className="font-medium text-foreground">
                                {employee.pfaName ?? 'N/A'}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            NHIS number:{' '}
                            <span className="font-medium text-foreground">
                                {employee.nhisNumber ?? 'N/A'}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            NHF number:{' '}
                            <span className="font-medium text-foreground">
                                {employee.nhfNumber ?? 'N/A'}
                            </span>
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Bank details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <p className="text-sm text-muted-foreground">
                            Bank name:{' '}
                            <span className="font-medium text-foreground">
                                {employee.bankName}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Account name:{' '}
                            <span className="font-medium text-foreground">
                                {employee.bankAccountName}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground md:col-span-2">
                            Account number:{' '}
                            <span className="font-medium text-foreground">
                                {employee.bankAccountNumber}
                            </span>
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Compensation</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <p className="text-sm text-muted-foreground">
                            Monthly gross salary:{' '}
                            <span className="font-medium text-foreground">
                                {formatMoney(employee.monthlyGrossSalary)}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Annual gross salary:{' '}
                            <span className="font-medium text-foreground">
                                {employee.annualGrossSalary === null
                                    ? 'N/A'
                                    : formatMoney(employee.annualGrossSalary)}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            PAYE deduction:{' '}
                            <span className="font-medium text-foreground">
                                {formatMoney(employee.monthlyTaxDeduction)}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Pension deduction:{' '}
                            <span className="font-medium text-foreground">
                                {formatMoney(employee.monthlyPensionDeduction)}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            NHF deduction:{' '}
                            <span className="font-medium text-foreground">
                                {formatMoney(employee.monthlyNhfDeduction)}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground md:col-span-2">
                            Other deductions:{' '}
                            <span className="font-medium text-foreground">
                                {formatMoney(employee.otherMonthlyDeductions)}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Other allowance 1:{' '}
                            <span className="font-medium text-foreground">
                                {employee.otherAllowance1 === null
                                    ? 'N/A'
                                    : formatMoney(employee.otherAllowance1)}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Other allowance 2:{' '}
                            <span className="font-medium text-foreground">
                                {employee.otherAllowance2 === null
                                    ? 'N/A'
                                    : formatMoney(employee.otherAllowance2)}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Total salary:{' '}
                            <span className="font-medium text-foreground">
                                {employee.totalSalary === null
                                    ? 'N/A'
                                    : formatMoney(employee.totalSalary)}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Personal life insurance:{' '}
                            <span className="font-medium text-foreground">
                                {employee.personalLifeInsurance === null
                                    ? 'N/A'
                                    : formatMoney(
                                          employee.personalLifeInsurance,
                                      )}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground md:col-span-2">
                            Rent relief:{' '}
                            <span className="font-medium text-foreground">
                                {employee.rentRelief === null
                                    ? 'N/A'
                                    : formatMoney(employee.rentRelief)}
                            </span>
                        </p>
                        {employee.customItems.map((item, index) => (
                            <p
                                key={`${item.label}-${index}`}
                                className="text-sm text-muted-foreground md:col-span-2"
                            >
                                {item.label} ({item.rate}%):{' '}
                                <span className="font-medium text-foreground">
                                    {formatMoney(item.value)}
                                </span>
                            </p>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Employment details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <p className="text-sm text-muted-foreground">
                            Department:{' '}
                            <span className="font-medium text-foreground">
                                {employee.department ?? 'N/A'}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Designation:{' '}
                            <span className="font-medium text-foreground">
                                {employee.jobTitle ?? 'N/A'}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Location:{' '}
                            <span className="font-medium text-foreground">
                                {employee.location ?? 'N/A'}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Date of birth:{' '}
                            <span className="font-medium text-foreground">
                                {employee.dateOfBirth ?? 'N/A'}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Employment type:{' '}
                            <span className="font-medium text-foreground capitalize">
                                {employee.employmentType.replace('_', ' ')}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Start date:{' '}
                            <span className="font-medium text-foreground">
                                {employee.hireDate ?? 'N/A'}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Exit date:{' '}
                            <span className="font-medium text-foreground">
                                {employee.exitDate ?? 'N/A'}
                            </span>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
