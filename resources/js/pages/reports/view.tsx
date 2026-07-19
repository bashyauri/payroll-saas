import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download } from 'lucide-react';
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

export default function ReportView({
    organization,
    reportType,
    reportLabel,
    headers,
    rows,
    isTrial,
}: ReportViewProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${reportLabel} - View`} />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/reports" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Reports
                        </Link>
                        <h1 className="text-2xl font-bold">{reportLabel}</h1>
                        <p className="text-muted-foreground">
                            {organization.name} - {rows.length} records
                        </p>
                    </div>
                    {!isTrial && (
                        <Button asChild>
                            <a href={`/reports/export?type=${reportType}`} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Export CSV
                            </a>
                        </Button>
                    )}
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
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted">
                                    <tr>
                                        {headers.map((header, index) => (
                                            <th key={index} className="px-4 py-3 text-left font-medium">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, rowIndex) => (
                                        <tr key={rowIndex} className="border-t">
                                            {row.map((cell, cellIndex) => (
                                                <td key={cellIndex} className="px-4 py-3">
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
