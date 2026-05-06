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
                <Alert>
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{flash.success}</AlertDescription>
                </Alert>
            )}

            {statusPayload && (
                <Alert variant={statusPayload.variant}>
                    <AlertTitle>{statusPayload.title}</AlertTitle>
                    <AlertDescription>{statusPayload.message}</AlertDescription>
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
                <Alert>
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>{flash.warning}</AlertDescription>
                </Alert>
            )}

            {flash?.error && (
                <Alert variant="destructive">
                    <AlertTitle>Request failed</AlertTitle>
                    <AlertDescription>{flash.error}</AlertDescription>
                </Alert>
            )}

            {firstValidationError && (
                <Alert variant="destructive">
                    <AlertTitle>Validation failed</AlertTitle>
                    <AlertDescription>{firstValidationError}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
