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
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';      // Confirm
import CancelIcon from '@mui/icons-material/Cancel';              // Cancel  
import CreditScoreIcon from '@mui/icons-material/CreditScore';     // Confirm Payment
import {
  CalendarMonth as CalendarIcon,
  List as ListIcon,
  Done as ApproveIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { useState } from 'react';
import AppointmentCalendar from '../calendar/AppointmentCalendar';
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

interface Appointment {
  id: number;
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

interface DoctorAppointmentsProps {
  appointments: {
    data: Appointment[];
    from?: number;
    to?: number;
    total?: number;
  };
}

export default function DoctorAppointments({ appointments }: DoctorAppointmentsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [pendingAction, setPendingAction] = useState<{
    type: 'confirm' | 'cancel' | 'payment' | 'update';
    title: string;
    message: string;
  } | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUpdateClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setNewPaymentStatus(appointment.payment_status);
    setUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = () => {
    if (selectedAppointment) {
      router.patch(`/appointments/${selectedAppointment.id}`, {
        status: newStatus,
        payment_status: newPaymentStatus,
      });
      setUpdateDialogOpen(false);
    }
  };

  const handleConfirmAction = (appointment: Appointment, type: 'confirm' | 'cancel' | 'payment' | 'update') => {
    setSelectedAppointment(appointment);
    
    let title = '';
    let message = '';
    
    switch (type) {
      case 'confirm':
        title = 'Confirm Appointment';
        message = `Are you sure you want to confirm the appointment with ${appointment.user.name}?`;
        break;
      case 'cancel':
        title = 'Cancel Appointment';
        message = `Are you sure you want to cancel the appointment with ${appointment.user.name}?`;
        break;
      case 'payment':
        title = 'Mark as Paid';
        message = `Are you sure you want to mark the payment as received for ${appointment.user.name}?`;
        break;
      case 'update':
        title = 'Update Appointment';
        message = `Open the update dialog for ${appointment.user.name}'s appointment?`;
        break;
    }
    
    setPendingAction({ type, title, message });
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogSubmit = () => {
    if (!selectedAppointment || !pendingAction) return;
    
    switch (pendingAction.type) {
      case 'confirm':
        router.patch(`/appointments/${selectedAppointment.id}`, { status: 'confirmed' });
        break;
      case 'cancel':
        router.patch(`/appointments/${selectedAppointment.id}`, { status: 'cancelled' });
        break;
      case 'payment':
        router.patch(`/appointments/${selectedAppointment.id}`, { payment_status: 'paid' });
        break;
      case 'update':
        setUpdateDialogOpen(true);
        break;
    }
    
    setConfirmDialogOpen(false);
    setPendingAction(null);
  };

  const handleQuickAction = (appointmentId: number, status: string) => {
    router.patch(`/appointments/${appointmentId}`, { status });
  };

  const handleMarkAsPaid = (appointmentId: number) => {
    router.patch(`/appointments/${appointmentId}`, {
      payment_status: 'paid',
    });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" mb={3}>
        My Assigned Appointments
      </Typography>

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
              No appointments assigned to you at the moment.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {activeTab === 0 && (
            <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.data.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {dayjs(appointment.date).format('MMM D, YYYY')}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {appointment.time ? dayjs(`1970-01-01 ${appointment.time}`).format('h:mm A') : 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {appointment.user.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {appointment.user.email}
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
                    <Box display="flex" gap={0.5}>
                      {appointment.status === 'pending' && (
                        <Tooltip title="Confirm Appointment">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleConfirmAction(appointment, 'confirm')}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {appointment.payment_status === 'pending' && (
                        <Tooltip title="Mark as Paid">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleConfirmAction(appointment, 'payment')}
                          >
                            <CreditScoreIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {appointment.status === 'pending' && (
                        <Tooltip title="Cancel Appointment">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleConfirmAction(appointment, 'cancel')}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
              userRole="provider"
            />
          )}
        </Box>
      )}

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{pendingAction?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {pendingAction?.message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDialogSubmit} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Appointment</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            {selectedAppointment && (
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Patient: {selectedAppointment.user.name}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Date: {dayjs(selectedAppointment.date).format('MMM D, YYYY')} at{' '}
                  {selectedAppointment.time ? dayjs(`1970-01-01 ${selectedAppointment.time}`).format('h:mm A') : 'N/A'}
                </Typography>
              </Box>
            )}
            
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={newPaymentStatus}
                label="Payment Status"
                onChange={(e) => setNewPaymentStatus(e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateSubmit} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}