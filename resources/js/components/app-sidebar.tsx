import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, CreditCard, Home, Settings, Stethoscope, Users, UserCheck } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
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

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    
    const adminNavItems: NavItem[] = [
        {
            title: 'Doctor Applications',
            href: '/admin/doctor-applications',
            icon: UserCheck,
        },
    ];

    const allNavItems = [
        ...mainNavItems,
        ...(auth.user && (auth.user.role === 'super_admin' || auth.user.role === 'admin') ? adminNavItems : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            size="lg" 
                            asChild
                            className="hover:bg-transparent group relative overflow-hidden"
                        >
                            <Link href={dashboard()} prefetch className="relative">
                                <AppLogo />
                                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
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
