import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  CalendarToday as DateIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';

interface Appointment {
  id: number;
  user_id: number;
  provider_id: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid';
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

const getStatusColor = (status: string) => {
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

const getPaymentStatusColor = (paymentStatus: string) => {
  switch (paymentStatus) {
    case 'pending':
      return 'warning';
    case 'paid':
      return 'success';
    default:
      return 'default';
  }
};

export default function AppointmentModal({
  open,
  onClose,
  appointment,
}: AppointmentModalProps) {
  if (!appointment) return null;

  const handleEdit = () => {
    router.visit(`/appointments/${appointment.id}/edit`);
    onClose();
  };

  const handleStatusUpdate = (status: string) => {
    router.patch(`/appointments/${appointment.id}`, { status }, {
      onSuccess: () => onClose(),
    });
  };

  const handlePaymentStatusUpdate = (paymentStatus: string) => {
    router.patch(`/appointments/${appointment.id}`, {
      payment_status: paymentStatus,
    }, {
      onSuccess: () => onClose(),
    });
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
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
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={6}>
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
          </Grid>

          <Grid item xs={6}>
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
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={6}>
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
          </Grid>

          <Grid item xs={6}>
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
          </Grid>
        </Grid>
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