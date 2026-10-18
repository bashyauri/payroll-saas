import { Form, Head, router } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

type Member = { id: string; name: string; email: string; role: string };
const roleLabels: Record<string, string> = { admin: 'Administrator', hr: 'HR', member: 'Member', preparer: 'Preparer', reviewer: 'Reviewer', authorizer: 'Authorizer', approver: 'Approver' };

export default function OrganizationUsers({ members, roles, invitations, status }: { members: Member[]; roles: string[]; invitations: Array<{ id: string; email: string; role: string; expiresAt: string }>; status?: string }) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users & roles', href: '/settings/users' }];
    return <AppLayout breadcrumbs={breadcrumbs}><Head title="Users & roles" /><SettingsLayout>
        <Heading variant="small" title="Users & roles" description="Invite colleagues to this organization and assign internal control roles." />
        {status === 'organization-invitation-sent' && <p className="text-sm text-emerald-700">Invitation sent. It expires in 7 days.</p>}
        {status === 'organization-user-added' && <p className="text-sm text-emerald-700">Account added to the organization.</p>}
        {(status === 'organization-user-updated' || status === 'organization-user-removed') && <p className="text-sm text-emerald-700">Changes saved.</p>}
        <Form action="/settings/users" method="post" className="space-y-4 rounded-lg border p-4">
            {({ processing, errors }) => <>
                <div className="grid gap-2"><Label htmlFor="email">Email address</Label><Input id="email" name="email" type="email" required placeholder="colleague@company.com" /><InputError message={errors.email} /><p className="text-xs text-muted-foreground">Existing accounts are added now. New users receive an invitation link to create an account.</p></div>
                <div className="grid gap-2"><Label htmlFor="new-role">Role</Label><select id="new-role" name="role" className="h-10 rounded-md border bg-background px-3">{roles.map(role => <option key={role} value={role}>{roleLabels[role] ?? role}</option>)}</select><InputError message={errors.role} /></div>
                <Button disabled={processing}>Invite user</Button>
            </>}
        </Form>
        {invitations.length > 0 && <div className="space-y-3"><h2 className="font-medium">Pending invitations</h2>{invitations.map(invite => <div key={invite.id} className="flex flex-wrap justify-between gap-2 rounded-lg border p-3 text-sm"><span>{invite.email} · {roleLabels[invite.role] ?? invite.role}</span><span className="text-muted-foreground">Expires {invite.expiresAt}</span></div>)}</div>}
        <div className="space-y-3"><h2 className="font-medium">Organization members</h2>
            {members.map(member => <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"><div><p className="font-medium">{member.name}</p><p className="text-sm text-muted-foreground">{member.email}</p></div><div className="flex items-center gap-2">
                {member.role === 'owner' ? <span className="text-sm">Owner</span> : <><select aria-label={`Role for ${member.name}`} value={member.role} onChange={e => router.patch(`/settings/users/${member.id}`, { role: e.target.value }, { preserveScroll: true })} className="h-9 rounded-md border bg-background px-2">{roles.map(role => <option key={role} value={role}>{roleLabels[role] ?? role}</option>)}</select><Button variant="outline" size="sm" onClick={() => { if (window.confirm(`Remove ${member.name} from this organization?`)) router.delete(`/settings/users/${member.id}`); }}>Remove</Button></>}
            </div></div>)}
        </div>
    </SettingsLayout></AppLayout>;
}
