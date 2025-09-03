import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { 
    Calendar, 
    CreditCard, 
    TrendingUp, 
    Users, 
    Heart,
    Stethoscope,
    Shield,
    Crown,
    Activity,
    UserCheck,
    Settings,
    Globe,
    Building2,
    ClipboardList
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
    icon: React.ComponentType<any>;
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
    upcomingAppointments: AppointmentData[];
    userRole: 'admin' | 'provider' | 'client' | 'super_admin';
}

interface RoleConfig {
    primaryColor: string;
    secondaryColor: string;
    gradientFrom: string;
    gradientTo: string;
    icon: React.ComponentType<any>;
    title: string;
    subtitle: string;
    accentColor: string;
}

function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps & { roleConfig?: RoleConfig }) {
    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="bg-gradient-to-r from-[#20a09f] to-[#178f8e] px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Icon className="size-5" />
                    </div>
                </div>
            </div>
            <div className="px-6 py-4">
                <div className="text-3xl font-bold text-foreground">{value}</div>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
                {trend && (
                    <div className="flex items-center mt-3 p-2 bg-accent/10 rounded-lg">
                        <TrendingUp className="size-4 text-accent mr-2" />
                        <span className="text-sm text-accent font-semibold">{trend}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Dashboard({ stats, upcomingAppointments, userRole }: DashboardProps) {
    const getRoleConfig = (role: string): RoleConfig => {
        switch (role) {
            case 'client':
                return {
                    primaryColor: '#20a09f',
                    secondaryColor: '#e6fbfb',
                    gradientFrom: '#20a09f',
                    gradientTo: '#17c3b2',
                    icon: Heart,
                    title: 'Patient Portal',
                    subtitle: 'Your healthcare journey, simplified and secure',
                    accentColor: '#20a09f'
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
                    accentColor: '#2563eb'
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
                    accentColor: '#7c3aed'
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
                    accentColor: '#0f172a'
                };
            default:
                return {
                    primaryColor: '#20a09f',
                    secondaryColor: '#e6fbfb',
                    gradientFrom: '#20a09f',
                    gradientTo: '#178f8e',
                    icon: Activity,
                    title: 'Dashboard',
                    subtitle: 'Welcome to Clinify',
                    accentColor: '#20a09f'
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
        
        // Role-specific default icons
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
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Role-specific Header */}
                <div className={`relative mb-6 overflow-hidden rounded-2xl shadow-lg ${userRole === 'super_admin' ? 'border border-slate-600' : ''}`}>
                    <div 
                        className="px-8 py-6 text-white relative"
                        style={{
                            background: userRole === 'super_admin' 
                                ? `linear-gradient(135deg, ${roleConfig.gradientFrom} 0%, ${roleConfig.gradientTo} 100%), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                : `linear-gradient(135deg, ${roleConfig.gradientFrom} 0%, ${roleConfig.gradientTo} 100%)`
                        }}
                    >
                        <div className={`absolute inset-0 ${userRole === 'super_admin' ? 'bg-black/20' : 'bg-black/10'}`}></div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl backdrop-blur-sm ${
                                    userRole === 'super_admin' 
                                        ? 'bg-slate-700/50 border border-slate-500/30' 
                                        : 'bg-white/20'
                                }`}>
                                    <roleConfig.icon className="size-8" />
                                </div>
                                <div>
                                    <h1 className={`text-3xl font-bold ${
                                        userRole === 'super_admin' ? 'text-slate-100' : ''
                                    }`}>
                                        {roleConfig.title}
                                    </h1>
                                    <p className={`text-base ${
                                        userRole === 'super_admin' ? 'text-slate-300' : 'text-white/90'
                                    }`}>
                                        {roleConfig.subtitle}
                                    </p>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="text-right">
                                    <div className={`text-sm ${
                                        userRole === 'super_admin' ? 'text-slate-400' : 'text-white/70'
                                    }`}>
                                        Role
                                    </div>
                                    <div className="text-lg font-semibold capitalize">
                                        {userRole.replace('_', ' ')}
                                    </div>
                                    {userRole === 'super_admin' && (
                                        <div className="mt-1 flex items-center justify-end gap-1">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-green-300">System Online</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Decorative elements */}
                        {userRole === 'super_admin' ? (
                            <>
                                <div className="absolute top-4 right-4 w-1 h-8 bg-slate-400/30 rounded-full"></div>
                                <div className="absolute top-4 right-8 w-1 h-6 bg-slate-400/20 rounded-full"></div>
                                <div className="absolute top-4 right-12 w-1 h-4 bg-slate-400/10 rounded-full"></div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>
                            </>
                        ) : (
                            <>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mb-12"></div>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {statsWithIcons.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                <div className="bg-card rounded-xl border border-border shadow-lg">
                    <div 
                        className="px-6 py-4 text-white rounded-t-xl"
                        style={{
                            background: `linear-gradient(135deg, ${roleConfig.gradientFrom} 0%, ${roleConfig.gradientTo} 100%)`
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <Calendar className="size-5" />
                            <h3 className="font-semibold text-lg">Upcoming Appointments</h3>
                        </div>
                    </div>
                    <div className="p-6">
                        {upcomingAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingAppointments.map((appointment, index) => (
                                    <div 
                                        key={index} 
                                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200 hover:border-accent/50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div 
                                                className="p-2 rounded-lg"
                                                style={{ backgroundColor: `${roleConfig.primaryColor}20` }}
                                            >
                                                <Calendar className="size-4" style={{ color: roleConfig.primaryColor }} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-muted-foreground">
                                                    {appointment.time}
                                                    {appointment.date && ` • ${appointment.date}`}
                                                </div>
                                                <div className="text-base font-semibold text-foreground mt-1">
                                                    {userRole === 'admin' || userRole === 'super_admin'
                                                        ? `${appointment.patient} with Dr. ${appointment.provider}`
                                                        : userRole === 'provider'
                                                        ? appointment.patient
                                                        : `Dr. ${appointment.provider}`
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            appointment.status === 'confirmed' 
                                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                                : appointment.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                : 'bg-red-100 text-red-700 border border-red-200'
                                        }`}>
                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div 
                                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                                    style={{ backgroundColor: `${roleConfig.primaryColor}20` }}
                                >
                                    <Calendar className="size-8" style={{ color: roleConfig.primaryColor }} />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Appointments</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    {userRole === 'admin' || userRole === 'super_admin'
                                        ? 'No upcoming appointments in the system. New appointments will appear here once scheduled.'
                                        : userRole === 'provider'
                                        ? 'No upcoming appointments with your patients. Your schedule is clear for now.'
                                        : 'No upcoming appointments scheduled. Book your next appointment to see it here.'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
