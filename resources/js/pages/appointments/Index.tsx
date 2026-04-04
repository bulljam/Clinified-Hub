import AdminAppointments from '@/components/appointments/AdminAppointments';
import DoctorAppointments from '@/components/appointments/DoctorAppointments';
import PatientAppointments from '@/components/appointments/PatientAppointments';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

interface AppointmentRecord {
    id: number;
    provider_id: number;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'on_hold' | 'cancelled';
    requires_refund?: boolean;
    notes?: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    provider: {
        id: number;
        name: string;
        email: string;
    };
}

interface PaginatedAppointments {
    data: AppointmentRecord[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Provider {
    id: number;
    name: string;
    email: string;
}

interface CurrentUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AppointmentIndexProps {
    auth: {
        user: CurrentUser;
    };
    appointments: PaginatedAppointments;
    allAppointments?: AppointmentRecord[];
    providers?: Provider[];
    filters?: {
        status?: string;
        payment_status?: string;
        provider_id?: string;
        date?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Appointments', href: '/appointments' }];

export default function Index({ auth, appointments, allAppointments = [], providers = [], filters = {} }: AppointmentIndexProps) {
    const userRole = auth.user.role;

    const renderAppointmentComponent = () => {
        switch (userRole) {
            case 'client':
                return (
                    <PatientAppointments
                        appointments={appointments}
                        allAppointments={allAppointments}
                        providers={providers}
                        filters={filters}
                        currentUser={auth.user}
                    />
                );
            case 'provider':
                return <DoctorAppointments appointments={appointments} filters={filters} />;
            case 'admin':
            case 'super_admin':
                return <AdminAppointments appointments={appointments} providers={providers} filters={filters} userRole={userRole} />;
            default:
                return null;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Appointments" />

                <div className="py-4 md:py-8 lg:py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{renderAppointmentComponent()}</div>
                </div>
            </AppLayout>
        </ThemeProvider>
    );
}
