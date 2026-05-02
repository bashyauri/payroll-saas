import { Head, Link } from '@inertiajs/react';
import { FileCheck2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
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
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Payroll',
        href: '/payroll',
    },
];

export default function PayrollIndex({
    organization,
    settingsSummary,
}: PayrollPageProps) {
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
                            Payroll execution is staged. This page now serves as
                            the live destination for dashboard quick actions.
                        </p>
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
