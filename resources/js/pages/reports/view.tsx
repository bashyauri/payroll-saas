import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type ReportViewProps = {
    organization: {
        name: string;
        domain: string | null;
    };
    reportType: string;
    reportLabel: string;
    selectedRunId?: string | null;
    availableRuns?: Array<{
        id: string;
        periodMonth: string;
    }>;
    headers: string[];
    rows: (string | number)[][];
    isTrial: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Reports',
        href: '/reports',
    },
    {
        title: 'Report View',
        href: '#',
    },
];

/** Columns beyond the first 3 (employee#, name, dept/title) are numeric — right-align them */
function cellClass(colIndex: number): string {
    return colIndex >= 3
        ? 'px-4 py-3 text-right font-mono text-xs tabular-nums'
        : 'px-4 py-3';
}

function thClass(colIndex: number): string {
    return colIndex >= 3
        ? 'px-4 py-3 text-right font-medium text-xs'
        : 'px-4 py-3 text-left font-medium';
}

export default function ReportView({
    organization,
    reportType,
    reportLabel,
    selectedRunId,
    availableRuns = [],
    headers,
    rows,
    isTrial,
}: ReportViewProps) {
    const runQuery = selectedRunId ? `&payroll_run=${selectedRunId}` : '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${reportLabel} - View`} />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <Link href="/reports" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Reports
                        </Link>
                        <h1 className="text-2xl font-bold">{reportLabel}</h1>
                        <p className="text-muted-foreground">
                            {organization.name} &mdash;{' '}
                            {selectedRunId
                                ? `Finalized payroll run`
                                : 'Current active employee snapshot'}{' '}
                            &mdash; {rows.length} record{rows.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Period selector — always visible */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground">Period:</span>
                            <select
                                value={selectedRunId ?? ''}
                                onChange={(e) => {
                                    const runId = e.target.value;
                                    const url = runId
                                        ? `/reports/view?type=${reportType}&payroll_run=${runId}`
                                        : `/reports/view?type=${reportType}`;
                                    router.visit(url);
                                }}
                                className="h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                            >
                                <option value="">Current Snapshot (Live)</option>
                                {availableRuns.map((run) => (
                                    <option key={run.id} value={run.id}>
                                        Finalized: {run.periodMonth}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {!isTrial && (
                            <>
                                <Button asChild variant="outline" size="sm">
                                    <a href={`/reports/export?type=${reportType}${runQuery}`} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-1.5 h-3.5 w-3.5" />
                                        CSV
                                    </a>
                                </Button>
                                <Button asChild variant="outline" size="sm">
                                    <a href={`/reports/export-pdf?type=${reportType}${runQuery}`} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-1.5 h-3.5 w-3.5" />
                                        PDF
                                    </a>
                                </Button>
                                <Button asChild size="sm">
                                    <a href={`/reports/export-excel?type=${reportType}${runQuery}`} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-1.5 h-3.5 w-3.5" />
                                        Excel
                                    </a>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {isTrial && (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader>
                            <CardTitle className="text-yellow-800">Trial Mode</CardTitle>
                            <CardDescription className="text-yellow-700">
                                You are viewing this report in trial mode. Export is disabled. Upgrade to export reports.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}

                <Card>
                    <CardContent className="p-0">
                        {rows.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
                                <FileX className="h-10 w-10 opacity-40" />
                                <p className="text-sm font-medium">No data available</p>
                                <p className="text-xs max-w-xs">
                                    There are no records to display for this report. Ensure employees are active and a payroll run has been processed.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted">
                                        <tr>
                                            {headers.map((header, index) => (
                                                <th key={index} className={thClass(index)}>
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, rowIndex) => (
                                            <tr key={rowIndex} className="border-t hover:bg-muted/40">
                                                {row.map((cell, cellIndex) => (
                                                    <td key={cellIndex} className={cellClass(cellIndex)}>
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                    {/* Totals footer row — sums string currency values in numeric columns */}
                                    {rows.length > 1 && (
                                        <tfoot className="border-t-2 bg-muted/60 font-semibold">
                                            <tr>
                                                {headers.map((_, colIndex) => {
                                                    if (colIndex === 0) {
                                                        return (
                                                            <td key={colIndex} className="px-4 py-3 text-xs font-bold uppercase tracking-wide">
                                                                Totals
                                                            </td>
                                                        );
                                                    }
                                                    if (colIndex < 3) {
                                                        return <td key={colIndex} className="px-4 py-3" />;
                                                    }
                                                    // Sum numeric columns — strip "NGN " prefix and commas
                                                    const total = rows.reduce((sum, row) => {
                                                        const raw = String(row[colIndex]).replace(/[^0-9.-]/g, '');
                                                        return sum + (parseFloat(raw) || 0);
                                                    }, 0);
                                                    return (
                                                        <td key={colIndex} className="px-4 py-3 text-right font-mono text-xs tabular-nums">
                                                            NGN {total.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
