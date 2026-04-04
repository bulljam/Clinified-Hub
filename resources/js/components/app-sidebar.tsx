import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import superAdmin from '@/routes/super-admin';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, CreditCard, Home, Shield, Stethoscope, UserCheck, Users } from 'lucide-react';
import AppLogo from './app-logo';

const baseNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: Home,
    },
    {
        title: 'Appointments',
        href: '/appointments',
        icon: Calendar,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Providers',
        href: '/providers',
        icon: Stethoscope,
    },
    {
        title: 'Patients',
        href: '/patients',
        icon: Users,
    },
    {
        title: 'Payments',
        href: '/payments',
        icon: CreditCard,
    },
    {
        title: 'Doctor Applications',
        href: '/admin/doctor-applications',
        icon: UserCheck,
    },
];

const providerNavItems: NavItem[] = [
    {
        title: 'Providers',
        href: '/providers',
        icon: Stethoscope,
    },
    {
        title: 'Patients',
        href: '/patients',
        icon: Users,
    },
    {
        title: 'Payments',
        href: '/payments',
        icon: CreditCard,
    },
];

const patientNavItems: NavItem[] = [
    {
        title: 'Providers',
        href: '/providers',
        icon: Stethoscope,
    },
    {
        title: 'Payments',
        href: '/payments',
        icon: CreditCard,
    },
];

const superAdminNavItems: NavItem[] = [
    {
        title: 'Admin Management',
        href: superAdmin.admins.index().url,
        icon: Shield,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    const getRoleBasedNavItems = () => {
        if (!auth.user) return baseNavItems;

        switch (auth.user.role) {
            case 'super_admin':
                return [...baseNavItems, ...adminNavItems, ...superAdminNavItems];
            case 'admin':
                return [...baseNavItems, ...adminNavItems];
            case 'provider':
                return [...baseNavItems, ...providerNavItems];
            case 'client':
                return [...baseNavItems, ...patientNavItems];
            default:
                return baseNavItems;
        }
    };

    const allNavItems = getRoleBasedNavItems();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="group relative overflow-hidden hover:bg-transparent">
                            <Link href="/" prefetch className="relative">
                                <AppLogo />
                                <span className="absolute right-2 bottom-0 left-2 h-0.5 origin-left scale-x-0 transform bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={allNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
