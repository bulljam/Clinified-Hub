import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowBack as BackIcon, Edit as EditIcon } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Chip, Divider, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

const theme = createTheme();

const getStatusColor = (status: 'pending' | 'confirmed' | 'cancelled') => {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'confirmed':
            return 'success';
        case 'cancelled':
            return 'error';
        default:
            return 'default';
    }
};

const getPaymentStatusColor = (paymentStatus: 'pending' | 'paid' | 'on_hold' | 'cancelled') => {
    switch (paymentStatus) {
        case 'pending':
            return 'warning';
        case 'paid':
            return 'success';
        default:
            return 'default';
    }
};

interface Appointment {
    id: number;
    user_id: number;
    provider_id: number;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'on_hold' | 'cancelled';
    created_at: string;
    updated_at: string;
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

interface AppointmentShowProps {
    auth: SharedData['auth'];
    appointment: Appointment;
}

export default function Show({ auth, appointment }: AppointmentShowProps) {
    const canEdit = () => {
        const userRole = auth.user.role;
        if (userRole === 'admin') return true;
        if (userRole === 'provider' && appointment.provider_id === auth.user.id) return true;
        if (userRole === 'client' && appointment.user_id === auth.user.id) return true;
        return false;
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Appointments', href: '/appointments' },
        { title: `Appointment #${appointment.id}`, href: `/appointments/${appointment.id}` },
    ];

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Appointment Details" />

                <div className="py-12">
                    <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                        <Box mb={3}>
                            <Button startIcon={<BackIcon />} onClick={() => router.visit('/appointments')}>
                                Back to Appointments
                            </Button>
                        </Box>

                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                                    <Box>
                                        <Typography variant="h4" gutterBottom>
                                            Appointment #{appointment.id}
                                        </Typography>
                                        <Box display="flex" gap={1} mt={1}>
                                            <Chip
                                                label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                color={getStatusColor(appointment.status)}
                                            />
                                            <Chip
                                                label={`Payment: ${appointment.payment_status.charAt(0).toUpperCase() + appointment.payment_status.slice(1)}`}
                                                color={getPaymentStatusColor(appointment.payment_status)}
                                            />
                                        </Box>
                                    </Box>

                                    {canEdit() && (
                                        <Button
                                            variant="contained"
                                            startIcon={<EditIcon />}
                                            onClick={() => router.visit(`/appointments/${appointment.id}/edit`)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
                                    <Box>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    Appointment Information
                                                </Typography>
                                                <Box display="flex" flexDirection="column" gap={2}>
                                                    <Box>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Date
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {dayjs(appointment.date).format('dddd, MMMM D, YYYY')}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Time
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {dayjs(appointment.time, 'HH:mm:ss').format('h:mm A')}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Status
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Payment Status
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {appointment.payment_status.charAt(0).toUpperCase() + appointment.payment_status.slice(1)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Box>

                                    <Box>
                                        <Box display="grid" gap={2}>
                                            <Box>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom color="primary">
                                                            Patient Information
                                                        </Typography>
                                                        <Box>
                                                            <Typography variant="subtitle2" color="textSecondary">
                                                                Name
                                                            </Typography>
                                                            <Typography variant="body1" fontWeight="medium">
                                                                {appointment.user.name}
                                                            </Typography>
                                                        </Box>
                                                        <Box mt={1}>
                                                            <Typography variant="subtitle2" color="textSecondary">
                                                                Email
                                                            </Typography>
                                                            <Typography variant="body1">{appointment.user.email}</Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Box>

                                            <Box>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom color="primary">
                                                            Provider Information
                                                        </Typography>
                                                        <Box>
                                                            <Typography variant="subtitle2" color="textSecondary">
                                                                Name
                                                            </Typography>
                                                            <Typography variant="body1" fontWeight="medium">
                                                                {appointment.provider.name}
                                                            </Typography>
                                                        </Box>
                                                        <Box mt={1}>
                                                            <Typography variant="subtitle2" color="textSecondary">
                                                                Email
                                                            </Typography>
                                                            <Typography variant="body1">{appointment.provider.email}</Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box mt={3}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Appointment History
                                            </Typography>
                                            <Box display="flex" flexDirection="column" gap={1}>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2">Created</Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {dayjs(appointment.created_at).format('MMM D, YYYY h:mm A')}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2">Last Updated</Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {dayjs(appointment.updated_at).format('MMM D, YYYY h:mm A')}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        </ThemeProvider>
    );
}
