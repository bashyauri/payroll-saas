import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Banknote,
    Building2,
    Calendar,
    Download,
    FileText,
    Printer,
    ShieldCheck,
    User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { dashboard as employeeDashboard } from '@/routes/employee';
import type { BreadcrumbItem } from '@/types';

type PayslipProps = {
    payrollRun: {
        id: string;
        periodMonth: string;
        periodStart: string;
        periodEnd: string;
        finalizedAt: string | null;
    };
    employee: {
        id: string;
        employeeNumber: string;
        firstName: string;
        lastName: string;
        middleName: string | null;
        workEmail: string | null;
        department: string | null;
        jobTitle: string | null;
        bankName: string;
        bankAccountName: string;
        bankAccountNumber: string;
    };
    calculation: {
        grossSalary: number;
        basicSalary: number;
        housingAllowance: number;
        transportAllowance: number;
        otherAllowance1: number;
        otherAllowance2: number;
        totalEarnings: number;
        totalDeductions: number;
        netPay: number;
        paye: number;
        pensionDeduction: number;
        pensionEmployer: number;
        nhf: number;
        nhisDeduction: number;
        nhisEmployer: number;
        nsitf: number;
        otherDeductions: number;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employee Dashboard',
        href: '/employee/dashboard',
    },
    {
        title: 'Payslip',
        href: '/employee/payslip',
    },
];

function formatMoney(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function Payslip({
    payrollRun,
    employee,
    calculation,
}: PayslipProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Payslip - ${payrollRun.periodMonth}`} />
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="sm">
                            <Link href={employeeDashboard()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">
                            Payslip - {payrollRun.periodMonth}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.print()}
                        >
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                        >
                            <a href={`/employee/payslips/${payrollRun.id}/pdf`} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Payslip Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">
                                    {employee.firstName} {employee.lastName}
                                </CardTitle>
                                <CardDescription>
                                    Employee Number: {employee.employeeNumber}
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">
                                    Pay Period
                                </p>
                                <p className="font-medium">
                                    {formatDate(payrollRun.periodStart)} - {formatDate(payrollRun.periodEnd)}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        Department:
                                    </span>
                                    <span className="font-medium">
                                        {employee.department || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        Job Title:
                                    </span>
                                    <span className="font-medium">
                                        {employee.jobTitle || 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        Finalized:
                                    </span>
                                    <span className="font-medium">
                                        {payrollRun.finalizedAt 
                                            ? formatDate(payrollRun.finalizedAt)
                                            : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Earnings Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Banknote className="h-5 w-5" />
                            Earnings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Basic Salary</span>
                            <span className="font-medium">{formatMoney(calculation.basicSalary)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Housing Allowance</span>
                            <span className="font-medium">{formatMoney(calculation.housingAllowance)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Transport Allowance</span>
                            <span className="font-medium">{formatMoney(calculation.transportAllowance)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Other Allowance 1</span>
                            <span className="font-medium">{formatMoney(calculation.otherAllowance1)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Other Allowance 2</span>
                            <span className="font-medium">{formatMoney(calculation.otherAllowance2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Earnings</span>
                            <span className="font-medium">{formatMoney(calculation.totalEarnings)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                            <span>Gross Salary</span>
                            <span className="text-green-600">{formatMoney(calculation.grossSalary)}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Deductions Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ShieldCheck className="h-5 w-5" />
                            Deductions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">PAYE (Tax)</span>
                            <span className="font-medium">{formatMoney(calculation.paye)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Pension (Employee)</span>
                            <span className="font-medium">{formatMoney(calculation.pensionDeduction)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">NHF</span>
                            <span className="font-medium">{formatMoney(calculation.nhf)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">NHIS (Employee)</span>
                            <span className="font-medium">{formatMoney(calculation.nhisDeduction)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">NSITF</span>
                            <span className="font-medium">{formatMoney(calculation.nsitf)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Other Deductions</span>
                            <span className="font-medium">{formatMoney(calculation.otherDeductions)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                            <span>Total Deductions</span>
                            <span className="text-red-600">{formatMoney(calculation.totalDeductions)}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Net Pay Summary */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <FileText className="h-6 w-6" />
                            Net Pay Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Net Pay for {payrollRun.periodMonth}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    This amount will be credited to your bank account
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-green-600">
                                    {formatMoney(calculation.netPay)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bank Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Building2 className="h-5 w-5" />
                            Payment Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Bank Name</span>
                            <span className="font-medium">{employee.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Account Name</span>
                            <span className="font-medium">{employee.bankAccountName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Account Number</span>
                            <span className="font-medium">{employee.bankAccountNumber}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Employer Contributions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ShieldCheck className="h-5 w-5" />
                            Employer Contributions (For Information)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Pension (Employer)</span>
                            <span className="font-medium">{formatMoney(calculation.pensionEmployer)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">NHIS (Employer)</span>
                            <span className="font-medium">{formatMoney(calculation.nhisEmployer)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                            <span>Total Employer Contributions</span>
                            <span className="text-blue-600">
                                {formatMoney(calculation.pensionEmployer + calculation.nhisEmployer)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}