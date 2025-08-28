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
  Typography,
} from '@mui/material';
import {
  CheckCircle as ConfirmIcon,
  Cancel as CancelIcon,
  CalendarMonth as CalendarIcon,
  List as ListIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { useState } from 'react';
import AppointmentCalendar from '../calendar/AppointmentCalendar';
import '../calendar/calendar.css';

const getStatusColor = (status) => {
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

const getPaymentStatusColor = (paymentStatus) => {
  switch (paymentStatus) {
    case 'pending':
      return 'warning';
    case 'paid':
      return 'success';
    default:
      return 'default';
  }
};

export default function DoctorAppointments({ appointments }) {
  const [activeTab, setActiveTab] = useState(0);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUpdateClick = (appointment) => {
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

  const handleQuickAction = (appointmentId, status) => {
    router.patch(`/appointments/${appointmentId}`, { status });
  };

  const handleMarkAsPaid = (appointmentId) => {
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
                <TableCell align="right">Actions</TableCell>
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
                        {dayjs(appointment.time, 'HH:mm:ss').format('h:mm A')}
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
                      {appointment.status === 'pending' && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<ConfirmIcon />}
                            onClick={() => handleQuickAction(appointment.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => handleQuickAction(appointment.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleUpdateClick(appointment)}
                      >
                        Update
                      </Button>
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
              view="week"
            />
          )}
        </Box>
      )}

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
                  {dayjs(selectedAppointment.time, 'HH:mm:ss').format('h:mm A')}
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