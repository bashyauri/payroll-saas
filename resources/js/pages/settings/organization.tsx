import { Form, Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

type OrganizationProfile = { name: string; address: string | null; phone: string | null; email: string | null; tax_id: string | null; website: string | null };
const fields: Array<{ key: keyof OrganizationProfile; label: string; type?: string }> = [
    { key: 'name', label: 'Organization name' }, { key: 'address', label: 'Address' },
    { key: 'phone', label: 'Phone' }, { key: 'email', label: 'Contact email', type: 'email' },
    { key: 'tax_id', label: 'Tax identification number' }, { key: 'website', label: 'Website', type: 'url' },
];

export default function OrganizationSettings({ organization, status }: { organization: OrganizationProfile; status?: string }) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Organization information', href: '/settings/organization' }];
    return <AppLayout breadcrumbs={breadcrumbs}><Head title="Organization information" /><SettingsLayout>
        <Heading variant="small" title="Organization information" description="These details appear on exported reports and official payroll documents." />
        {status === 'organization-profile-updated' && <p className="text-sm text-emerald-700">Organization information saved.</p>}
        <Form action="/settings/organization" method="patch" options={{ preserveScroll: true }} className="space-y-5">
            {({ processing, errors }) => <>
                {fields.map(({ key, label, type }) => <div className="grid gap-2" key={key}><Label htmlFor={key}>{label}</Label><Input id={key} name={key} type={type ?? 'text'} required={key === 'name'} defaultValue={organization[key] ?? ''} /><InputError message={errors[key]} /></div>)}
                <Button disabled={processing}>Save organization information</Button>
            </>}
        </Form>
    </SettingsLayout></AppLayout>;
}
