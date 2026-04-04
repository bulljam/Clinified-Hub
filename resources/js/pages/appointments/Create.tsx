import AppointmentForm from '@/components/appointments/AppointmentForm';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

export default function Create({ auth, providers }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Book New Appointment</h2>}>
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
