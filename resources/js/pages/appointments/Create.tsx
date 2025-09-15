import { Head } from '@inertiajs/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppLayout from '@/layouts/app-layout';
import AppointmentForm from '@/components/appointments/AppointmentForm';

const theme = createTheme();

export default function Create({ auth, providers }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppLayout
        user={auth.user}
        header={
          <h2 className="text-xl font-semibold leading-tight text-gray-800">
            Book New Appointment
          </h2>
        }
      >
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