import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Pagination } from '@mui/material';
import type { LucideIcon } from 'lucide-react';
import {
    Activity,
    Building2,
    Calendar,
    ClipboardList,
    CreditCard,
    Globe,
    Heart,
    Settings,
    Shield,
    Stethoscope,
    TrendingUp,
    UserCheck,
    Users,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface StatCardProps {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    trend?: string | null;
}

interface AppointmentData {
    time: string;
    date?: string;
    patient?: string;
    provider?: string;
    status: string;
}

interface DashboardProps {
    stats: StatCardProps[];
    upcomingAppointments: {
        data: AppointmentData[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    userRole: 'admin' | 'provider' | 'client' | 'super_admin';
}

interface RoleConfig {
    primaryColor: string;
    secondaryColor: string;
    gradientFrom: string;
    gradientTo: string;
    icon: LucideIcon;
    title: string;
    subtitle: string;
    accentColor: string;
}

function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps & { roleConfig?: RoleConfig }) {
    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="bg-gradient-to-r from-[#5c6bc0] to-[#26418f] px-4 py-3 text-white md:px-6 md:py-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold md:text-sm">{title}</h3>
                    <div className="rounded-lg bg-white/20 p-1.5 md:p-2">
                        <Icon className="size-4 md:size-5" />
                    </div>
                </div>
            </div>
            <div className="px-4 py-3 md:px-6 md:py-4">
                <div className="text-2xl font-bold text-foreground md:text-3xl">{value}</div>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">{description}</p>
                {trend && (
                    <div className="mt-2 flex items-center rounded-lg bg-primary/10 p-1.5 md:mt-3 md:p-2">
                        <TrendingUp className="mr-1.5 size-3 text-primary md:mr-2 md:size-4" />
                        <span className="text-xs font-semibold text-primary md:text-sm">{trend}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Dashboard({ stats, upcomingAppointments, userRole }: DashboardProps) {
    const handleUpcomingPageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        router.get(
            dashboard().url,
            { upcoming_page: page },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only: ['upcomingAppointments'],
            },
        );
    };

    const getRoleConfig = (role: string): RoleConfig => {
        switch (role) {
            case 'client':
                return {
                    primaryColor: '#5c6bc0',
                    secondaryColor: '#e0e3ff',
                    gradientFrom: '#5c6bc0',
                    gradientTo: '#17c3b2',
                    icon: Heart,
                    title: 'Patient Portal',
                    subtitle: 'Your healthcare journey, simplified and secure',
                    accentColor: '#5c6bc0',
                };
            case 'provider':
                return {
                    primaryColor: '#2563eb',
                    secondaryColor: '#eff6ff',
                    gradientFrom: '#2563eb',
                    gradientTo: '#1d4ed8',
                    icon: Stethoscope,
                    title: 'Provider Dashboard',
                    subtitle: 'Manage your practice with precision and care',
                    accentColor: '#2563eb',
                };
            case 'admin':
                return {
                    primaryColor: '#7c3aed',
                    secondaryColor: '#f3e8ff',
                    gradientFrom: '#7c3aed',
                    gradientTo: '#6d28d9',
                    icon: Shield,
                    title: 'Admin Control Center',
                    subtitle: 'Comprehensive system management and oversight',
                    accentColor: '#7c3aed',
                };
            case 'super_admin':
                return {
                    primaryColor: '#0f172a',
                    secondaryColor: '#f1f5f9',
                    gradientFrom: '#0f172a',
                    gradientTo: '#1e293b',
                    icon: Settings,
                    title: 'System Control Panel',
                    subtitle: 'Advanced platform configuration and analytics',
                    accentColor: '#0f172a',
                };
            default:
                return {
                    primaryColor: '#5c6bc0',
                    secondaryColor: '#e0e3ff',
                    gradientFrom: '#5c6bc0',
                    gradientTo: '#26418f',
                    icon: Activity,
                    title: 'Dashboard',
                    subtitle: 'Welcome to ClinifiedHub',
                    accentColor: '#5c6bc0',
                };
        }
    };

    const getIconForStat = (title: string, index: number, role: string) => {
        const lowerTitle = title.toLowerCase();

        if (lowerTitle.includes('appointment')) return Calendar;
        if (lowerTitle.includes('payment') || lowerTitle.includes('revenue')) return CreditCard;
        if (lowerTitle.includes('patient')) return Users;
        if (lowerTitle.includes('provider') || lowerTitle.includes('doctor')) return UserCheck;
        if (lowerTitle.includes('total') || lowerTitle.includes('growth')) return TrendingUp;
        if (lowerTitle.includes('pending')) return ClipboardList;

        if (role === 'client') return [Heart, Calendar, Activity][index] || Heart;
        if (role === 'provider') return [Stethoscope, Users, Calendar][index] || Stethoscope;
        if (role === 'admin') return [Shield, Building2, Settings][index] || Shield;
        if (role === 'super_admin') return [Settings, Globe, TrendingUp][index] || Settings;

        return [Calendar, Users, TrendingUp][index] || Calendar;
    };

    const roleConfig = getRoleConfig(userRole);

    const statsWithIcons = stats.map((stat, index) => ({
        ...stat,
        icon: getIconForStat(stat.title, index, userRole),
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4 md:gap-6 md:p-6">
                <div
                    className={`relative mb-4 overflow-hidden rounded-2xl shadow-lg md:mb-6 ${userRole === 'super_admin' ? 'border border-slate-600' : ''}`}
                >
                    <div
                        className="relative px-4 py-4 text-white md:px-8 md:py-6"
                        style={{
                            background:
                                userRole === 'super_admin'
                                    ? `linear-gradient(135deg, ${roleConfig.gradientFrom} 0%, ${roleConfig.gradientTo} 100%), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                    : `linear-gradient(135deg, ${roleConfig.gradientFrom} 0%, ${roleConfig.gradientTo} 100%)`,
                        }}
                    >
                        <div className={`absolute inset-0 ${userRole === 'super_admin' ? 'bg-black/20' : 'bg-black/10'}`}></div>
                        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div
                                    className={`rounded-xl p-2 backdrop-blur-sm md:p-3 ${
                                        userRole === 'super_admin' ? 'border border-slate-500/30 bg-slate-700/50' : 'bg-white/20'
                                    }`}
                                >
                                    <roleConfig.icon className="size-6 md:size-8" />
                                </div>
                                <div>
                                    <h1 className={`text-xl font-bold md:text-3xl ${userRole === 'super_admin' ? 'text-slate-100' : ''}`}>
                                        {roleConfig.title}
                                    </h1>
                                    <p className={`text-sm md:text-base ${userRole === 'super_admin' ? 'text-slate-300' : 'text-white/90'}`}>
                                        {roleConfig.subtitle}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-end md:block">
                                <div className="text-right">
                                    <div className={`text-sm ${userRole === 'super_admin' ? 'text-slate-400' : 'text-white/70'}`}>Role</div>
                                    <div className="text-lg font-semibold capitalize">{userRole.replace('_', ' ')}</div>
                                    {userRole === 'super_admin' && (
                                        <div className="mt-1 flex items-center justify-end gap-1">
                                            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                                            <span className="text-xs text-green-300">System Online</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {userRole === 'super_admin' ? (
                            <>
                                <div className="absolute top-4 right-4 h-8 w-1 rounded-full bg-slate-400/30"></div>
                                <div className="absolute top-4 right-8 h-6 w-1 rounded-full bg-slate-400/20"></div>
                                <div className="absolute top-4 right-12 h-4 w-1 rounded-full bg-slate-400/10"></div>
                                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>
                            </>
                        ) : (
                            <>
                                <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-white/5"></div>
                                <div className="absolute right-0 bottom-0 -mr-12 -mb-12 h-24 w-24 rounded-full bg-white/5"></div>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                    {statsWithIcons.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                <div className="rounded-xl border border-border bg-card shadow-lg">
                    <div
                        className="rounded-t-xl px-4 py-3 text-white md:px-6 md:py-4"
                        style={{
                            background: `linear-gradient(135deg, ${roleConfig.gradientFrom} 0%, ${roleConfig.gradientTo} 100%)`,
                        }}
                    >
                        <div className="flex items-center gap-2 md:gap-3">
                            <Calendar className="size-4 md:size-5" />
                            <h3 className="text-base font-semibold md:text-lg">Upcoming Appointments</h3>
                        </div>
                    </div>
                    <div className="p-4 md:p-6">
                        {upcomingAppointments.data.length > 0 ? (
                            <div className="space-y-3 md:space-y-4">
                                {upcomingAppointments.data.map((appointment, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col justify-between gap-3 rounded-lg border border-border p-3 transition-all duration-200 hover:border-accent/50 hover:shadow-md sm:flex-row sm:items-center md:p-4"
                                    >
                                        <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
                                            <div
                                                className="flex-shrink-0 rounded-lg p-1.5 md:p-2"
                                                style={{ backgroundColor: `${roleConfig.primaryColor}20` }}
                                            >
                                                <Calendar className="size-3 md:size-4" style={{ color: roleConfig.primaryColor }} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs font-medium text-muted-foreground md:text-sm">
                                                    {appointment.time}
                                                    {appointment.date && ` • ${appointment.date}`}
                                                </div>
                                                <div className="mt-1 truncate text-sm font-semibold text-foreground md:text-base">
                                                    {userRole === 'admin' || userRole === 'super_admin'
                                                        ? `${appointment.patient} with Dr. ${appointment.provider}`
                                                        : userRole === 'provider'
                                                          ? appointment.patient
                                                          : `Dr. ${appointment.provider}`}
                                                </div>
                                            </div>
                                        </div>
                                        <span
                                            className={`self-start rounded-full px-2 py-1 text-xs font-semibold sm:self-center md:px-3 ${
                                                appointment.status === 'confirmed'
                                                    ? 'border border-green-200 bg-green-100 text-green-700'
                                                    : appointment.status === 'pending'
                                                      ? 'border border-yellow-200 bg-yellow-100 text-yellow-700'
                                                      : 'border border-red-200 bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                        </span>
                                    </div>
                                ))}

                                {upcomingAppointments.last_page > 1 && (
                                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-sm text-muted-foreground">
                                            Showing{' '}
                                            <strong>
                                                {upcomingAppointments.from || 0}-{upcomingAppointments.to || 0}
                                            </strong>{' '}
                                            of <strong>{upcomingAppointments.total || 0}</strong> upcoming appointments
                                        </p>
                                        <Pagination
                                            count={upcomingAppointments.last_page}
                                            page={upcomingAppointments.current_page}
                                            onChange={handleUpcomingPageChange}
                                            color="primary"
                                            showFirstButton
                                            showLastButton
                                            sx={{
                                                '& .MuiPagination-ul': {
                                                    justifyContent: 'center',
                                                },
                                                '& .MuiPaginationItem-root': {
                                                    borderRadius: 2,
                                                    fontWeight: 600,
                                                    '&.Mui-selected': {
                                                        bgcolor: roleConfig.primaryColor,
                                                        color: 'white',
                                                        '&:hover': {
                                                            bgcolor: roleConfig.gradientTo,
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-8 text-center md:py-12">
                                <div
                                    className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full md:mb-4 md:h-16 md:w-16"
                                    style={{ backgroundColor: `${roleConfig.primaryColor}20` }}
                                >
                                    <Calendar className="size-6 md:size-8" style={{ color: roleConfig.primaryColor }} />
                                </div>
                                <h3 className="mb-2 text-base font-semibold text-foreground md:text-lg">No Upcoming Appointments</h3>
                                <p className="mx-auto max-w-md px-4 text-sm text-muted-foreground md:text-base">
                                    {userRole === 'admin' || userRole === 'super_admin'
                                        ? 'No upcoming appointments in the system. New appointments will appear here once scheduled.'
                                        : userRole === 'provider'
                                          ? 'No upcoming appointments with your patients. Your schedule is clear for now.'
                                          : 'No upcoming appointments scheduled. Book your next appointment to see it here.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
