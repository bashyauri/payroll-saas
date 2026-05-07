import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import WorkspaceController from '@/actions/App/Http/Controllers/Settings/WorkspaceController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/workspace';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Workspace settings',
        href: edit(),
    },
];

export default function WorkspaceSettings({
    subdomain,
    baseDomain,
    organizationName,
}: {
    subdomain: string | null;
    baseDomain: string;
    organizationName: string | null;
}) {
    const [isRedirecting, setIsRedirecting] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Workspace settings" />

            <h1 className="sr-only">Workspace settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Workspace subdomain"
                        description="Choose a stable subdomain for your organization."
                    />

                    <Alert>
                        <AlertTitle>Subdomain ownership</AlertTitle>
                        <AlertDescription>
                            Your workspace URL is locked to your organization
                            and cannot be used by anyone else.
                        </AlertDescription>
                    </Alert>

                    <Form
                        {...WorkspaceController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        onSuccess={() => setIsRedirecting(true)}
                        onError={() => setIsRedirecting(false)}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                {isRedirecting && (
                                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-100">
                                        <AlertTitle>
                                            Workspace URL updated
                                        </AlertTitle>
                                        <AlertDescription className="text-emerald-800/90 dark:text-emerald-200/90">
                                            Saved successfully. Redirecting to
                                            your new subdomain...
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="subdomain">Subdomain</Label>

                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="subdomain"
                                            name="subdomain"
                                            required
                                            defaultValue={subdomain ?? ''}
                                            autoComplete="off"
                                            className="max-w-sm"
                                            placeholder="your-company"
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            .{baseDomain}
                                        </span>
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        Lowercase letters, numbers, and hyphens
                                        only.
                                    </p>

                                    <InputError
                                        className="mt-1"
                                        message={errors.subdomain}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button disabled={processing}>
                                        Save workspace URL
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>

                    {organizationName && (
                        <p className="text-xs text-muted-foreground">
                            Organization: {organizationName}
                        </p>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
