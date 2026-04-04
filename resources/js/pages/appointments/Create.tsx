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

interface CreateAppointmentProps {
    auth: SharedData['auth'];
    providers: Provider[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Appointments', href: '/appointments' },
    { title: 'Book New Appointment', href: '/appointments/create' },
];

export default function Create({ providers }: CreateAppointmentProps) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Book Appointment" />

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <AppointmentForm providers={providers} />
                    </div>
                </div>
            </AppLayout>
        </ThemeProvider>
    );
}
