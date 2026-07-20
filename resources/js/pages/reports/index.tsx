import { Head, Link } from '@inertiajs/react';
import { Landmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type ReportsPageProps = {
    organization: {
        name: string;
        domain: string | null;
    };
    activeType: string;
    reportOptions: Array<{
        key: string;
        label: string;
        description?: string;
        href: string;
        exportHref: string;
        exportPdfHref: string;
        exportExcelHref: string;
    }>;
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
];

export default function ReportsIndex({
    organization,
    activeType,
    reportOptions,
}: ReportsPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 md:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Landmark className="h-5 w-5" />
                            Compliance reports
                        </CardTitle>
                        <CardDescription>
                            Open compliance report views and export CSV files
                            for {organization.name}.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <div className="grid gap-3 sm:grid-cols-2">
                    {reportOptions.map((report) => (
                        <Card key={report.key}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">
                                    {report.label}
                                </CardTitle>
                                {report.description && (
                                    <CardDescription>
                                        {report.description}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                                <span>
                                    {activeType === report.key ? (
                                        <Badge variant="secondary">
                                            Current view
                                        </Badge>
                                    ) : (
                                        'Open report view'
                                    )}
                                </span>
                                <a
                                    className="text-primary underline underline-offset-4 cursor-pointer"
                                    href={report.href}
                                >
                                    Open
                                </a>
                                <a
                                    className="text-primary underline underline-offset-4 cursor-pointer"
                                    href={report.exportHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Export CSV
                                </a>
                                <a
                                    className="text-primary underline underline-offset-4 cursor-pointer"
                                    href={report.exportPdfHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Export PDF
                                </a>
                                <a
                                    className="text-primary underline underline-offset-4 cursor-pointer"
                                    href={report.exportExcelHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Export Excel
                                </a>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
