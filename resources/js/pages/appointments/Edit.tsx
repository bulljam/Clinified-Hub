import AppointmentForm from '@/components/appointments/AppointmentForm';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

interface Provider {
    id: number;
    name: string;
    email: string;
}

interface Appointment {
    id: number;
    provider_id: number;
    date: string;
    time: string;
    status: string;
    payment_status: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface EditAppointmentProps {
    auth: SharedData['auth'];
    appointment: Appointment;
    providers: Provider[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Appointments', href: '/appointments' },
    { title: 'Edit Appointment', href: '#' },
];

export default function Edit({ appointment, providers }: EditAppointmentProps) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Edit Appointment" />

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <AppointmentForm appointment={appointment} providers={providers} isEdit={true} />
                    </div>
                </div>
            </AppLayout>
        </ThemeProvider>
    );
}
