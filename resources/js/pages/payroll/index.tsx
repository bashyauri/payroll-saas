import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FileCheck2, LoaderCircle, ShieldCheck, Eye, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
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
import { edit as editPayrollSettings } from '@/routes/payroll/settings';
import type { BreadcrumbItem } from '@/types';

type PayrollPageProps = {
    organization: {
        name: string;
        domain: string | null;
    };
    userRole?: string;
    settingsSummary: {
        pensionEmployeeRate: number;
        pensionEmployerRate: number;
        nhfRate: number;
        nhisEmployeeRate: number;
        nhisEmployerRate: number;
    };
    payrollRuns: Array<{
        id: string;
        periodMonth: string;
        periodStart: string;
        periodEnd: string;
        status: string;
        employeeCount: number;
        totalGrossSalary: number;
        totalDeductions: number;
        totalNetPay: number;
        nhisEmployerContribution: number;
        createdAt: string | null;
        submittedAt?: string | null;
        approvedAt?: string | null;
        finalizedAt: string | null;
        voidRequestedAt?: string | null;
        voidedAt?: string | null;
    }>;
    status?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Payroll',
        href: '/payroll',
    },
];

export default function PayrollIndex({
    organization,
    userRole = 'member',
    settingsSummary,
    payrollRuns,
    status,
}: PayrollPageProps) {
    const form = useForm({
        period_month: '',
    });

    const isOwner = userRole === 'owner';
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [selectedMonth, setSelectedMonth] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        form.post('/payroll/runs', {
            preserveScroll: true,
        });
    };

    const finalizeRun = (runId: string): void => {
        if (confirm('Are you sure you want to finalize this payroll run?')) {
            router.post(
                `/payroll/runs/${runId}/finalize`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const formatMoney = (amount: number): string => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const getStatusBadge = (runStatus: string) => {
        switch (runStatus) {
            case 'draft':
                return (
                    <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30">
                        Draft (In Review)
                    </Badge>
                );
            case 'pending_approval':
                return (
                    <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/30">
                        Pending Approval
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30">
                        Approved
                    </Badge>
                );
            case 'finalized':
                return (
                    <Badge variant="outline" className="border-green-600 text-green-700 bg-green-50 dark:bg-green-950/30">
                        Finalized
                    </Badge>
                );
            case 'void_requested':
                return (
                    <Badge variant="outline" className="border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-950/30">
                        Void Requested
                    </Badge>
                );
            case 'voided':
                return (
                    <Badge variant="destructive" className="bg-red-600 text-white">
                        VOIDED
                    </Badge>
                );
            default:
                return <Badge variant="outline">{runStatus}</Badge>;
        }
    };

    const generateMonthOptions = () => {
        const options = [];
        const currentDate = new Date();
        
        // Generate options for previous, current and next year
        for (let year = currentDate.getFullYear() - 1; year <= currentDate.getFullYear() + 1; year++) {
            for (let month = 0; month < 12; month++) {
                const date = new Date(year, month, 1);
                const value = `${year}-${String(month + 1).padStart(2, '0')}`;
                const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                options.push({ value, label });
            }
        }
        
        return options.sort((a, b) => b.value.localeCompare(a.value));
    };

    // Filter payroll runs based on selected year, month, and status
    const filteredPayrollRuns = payrollRuns.filter((run) => {
        if (selectedStatus !== 'all' && run.status !== selectedStatus) {
            return false;
        }

        if (selectedYear === 'all' && selectedMonth === 'all') return true;
        
        const runDate = new Date(run.periodMonth + '-01');
        const runYear = runDate.getFullYear().toString();
        const runMonth = (runDate.getMonth() + 1).toString().padStart(2, '0');
        
        if (selectedYear !== 'all' && selectedMonth !== 'all') {
            return runYear === selectedYear && runMonth === selectedMonth;
        }
        if (selectedYear !== 'all') {
            return runYear === selectedYear;
        }
        if (selectedMonth !== 'all') {
            return runMonth === selectedMonth;
        }
        return true;
    });

    const availableYears = Array.from(
        new Set(payrollRuns.map((run) => new Date(run.periodMonth + '-01').getFullYear().toString()))
    ).sort((a, b) => b.localeCompare(a));

    const availableMonths = Array.from(
        new Set(payrollRuns.map((run) => {
            const date = new Date(run.periodMonth + '-01');
            return (date.getMonth() + 1).toString().padStart(2, '0');
        }))
    ).sort((a, b) => a.localeCompare(b));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payroll" />
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4 md:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <FileCheck2 className="h-5 w-5" />
                            Payroll Workspace & Ledger
                        </CardTitle>
                        <CardDescription>
                            Run payroll, adjust inclusions, manage multi-step approvals, and maintain audit-compliant history for {organization.name}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p>
                            Domain:{' '}
                            <span className="font-medium text-foreground">
                                {organization.domain ?? 'N/A'}
                            </span>
                        </p>
                        <p>
                            Workflows follow strict enterprise controls: Draft Review &rarr; Approval Submission &rarr; Authorization &rarr; Finalization. Finalized runs can only be voided via strict authorization.
                        </p>
                    </CardContent>
                </Card>

                {status === 'payroll-run-created' && (
                    <Card className="border-emerald-200 bg-emerald-50/40 dark:border-emerald-700 dark:bg-emerald-950/20">
                        <CardContent className="pt-6 text-sm text-emerald-900 dark:text-emerald-100">
                            Payroll run created successfully. Review and adjust employee details below.
                        </CardContent>
                    </Card>
                )}

                {status === 'payroll-run-finalized' && (
                    <Card className="border-emerald-200 bg-emerald-50/40 dark:border-emerald-700 dark:bg-emerald-950/20">
                        <CardContent className="pt-6 text-sm text-emerald-900 dark:text-emerald-100">
                            Payroll run finalized successfully. Payslips are now available.
                        </CardContent>
                    </Card>
                )}

                {status === 'payroll-run-voided' && (
                    <Card className="border-red-200 bg-red-50/60 dark:border-red-800 dark:bg-red-950/30">
                        <CardContent className="pt-6 text-sm text-red-900 dark:text-red-200 font-medium">
                            Payroll run was voided. It is excluded from all reports and payslip calculations while retaining compliance audit trail.
                        </CardContent>
                    </Card>
                )}

                {/* Create Payroll Run Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Create Monthly Payroll Run
                        </CardTitle>
                        <CardDescription>
                            Select a month to generate a draft payroll run with pre-calculated statutory deductions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="grid gap-3 sm:max-w-sm"
                        >
                            <label
                                htmlFor="period_month"
                                className="text-sm font-medium"
                            >
                                Payroll month
                            </label>
                            <select
                                id="period_month"
                                value={form.data.period_month}
                                onChange={(event) =>
                                    form.setData(
                                        'period_month',
                                        event.target.value,
                                    )
                                }
                                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                required
                            >
                                <option value="">Select a month</option>
                                {generateMonthOptions().map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={form.errors.period_month} />
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="w-full sm:w-auto"
                            >
                                {form.processing ? (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <FileCheck2 className="mr-2 h-4 w-4" />
                                )}
                                Generate Draft Run
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Ledger & History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Payroll Runs Ledger
                        </CardTitle>
                        <CardDescription>
                            Review historical runs, audit status, and manage approval state.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Filter Controls */}
                        {payrollRuns.length > 0 && (
                            <div className="flex flex-wrap items-center gap-3 border-b pb-3">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="status-filter" className="text-xs font-semibold text-muted-foreground uppercase">
                                        Status:
                                    </label>
                                    <select
                                        id="status-filter"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="draft">Draft (Review)</option>
                                        <option value="pending_approval">Pending Approval</option>
                                        <option value="approved">Approved</option>
                                        <option value="finalized">Finalized</option>
                                        <option value="void_requested">Void Requested</option>
                                        <option value="voided">Voided</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="year-filter" className="text-xs font-semibold text-muted-foreground uppercase">
                                        Year:
                                    </label>
                                    <select
                                        id="year-filter"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                                    >
                                        <option value="all">All Years</option>
                                        {availableYears.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="month-filter" className="text-xs font-semibold text-muted-foreground uppercase">
                                        Month:
                                    </label>
                                    <select
                                        id="month-filter"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                                    >
                                        <option value="all">All Months</option>
                                        {availableMonths.map((month) => (
                                            <option key={month} value={month}>
                                                {new Date(2000, parseInt(month) - 1, 1).toLocaleString('default', { month: 'long' })}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="text-xs text-muted-foreground ml-auto">
                                    Showing {filteredPayrollRuns.length} of {payrollRuns.length} runs
                                </div>
                            </div>
                        )}
                        
                        <div className="grid gap-3">
                        {filteredPayrollRuns.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground text-center">
                                {payrollRuns.length === 0 ? (
                                    'No payroll runs yet. Create your first monthly run above.'
                                ) : (
                                    'No payroll runs match the selected filters.'
                                )}
                            </div>
                        ) : (
                            filteredPayrollRuns.map((run) => (
                                <div
                                    key={run.id}
                                    className={`rounded-lg border p-4 transition-colors ${
                                        run.status === 'voided'
                                            ? 'bg-red-50/30 border-red-200 dark:bg-red-950/10'
                                            : run.status === 'void_requested'
                                            ? 'bg-orange-50/30 border-orange-200 dark:bg-orange-950/10'
                                            : ''
                                    }`}
                                >
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-semibold text-foreground text-base">
                                                {run.periodMonth}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {run.periodStart} to {run.periodEnd}
                                            </p>
                                        </div>
                                        <div>{getStatusBadge(run.status)}</div>
                                    </div>
                                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                                        <p>
                                            Employees:{' '}
                                            <span className="font-medium text-foreground">
                                                {run.employeeCount}
                                            </span>
                                        </p>
                                        <p>
                                            Gross:{' '}
                                            <span className="font-medium text-foreground">
                                                {formatMoney(run.totalGrossSalary)}
                                            </span>
                                        </p>
                                        <p>
                                            Deductions:{' '}
                                            <span className="font-medium text-foreground">
                                                {formatMoney(run.totalDeductions)}
                                            </span>
                                        </p>
                                        <p>
                                            Net pay:{' '}
                                            <span className={`font-semibold ${
                                                run.status === 'voided' ? 'line-through text-muted-foreground' : 'text-emerald-600 dark:text-emerald-400'
                                            }`}>
                                                {formatMoney(run.totalNetPay)}
                                            </span>
                                        </p>
                                        <p className="sm:col-span-2">
                                            NHIS employer contribution:{' '}
                                            <span className="font-medium text-foreground">
                                                {formatMoney(run.nhisEmployerContribution)}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t">
                                        <Button
                                            asChild
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Link href={`/payroll/runs/${run.id}`}>
                                                <Eye className="mr-1.5 h-3.5 w-3.5" />
                                                <span>Review & Audit</span>
                                            </Link>
                                        </Button>

                                        {run.status === 'approved' && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                onClick={() => finalizeRun(run.id)}
                                            >
                                                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                                                <span>Finalize Run</span>
                                            </Button>
                                        )}

                                        {run.status === 'draft' && isOwner && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => finalizeRun(run.id)}
                                            >
                                                <span>Direct Finalize</span>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <ShieldCheck className="h-4 w-4" />
                            Current statutory defaults
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p>
                            Pension employee rate:{' '}
                            {settingsSummary.pensionEmployeeRate}%
                        </p>
                        <p>
                            Pension employer rate:{' '}
                            {settingsSummary.pensionEmployerRate}%
                        </p>
                        <p>NHF rate: {settingsSummary.nhfRate}%</p>
                        <p>
                            NHIS employee/employer:{' '}
                            {settingsSummary.nhisEmployeeRate}% /{' '}
                            {settingsSummary.nhisEmployerRate}%
                        </p>
                        <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="w-full sm:w-auto"
                        >
                            <Link href={editPayrollSettings()}>
                                Open payroll settings
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
