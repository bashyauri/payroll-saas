import { Form, Head } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    const steps = [
        { number: 1, title: 'Sign Up', completed: true },
        { number: 2, title: 'Verify Email', completed: false },
        { number: 3, title: 'Choose Plan', completed: false },
        { number: 4, title: 'Start Free Trial', completed: false },
    ];

    return (
        <AuthLayout
            title="Create your account"
            description="Get started with your Nigerian payroll solution"
        >
            <Head title="Register" />

            {/* Step Indicator - Mobile optimized */}
            <div className="mb-8 flex justify-between gap-2 sm:gap-3">
                {steps.map((step) => (
                    <div
                        key={step.number}
                        className="flex flex-1 flex-col items-center gap-1"
                    >
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all sm:h-10 sm:w-10 sm:text-sm ${
                                step.completed
                                    ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400'
                                    : step.number === 1
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

            {/* Quick Info Banner */}
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 sm:p-4 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
                <p className="font-medium">
                    Free 7-day trial • No credit card required yet
                </p>
                <p className="text-xs opacity-90 sm:text-sm">
                    You'll secure your account with payment details after email
                    verification.
                </p>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium"
                                >
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Your full name"
                                    className="text-base sm:text-sm"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2 text-xs sm:text-sm"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="your.email@company.com"
                                    className="text-base sm:text-sm"
                                />
                                <InputError
                                    message={errors.email}
                                    className="text-xs sm:text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    We'll send a verification link here
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Create a strong password"
                                    className="text-base sm:text-sm"
                                />
                                <InputError
                                    message={errors.password}
                                    className="text-xs sm:text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Minimum 8 characters recommended
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-sm font-medium"
                                >
                                    Confirm Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm your password"
                                    className="text-base sm:text-sm"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="text-xs sm:text-sm"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full text-base sm:text-sm"
                                tabIndex={5}
                                data-test="register-user-button"
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                {processing
                                    ? 'Creating account...'
                                    : 'Create Account & Continue'}
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Already registered?
                                </span>
                            </div>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="font-medium"
                            >
                                Log in to your account
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {/* Security Info */}
            <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground sm:p-4 sm:text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <div>
                    <p className="font-medium text-foreground">
                        Your payment information is secure
                    </p>
                    <p className="mt-1">
                        We use Paystack for secure payment processing. Your data
                        is encrypted and PCI-DSS compliant.
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
