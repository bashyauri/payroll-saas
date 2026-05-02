import { Link, usePage } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    FileText,
    Landmark,
    LayoutGrid,
    Settings,
    ShieldCheck,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { edit as editPayrollSettings } from '@/routes/payroll/settings';
import { edit as editProfile } from '@/routes/profile';
import { index as employeesIndex } from '@/routes/tenant/employees';
import { edit as editWorkspace } from '@/routes/workspace';
import type { Auth, NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props as { auth: Auth };
    const can = auth?.can;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(can?.addEmployee
            ? [
                  {
                      title: 'Employees',
                      href: employeesIndex(),
                      icon: Users,
                  },
              ]
            : []),
        ...(can?.managePayrollSettings
            ? [
                  {
                      title: 'Payroll',
                      href: '/payroll',
                      icon: FileText,
                  },
                  {
                      title: 'Reports',
                      href: '/reports',
                      icon: Landmark,
                  },
                  {
                      title: 'Payroll Settings',
                      href: editPayrollSettings(),
                      icon: ShieldCheck,
                  },
              ]
            : []),
        ...(can?.manageWorkspace
            ? [
                  {
                      title: 'Workspace',
                      href: editWorkspace(),
                      icon: BriefcaseBusiness,
                  },
              ]
            : []),
        {
            title: 'Settings',
            href: editProfile(),
            icon: Settings,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
