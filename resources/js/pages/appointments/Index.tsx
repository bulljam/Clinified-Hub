import { Head } from '@inertiajs/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppLayout from '@/layouts/app-layout';
import PatientAppointments from '@/components/appointments/PatientAppointments';
import DoctorAppointments from '@/components/appointments/DoctorAppointments';
import AdminAppointments from '@/components/appointments/AdminAppointments';

const theme = createTheme();

export default function Index({ auth, appointments, allAppointments, providers, filters }) {
  const userRole = auth.user.role;

  const renderAppointmentComponent = () => {
    switch (userRole) {
      case 'client':
        return <PatientAppointments appointments={appointments} allAppointments={allAppointments || []} providers={providers || []} filters={filters} currentUser={auth.user} />;
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
      <AppLayout
        user={auth.user}
        header={
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Appointments
          </h2>
        }
      >
        <Head title="Appointments" />

        <div className="py-12">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {renderAppointmentComponent()}
          </div>
        </div>
      </AppLayout>
    </ThemeProvider>
  );
}