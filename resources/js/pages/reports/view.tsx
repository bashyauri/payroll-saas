import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Download, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
    selectedRunStatus?: string | null;
    selectedRunMonth?: string | null;
    availableRuns?: Array<{
        id: string;
        periodMonth: string;
        status?: string;
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

/** Determines if a column is numeric currency based on header text */
function isNumericColumn(header: string): boolean {
    if (!header) return false;
    const lower = header.toLowerCase();
    if (
        lower.includes('item') ||
        lower.includes('breakdown') ||
        lower.includes('name') ||
        lower.includes('number') ||
        lower.includes('department') ||
        lower.includes('title') ||
        lower.includes('location') ||
        lower.includes('pin') ||
        lower.includes('pfa') ||
        lower.includes('type')
    ) {
        return false;
    }
    return (
        lower.includes('(ngn)') ||
        lower.includes('total') ||
        lower.includes('salary') ||
        lower.includes('pay') ||
        lower.includes('deduction') ||
        lower.includes('allowance') ||
        lower.includes('bonus') ||
        lower.includes('overtime') ||
        lower.includes('cost') ||
        lower.includes('match') ||
        lower.includes('liability')
    );
}

function cellClass(header: string): string {
    return isNumericColumn(header)
        ? 'px-4 py-3 text-right font-mono text-xs tabular-nums whitespace-nowrap'
        : 'px-4 py-3 text-left text-xs';
}

function thClass(header: string): string {
    return isNumericColumn(header)
        ? 'px-4 py-3 text-right font-medium text-xs whitespace-nowrap'
        : 'px-4 py-3 text-left font-medium text-xs whitespace-nowrap';
}

export default function ReportView({
    organization,
    reportType,
    reportLabel,
    selectedRunId,
    selectedRunStatus,
    selectedRunMonth,
    availableRuns = [],
    headers,
    rows,
    isTrial,
}: ReportViewProps) {
    const runQuery = selectedRunId ? `&payroll_run=${selectedRunId}` : (selectedRunMonth ? '' : '&payroll_run=snapshot');
    const [orientation, setOrientation] = useState('auto');
    const wideReport = headers.length > 7 || headers.reduce((sum, h) => sum + h.length, 0) > 88;
    const pdfQuery = `${runQuery}&orientation=${orientation}`;

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
                        <p className="text-muted-foreground text-xs mt-1">
                            {organization.name} &mdash;{' '}
                            {selectedRunId ? (
                                <span>
                                    Payroll Run: <strong className="font-semibold text-foreground">{selectedRunMonth}</strong>{' '}
                                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted border ml-1">
                                        {selectedRunStatus ?? 'Active'}
                                    </span>
                                </span>
                            ) : (
                                <span>Current Active Employee Base (Live Snapshot)</span>
                            )}{' '}
                            &mdash; {rows.length} record{rows.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Period selector */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground">Period:</span>
                            <select
                                value={selectedRunId ?? 'snapshot'}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const url = val && val !== 'snapshot'
                                        ? `/reports/view?type=${reportType}&payroll_run=${val}`
                                        : `/reports/view?type=${reportType}&payroll_run=snapshot`;
                                    router.visit(url);
                                }}
                                className="h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                            >
                                <option value="snapshot">Current Snapshot (Live Base)</option>
                                {availableRuns.map((run) => (
                                    <option key={run.id} value={run.id}>
                                        {run.periodMonth} {run.status ? `(${run.status})` : ''}
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
                                    <a href={`/reports/export-pdf?type=${reportType}${pdfQuery}`} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-1.5 h-3.5 w-3.5" />
                                        PDF
                                    </a>
                                </Button>
                                <label className="flex items-center gap-2 text-xs text-muted-foreground">PDF layout
                                    <select value={orientation} onChange={event => setOrientation(event.target.value)} className="h-9 rounded-md border bg-background px-2 text-foreground">
                                        <option value="auto">Auto</option><option value="landscape">Landscape</option><option value="portrait">Portrait</option>
                                    </select>
                                </label>
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

                {wideReport && !isTrial && <Alert className="border-amber-300 bg-amber-50 text-amber-950"><AlertTitle>This report may exceed the page margins</AlertTitle><AlertDescription className="flex flex-wrap items-center justify-between gap-3 text-amber-900"><span>Use Landscape or download a compact version with shortened column headings.</span><Button asChild size="sm" variant="outline"><a href={`/reports/export-pdf?type=${reportType}${pdfQuery}&abridged=1`} target="_blank" rel="noopener noreferrer">Download compact PDF</a></Button></AlertDescription></Alert>}

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
                                                <th key={index} className={thClass(header)}>
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, rowIndex) => (
                                            <tr key={rowIndex} className="border-t hover:bg-muted/40">
                                                {row.map((cell, cellIndex) => (
                                                    <td key={cellIndex} className={cellClass(headers[cellIndex])}>
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
                                                {headers.map((header, colIndex) => {
                                                    if (colIndex === 0) {
                                                        return (
                                                            <td key={colIndex} className="px-4 py-3 text-xs font-bold uppercase tracking-wide">
                                                                Totals
                                                            </td>
                                                        );
                                                    }
                                                    if (!isNumericColumn(header)) {
                                                        return <td key={colIndex} className="px-4 py-3" />;
                                                    }
                                                    // Sum numeric columns — strip "NGN " prefix and commas
                                                    const total = rows.reduce((sum, row) => {
                                                        const raw = String(row[colIndex] ?? '').replace(/[^0-9.-]/g, '');
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
