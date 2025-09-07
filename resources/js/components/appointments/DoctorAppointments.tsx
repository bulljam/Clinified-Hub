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
  TextField,
  Typography,
  Avatar,
  Tooltip,
  Fade,
  Stack,
  Divider,
  LinearProgress,
  Pagination,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import {
  CalendarMonth as CalendarIcon,
  List as ListIcon,
  Done as ApproveIcon,
  LocalHospital as MedicalIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  AttachMoney as PaymentIcon,
  TrendingUp as StatsIcon,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Event as EventIcon,
  Notes as NotesIcon,
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
    case 'on_hold':
      return 'info';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'on_hold' | 'cancelled';
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
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  filters?: {
    status?: string;
    payment_status?: string;
    date?: string;
  };
}

export default function DoctorAppointments({ appointments, filters = {} }: DoctorAppointmentsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [paymentFilter, setPaymentFilter] = useState(filters.payment_status || '');
  const [dateFilter, setDateFilter] = useState(filters.date || '');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'approve_payment' | 'cancel' | 'payment' | 'update';
    title: string;
    message: string;
  } | null>(null);
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const appointmentStats = {
    total: appointments.data.length,
    confirmed: appointments.data.filter(a => a.status === 'confirmed').length,
    pending: appointments.data.filter(a => a.status === 'pending').length,
    paid: appointments.data.filter(a => a.payment_status === 'paid').length,
    onHold: appointments.data.filter(a => a.payment_status === 'on_hold').length,
  };

  const applyFilters = (page: number = 1) => {
    const filterParams = {
      status: statusFilter || undefined,
      payment_status: paymentFilter || undefined,
      date: dateFilter || undefined,
      page: page > 1 ? page : undefined,
    };
    
    // Remove undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filterParams).filter(([_, value]) => value !== undefined && value !== '')
    );
    
    router.get('/appointments', cleanFilters, {
      preserveState: true,
      preserveScroll: true,
      only: ['appointments', 'filters']
    });
  };

  const clearFilters = () => {
    setStatusFilter('');
    setPaymentFilter('');
    setDateFilter('');
    // Apply cleared filters to server
    router.get('/appointments', {}, {
      preserveState: true,
      preserveScroll: true,
      only: ['appointments', 'filters']
    });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    applyFilters(page);
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

  const handleConfirmAction = (appointment: Appointment, type: 'approve_payment' | 'cancel' | 'payment' | 'update') => {
    setSelectedAppointment(appointment);
    
    let title = '';
    let message = '';
    
    switch (type) {
      case 'approve_payment':
        title = 'Approve Payment';
        message = `Approve payment and automatically confirm the appointment with ${appointment.user.name}?`;
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
      case 'approve_payment':
        router.post(`/appointments/${selectedAppointment.id}/approve-payment`);
        break;
      case 'cancel':
        router.patch(`/appointments/${selectedAppointment.id}`, { status: 'cancelled' });
        break;
      case 'payment':
        router.post(`/appointments/${selectedAppointment.id}/approve-payment`);
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

  const handleAppointmentRowClick = (appointment: Appointment) => {
    setViewingAppointment(appointment);
    setAppointmentDetailsOpen(true);
  };



  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh', bgcolor: '#fafafa' }}>
      {isLoading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />}
      
      {/* Header Section */}
      <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: '#20a09f', width: 56, height: 56 }}>
                <MedicalIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold" color="#20a09f">
                  My Assigned Appointments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your scheduled patient appointments
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Statistics Cards - Only show in list view */}
      {activeTab === 0 && (
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={3} mb={4}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
            <CardContent sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="#20a09f">
                    {appointmentStats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Appointments
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#20a09f', width: 48, height: 48 }}>
                  <StatsIcon />
                </Avatar>
              </Box>
              <Box sx={{ position: 'absolute', bottom: -20, right: -20, opacity: 0.1 }}>
                <MedicalIcon sx={{ fontSize: 80 }} />
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {appointmentStats.confirmed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confirmed
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                  <PersonIcon />
                </Avatar>
              </Box>
              <Box sx={{ position: 'absolute', bottom: -20, right: -20, opacity: 0.1 }}>
                <PersonIcon sx={{ fontSize: 80 }} />
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {appointmentStats.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                  <TimeIcon />
                </Avatar>
              </Box>
              <Box sx={{ position: 'absolute', bottom: -20, right: -20, opacity: 0.1 }}>
                <TimeIcon sx={{ fontSize: 80 }} />
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {appointmentStats.paid}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Approved
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                  <PaymentIcon />
                </Avatar>
              </Box>
              <Box sx={{ position: 'absolute', bottom: -20, right: -20, opacity: 0.1 }}>
                <PaymentIcon sx={{ fontSize: 80 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Advanced Filters Section - Only show in list view */}
      {activeTab === 0 && (
        <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <FilterIcon sx={{ color: '#20a09f' }} />
              <Typography variant="h6" fontWeight="600" color="#20a09f">
                Filter Patient Appointments
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="stretch" justifyContent="flex-start" flexWrap="wrap">
              <FormControl size="medium" sx={{ minWidth: 180, flex: { xs: '1 1 100%', sm: '1 1 auto' } }}>
                <InputLabel>Appointment Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Appointment Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="pending">🟡 Pending</MenuItem>
                  <MenuItem value="confirmed">🟢 Confirmed</MenuItem>
                  <MenuItem value="cancelled">🔴 Cancelled</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="medium" sx={{ minWidth: 160, flex: { xs: '1 1 100%', sm: '1 1 auto' } }}>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={paymentFilter}
                  label="Payment Status"
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All Payments</MenuItem>
                  <MenuItem value="pending">🟡 Pending</MenuItem>
                  <MenuItem value="on_hold">🔵 On Hold</MenuItem>
                  <MenuItem value="paid">🟢 Paid</MenuItem>
                  <MenuItem value="cancelled">🔴 Cancelled</MenuItem>
                  <MenuItem value="refunded">🔴 Refunded</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="medium"
                label="Filter by Date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
                sx={{ 
                  minWidth: 160,
                  flex: { xs: '1 1 100%', sm: '1 1 auto' },
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
              />

              <Box display="flex" gap={2} sx={{ flex: { xs: '1 1 100%', sm: 'none' }, justifyContent: { xs: 'stretch', sm: 'flex-start' } }}>
                <Button 
                  variant="contained" 
                  onClick={() => applyFilters()}
                  size="large"
                  sx={{ 
                    bgcolor: '#20a09f',
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    flex: { xs: 1, sm: 'none' },
                    '&:hover': {
                      bgcolor: '#178f8e',
                    }
                  }}
                >
                  Apply Filters
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={clearFilters}
                  size="large"
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500,
                    flex: { xs: 1, sm: 'none' }
                  }}
                >
                  Clear All
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* View Toggle Tabs */}
      <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                py: 2,
                '&.Mui-selected': {
                  bgcolor: '#20a09f',
                  color: 'white',
                  borderRadius: '8px 8px 0 0',
                }
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            <Tab
              icon={<ListIcon />}
              label="Patient Appointments List"
              iconPosition="start"
            />
            <Tab
              icon={<CalendarIcon />}
              label="Calendar Overview"
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Card>

      {filteredAppointments.length === 0 ? (
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Avatar sx={{ bgcolor: 'grey.100', width: 80, height: 80, mx: 'auto', mb: 3 }}>
              <MedicalIcon sx={{ fontSize: 40, color: 'grey.400' }} />
            </Avatar>
            <Typography variant="h6" fontWeight="600" color="text.primary" mb={1}>
              No Patient Appointments
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {appointments.data.length === 0 
                ? "You don't have any assigned patient appointments at this time. Check back later for new appointments."
                : "No appointments match your current filter criteria. Try adjusting your filters."
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {activeTab === 0 && (
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <TableContainer sx={{ 
                overflowX: 'auto',
                width: '100%',
                '&::-webkit-scrollbar': {
                  height: 8,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f1f1',
                  borderRadius: 4,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#20a09f',
                  borderRadius: 4,
                  '&:hover': {
                    backgroundColor: '#178f8e',
                  },
                }
              }}>
                <Table sx={{ minWidth: 1200 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#20a09f' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 180 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <MedicalIcon fontSize="small" />
                          Appointment ID
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 160 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <TimeIcon fontSize="small" />
                          Date & Time
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 200 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PersonIcon fontSize="small" />
                          Patient Details
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 120 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AccessTimeFilledIcon fontSize="small" />
                          Status
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 120 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PaymentIcon fontSize="small" />
                          Payment
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 160 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LibraryAddCheckIcon fontSize="small" />
                          Actions
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.data.map((appointment, index) => (
                      <Fade in={true} timeout={300 + index * 100} key={appointment.id}>
                        <TableRow 
                          hover
                          onClick={() => handleAppointmentRowClick(appointment)}
                          sx={{
                            '&:hover': {
                              bgcolor: 'rgba(32, 160, 159, 0.08)',
                              transition: 'background-color 0.2s ease',
                            },
                            '&:nth-of-type(even)': {
                              bgcolor: '#fafafa',
                            },
                            '&:nth-of-type(odd)': {
                              bgcolor: 'white',
                            },
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            borderBottom: '1px solid #f0f0f0',
                          }}
                        >
                          <TableCell sx={{ py: 3, minWidth: 180 }}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar sx={{ 
                                bgcolor: '#20a09f', 
                                width: 32, 
                                height: 32, 
                                fontSize: '0.8rem',
                                boxShadow: '0 2px 4px rgba(32, 160, 159, 0.3)',
                                border: '2px solid white'
                              }}>
                                <MedicalIcon fontSize="small" />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontFamily="monospace" fontWeight="600" color="#20a09f">
                                  APT-{appointment.id}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: #{appointment.id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 3, minWidth: 160 }}>
                            <Box>
                              <Typography variant="body2" fontWeight="600" color="text.primary">
                                {dayjs(appointment.date).format('MMM D, YYYY')}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                <TimeIcon fontSize="small" color="action" />
                                <Typography variant="caption" color="text.secondary">
                                  {appointment.time ? dayjs(`1970-01-01 ${appointment.time}`).format('h:mm A') : 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 3, minWidth: 200 }}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar sx={{ 
                                bgcolor: '#4caf50', 
                                width: 40, 
                                height: 40,
                                boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)',
                                border: '2px solid white',
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                              }}>
                                {appointment.user.name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="600" color="text.primary">
                                  {appointment.user.name}
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                  <PersonIcon fontSize="small" color="action" />
                                  <Typography variant="caption" color="text.secondary">
                                    Patient • {appointment.user.email}
                                  </Typography>
                                </Stack>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 3, minWidth: 120 }}>
                            <Chip
                              label={`${appointment.status === 'confirmed' ? '🟢' : appointment.status === 'pending' ? '🟡' : '🔴'} ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}`}
                              color={getStatusColor(appointment.status)}
                              size="medium"
                              sx={{ 
                                fontWeight: 600,
                                minWidth: 100,
                                height: 32,
                                borderRadius: 2,
                                '&.MuiChip-colorWarning': {
                                  bgcolor: '#fff3cd',
                                  color: '#856404',
                                  borderColor: '#ffeaa7',
                                },
                                '&.MuiChip-colorSuccess': {
                                  bgcolor: '#d4edda',
                                  color: '#155724',
                                  borderColor: '#a7d8a7',
                                },
                                '&.MuiChip-colorError': {
                                  bgcolor: '#f8d7da',
                                  color: '#721c24',
                                  borderColor: '#f1aeb5',
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 3, minWidth: 180 }}>
                            <Box display="flex" flexDirection="column" gap={1}>
                              <Chip
                                label={`${
                                  appointment.payment_status === 'paid'
                                    ? '🟢 Paid' 
                                    : appointment.payment_status === 'on_hold' 
                                    ? '🔵 On Hold'
                                    : appointment.payment_status === 'cancelled'
                                    ? '🔴 Cancelled'
                                    : '🟡 Pending'
                                }`}
                                color={getPaymentStatusColor(appointment.payment_status)}
                                size="medium"
                                sx={{ 
                                  fontWeight: 600,
                                  minWidth: 100,
                                  height: 32,
                                  borderRadius: 2,
                                  '&.MuiChip-colorWarning': {
                                    bgcolor: '#fff3cd',
                                    color: '#856404',
                                    borderColor: '#ffeaa7',
                                  },
                                  '&.MuiChip-colorSuccess': {
                                    bgcolor: '#d4edda',
                                    color: '#155724',
                                    borderColor: '#a7d8a7',
                                  },
                                  '&.MuiChip-colorInfo': {
                                    bgcolor: '#d1ecf1',
                                    color: '#0c5460',
                                    borderColor: '#bee5eb',
                                  },
                                  '&.MuiChip-colorError': {
                                    bgcolor: '#f8d7da',
                                    color: '#721c24',
                                    borderColor: '#f1aeb5',
                                  }
                                }}
                              />
                              
                              {appointment.payment_status === 'on_hold' && (
                                <Typography variant="caption" color="text.secondary">
                                  Click confirm to approve
                                </Typography>
                              )}
                              
                              {appointment.payment_status === 'cancelled' && (
                                <Typography variant="caption" color="warning.main" fontWeight="600">
                                  Refund will be processed for patient
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 3, minWidth: 160, overflow: 'visible', position: 'relative' }}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ overflow: 'visible' }}>
                              {appointment.status === 'pending' && appointment.payment_status === 'on_hold' && (
                                <Tooltip title="Approve Payment & Confirm Appointment" arrow>
                                  <IconButton
                                    size="medium"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleConfirmAction(appointment, 'approve_payment');
                                    }}
                                    sx={{
                                      bgcolor: 'success.main',
                                      color: 'white',
                                      width: 36,
                                      height: 36,
                                      borderRadius: 2,
                                      boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)',
                                      '&:hover': {
                                        bgcolor: 'success.dark',
                                        transform: 'scale(1.1) rotate(5deg)',
                                        boxShadow: '0 4px 8px rgba(76, 175, 80, 0.4)',
                                      },
                                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                  >
                                    <CheckCircleIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              
                              {appointment.status === 'pending' && appointment.payment_status !== 'on_hold' && (
                                <Tooltip title="Payment must be submitted before approval" arrow>
                                  <Box sx={{ position: 'relative' }}>
                                    <IconButton
                                      size="medium"
                                      disabled
                                      sx={{
                                        bgcolor: 'grey.300',
                                        color: 'grey.600',
                                        width: 36,
                                        height: 36,
                                        borderRadius: 2,
                                        '&.Mui-disabled': {
                                          bgcolor: 'grey.200',
                                          color: 'grey.400',
                                        }
                                      }}
                                    >
                                      <CheckCircleIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Tooltip>
                              )}
                              
                              
                              {appointment.status === 'pending' && appointment.payment_status !== 'paid' && (
                                <Tooltip title="Cancel Appointment" arrow>
                                  <IconButton
                                    size="medium"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleConfirmAction(appointment, 'cancel');
                                    }}
                                    sx={{
                                      bgcolor: 'error.main',
                                      color: 'white',
                                      width: 36,
                                      height: 36,
                                      borderRadius: 2,
                                      boxShadow: '0 2px 4px rgba(244, 67, 54, 0.3)',
                                      '&:hover': {
                                        bgcolor: 'error.dark',
                                        transform: 'scale(1.1)',
                                        boxShadow: '0 4px 8px rgba(244, 67, 54, 0.4)',
                                      },
                                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      </Fade>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Beautiful Pagination */}
              {totalPages > 1 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  mt: 4, 
                  mb: 2,
                  gap: 2
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredAppointments.length)} of {filteredAppointments.length} appointments
                  </Typography>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_event, page) => handlePageChange(page)}
                    size="large"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    sx={{
                      color: '#20a09f',
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        fontWeight: 600,
                        minWidth: 40,
                        height: 40,
                        border: '1px solid #e0e0e0',
                        '&:hover': {
                          bgcolor: '#20a09f',
                          color: 'white',
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 8px rgba(32, 160, 159, 0.3)',
                        },
                        '&.Mui-selected': {
                          bgcolor: '#20a09f',
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(32, 160, 159, 0.4)',
                          '&:hover': {
                            bgcolor: '#178f8e',
                          },
                        },
                        transition: 'all 0.2s ease',
                      },
                      '& .MuiPaginationItem-ellipsis': {
                        color: 'text.secondary',
                      },
                    }}
                  />
                </Box>
              )}
            </Card>
          )}

          {activeTab === 1 && (
            <AppointmentCalendar
              appointments={appointments.data}
              userRole="provider"
            />
          )}
        </Box>
      )}

      {/* Pagination Footer - Only show in list view */}
      {appointments.data.length > 0 && activeTab === 0 && (
        <Card elevation={0} sx={{ mt: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ py: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Showing <strong>{appointments.from || 0}-{appointments.to || 0}</strong> of <strong>{appointments.total || 0}</strong> appointments
              </Typography>
              {appointments.last_page > 1 && (
                <Pagination
                  count={appointments.last_page}
                  page={appointments.current_page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPagination-ul': {
                      justifyContent: 'center',
                    },
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2,
                      fontWeight: 600,
                      '&.Mui-selected': {
                        bgcolor: '#20a09f',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#178f8e',
                        },
                      },
                      '&:hover': {
                        bgcolor: 'rgba(32, 160, 159, 0.1)',
                      },
                    },
                  }}
                />
              )}
            </Stack>
          </CardContent>
        </Card>
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
          <Button onClick={handleConfirmDialogSubmit} variant="contained" sx={{ bgcolor: '#20a09f', '&:hover': { bgcolor: '#178f8e' } }}>
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
                <MenuItem value="on_hold">On Hold</MenuItem>
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

      {/* Appointment Details Modal */}
      <Dialog
        open={appointmentDetailsOpen}
        onClose={() => setAppointmentDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" fontWeight="bold" color="#20a09f">
              Appointment Details
            </Typography>
            {viewingAppointment && (
              <Chip
                label={`${viewingAppointment.status === 'confirmed' ? '🟢' : viewingAppointment.status === 'pending' ? '🟡' : '🔴'} ${viewingAppointment.status.charAt(0).toUpperCase() + viewingAppointment.status.slice(1)}`}
                color={getStatusColor(viewingAppointment.status)}
                sx={{ fontWeight: 600, fontSize: '0.875rem' }}
              />
            )}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {viewingAppointment && (
            <Stack spacing={4}>
              {/* Header with appointment info */}
              <Card elevation={0} sx={{ bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={3} mb={2}>
                    <Avatar sx={{ 
                      bgcolor: '#20a09f', 
                      width: 56, 
                      height: 56,
                      boxShadow: '0 4px 12px rgba(32, 160, 159, 0.3)'
                    }}>
                      <EventIcon fontSize="large" />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        APT-{viewingAppointment.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Appointment ID: #{viewingAppointment.id}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Patient Information */}
              <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" mb={3} color="#20a09f">
                    Patient Information
                  </Typography>
                  <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ 
                        bgcolor: '#4caf50', 
                        width: 48, 
                        height: 48,
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                      }}>
                        {viewingAppointment.user.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="600">
                          {viewingAppointment.user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
                          <EmailIcon fontSize="small" />
                          {viewingAppointment.user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Appointment Details */}
              <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" mb={3} color="#20a09f">
                    Appointment Information
                  </Typography>
                  <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">
                        Date
                      </Typography>
                      <Typography variant="body1" fontWeight="500" display="flex" alignItems="center" gap={1}>
                        <EventIcon fontSize="small" />
                        {dayjs(viewingAppointment.date).format('MMMM D, YYYY')}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">
                        Time
                      </Typography>
                      <Typography variant="body1" fontWeight="500" display="flex" alignItems="center" gap={1}>
                        <TimeIcon fontSize="small" />
                        {viewingAppointment.time ? dayjs(`1970-01-01 ${viewingAppointment.time}`).format('h:mm A') : 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">
                        Status
                      </Typography>
                      <Box mt={0.5}>
                        <Chip
                          label={`${viewingAppointment.status === 'confirmed' ? '🟢' : viewingAppointment.status === 'pending' ? '🟡' : '🔴'} ${viewingAppointment.status.charAt(0).toUpperCase() + viewingAppointment.status.slice(1)}`}
                          color={getStatusColor(viewingAppointment.status)}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">
                        Payment Status
                      </Typography>
                      <Box mt={0.5}>
                        <Chip
                          label={`${
                            viewingAppointment.payment_status === 'paid'
                              ? '🟢 Paid' 
                              : viewingAppointment.payment_status === 'on_hold' 
                              ? '🔵 On Hold'
                              : viewingAppointment.payment_status === 'cancelled'
                              ? '🔴 Cancelled'
                              : viewingAppointment.payment_status === 'refunded'
                              ? '🔴 Refunded'
                              : '🟡 Pending'
                          }`}
                          color={getPaymentStatusColor(viewingAppointment.payment_status)}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              {viewingAppointment.status === 'pending' && (
                <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" mb={3} color="#20a09f">
                      Quick Actions
                    </Typography>
                    
                    {viewingAppointment.payment_status === 'on_hold' ? (
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          startIcon={<CheckCircleIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAppointmentDetailsOpen(false);
                            handleConfirmAction(viewingAppointment, 'approve_payment');
                          }}
                          sx={{ 
                            bgcolor: 'success.main',
                            '&:hover': { bgcolor: 'success.dark' }
                          }}
                        >
                          Approve Payment & Confirm
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAppointmentDetailsOpen(false);
                            handleConfirmAction(viewingAppointment, 'cancel');
                          }}
                          sx={{ 
                            borderColor: 'error.main',
                            color: 'error.main',
                            '&:hover': { 
                              borderColor: 'error.dark',
                              bgcolor: 'error.light',
                              color: 'error.dark'
                            }
                          }}
                        >
                          Cancel Appointment
                        </Button>
                      </Stack>
                    ) : (
                      <Box>
                        <Stack direction="row" spacing={2} mb={2}>
                          <Button
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            disabled
                            sx={{ 
                              bgcolor: 'grey.300',
                              color: 'grey.600',
                              '&.Mui-disabled': {
                                bgcolor: 'grey.200',
                                color: 'grey.400',
                              }
                            }}
                          >
                            Approve Payment & Confirm
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setAppointmentDetailsOpen(false);
                              handleConfirmAction(viewingAppointment, 'cancel');
                            }}
                            sx={{ 
                              borderColor: 'error.main',
                              color: 'error.main',
                              '&:hover': { 
                                borderColor: 'error.dark',
                                bgcolor: 'error.light',
                                color: 'error.dark'
                              }
                            }}
                          >
                            Cancel Appointment
                          </Button>
                        </Stack>
                        <Box 
                          sx={{ 
                            bgcolor: '#fff3cd', 
                            border: '1px solid #ffeaa7',
                            borderRadius: 1,
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <PaymentIcon sx={{ color: '#856404', fontSize: 20 }} />
                          <Typography variant="body2" color="#856404" fontWeight="500">
                            Patient must submit payment before you can approve and confirm this appointment
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={() => setAppointmentDetailsOpen(false)}
            variant="outlined"
            sx={{ px: 4 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}