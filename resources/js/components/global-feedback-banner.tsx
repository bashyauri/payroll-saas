import { usePage } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type FlashBag = Partial<{
    status: string;
    success: string;
    error: string;
    warning: string;
    onboarding_notice: string;
}>;

type SharedProps = {
    flash?: FlashBag;
    errors?: Record<string, string>;
};

const STATUS_MESSAGES: Record<
    string,
    { title: string; message: string; variant?: 'destructive' }
> = {
    'payroll-settings-updated': {
        title: 'Payroll settings updated',
        message: 'Your payroll settings were saved successfully.',
    },
    'workspace-subdomain-updated': {
        title: 'Workspace URL updated',
        message: 'Your workspace subdomain was saved.',
    },
    'employee-created': {
        title: 'Employee created',
        message: 'Employee record saved successfully.',
    },
    'payroll-run-created': {
        title: 'Payroll run created',
        message: 'Draft payroll run created successfully.',
    },
    'payroll-run-finalized': {
        title: 'Payroll run finalized',
        message: 'The payroll run has been finalized successfully.',
    },
    'payroll-run-already-finalized': {
        title: 'Payroll run already finalized',
        message: 'This payroll run was already finalized.',
    },
    'payroll-run-finalization-blocked': {
        title: 'Finalization blocked',
        message:
            'Billing access rules blocked payroll finalization. Please resolve billing status and try again.',
        variant: 'destructive',
    },
};

function normalizeStatus(status: string): {
    title: string;
    message: string;
    variant?: 'destructive';
} {
    const mappedStatus = STATUS_MESSAGES[status];

    if (mappedStatus) {
        return mappedStatus;
    }

    return {
        title: 'Notice',
        message: status,
    };
}

export function GlobalFeedbackBanner() {
    const { flash, errors } = usePage().props as SharedProps;

    const firstValidationError = Object.values(errors ?? {}).find(
        (message) => typeof message === 'string' && message.trim() !== '',
    );

    if (
        !flash?.status &&
        !flash?.success &&
        !flash?.error &&
        !flash?.warning &&
        !flash?.onboarding_notice &&
        !firstValidationError
    ) {
        return null;
    }

    const statusPayload = flash?.status ? normalizeStatus(flash.status) : null;

    return (
        <div className="space-y-3 px-4 pt-4 md:px-6">
            {flash?.success && (
                <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-100">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription className="text-emerald-800/90 dark:text-emerald-200/90">
                        {flash.success}
                    </AlertDescription>
                </Alert>
            )}

            {statusPayload && (
                <Alert
                    variant={statusPayload.variant}
                    className={
                        statusPayload.variant === 'destructive'
                            ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-100'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-100'
                    }
                >
                    <AlertTitle>{statusPayload.title}</AlertTitle>
                    <AlertDescription
                        className={
                            statusPayload.variant === 'destructive'
                                ? 'text-red-800/90 dark:text-red-200/90'
                                : 'text-emerald-800/90 dark:text-emerald-200/90'
                        }
                    >
                        {statusPayload.message}
                    </AlertDescription>
                </Alert>
            )}

            {flash?.onboarding_notice && (
                <Alert>
                    <AlertTitle>Action needed</AlertTitle>
                    <AlertDescription>
                        {flash.onboarding_notice}
                    </AlertDescription>
                </Alert>
            )}

            {flash?.warning && (
                <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-100">
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription className="text-amber-800/90 dark:text-amber-200/90">
                        {flash.warning}
                    </AlertDescription>
                </Alert>
            )}

            {flash?.error && (
                <Alert
                    variant="destructive"
                    className="border-red-200 bg-red-50 text-red-900 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-100"
                >
                    <AlertTitle>Request failed</AlertTitle>
                    <AlertDescription className="text-red-800/90 dark:text-red-200/90">
                        {flash.error}
                    </AlertDescription>
                </Alert>
            )}

            {firstValidationError && (
                <Alert
                    variant="destructive"
                    className="border-red-200 bg-red-50 text-red-900 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-100"
                >
                    <AlertTitle>Validation failed</AlertTitle>
                    <AlertDescription className="text-red-800/90 dark:text-red-200/90">
                        {firstValidationError}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
