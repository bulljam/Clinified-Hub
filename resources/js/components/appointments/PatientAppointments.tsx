import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CalendarMonth as CalendarIcon,
  List as ListIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import AppointmentCalendar from '../calendar/AppointmentCalendar';
import PatientAppointmentForm from './PatientAppointmentForm';
import NewAppointmentModal from './NewAppointmentModal';
import '../calendar/calendar.css';

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

interface Provider {
  id: number;
  name: string;
  email: string;
}

interface Appointment {
  id: number;
  provider_id: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid';
  notes?: string;
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
  allAppointments: Appointment[];
}

export default function PatientAppointments({ appointments, allAppointments }: PatientAppointmentsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    // Extract unique providers from existing appointments
    const uniqueProviders = appointments.data
      .map(appointment => appointment.provider)
      .filter((provider, index, self) => 
        index === self.findIndex(p => p.id === provider.id)
      );
    
    // If no appointments exist, add some default providers
    if (uniqueProviders.length === 0) {
      // You can add default providers here or fetch from an API
      const defaultProviders: Provider[] = [
        { id: 2, name: 'Dr. John Smith', email: 'john.smith@clinify.com' },
        { id: 3, name: 'Dr. Sarah Johnson', email: 'sarah.johnson@clinify.com' }
      ];
      setProviders(defaultProviders);
    } else {
      setProviders(uniqueProviders);
    }
  }, [appointments.data]);

  const handleDelete = () => {
    if (deletingAppointment) {
      router.delete(`/appointments/${deletingAppointment.id}`, {
        onSuccess: () => {
          setDeletingAppointment(null);
        }
      });
    }
  };


  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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
          onClick={() => setShowNewAppointmentModal(true)}
        >
          Book New Appointment
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="appointment view tabs">
          <Tab
            icon={<ListIcon />}
            label="List View"
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            icon={<CalendarIcon />}
            label="Calendar View"
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
        </Tabs>
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
              onClick={() => setShowNewAppointmentModal(true)}
            >
              Book Appointment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {activeTab === 0 && (
            <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.data.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>
                    {dayjs(appointment.date).format('MMM D, YYYY')}
                  </TableCell>
                  <TableCell>
                    {appointment.time ? dayjs(`1970-01-01 ${appointment.time}`).format('h:mm A') : 'N/A'}
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
                    <Chip
                      label={appointment.payment_status.charAt(0).toUpperCase() + appointment.payment_status.slice(1)}
                      color={getPaymentStatusColor(appointment.payment_status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => setEditingAppointment(appointment)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      {appointment.status === 'pending' && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeletingAppointment(appointment)}
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

          {activeTab === 1 && (
            <AppointmentCalendar
              appointments={appointments.data}
              userRole="client"
            />
          )}
        </Box>
      )}

      {editingAppointment && (
        <PatientAppointmentForm
          appointment={editingAppointment}
          open={!!editingAppointment}
          onClose={() => setEditingAppointment(null)}
        />
      )}

      <Dialog 
        open={!!deletingAppointment} 
        onClose={() => setDeletingAppointment(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this appointment with{' '}
            <strong>{deletingAppointment?.provider.name}</strong> on{' '}
            <strong>{deletingAppointment ? dayjs(deletingAppointment.date).format('MMM D, YYYY') : ''}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingAppointment(null)}>
            Keep Appointment
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDelete}
          >
            Yes, Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>

      <NewAppointmentModal
        open={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        providers={providers}
        allAppointments={allAppointments || []}
      />
    </Box>
  );
}