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
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    monthlyGrossSalary: string | number;
    monthlyTaxDeduction: string | number;
    monthlyPensionDeduction: string | number;
    monthlyNhfDeduction: string | number;
    otherMonthlyDeductions: string | number;
    department: string | null;
    jobTitle: string | null;
    employmentType: string;
    hireDate: string | null;
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
                            Job title:{' '}
                            <span className="font-medium text-foreground">
                                {employee.jobTitle ?? 'N/A'}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Employment type:{' '}
                            <span className="font-medium text-foreground capitalize">
                                {employee.employmentType.replace('_', ' ')}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Hire date:{' '}
                            <span className="font-medium text-foreground">
                                {employee.hireDate ?? 'N/A'}
                            </span>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
