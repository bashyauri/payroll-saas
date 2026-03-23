import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Clock3, ShieldCheck } from 'lucide-react';
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
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardDescription>Billing status</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                Active
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Payroll finalization is enabled.
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardDescription>7-day guarantee</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Clock3 className="h-5 w-5 text-primary" />5
                                days left
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Refund remains available within the active guarantee
                            window.
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardDescription>Current plan</CardDescription>
                            <CardTitle className="text-xl">Essential</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between gap-3">
                            <Badge variant="secondary">
                                NGN 800 / employee
                            </Badge>
                            <Button size="sm" asChild>
                                <Link href="/billing/plans">
                                    Manage billing
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            Payroll Finalization Guard
                        </CardTitle>
                        <CardDescription>
                            Finalization checks subscription status, grace
                            state, and billing blocks before disbursement.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center gap-3">
                        <Button asChild>
                            <Link href="/billing/plans">
                                Select or change plan
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/settings/profile">
                                Update organization details
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50/40 dark:border-amber-700 dark:bg-amber-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            Payment method selection
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Users choose payment method on Paystack-hosted checkout
                        after selecting a plan in this app.
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
