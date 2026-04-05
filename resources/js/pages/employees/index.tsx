import { Head, Link } from '@inertiajs/react';
import { Plus, Users } from 'lucide-react';
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
import { create, index } from '@/routes/tenant/employees';
import type { BreadcrumbItem } from '@/types';

type EmployeeRecord = {
    id: string;
    employeeNumber: string;
    name: string;
    department: string | null;
    jobTitle: string | null;
    bankName: string;
    bankAccountNumber: string;
    monthlyGrossSalary: string | number;
    status: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: index(),
    },
];

function formatMoney(amount: string | number): string {
    const numericAmount =
        typeof amount === 'string' ? Number.parseFloat(amount) : amount;

    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 2,
    }).format(numericAmount);
}

export default function EmployeesIndex({
    employees,
    employeeCount,
    employeeLimit,
    remainingSlots,
    isNearEmployeeLimit,
    isAtEmployeeLimit,
    status,
    organizationName,
}: {
    employees: EmployeeRecord[];
    employeeCount: number;
    employeeLimit: number | null;
    remainingSlots: number | null;
    isNearEmployeeLimit: boolean;
    isAtEmployeeLimit: boolean;
    status: string | null;
    organizationName: string;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />

            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 md:p-6">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-xl">Employees</CardTitle>
                            <CardDescription>
                                Manage employee records for {organizationName}.
                            </CardDescription>
                        </div>
                        <Button asChild disabled={isAtEmployeeLimit}>
                            <Link href={create()}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Employee
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs text-muted-foreground">
                                Current employees
                            </p>
                            <p className="text-lg font-semibold">
                                {employeeCount}
                            </p>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs text-muted-foreground">
                                Employee limit
                            </p>
                            <p className="text-lg font-semibold">
                                {employeeLimit ?? 'N/A'}
                            </p>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs text-muted-foreground">
                                Remaining slots
                            </p>
                            <p className="text-lg font-semibold">
                                {remainingSlots ?? 'Unlimited'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {status === 'employee-created' && (
                    <Card className="border-emerald-200 bg-emerald-50/40 dark:border-emerald-700 dark:bg-emerald-950/20">
                        <CardContent className="pt-6 text-sm text-emerald-900 dark:text-emerald-100">
                            Employee record saved successfully.
                        </CardContent>
                    </Card>
                )}

                {(isNearEmployeeLimit || isAtEmployeeLimit) && (
                    <Card className="border-orange-200 bg-orange-50/40 dark:border-orange-700 dark:bg-orange-950/20">
                        <CardHeader>
                            <CardTitle className="text-base">
                                {isAtEmployeeLimit
                                    ? 'Employee limit reached'
                                    : 'You are close to your employee limit'}
                            </CardTitle>
                            <CardDescription>
                                Upgrade to add more employees
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Users className="h-4 w-4" />
                            Employee directory
                        </CardTitle>
                        <CardDescription>
                            Nigerian payroll data includes NIN, BVN, bank
                            account details, salary, and deductions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        {employees.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                No employees yet. Add your first employee to
                                begin payroll setup.
                            </div>
                        ) : (
                            employees.map((employee) => (
                                <div
                                    key={employee.id}
                                    className="rounded-lg border p-4"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <p className="font-medium text-foreground">
                                                {employee.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {employee.employeeNumber}
                                                {employee.jobTitle
                                                    ? ` • ${employee.jobTitle}`
                                                    : ''}
                                                {employee.department
                                                    ? ` • ${employee.department}`
                                                    : ''}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="capitalize"
                                        >
                                            {employee.status}
                                        </Badge>
                                    </div>

                                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                                        <p>
                                            Bank:{' '}
                                            <span className="font-medium text-foreground">
                                                {employee.bankName}
                                            </span>
                                        </p>
                                        <p>
                                            Account:{' '}
                                            <span className="font-medium text-foreground">
                                                {employee.bankAccountNumber}
                                            </span>
                                        </p>
                                        <p>
                                            Salary:{' '}
                                            <span className="font-medium text-foreground">
                                                {formatMoney(
                                                    employee.monthlyGrossSalary,
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
