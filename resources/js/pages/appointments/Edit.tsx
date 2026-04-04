import AppointmentForm from '@/components/appointments/AppointmentForm';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

export default function Edit({ auth, appointment, providers }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Edit Appointment</h2>}>
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
