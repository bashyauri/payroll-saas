// Components
import { Form, Head } from '@inertiajs/react';
import { CheckCircle2, Clock, Lock } from 'lucide-react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

const steps = [
    { number: 1, title: 'Sign Up', completed: true },
    { number: 2, title: 'Verify Email', completed: false },
    { number: 3, title: 'Choose Plan', completed: false },
    { number: 4, title: 'Start Free Trial', completed: false },
];

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Verify your email"
            description="Complete this step to unlock billing plans and start your free trial"
        >
            <Head title="Email verification" />

            {/* Step Indicator */}
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
                                    : step.number === 2
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

            <div className="space-y-6">
                {/* Info boxes */}
                <div className="rounded-lg border border-border bg-gradient-to-r from-blue-50 to-cyan-50 p-4 sm:p-6 dark:from-blue-950/30 dark:to-cyan-950/30">
                    <div className="mb-3 flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-foreground">
                            What happens next?
                        </h3>
                    </div>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                1
                            </span>
                            <span>
                                Verify your email by clicking the link we sent
                                you
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                2
                            </span>
                            <span>
                                You'll automatically be redirected to choose
                                your plan
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                3
                            </span>
                            <span>
                                Complete payment via Paystack to start your
                                7-day free trial
                            </span>
                        </li>
                    </ol>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900 sm:p-4 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-300">
                        <div className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
                            <div>
                                <p className="font-medium">
                                    Verification link sent!
                                </p>
                                <p className="text-xs opacity-90 sm:text-sm">
                                    Check your email for the verification link.
                                    Don't see it? Check your spam folder.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <Form {...send.form()} className="space-y-4 text-center">
                    {({ processing }) => (
                        <>
                            <Button
                                disabled={processing}
                                size="lg"
                                className="w-full gap-2"
                            >
                                {processing && <Spinner />}
                                {processing
                                    ? 'Sending email...'
                                    : 'Resend Verification Email'}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Need help?
                                    </span>
                                </div>
                            </div>

                            <TextLink
                                method="post"
                                href={logout()}
                                className="block text-sm font-medium text-primary hover:text-primary/80"
                            >
                                Log out and try again
                            </TextLink>
                        </>
                    )}
                </Form>

                {/* Timer Info */}
                <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground sm:p-4 sm:text-sm">
                    <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-foreground">
                            Verification link expires in 24 hours
                        </p>
                        <p className="mt-1">
                            If your link has expired, simply request a new one
                            above.
                        </p>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
