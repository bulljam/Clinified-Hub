import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
  TextField,
  Typography,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CalendarMonth as CalendarIcon,
  List as ListIcon,
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

interface AdminAppointmentsProps {
  appointments: {
    data: Appointment[];
    from?: number;
    to?: number;
    total?: number;
  };
  filters?: {
    status?: string;
    payment_status?: string;
    provider_id?: string;
    date?: string;
  };
}

export default function AdminAppointments({ appointments, filters = {} }: AdminAppointmentsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [paymentFilter, setPaymentFilter] = useState(filters.payment_status || '');
  const [providerFilter, setProviderFilter] = useState(filters.provider_id || '');
  const [dateFilter, setDateFilter] = useState(filters.date || '');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = () => {
    router.get('/appointments', {
      status: statusFilter,
      payment_status: paymentFilter,
      provider_id: providerFilter,
      date: dateFilter,
    }, { preserveState: true });
  };

  const handleDelete = (appointmentId: number) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      router.delete(`/appointments/${appointmentId}`);
    }
  };

  const handleQuickStatusUpdate = (appointmentId: number, status: string) => {
    router.patch(`/appointments/${appointmentId}`, { status });
  };

  const handlePaymentStatusUpdate = (appointmentId: number, paymentStatus: string) => {
    router.patch(`/appointments/${appointmentId}`, {
      payment_status: paymentStatus,
    });
  };

  const clearFilters = () => {
    setStatusFilter('');
    setPaymentFilter('');
    setProviderFilter('');
    setDateFilter('');
    router.get('/appointments');
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          All Appointments
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.visit('/appointments/create')}
        >
          Create Appointment
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={paymentFilter}
                label="Payment Status"
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Date"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />

            <Button variant="contained" onClick={handleFilterChange}>
              Apply Filters
            </Button>
            <Button variant="outlined" onClick={clearFilters}>
              Clear
            </Button>
          </Box>
        </CardContent>
      </Card>

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
              No appointments found with the current filters.
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
                <TableCell>ID</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Patient</TableCell>
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
                    <Typography variant="body2" fontFamily="monospace">
                      #{appointment.id}
                    </Typography>
                  </TableCell>
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
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        color={getStatusColor(appointment.status)}
                        size="small"
                        onClick={() => {
                          const newStatus = appointment.status === 'pending' ? 'confirmed' : 
                                          appointment.status === 'confirmed' ? 'cancelled' : 'pending';
                          handleQuickStatusUpdate(appointment.id, newStatus);
                        }}
                        sx={{ cursor: 'pointer' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={appointment.payment_status.charAt(0).toUpperCase() + appointment.payment_status.slice(1)}
                        color={getPaymentStatusColor(appointment.payment_status)}
                        size="small"
                        onClick={() => {
                          const newPaymentStatus = appointment.payment_status === 'pending' ? 'paid' : 'pending';
                          handlePaymentStatusUpdate(appointment.id, newPaymentStatus);
                        }}
                        sx={{ cursor: 'pointer' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => router.visit(`/appointments/${appointment.id}`)}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => router.visit(`/appointments/${appointment.id}/edit`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(appointment.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
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
              appointments={appointments.data || []}
            />
          )}
        </Box>
      )}

      {appointments.data.length > 0 && (
        <Box mt={2} display="flex" justifyContent="center">
          <Typography variant="body2" color="textSecondary">
            Showing {appointments.from || 0}-{appointments.to || 0} of {appointments.total || 0} appointments
          </Typography>
        </Box>
      )}
    </Box>
  );
}