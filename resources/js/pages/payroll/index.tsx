import { Head, Link, router, useForm } from '@inertiajs/react';
import { FileCheck2, LoaderCircle, ShieldCheck } from 'lucide-react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
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
        createdAt: string | null;
        finalizedAt: string | null;
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
    settingsSummary,
    payrollRuns,
    status,
}: PayrollPageProps) {
    const form = useForm({
        period_month: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        form.post('/payroll/runs', {
            preserveScroll: true,
        });
    };

    const finalizeRun = (runId: string): void => {
        router.post(
            `/payroll/runs/${runId}/finalize`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const formatMoney = (amount: number): string => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payroll" />
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4 md:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <FileCheck2 className="h-5 w-5" />
                            Payroll workspace
                        </CardTitle>
                        <CardDescription>
                            Run payroll and statutory workflows for{' '}
                            {organization.name}.
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
                            Create a monthly run, review totals, and finalize
                            once billing checks pass.
                        </p>
                    </CardContent>
                </Card>

                {status === 'payroll-run-created' && (
                    <Card className="border-emerald-200 bg-emerald-50/40 dark:border-emerald-700 dark:bg-emerald-950/20">
                        <CardContent className="pt-6 text-sm text-emerald-900 dark:text-emerald-100">
                            Payroll run created successfully.
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Create payroll run
                        </CardTitle>
                        <CardDescription>
                            Select a payroll month to create a draft run with
                            immutable settings snapshot and totals.
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
                            <input
                                id="period_month"
                                type="month"
                                value={form.data.period_month}
                                onChange={(event) =>
                                    form.setData(
                                        'period_month',
                                        event.target.value,
                                    )
                                }
                                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <InputError message={form.errors.period_month} />
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="w-full sm:w-auto"
                            >
                                {form.processing && (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create draft run
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Payroll runs ledger
                        </CardTitle>
                        <CardDescription>
                            Track each month, totals, and finalization state.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        {payrollRuns.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                No payroll runs yet. Create your first monthly
                                run.
                            </div>
                        ) : (
                            payrollRuns.map((run) => (
                                <div
                                    key={run.id}
                                    className="rounded-lg border p-4"
                                >
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-medium text-foreground">
                                                {run.periodMonth}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {run.periodStart} to{' '}
                                                {run.periodEnd}
                                            </p>
                                        </div>
                                        <div className="text-xs tracking-wide text-muted-foreground uppercase">
                                            {run.status}
                                        </div>
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
                                                {formatMoney(
                                                    run.totalGrossSalary,
                                                )}
                                            </span>
                                        </p>
                                        <p>
                                            Deductions:{' '}
                                            <span className="font-medium text-foreground">
                                                {formatMoney(
                                                    run.totalDeductions,
                                                )}
                                            </span>
                                        </p>
                                        <p>
                                            Net pay:{' '}
                                            <span className="font-medium text-foreground">
                                                {formatMoney(run.totalNetPay)}
                                            </span>
                                        </p>
                                    </div>
                                    {run.status !== 'finalized' && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="mt-3"
                                            onClick={() => finalizeRun(run.id)}
                                        >
                                            Finalize run
                                        </Button>
                                    )}
                                </div>
                            ))
                        )}
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
