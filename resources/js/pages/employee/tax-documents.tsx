import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Download,
    FileText,
    ShieldCheck,
    TrendingUp,
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

type TaxDocumentsProps = {
    employee: {
        id: string;
        employeeNumber: string;
        firstName: string;
        lastName: string;
        taxIdentificationNumber: string | null;
        pensionPin: string | null;
        nhfNumber: string | null;
        nhisNumber: string | null;
    };
    payrollRuns: Array<{
        id: string;
        periodMonth: string;
        periodStart: string;
        periodEnd: string;
        finalizedAt: string | null;
        hasCalculation: boolean;
        paye: number;
        pensionEmployee: number;
        nhf: number;
        nhisEmployee: number;
        nsitf: number;
    }>;
    ytdTotals: {
        paye: number;
        pensionEmployee: number;
        nhf: number;
        nhisEmployee: number;
        nsitf: number;
        grossSalary: number;
    };
    currentYear: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employee Dashboard',
        href: '/employee/dashboard',
    },
    {
        title: 'Tax Documents',
        href: '/employee/tax-documents',
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
        month: 'short',
        day: 'numeric',
    });
}

export default function TaxDocuments({
    employee,
    payrollRuns,
    ytdTotals,
    currentYear,
}: TaxDocumentsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tax Documents" />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="sm">
                        <Link href={employeeDashboard()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Tax Documents</h1>
                </div>

                {/* Employee Tax Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ShieldCheck className="h-5 w-5" />
                            Your Tax Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Tax ID (TIN)
                                </p>
                                <p className="font-medium">
                                    {employee.taxIdentificationNumber || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Pension PIN
                                </p>
                                <p className="font-medium">
                                    {employee.pensionPin || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    NHF Number
                                </p>
                                <p className="font-medium">
                                    {employee.nhfNumber || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    NHIS Number
                                </p>
                                <p className="font-medium">
                                    {employee.nhisNumber || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Year-to-Date Summary */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <TrendingUp className="h-6 w-6" />
                            Year-to-Date Summary ({currentYear})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Total Gross Salary
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatMoney(ytdTotals.grossSalary)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Total PAYE Tax
                                </p>
                                <p className="text-2xl font-bold text-red-600">
                                    {formatMoney(ytdTotals.paye)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Total Pension (Employee)
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatMoney(ytdTotals.pensionEmployee)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Total NHF
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatMoney(ytdTotals.nhf)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Total NHIS (Employee)
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatMoney(ytdTotals.nhisEmployee)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Total NSITF
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatMoney(ytdTotals.nsitf)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Tax Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FileText className="h-5 w-5" />
                            Monthly Tax Breakdown
                        </CardTitle>
                        <CardDescription>
                            Your tax contributions for the last 12 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {payrollRuns.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4">
                                No tax documents available yet. Documents will appear here once payroll is processed.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {payrollRuns.map((run) => (
                                    <div
                                        key={run.id}
                                        className="rounded-lg border p-4"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <p className="font-medium">
                                                    {run.periodMonth}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(run.periodStart)} - {formatDate(run.periodEnd)}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    PAYE Certificate
                                                </Button>
                                            </div>
                                        </div>
                                        {run.hasCalculation ? (
                                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">PAYE:</span>
                                                    <span className="font-medium">{formatMoney(run.paye)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Pension:</span>
                                                    <span className="font-medium">{formatMoney(run.pensionEmployee)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">NHF:</span>
                                                    <span className="font-medium">{formatMoney(run.nhf)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">NHIS:</span>
                                                    <span className="font-medium">{formatMoney(run.nhisEmployee)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">NSITF:</span>
                                                    <span className="font-medium">{formatMoney(run.nsitf)}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                No calculation data available for this period.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Available Document Downloads */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Download className="h-5 w-5" />
                            Download Documents
                        </CardTitle>
                        <CardDescription>
                            Official tax and compliance documents
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">PAYE Certificate - {currentYear}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Year-to-date tax certificate for your records
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Pension Contribution Statement</p>
                                    <p className="text-xs text-muted-foreground">
                                        Annual pension contribution summary
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Tax Summary Report</p>
                                    <p className="text-xs text-muted-foreground">
                                        Comprehensive tax summary for all statutory deductions
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}