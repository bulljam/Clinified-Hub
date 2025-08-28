import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';

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

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: string;
  payment_status: string;
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

interface PatientAppointmentsProps {
  appointments: {
    data: Appointment[];
    from?: number;
    to?: number;
    total?: number;
  };
}

export default function PatientAppointments({ appointments }: PatientAppointmentsProps) {
  const handleDelete = (appointmentId: number) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      router.delete(`/appointments/${appointmentId}`);
    }
  };

  const handleMarkAsPaid = (appointmentId: number) => {
    router.patch(`/appointments/${appointmentId}`, {
      payment_status: 'paid',
    });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          My Appointments
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.visit('/appointments/create')}
        >
          Book New Appointment
        </Button>
      </Box>

      {appointments.data.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="textSecondary">
              No appointments found. Would you like to book your first appointment?
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => router.visit('/appointments/create')}
            >
              Book Appointment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.data.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>
                    {dayjs(appointment.date).format('MMM D, YYYY')}
                  </TableCell>
                  <TableCell>
                    {dayjs(appointment.time, 'HH:mm:ss').format('h:mm A')}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {appointment.provider.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {appointment.provider.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={appointment.payment_status.charAt(0).toUpperCase() + appointment.payment_status.slice(1)}
                        color={getPaymentStatusColor(appointment.payment_status)}
                        size="small"
                      />
                      {appointment.payment_status === 'pending' && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          onClick={() => handleMarkAsPaid(appointment.id)}
                        >
                          Mark as Paid
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => router.visit(`/appointments/${appointment.id}`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      {appointment.status === 'pending' && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(appointment.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}