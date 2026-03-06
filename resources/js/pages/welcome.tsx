import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { Button } from '@/components/ui/button';
import {
    Users,
    Calculator,
    FileText,
    Lock,
    TrendingUp,
    CheckCircle2,
    ArrowRight,
} from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    const features = [
        {
            icon: Calculator,
            title: 'Accurate Payroll Calculation',
            description:
                'Automated PAYE, pension, NHF deductions compliant with Nigeria Tax Act 2025',
        },
        {
            icon: FileText,
            title: 'Payslip Generation',
            description:
                'Professional payslips in PDF format with detailed breakdown',
        },
        {
            icon: Users,
            title: 'Employee Management',
            description:
                'Centralized employee database with roles and department organization',
        },
        {
            icon: Lock,
            title: 'Secure & Compliant',
            description:
                'Bank-level encryption and full audit trails for compliance',
        },
    ];

    const steps = [
        {
            number: 1,
            title: 'Create Account',
            description: 'Sign up and set up your organization in minutes',
        },
        {
            number: 2,
            title: 'Add Employees',
            description: 'Input employee details, salaries, and deductions',
        },
        {
            number: 3,
            title: 'Run Payroll',
            description: 'Generate payroll with tax calculations automatically',
        },
        {
            number: 4,
            title: 'Distribute & Report',
            description: 'Send payslips and generate compliance reports',
        },
    ];

    const plans = [
        {
            name: 'Starter',
            price: '₦5,000',
            period: '/month',
            description: 'Perfect for small teams',
            features: [
                'Up to 10 employees',
                'Basic payroll processing',
                'Monthly reportings',
                'Email support',
            ],
            highlighted: false,
        },
        {
            name: 'Professional',
            price: '₦15,000',
            period: '/month',
            description: 'For growing businesses',
            features: [
                'Up to 100 employees',
                'Advanced tax calculations',
                'Real-time analytics',
                'Priority support',
                'API access',
            ],
            highlighted: true,
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: 'pricing',
            description: 'For large organizations',
            features: [
                'Unlimited employees',
                'Full customization',
                'Dedicated manager',
                '24/7 support',
                'SLA guarantee',
            ],
            highlighted: false,
        },
    ];

    return (
        <>
            <Head title="Niyi PayLedger - Nigerian Payroll Management">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-background text-foreground">
                {/* Navigation */}
                <nav className="sticky top-0 z-50 border-b border-border bg-card">
                    <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                                    NP
                                </div>
                                <span className="text-lg font-semibold">
                                    Niyi PayLedger
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link href={dashboard()}>
                                        <Button variant="outline">
                                            Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={login()}>
                                            <Button variant="ghost">
                                                Log in
                                            </Button>
                                        </Link>
                                        {canRegister && (
                                            <Link href={register()}>
                                                <Button>Get Started</Button>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background py-20 lg:py-32">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                        <div className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
                    </div>
                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                                <CheckCircle2 className="h-4 w-4" />
                                Nigeria Tax Act 2025 Compliant
                            </div>
                            <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-6xl">
                                Nigerian Payroll{' '}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    Made Simple
                                </span>
                            </h1>
                            <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
                                Automate payroll calculations, tax compliance,
                                and employee payments. Built for Nigerian
                                businesses, from startups to enterprises.
                            </p>
                            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                {canRegister && (
                                    <Link href={register()}>
                                        <Button
                                            size="lg"
                                            className="gap-2 text-base"
                                        >
                                            Start Free Trial{' '}
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                )}
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="text-base"
                                >
                                    Watch Demo
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                No credit card required. 14-day free trial.
                                Cancel anytime.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-card py-20 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-4xl font-bold">
                                Powerful Features for Your Payroll
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                Everything you need to manage payroll
                                efficiently and stay compliant with Nigerian
                                regulations
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="rounded-lg border border-border bg-background p-8 transition-shadow duration-300 hover:shadow-lg"
                                    >
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-20 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-4xl font-bold">
                                How It Works
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                Get your payroll system up and running in four
                                simple steps
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {steps.map((step) => (
                                <div
                                    key={step.number}
                                    className="group relative"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground transition-shadow duration-300 group-hover:shadow-lg">
                                            {step.number}
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                    {step.number < 4 && (
                                        <div className="absolute top-7 -right-4 hidden h-0.5 w-8 bg-border lg:block" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="bg-card py-20 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-4xl font-bold">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                Choose the perfect plan for your business
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            {plans.map((plan, index) => (
                                <div
                                    key={index}
                                    className={`rounded-lg border transition-all duration-300 ${plan.highlighted ? 'scale-105 border-primary bg-primary/5 shadow-lg' : 'border-border bg-background'} p-8`}
                                >
                                    {plan.highlighted && (
                                        <div className="mb-4 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                                            MOST POPULAR
                                        </div>
                                    )}
                                    <h3 className="mb-2 text-2xl font-bold">
                                        {plan.name}
                                    </h3>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        {plan.description}
                                    </p>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">
                                            {plan.price}
                                        </span>
                                        <span className="ml-2 text-muted-foreground">
                                            {plan.period}
                                        </span>
                                    </div>
                                    <Link href={canRegister ? register() : '#'}>
                                        <Button
                                            className="mb-8 w-full"
                                            variant={
                                                plan.highlighted
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                        >
                                            Get Started
                                        </Button>
                                    </Link>
                                    <div className="space-y-4">
                                        {plan.features.map(
                                            (feature, fIndex) => (
                                                <div
                                                    key={fIndex}
                                                    className="flex items-start gap-3"
                                                >
                                                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                                    <span className="text-sm">
                                                        {feature}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-primary py-20 text-primary-foreground lg:py-32">
                    <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
                        <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
                            Ready to Simplify Your Payroll?
                        </h2>
                        <p className="mb-8 text-lg opacity-90">
                            Join hundreds of Nigerian businesses managing
                            payroll efficiently with Niyi PayLedger.
                        </p>
                        {canRegister && (
                            <Link href={register()}>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="gap-2 text-lg"
                                >
                                    Start Your Free Trial{' '}
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-border bg-card">
                    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                        <div className="mb-8 grid gap-8 md:grid-cols-4">
                            <div>
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                                        NP
                                    </div>
                                    <span className="font-semibold">
                                        Niyi PayLedger
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Nigerian Payroll Management System
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold">Product</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-foreground"
                                        >
                                            Features
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-foreground"
                                        >
                                            Pricing
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-foreground"
                                        >
                                            Security
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold">Company</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-foreground"
                                        >
                                            About
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-foreground"
                                        >
                                            Contact
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-foreground"
                                        >
                                            Support
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold">Legal</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-foreground"
                                        >
                                            Privacy
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-foreground"
                                        >
                                            Terms
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-foreground"
                                        >
                                            Compliance
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-border pt-8">
                            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                                <p className="text-sm text-muted-foreground">
                                    v1.2.0 - Developed by{' '}
                                    <span className="font-semibold text-foreground">
                                        The Niyi Consult
                                    </span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    © 2026 Niyi PayLedger. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
