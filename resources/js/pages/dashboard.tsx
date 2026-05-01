import { Head, Link } from '@inertiajs/react';
import { Building2, Clock3, CreditCard, FileText, Users } from 'lucide-react';
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
import { plans as billingPlans } from '@/routes/billing';
import { edit as editProfile } from '@/routes/profile';
import { create as createEmployee } from '@/routes/tenant/employees';
import { edit as editWorkspace } from '@/routes/workspace';
import type { BreadcrumbItem } from '@/types';

type DashboardProps = {
    organization: {
        name: string;
        type: string;
        slug: string;
        billingStatus: string;
        domain: string | null;
    };
    trial: {
        endsAt: string | null;
        daysRemaining: number | null;
        countdownLabel: string | null;
    };
    plan: {
        name: string | null;
        billingPeriod: string | null;
        pricePerEmployee: string | number | null;
        currency: string | null;
        subscriptionStatus: string | null;
        paidEmployeeCount: number | null;
        minEmployees: number | null;
        maxEmployees: number | null;
    };
    quickStats: {
        employees: number;
    };
    guards: {
        isReadOnly: boolean;
        isTrial: boolean;
        accessMode: string;
        accessMessage: string;
        organizationRole: string | null;
        canFinalizePayroll: boolean;
        canAddEmployee: boolean;
        canManageWorkspace: boolean;
        employeeLimit: number | null;
        isNearEmployeeLimit: boolean;
        isAtEmployeeLimit: boolean;
    };
    organizationOptions: Array<{
        id: string;
        name: string;
        type: string;
        isCurrent: boolean;
        domain: string | null;
    }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

function formatMoney(
    currency: string | null,
    amount: string | number | null,
): string {
    if (currency === null || amount === null) {
        return 'N/A';
    }

    const numericAmount =
        typeof amount === 'string' ? Number.parseFloat(amount) : amount;

    if (Number.isNaN(numericAmount)) {
        return 'N/A';
    }

    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(numericAmount);
}

export default function Dashboard({
    organization,
    trial,
    plan,
    quickStats,
    guards,
    organizationOptions,
}: DashboardProps) {
    const hasMultipleOrganizations = organizationOptions.length > 1;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 md:p-6">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Welcome to your Payroll Dashboard
                        </CardTitle>
                        <CardDescription>
                            Full feature access is unlocked immediately after
                            payment.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs text-muted-foreground">
                                Organization name
                            </p>
                            <p className="text-sm font-semibold">
                                {organization.name}
                            </p>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs text-muted-foreground">
                                Organization type
                            </p>
                            <p className="text-sm font-semibold capitalize">
                                {organization.type}
                            </p>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs text-muted-foreground">
                                Trial countdown
                            </p>
                            <p className="text-sm font-semibold">
                                {trial.countdownLabel ?? 'N/A'}
                            </p>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs text-muted-foreground">
                                Employees
                            </p>
                            <p className="text-sm font-semibold">
                                {quickStats.employees}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Plan details</CardDescription>
                            <CardTitle>
                                {plan.name ?? 'No active plan found'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                <span className="capitalize">
                                    {plan.billingPeriod
                                        ? `${plan.billingPeriod} billing`
                                        : 'N/A'}
                                </span>
                            </div>
                            <p>
                                Price per employee:{' '}
                                <span className="font-medium text-foreground">
                                    {formatMoney(
                                        plan.currency,
                                        plan.pricePerEmployee,
                                    )}
                                </span>
                            </p>
                            <p>
                                Paid employee count:{' '}
                                <span className="font-medium text-foreground">
                                    {plan.paidEmployeeCount ?? 'N/A'}
                                </span>
                            </p>
                            <p>
                                Plan employee band:{' '}
                                <span className="font-medium text-foreground">
                                    {plan.minEmployees === null
                                        ? 'N/A'
                                        : plan.maxEmployees === null
                                          ? `${plan.minEmployees}+`
                                          : `${plan.minEmployees}-${plan.maxEmployees}`}
                                </span>
                            </p>
                            <p>
                                Employee usage:{' '}
                                <span className="font-medium text-foreground">
                                    {guards.employeeLimit === null
                                        ? `${quickStats.employees} / N/A`
                                        : `${quickStats.employees} / ${guards.employeeLimit}`}
                                </span>
                            </p>
                            <Badge variant="secondary" className="capitalize">
                                {plan.subscriptionStatus ??
                                    organization.billingStatus}
                            </Badge>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Quick actions</CardDescription>
                            <CardTitle>Get work done</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button asChild className="w-full justify-start">
                                {guards.canAddEmployee ? (
                                    <Link href={createEmployee()}>
                                        <Users className="mr-2 h-4 w-4" />
                                        Add Employee
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center text-muted-foreground">
                                        <Users className="mr-2 h-4 w-4" />
                                        Add Employee (owner/admin only)
                                    </span>
                                )}
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full justify-start"
                            >
                                <Link
                                    href={billingPlans({
                                        query: { upgrade: 1 },
                                    })}
                                >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Upgrade plan
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full justify-start"
                            >
                                {guards.canFinalizePayroll ? (
                                    <Link href="#">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Run Payroll
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center text-muted-foreground">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Run Payroll (owner/admin only)
                                    </span>
                                )}
                            </Button>
                            <Button
                                asChild
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                <Link href="#">
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Payslips
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Workspace</CardDescription>
                            <CardTitle>Domain & organization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="text-muted-foreground">
                                Current domain:{' '}
                                <span className="font-medium text-foreground">
                                    {organization.domain ?? 'N/A'}
                                </span>
                            </p>
                            <p className="text-muted-foreground">
                                Your role:{' '}
                                <span className="font-medium text-foreground capitalize">
                                    {guards.organizationRole ?? 'member'}
                                </span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    asChild
                                    size="sm"
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    {guards.canManageWorkspace ? (
                                        <Link href={editWorkspace()}>
                                            Change workspace URL
                                        </Link>
                                    ) : (
                                        <span className="text-muted-foreground">
                                            Change workspace URL (owner/admin
                                            only)
                                        </span>
                                    )}
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    <Link href={editProfile()}>
                                        Update organization profile
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {(guards.isNearEmployeeLimit || guards.isAtEmployeeLimit) && (
                    <Card className="border-orange-200 bg-orange-50/40 dark:border-orange-700 dark:bg-orange-950/20">
                        <CardHeader>
                            <CardTitle className="text-base">
                                {guards.isAtEmployeeLimit
                                    ? 'Employee limit reached'
                                    : 'You are close to your employee limit'}
                            </CardTitle>
                            <CardDescription>
                                Upgrade to add more employees
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                Current usage:{' '}
                                <span className="font-medium text-foreground">
                                    {guards.employeeLimit === null
                                        ? `${quickStats.employees} / N/A`
                                        : `${quickStats.employees} / ${guards.employeeLimit}`}
                                </span>
                            </div>
                            <Button
                                asChild
                                size="sm"
                                className="w-full sm:w-auto"
                            >
                                <Link
                                    href={billingPlans({
                                        query: { upgrade: 1 },
                                    })}
                                >
                                    Upgrade plan
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {hasMultipleOrganizations && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Building2 className="h-4 w-4" />
                                Your organizations
                            </CardTitle>
                            <CardDescription>
                                You currently belong to multiple organizations.
                                Workspace switcher is not enabled yet in MVP.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-2 sm:grid-cols-2">
                            {organizationOptions.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-md border p-3"
                                >
                                    <p className="text-sm font-medium">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                        {item.type}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.domain ?? 'No domain yet'}
                                    </p>
                                    {item.isCurrent && (
                                        <Badge
                                            className="mt-2"
                                            variant="secondary"
                                        >
                                            Current workspace
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                <Card className="border-amber-200 bg-amber-50/40 dark:border-amber-700 dark:bg-amber-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Clock3 className="h-4 w-4" />
                            Trial and refund note
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {trial.countdownLabel ??
                            'Your trial/refund window information will appear here once subscription data is available.'}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
