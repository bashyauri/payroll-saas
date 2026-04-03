import { Head, Link, usePage } from '@inertiajs/react';
import {
    Users,
    Calculator,
    FileText,
    Lock,
    ArrowRight,
    Shield,
    Clock,
    CreditCard,
    LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { login, logout, register } from '@/routes';

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
                'Automated PAYE, pension, and NHF deductions for Nigerian payroll',
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
            title: 'Sign Up',
            description: 'Create your account in less than 2 minutes',
        },
        {
            number: 2,
            title: 'Choose Plan',
            description:
                'Select Essential or Professional based on your team size',
        },
        {
            number: 3,
            title: 'Secure Payment',
            description:
                'Pay via Paystack (card, transfer, USSD, or mobile money)',
        },
        {
            number: 4,
            title: 'Get Started',
            description: 'Immediately access full features for 7 days',
        },
    ];

    const trustPoints = [
        {
            icon: Shield,
            label: 'Bank-level Security',
        },
        {
            icon: CreditCard,
            label: 'Multiple Payment Methods',
        },
        {
            icon: Clock,
            label: '7-Day Guarantee',
        },
    ];

    const plans = [
        {
            organizationType: 'Essential',
            staffSizeBand: '1-50 employees',
            monthlyRetainer: '₦800 / employee / month',
            highlighted: true,
        },
        {
            organizationType: 'Professional',
            staffSizeBand: '51+ employees',
            monthlyRetainer: '₦850 / employee / month',
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
                <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
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
                            <div className="flex items-center gap-2 sm:gap-4">
                                {auth.user ? (
                                    <div className="flex items-center gap-2">
                                        <Link href="/onboarding/continue">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs sm:text-sm"
                                            >
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Link
                                            method="post"
                                            href={logout()}
                                            as="button"
                                            type="button"
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-1 text-xs sm:text-sm"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <Link href={login()}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs sm:text-sm"
                                            >
                                                Log in
                                            </Button>
                                        </Link>
                                        {canRegister && (
                                            <Link href={register()}>
                                                <Button
                                                    size="sm"
                                                    className="text-xs sm:text-sm"
                                                >
                                                    Sign Up Free
                                                </Button>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background py-12 sm:py-20 lg:py-32">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                        <div className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
                    </div>
                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mb-6 inline-flex flex-col items-center gap-3 sm:gap-4">
                                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                                    <Shield className="h-4 w-4" />
                                    7-Day Money-Back Guarantee
                                </div>
                            </div>
                            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-6xl">
                                Nigerian Payroll{' '}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    Made Simple
                                </span>
                            </h1>
                            <p className="mb-8 text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
                                Automate payroll calculations, tax compliance,
                                and employee payments. Built for Nigerian
                                businesses, from startups to enterprises.
                            </p>
                            <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                                {canRegister && (
                                    <Link href={register()}>
                                        <Button
                                            size="lg"
                                            className="w-full gap-2 text-base sm:w-auto"
                                        >
                                            Start 7-Day Trial Free{' '}
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                )}
                                <a href="#pricing">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full text-base sm:w-auto"
                                    >
                                        View Pricing
                                    </Button>
                                </a>
                            </div>
                            <p className="text-xs text-muted-foreground sm:text-sm">
                                No credit card required. Payment secured via
                                Paystack.
                            </p>

                            {/* Trust Indicators */}
                            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                {trustPoints.map((point, index) => {
                                    const Icon = point.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background/50 px-4 py-3 backdrop-blur"
                                        >
                                            <Icon className="h-5 w-5 text-primary" />
                                            <span className="text-xs font-medium sm:text-sm">
                                                {point.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section
                    id="pricing"
                    className="bg-card pt-12 pb-10 sm:pt-16 lg:pt-20 lg:pb-12"
                >
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-8 text-center sm:mb-12 lg:mb-14">
                            <h2 className="mb-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
                                Transparent NGN Pricing
                            </h2>
                            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base lg:text-lg">
                                Payroll-first plans priced per employee for
                                Nigerian businesses. Billed annually.
                            </p>
                        </div>

                        <div className="mb-6 grid gap-4 md:hidden">
                            {plans.map((plan, index) => (
                                <div
                                    key={index}
                                    className={`rounded-xl border p-5 ${plan.highlighted ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20' : 'border-border bg-background'}`}
                                >
                                    {plan.highlighted && (
                                        <div className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                                            RECOMMENDED
                                        </div>
                                    )}
                                    <h3 className="mb-3 text-xl font-semibold">
                                        {plan.organizationType}
                                    </h3>
                                    <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                        Staff Size Band
                                    </p>
                                    <p className="mb-4 text-sm font-medium">
                                        {plan.staffSizeBand}
                                    </p>
                                    <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                        Price
                                    </p>
                                    <p className="text-2xl font-bold text-primary sm:text-3xl">
                                        {plan.monthlyRetainer}
                                    </p>
                                    <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                                        Billed annually
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="hidden overflow-hidden rounded-2xl border border-border bg-background md:block">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead className="bg-muted/40">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                Organization Type
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                Staff Size Band
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                Price (NGN)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {plans.map((plan, index) => (
                                            <tr
                                                key={index}
                                                className={`border-t border-border ${plan.highlighted ? 'bg-primary/5' : ''}`}
                                            >
                                                <td className="px-6 py-5 font-medium">
                                                    {plan.organizationType}
                                                </td>
                                                <td className="px-6 py-5 text-muted-foreground">
                                                    {plan.staffSizeBand}
                                                </td>
                                                <td className="px-6 py-5 text-lg font-bold text-primary sm:text-xl">
                                                    {plan.monthlyRetainer}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <Link href={canRegister ? register() : '#'}>
                                <Button
                                    size="lg"
                                    className="w-full gap-2 sm:w-auto"
                                >
                                    Start 7-Day Trial
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-card pt-10 pb-20 sm:pt-16 lg:pt-24 lg:pb-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-12 text-center sm:mb-14 lg:mb-16">
                            <h2 className="mb-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
                                Powerful Features for Your Payroll
                            </h2>
                            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base lg:text-lg">
                                Everything you need to manage payroll
                                efficiently and stay compliant with Nigerian
                                regulations
                            </p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="rounded-lg border border-border bg-background p-6 transition-shadow duration-300 hover:shadow-lg sm:p-8"
                                    >
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="mb-2 text-base font-semibold sm:text-lg">
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

                {/* How It Works - Onboarding Steps */}
                <section className="py-12 sm:py-20 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-12 text-center sm:mb-14 lg:mb-16">
                            <h2 className="mb-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
                                Get Started in 4 Simple Steps
                            </h2>
                            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base lg:text-lg">
                                From sign-up to full access in minutes. No
                                credit card required for the first 7 days.
                            </p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {steps.map((step) => (
                                <div
                                    key={step.number}
                                    className="group relative flex flex-col"
                                >
                                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg sm:h-14 sm:w-14">
                                        {step.number}
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <h3 className="mb-2 text-base font-semibold sm:text-lg">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                    {step.number < 4 && (
                                        <div className="absolute top-6 -right-3 hidden h-0.5 w-6 bg-border transition-colors duration-300 group-hover:bg-primary lg:block" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 rounded-xl border border-border bg-gradient-to-r from-primary/5 to-secondary/5 p-6 sm:p-8">
                            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <div>
                                    <h3 className="mb-1 font-semibold text-foreground">
                                        Ready to get started?
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Your 7-day guarantee starts immediately
                                        after payment. Full refund if
                                        unsatisfied.
                                    </p>
                                </div>
                                {canRegister && (
                                    <Link href={register()}>
                                        <Button className="w-full gap-2 sm:w-auto">
                                            Sign Up Free
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-primary py-12 text-primary-foreground sm:py-20 lg:py-32">
                    <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
                        <h2 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-5xl">
                            Ready to Simplify Your Payroll?
                        </h2>
                        <p className="mb-8 text-sm opacity-90 sm:text-base lg:text-lg">
                            Join hundreds of Nigerian businesses managing
                            payroll efficiently with Niyi PayLedger.
                        </p>
                        {canRegister && (
                            <Link href={register()}>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="w-full gap-2 text-base sm:w-auto"
                                >
                                    Start Your Free Trial{' '}
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                        )}
                        <p className="mt-6 text-xs opacity-75 sm:text-sm">
                            7-day money-back guarantee • No credit card required
                        </p>
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
