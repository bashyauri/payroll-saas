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
import { dashboard } from '@/routes';
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
        href: string;
    }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
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
                            Browse report hubs for {organization.name}. Full
                            exports are scheduled for Stage 5.
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
                                <Link
                                    className="text-primary underline underline-offset-4"
                                    href={report.href}
                                >
                                    Open
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
