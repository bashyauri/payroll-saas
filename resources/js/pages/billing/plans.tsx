import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    CreditCard,
    Landmark,
    Smartphone,
    ShieldCheck,
} from 'lucide-react';
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
}: {
    plans: Plan[];
    hasPlans: boolean;
    paymentMethods: string[];
    guaranteeDays: number;
    currency: string;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing Plans" />

            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-accent/10 to-background">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Choose Your Payroll Plan
                        </CardTitle>
                        <CardDescription>
                            Pricing is in NGN and billed annually. After
                            choosing a plan, you will continue to Paystack to
                            select your payment method.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm md:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <span>
                                {guaranteeDays}-day money-back guarantee
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BadgeCheck className="h-4 w-4 text-primary" />
                            <span>
                                NTA 2025 compliance included in all plans
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {hasPlans ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {plans.map((plan) => {
                            const isProfessional = plan.slug === 'professional';

                            return (
                                <Card
                                    key={plan.slug}
                                    className={
                                        isProfessional
                                            ? 'border-primary shadow-sm'
                                            : ''
                                    }
                                >
                                    <CardHeader>
                                        <div className="mb-1 flex items-center justify-between">
                                            <CardTitle>{plan.name}</CardTitle>
                                            {isProfessional ? (
                                                <Badge className="bg-primary text-primary-foreground">
                                                    Popular for growing teams
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Best for small teams
                                                </Badge>
                                            )}
                                        </div>
                                        <CardDescription>
                                            {staffBand(
                                                plan.min_employees,
                                                plan.max_employees,
                                            )}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-3xl font-bold">
                                                {formatNaira(
                                                    plan.price_per_employee,
                                                )}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                per employee / month (
                                                {plan.billing_period})
                                            </p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-sm font-medium">
                                                Includes
                                            </p>
                                            <ul className="space-y-1 text-sm text-muted-foreground">
                                                {plan.features
                                                    .slice(0, 7)
                                                    .map((feature) => (
                                                        <li
                                                            key={feature}
                                                            className="flex items-start gap-2"
                                                        >
                                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                                                            <span>
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
                                    <CardFooter className="flex-col items-start gap-2">
                                        <Button className="w-full" asChild>
                                            <Link
                                                href="/billing/checkout"
                                                method="post"
                                                data={{
                                                    plan: plan.slug,
                                                    employee_count:
                                                        plan.min_employees,
                                                }}
                                            >
                                                Continue to Paystack
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <p className="text-xs text-muted-foreground">
                                            Payment method is selected on
                                            Paystack checkout.
                                        </p>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>No active billing plans found</CardTitle>
                            <CardDescription>
                                Plans are now sourced from the database only.
                                Seed active plans to enable checkout.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Run your subscription plan seeder and refresh this
                            page.
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Supported Payment Methods on Checkout
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm md:grid-cols-4">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" /> Card
                        </div>
                        <div className="flex items-center gap-2">
                            <Landmark className="h-4 w-4" /> Bank Transfer
                        </div>
                        <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" /> USSD
                        </div>
                        <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" /> Mobile Money
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
