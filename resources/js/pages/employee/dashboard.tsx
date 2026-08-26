import { Head, Link } from '@inertiajs/react';
import {
    Banknote,
    Bell,
    Building2,
    Calendar,
    FileText,
    Mail,
    Phone,
    User,
    Users,
} from 'lucide-react';
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
import { profile as employeeProfile, taxDocuments as employeeTaxDocuments, leaveBalance as employeeLeaveBalance, notifications as employeeNotifications } from '@/routes/employee';
import type { BreadcrumbItem } from '@/types';

type EmployeeDashboardProps = {
    employee: {
        id: string;
        employeeNumber: string;
        firstName: string;
        lastName: string;
        middleName: string | null;
        workEmail: string | null;
        phone: string | null;
        department: string | null;
        jobTitle: string | null;
        location: string | null;
        employmentType: string;
        hireDate: string | null;
        status: string;
        monthlyGrossSalary: number;
    };
    recentPayrollRuns: Array<{
        id: string;
        periodMonth: string;
        periodStart: string;
        periodEnd: string;
        status: string;
        finalizedAt: string | null;
        calculation: {
            grossSalary: number;
            totalDeductions: number;
            netPay: number;
            paye: number;
            pension: number;
            nhf: number;
            nhis: number;
            nsitf: number;
        } | null;
    }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employee Dashboard',
        href: '/employee/dashboard',
    },
];

function formatMoney(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateString: string | null): string {
    if (! dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function EmployeeDashboard({
    employee,
    recentPayrollRuns,
}: EmployeeDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employee Dashboard" />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Employee Information Card */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Welcome, {employee.firstName} {employee.lastName}
                        </CardTitle>
                        <CardDescription>
                            Your employee self-service portal
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs text-muted-foreground">
                                Employee Number
                            </p>
                            <p className="text-sm font-semibold">
                                {employee.employeeNumber}
                            </p>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs text-muted-foreground">
                                Department
                            </p>
                            <p className="text-sm font-semibold">
                                {employee.department || 'N/A'}
                            </p>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs text-muted-foreground">
                                Job Title
                            </p>
                            <p className="text-sm font-semibold">
                                {employee.jobTitle || 'N/A'}
                            </p>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs text-muted-foreground">
                                Employment Type
                            </p>
                            <p className="text-sm font-semibold capitalize">
                                {employee.employmentType.replace('_', ' ')}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Contact Information */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Contact Information</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="h-4 w-4" />
                                Personal Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-medium">{employee.workEmail || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Phone:</span>
                                <span className="font-medium">{employee.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Location:</span>
                                <span className="font-medium">{employee.location || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Hire Date:</span>
                                <span className="font-medium">{formatDate(employee.hireDate)}</span>
                            </div>
                            <div className="pt-2">
                                <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                                    {employee.status.toUpperCase()}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Salary Information */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Compensation</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Banknote className="h-4 w-4" />
                                Salary Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="text-muted-foreground">
                                Monthly Gross Salary:{' '}
                                <span className="font-medium text-foreground">
                                    {formatMoney(employee.monthlyGrossSalary)}
                                </span>
                            </p>
                            <p className="text-xs text-muted-foreground pt-2">
                                This is your current gross salary before deductions.
                                Net pay may vary based on actual payroll calculations.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Quick Actions</CardDescription>
                            <CardTitle>Manage Your Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button asChild className="w-full justify-start">
                                <Link href={employeeProfile()}>
                                    <User className="mr-2 h-4 w-4" />
                                    Update Profile
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full justify-start"
                            >
                                <Link href={employeeTaxDocuments()}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Tax Documents
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full justify-start"
                            >
                                <Link href={employeeLeaveBalance()}>
                                    <Users className="mr-2 h-4 w-4" />
                                    Leave Balance
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full justify-start"
                            >
                                <Link href={employeeNotifications()}>
                                    <Bell className="mr-2 h-4 w-4" />
                                    Notifications
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Payroll History */}
                <Card>
                    <CardHeader>
                        <CardDescription>Payroll History</CardDescription>
                        <CardTitle>Recent Payslips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentPayrollRuns.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4">
                                No payroll runs available yet. Payslips will appear here once payroll is processed.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {recentPayrollRuns.map((run) => (
                                    <div
                                        key={run.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium">
                                                {run.periodMonth}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(run.periodStart)} - {formatDate(run.periodEnd)}
                                            </p>
                                        </div>
                                        {run.calculation ? (
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    {formatMoney(run.calculation.netPay)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Net Pay
                                                </p>
                                            </div>
                                        ) : (
                                            <Badge variant="secondary">
                                                No calculation data
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}