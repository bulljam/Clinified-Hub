import { router } from '@inertiajs/react';
import { CalendarToday as DateIcon, Payment as PaymentIcon, Person as PersonIcon, AccessTime as TimeIcon } from '@mui/icons-material';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';

interface Appointment {
    id: number;
    user_id: number;
    provider_id: number;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    payment_status: 'pending' | 'paid';
    requires_refund?: boolean;
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

interface AppointmentModalProps {
    open: boolean;
    onClose: () => void;
    appointment: Appointment | null;
}

export default function AppointmentModal({ open, onClose, appointment }: AppointmentModalProps) {
    if (!appointment) return null;

    const handleEdit = () => {
        router.visit(`/appointments/${appointment.id}/edit`);
        onClose();
    };

    const handleStatusUpdate = (status: string) => {
        router.patch(
            `/appointments/${appointment.id}`,
            { status },
            {
                onSuccess: () => onClose(),
            },
        );
    };

    const handlePaymentStatusUpdate = (paymentStatus: string) => {
        router.patch(
            `/appointments/${appointment.id}`,
            {
                payment_status: paymentStatus,
            },
            {
                onSuccess: () => onClose(),
            },
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Appointment Details</Typography>
                    <Typography variant="body2" color="textSecondary" fontFamily="monospace">
                        #{appointment.id}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box display="grid" gap={3}>
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <DateIcon color="action" />
                            <Typography variant="body1" fontWeight="medium">
                                {dayjs(appointment.date).format('MMMM D, YYYY')}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <TimeIcon color="action" />
                            <Typography variant="body1" fontWeight="medium">
                                {appointment.time ? dayjs(`1970-01-01 ${appointment.time}`).format('h:mm A') : 'N/A'}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider />

                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
                        <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <PersonIcon color="action" />
                                <Typography variant="subtitle2">Patient</Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="medium">
                                {appointment.user.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {appointment.user.email}
                            </Typography>
                        </Box>

                        <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <PersonIcon color="action" />
                                <Typography variant="subtitle2">Provider</Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="medium">
                                Dr. {appointment.provider.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {appointment.provider.email}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider />

                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Appointment Status
                            </Typography>
                            <Box display="flex" gap={1} flexWrap="wrap">
                                <Chip
                                    label="Pending"
                                    color={appointment.status === 'pending' ? 'warning' : 'default'}
                                    variant={appointment.status === 'pending' ? 'filled' : 'outlined'}
                                    size="small"
                                    onClick={() => handleStatusUpdate('pending')}
                                    sx={{ cursor: 'pointer' }}
                                />
                                <Chip
                                    label="Confirmed"
                                    color={appointment.status === 'confirmed' ? 'success' : 'default'}
                                    variant={appointment.status === 'confirmed' ? 'filled' : 'outlined'}
                                    size="small"
                                    onClick={() => handleStatusUpdate('confirmed')}
                                    sx={{ cursor: 'pointer' }}
                                />
                                <Chip
                                    label="Cancelled"
                                    color={appointment.status === 'cancelled' ? 'error' : 'default'}
                                    variant={appointment.status === 'cancelled' ? 'filled' : 'outlined'}
                                    size="small"
                                    onClick={() => handleStatusUpdate('cancelled')}
                                    sx={{ cursor: 'pointer' }}
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <PaymentIcon color="action" />
                                <Typography variant="subtitle2">Payment Status</Typography>
                            </Box>
                            <Box display="flex" gap={1}>
                                <Chip
                                    label="Pending"
                                    color={appointment.payment_status === 'pending' ? 'warning' : 'default'}
                                    variant={appointment.payment_status === 'pending' ? 'filled' : 'outlined'}
                                    size="small"
                                    onClick={() => handlePaymentStatusUpdate('pending')}
                                    sx={{ cursor: 'pointer' }}
                                />
                                <Chip
                                    label="Paid"
                                    color={appointment.payment_status === 'paid' ? 'success' : 'default'}
                                    variant={appointment.payment_status === 'paid' ? 'filled' : 'outlined'}
                                    size="small"
                                    onClick={() => handlePaymentStatusUpdate('paid')}
                                    sx={{ cursor: 'pointer' }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Close
                </Button>
                <Button onClick={handleEdit} variant="contained" color="primary">
                    Edit Appointment
                </Button>
            </DialogActions>
        </Dialog>
    );
}
