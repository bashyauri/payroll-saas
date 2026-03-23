import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    ShieldCheck,
    Users,
    FileText,
    Settings,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
    // Onboarding checklist items
    const onboardingItems = [
        {
            id: 'add-employees',
            title: 'Add your first employee',
            description: 'Start building your employee database',
            icon: Users,
            completed: false,
            href: '#',
        },
        {
            id: 'configure-payroll',
            title: 'Configure payroll settings',
            description: 'Set up deductions and salary bands',
            icon: Settings,
            completed: false,
            href: '#',
        },
        {
            id: 'run-payroll',
            title: 'Run your first payroll',
            description: 'Generate payslips and process payments',
            icon: FileText,
            completed: false,
            href: '#',
        },
    ];

    const completedCount = onboardingItems.filter(
        (item) => item.completed,
    ).length;
    const progressPercent = Math.round(
        (completedCount / onboardingItems.length) * 100,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 md:p-6">
                {/* Onboarding Checklist - Mobile optimized */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardHeader>
                        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <CardTitle className="text-lg sm:text-xl">
                                    Getting Started
                                </CardTitle>
                                <CardDescription className="mt-1 text-xs sm:text-sm">
                                    Complete these steps to set up your payroll
                                    system
                                </CardDescription>
                            </div>
                            <Badge
                                variant="secondary"
                                className="w-fit text-xs sm:text-sm"
                            >
                                {completedCount} of {onboardingItems.length}{' '}
                                done
                            </Badge>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                            <Progress
                                value={progressPercent}
                                className="flex-1"
                            />
                            <span className="text-xs font-medium text-muted-foreground">
                                {progressPercent}%
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {onboardingItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className="group block"
                                >
                                    <div className="flex items-start gap-3 rounded-lg border border-border bg-background/50 p-3 transition-colors hover:border-primary/50 hover:bg-background sm:p-4">
                                        <div
                                            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                                                item.completed
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400'
                                                    : 'border border-border'
                                            }`}
                                        >
                                            {item.completed ? (
                                                <CheckCircle2 className="h-4 w-4" />
                                            ) : (
                                                <Icon className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p
                                                className={`text-xs font-medium sm:text-sm ${
                                                    item.completed
                                                        ? 'text-muted-foreground line-through'
                                                        : 'text-foreground'
                                                }`}
                                            >
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                        {!item.completed && (
                                            <div className="flex-shrink-0">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-xs"
                                                >
                                                    Start
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Billing Status Cards - Mobile optimized grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs sm:text-sm">
                                Billing status
                            </CardDescription>
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                                <span>Active</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground sm:text-sm">
                            Payroll finalization is enabled.
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs sm:text-sm">
                                7-day guarantee
                            </CardDescription>
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                <Clock3 className="h-5 w-5 flex-shrink-0 text-primary" />
                                <span>5 days left</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground sm:text-sm">
                            Refund available within guarantee window.
                        </CardContent>
                    </Card>

                    <Card className="sm:col-span-2 lg:col-span-1">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs sm:text-sm">
                                Current plan
                            </CardDescription>
                            <CardTitle className="text-lg sm:text-xl">
                                Essential
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                                ₦800 / emp
                            </Badge>
                            <Button
                                size="sm"
                                variant="ghost"
                                asChild
                                className="text-xs"
                            >
                                <Link href="/billing/plans">Manage</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Payroll Finalization Guard */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <ShieldCheck className="h-5 w-5 flex-shrink-0 text-primary" />
                            <span>Payroll Finalization Guard</span>
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Checks subscription status before disbursement.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                        <Button size="sm" asChild>
                            <Link href="/billing/plans">Change plan</Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                            <Link href="/settings/profile">
                                Update organization
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Payment Info Card */}
                <Card className="border-amber-200 bg-amber-50/40 dark:border-amber-700 dark:bg-amber-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600" />
                            <span>Payment Details</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground sm:text-sm">
                        Your subscription is active. Payment and refund settings
                        are managed in your account settings.
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
