import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, CreditCard, TrendingUp, Users } from 'lucide-react';

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
    userRole: 'admin' | 'provider' | 'client';
}

function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="bg-primary px-6 py-4 text-primary-foreground">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <Icon className="size-5" />
                </div>
            </div>
            <div className="px-6 py-4">
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
                {trend && (
                    <div className="flex items-center mt-2">
                        <TrendingUp className="size-4 text-accent mr-1" />
                        <span className="text-sm text-accent font-medium">{trend}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Dashboard({ stats, upcomingAppointments, userRole }: DashboardProps) {
    const getIconForStat = (title: string, index: number) => {
        if (title.toLowerCase().includes('appointment')) return Calendar;
        if (title.toLowerCase().includes('payment')) return CreditCard;
        if (title.toLowerCase().includes('patient') || title.toLowerCase().includes('provider')) return Users;
        if (title.toLowerCase().includes('revenue') || title.toLowerCase().includes('total')) return TrendingUp;
        return [Calendar, Users, TrendingUp][index] || Calendar;
    };

    const statsWithIcons = stats.map((stat, index) => ({
        ...stat,
        icon: getIconForStat(stat.title, index),
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                <div className="mb-2">
                    <h1 className="text-2xl font-bold text-foreground">Welcome to Clinify</h1>
                    <p className="text-muted-foreground">Manage your healthcare practice efficiently</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {statsWithIcons.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                <div className="bg-card rounded-xl border border-border">
                    <div className="bg-primary px-6 py-4 text-primary-foreground">
                        <h3 className="font-semibold">Upcoming Appointments</h3>
                    </div>
                    <div className="p-6">
                        {upcomingAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingAppointments.map((appointment, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="text-sm font-medium text-muted-foreground">
                                                {appointment.time}
                                                {appointment.date && ` • ${appointment.date}`}
                                            </div>
                                            <div className="text-sm font-medium text-foreground">
                                                {userRole === 'admin' 
                                                    ? `${appointment.patient} with Dr. ${appointment.provider}`
                                                    : userRole === 'provider'
                                                    ? appointment.patient
                                                    : `Dr. ${appointment.provider}`
                                                }
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            appointment.status === 'confirmed' 
                                                ? 'bg-accent/10 text-accent' 
                                                : appointment.status === 'pending'
                                                ? 'bg-chart-3/10 text-chart-3'
                                                : 'bg-destructive/10 text-destructive'
                                        }`}>
                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="size-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground">
                                    {userRole === 'admin' 
                                        ? 'No upcoming appointments in the system'
                                        : userRole === 'provider'
                                        ? 'No upcoming appointments with your patients'
                                        : 'No upcoming appointments scheduled'
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
