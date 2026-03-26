import { Head, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    CreditCard,
    Landmark,
    Smartphone,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Plan = {
    name: string;
    slug: string;
    currency: string;
    price_per_employee: number;
    billing_period: string;
    min_employees: number;
    max_employees: number | null;
    features: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing Plans',
        href: '/billing/plans',
    },
];

function formatNaira(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
    }).format(amount);
}

function staffBand(minEmployees: number, maxEmployees: number | null): string {
    if (!maxEmployees) {
        return `${minEmployees}+ employees`;
    }

    return `${minEmployees}-${maxEmployees} employees`;
}

export default function BillingPlans({
    plans,
    hasPlans,
    guaranteeDays,
    vatRate,
}: {
    plans: Plan[];
    hasPlans: boolean;
    paymentMethods: string[];
    guaranteeDays: number;
    currency: string;
    vatRate: number;
}) {
    const [employeeCounts, setEmployeeCounts] = useState<
        Record<string, string>
    >({});

    const { errors, flash } = usePage().props as {
        errors: Partial<Record<string, string>>;
        flash?: Partial<Record<string, string>>;
    };
    const csrfToken =
        typeof document !== 'undefined'
            ? (document
                  .querySelector('meta[name="csrf-token"]')
                  ?.getAttribute('content') ?? '')
            : '';

    const resolveEmployeeCount = (plan: Plan): number => {
        const raw = employeeCounts[plan.slug];
        const parsed = Number.parseInt(raw ?? '', 10);

        return Number.isNaN(parsed) ? plan.min_employees : parsed;
    };

    const steps = [
        { number: 1, title: 'Sign Up', completed: true },
        { number: 2, title: 'Verify Email', completed: true },
        { number: 3, title: 'Choose Plan', completed: false },
        { number: 4, title: 'Start Free Trial', completed: false },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing Plans" />

            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                {(errors.checkout || flash?.onboarding_notice) && (
                    <Card className="border-red-200 bg-red-50/70 dark:border-red-900 dark:bg-red-950/20">
                        <CardContent className="pt-6 text-sm text-red-700 dark:text-red-300">
                            {errors.checkout ?? flash?.onboarding_notice}
                        </CardContent>
                    </Card>
                )}

                {/* Step Indicator */}
                <div className="flex justify-between gap-2 rounded-lg border border-border bg-muted/30 p-4 sm:gap-3 md:border-0 md:bg-transparent md:p-0">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="flex flex-1 flex-col items-center gap-1"
                        >
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all sm:h-10 sm:w-10 sm:text-sm ${
                                    step.completed
                                        ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400'
                                        : step.number === 3
                                          ? 'bg-primary text-primary-foreground'
                                          : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {step.completed ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    step.number
                                )}
                            </div>
                            <span className="hidden text-center text-xs font-medium text-muted-foreground sm:inline">
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Header Card */}
                <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-accent/10 to-background">
                    <CardHeader>
                        <CardTitle className="text-xl sm:text-2xl">
                            Choose Your Payroll Plan
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Rates are in NGN and billed annually. Prices are
                            VAT-exclusive, and 7.5% VAT is added at checkout.
                            After choosing a plan, you will continue to Paystack
                            to select your preferred payment method.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-xs sm:gap-4 sm:text-sm md:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 flex-shrink-0 text-primary" />
                            <span>
                                {guaranteeDays}-day money-back guarantee
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {hasPlans ? (
                    <>
                        {/* Plans Grid - Mobile optimized */}
                        <div className="grid gap-4 lg:grid-cols-2">
                            {plans.map((plan) => {
                                const isProfessional =
                                    plan.slug === 'professional';
                                const selectedEmployeeCount =
                                    resolveEmployeeCount(plan);
                                const billingCycleMonths =
                                    plan.billing_period === 'annual' ? 12 : 1;
                                const estimatedMonthlyAmount =
                                    selectedEmployeeCount *
                                    plan.price_per_employee;
                                const estimatedSubtotalAmount =
                                    estimatedMonthlyAmount * billingCycleMonths;
                                const estimatedVatAmount =
                                    estimatedSubtotalAmount * vatRate;
                                const estimatedCheckoutAmount =
                                    estimatedSubtotalAmount +
                                    estimatedVatAmount;
                                const employeeRangeError =
                                    selectedEmployeeCount < plan.min_employees
                                        ? `${plan.name} requires at least ${plan.min_employees} employees.`
                                        : plan.max_employees !== null &&
                                            selectedEmployeeCount >
                                                plan.max_employees
                                          ? `${plan.name} supports a maximum of ${plan.max_employees} employees. Choose Professional for larger teams.`
                                          : null;

                                return (
                                    <Card
                                        key={plan.slug}
                                        className={`flex flex-col transition-all duration-300 hover:shadow-lg ${
                                            isProfessional
                                                ? 'border-primary shadow-sm ring-1 ring-primary/20'
                                                : ''
                                        }`}
                                    >
                                        <CardHeader>
                                            <div className="mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                                                <CardTitle className="text-lg sm:text-xl">
                                                    {plan.name}
                                                </CardTitle>
                                                {isProfessional ? (
                                                    <Badge className="w-fit bg-primary text-xs text-primary-foreground">
                                                        Recommended
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="secondary"
                                                        className="w-fit text-xs"
                                                    >
                                                        Starter
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardDescription className="text-xs sm:text-sm">
                                                {staffBand(
                                                    plan.min_employees,
                                                    plan.max_employees,
                                                )}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="flex-1 space-y-4">
                                            {/* Price Section */}
                                            <div className="rounded-lg bg-muted/50 p-3 sm:p-4">
                                                <p className="text-2xl font-bold text-primary sm:text-3xl">
                                                    {formatNaira(
                                                        plan.price_per_employee,
                                                    )}
                                                </p>
                                                <p className="text-xs text-muted-foreground sm:text-sm">
                                                    per employee / month
                                                    <br />
                                                    Billed {plan.billing_period}
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor={`employee-count-${plan.slug}`}
                                                    className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                                                >
                                                    Number of employees
                                                </label>
                                                <Input
                                                    id={`employee-count-${plan.slug}`}
                                                    type="number"
                                                    min={plan.min_employees}
                                                    max={
                                                        plan.max_employees ??
                                                        undefined
                                                    }
                                                    value={
                                                        employeeCounts[
                                                            plan.slug
                                                        ] ??
                                                        String(
                                                            plan.min_employees,
                                                        )
                                                    }
                                                    onChange={(event) => {
                                                        setEmployeeCounts(
                                                            (prev) => ({
                                                                ...prev,
                                                                [plan.slug]:
                                                                    event.target
                                                                        .value,
                                                            }),
                                                        );
                                                    }}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Allowed range:{' '}
                                                    {staffBand(
                                                        plan.min_employees,
                                                        plan.max_employees,
                                                    )}
                                                </p>
                                                <p className="text-sm font-medium text-foreground">
                                                    Estimated monthly amount
                                                    (excl. VAT):{' '}
                                                    {formatNaira(
                                                        estimatedMonthlyAmount,
                                                    )}
                                                </p>
                                                <p className="text-sm font-medium text-foreground">
                                                    Subtotal at checkout (excl.
                                                    VAT):{' '}
                                                    {formatNaira(
                                                        estimatedSubtotalAmount,
                                                    )}
                                                </p>
                                                <p className="text-sm font-medium text-foreground">
                                                    VAT (
                                                    {(vatRate * 100).toFixed(1)}
                                                    %):{' '}
                                                    {formatNaira(
                                                        estimatedVatAmount,
                                                    )}
                                                </p>
                                                <p className="text-sm font-semibold text-primary">
                                                    Amount payable:{' '}
                                                    {formatNaira(
                                                        estimatedCheckoutAmount,
                                                    )}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    This reflects{' '}
                                                    {plan.billing_period}{' '}
                                                    billing.
                                                </p>
                                                {employeeRangeError && (
                                                    <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                                        {employeeRangeError}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Features */}
                                            <div>
                                                <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                    Includes
                                                </p>
                                                <ul className="space-y-2 text-xs text-muted-foreground sm:text-sm">
                                                    {plan.features
                                                        .slice(0, 7)
                                                        .map((feature) => (
                                                            <li
                                                                key={feature}
                                                                className="flex items-start gap-2"
                                                            >
                                                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                                                <span className="leading-snug">
                                                                    {feature.replaceAll(
                                                                        '_',
                                                                        ' ',
                                                                    )}
                                                                </span>
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="flex-col items-start gap-3 border-t border-border pt-4">
                                            {employeeRangeError ? (
                                                <Button
                                                    className="w-full gap-2 text-sm"
                                                    disabled
                                                >
                                                    Start Free Trial
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <form
                                                    action="/billing/checkout"
                                                    method="post"
                                                    target="_blank"
                                                    className="w-full"
                                                >
                                                    <input
                                                        type="hidden"
                                                        name="_token"
                                                        value={csrfToken}
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name="plan"
                                                        value={plan.slug}
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name="employee_count"
                                                        value={
                                                            selectedEmployeeCount
                                                        }
                                                    />
                                                    <Button
                                                        type="submit"
                                                        className="w-full gap-2 text-sm"
                                                    >
                                                        Start Free Trial
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                Paystack opens in a new tab.
                                                7-day guarantee starts
                                                immediately.
                                            </p>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Payment Methods Section */}
                        {/* <Card className="border-border/50 bg-muted/30">
                            <CardHeader>
                                <CardTitle className="text-base sm:text-lg">
                                    Secure Payment Methods
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Choose your preferred payment method on
                                    Paystack checkout
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-xs sm:p-4 sm:text-sm">
                                    <CreditCard className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span>Debit Card</span>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-xs sm:p-4 sm:text-sm">
                                    <Landmark className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span>Bank Transfer</span>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-xs sm:p-4 sm:text-sm">
                                    <Smartphone className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span>USSD</span>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-xs sm:p-4 sm:text-sm">
                                    <Smartphone className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span>Mobile Money</span>
                                </div>
                            </CardContent>
                        </Card> */}

                        {/* FAQ Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base sm:text-lg">
                                    What happens next?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-xs sm:text-sm">
                                <div className="flex gap-3">
                                    <span className="flex-shrink-0 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                                        1
                                    </span>
                                    <div>
                                        <p className="font-medium text-foreground">
                                            Click "Start Free Trial"
                                        </p>
                                        <p className="text-muted-foreground">
                                            You'll be redirected to Paystack to
                                            complete payment
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="flex-shrink-0 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                                        2
                                    </span>
                                    <div>
                                        <p className="font-medium text-foreground">
                                            Choose payment method
                                        </p>
                                        <p className="text-muted-foreground">
                                            Card, bank transfer, USSD, or mobile
                                            money
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="flex-shrink-0 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                                        3
                                    </span>
                                    <div>
                                        <p className="font-medium text-foreground">
                                            Full access immediately
                                        </p>
                                        <p className="text-muted-foreground">
                                            Your 7-day guarantee starts right
                                            away
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>No active billing plans found</CardTitle>
                            <CardDescription>
                                Plans are sourced from the database. Seed active
                                plans to enable checkout.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
