import AdminAppointments from '@/components/appointments/AdminAppointments';
import DoctorAppointments from '@/components/appointments/DoctorAppointments';
import PatientAppointments from '@/components/appointments/PatientAppointments';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

export default function Index({ auth, appointments, allAppointments, providers, filters }) {
    const userRole = auth.user.role;

    const renderAppointmentComponent = () => {
        switch (userRole) {
            case 'client':
                return (
                    <PatientAppointments
                        appointments={appointments}
                        allAppointments={allAppointments || []}
                        providers={providers || []}
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
            <AppLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Appointments</h2>}>
                <Head title="Appointments" />

                <div className="py-4 md:py-8 lg:py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{renderAppointmentComponent()}</div>
                </div>
            </AppLayout>
        </ThemeProvider>
    );
}
