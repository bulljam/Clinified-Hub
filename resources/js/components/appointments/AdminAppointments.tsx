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
  Avatar,
  Tooltip,
  Fade,
  Stack,
  Divider,
  LinearProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CalendarMonth as CalendarIcon,
  List as ListIcon,
  LocalHospital as MedicalIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  AttachMoney as PaymentIcon,
  TrendingUp as StatsIcon,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
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

interface Provider {
  id: number;
  name: string;
  email: string;
}

interface AdminAppointmentsProps {
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
  providers?: Provider[];
  filters?: {
    status?: string;
    payment_status?: string;
    provider_id?: string;
    date?: string;
  };
  userRole?: string;
}

export default function AdminAppointments({ appointments, providers = [], filters = {}, userRole }: AdminAppointmentsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [paymentFilter, setPaymentFilter] = useState(filters.payment_status || '');
  const [providerFilter, setProviderFilter] = useState(filters.provider_id || '');
  const [dateFilter, setDateFilter] = useState(filters.date || '');
  const [isLoading, setIsLoading] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{action: string, appointmentId: number, newValue: string} | null>(null);
  const isAdmin = ['admin', 'super_admin'].includes(userRole || '');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Statistics for medical dashboard feel - using server-filtered data

  const appointmentStats = {
    total: appointments.data.length,
    confirmed: appointments.data.filter(a => a.status === 'confirmed').length,
    pending: appointments.data.filter(a => a.status === 'pending').length,
    paid: appointments.data.filter(a => a.payment_status === 'paid').length,
  };

  const applyFilters = (page: number = 1) => {
    const filterParams = {
      status: statusFilter || undefined,
      payment_status: paymentFilter || undefined,
      provider_id: providerFilter || undefined,
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

  const handleDelete = (appointmentId: number) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      router.delete(`/appointments/${appointmentId}`);
    }
  };

  const handleQuickStatusUpdate = (appointmentId: number, status: string) => {
    if (isAdmin) {
      setPendingAction({action: 'status', appointmentId, newValue: status});
      setAuthDialogOpen(true);
    } else {
      router.patch(`/appointments/${appointmentId}`, { status });
    }
  };

  const handlePaymentStatusUpdate = (appointmentId: number, paymentStatus: string) => {
    if (isAdmin) {
      setPendingAction({action: 'payment', appointmentId, newValue: paymentStatus});
      setAuthDialogOpen(true);
    } else {
      router.patch(`/appointments/${appointmentId}`, {
        payment_status: paymentStatus,
      });
    }
  };

  const handleAuthConfirm = () => {
    if (pendingAction) {
      if (pendingAction.action === 'status') {
        router.patch(`/appointments/${pendingAction.appointmentId}`, { status: pendingAction.newValue });
      } else if (pendingAction.action === 'payment') {
        router.patch(`/appointments/${pendingAction.appointmentId}`, {
          payment_status: pendingAction.newValue,
        });
      }
    }
    setAuthDialogOpen(false);
    setPendingAction(null);
  };

  const handleAuthCancel = () => {
    setAuthDialogOpen(false);
    setPendingAction(null);
  };

  const clearFilters = () => {
    setStatusFilter('');
    setPaymentFilter('');
    setProviderFilter('');
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
                  Patient Appointments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage and track all patient appointments
                </Typography>
              </Box>
            </Box>
            {userRole && !['admin', 'super_admin'].includes(userRole) && (
              <Button
                variant="contained"
                size="large"
                onClick={() => router.visit('/appointments/create')}
                sx={{ 
                  bgcolor: '#20a09f',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(32, 160, 159, 0.3)',
                  '&:hover': {
                    bgcolor: '#178f8e',
                    boxShadow: '0 6px 16px rgba(32, 160, 159, 0.4)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                + New Appointment
              </Button>
            )}
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
                    Paid
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
                Advanced Filters
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
                  <MenuItem value="paid">🟢 Paid</MenuItem>
                  <MenuItem value="on_hold">🔵 On Hold</MenuItem>
                  <MenuItem value="cancelled">🔴 Cancelled</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="medium" sx={{ minWidth: 180, flex: { xs: '1 1 100%', sm: '1 1 auto' } }}>
                <InputLabel>Healthcare Provider</InputLabel>
                <Select
                  value={providerFilter}
                  label="Healthcare Provider"
                  onChange={(e) => setProviderFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All Providers</MenuItem>
                  {providers.map((provider) => (
                    <MenuItem key={provider.id} value={provider.id.toString()}>
                      Dr. {provider.name}
                    </MenuItem>
                  ))}
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
              label="Patient List View"
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

      {appointments.data.length === 0 ? (
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Avatar sx={{ bgcolor: 'grey.100', width: 80, height: 80, mx: 'auto', mb: 3 }}>
              <MedicalIcon sx={{ fontSize: 40, color: 'grey.400' }} />
            </Avatar>
            <Typography variant="h6" fontWeight="600" color="text.primary" mb={1}>
              No Appointments Found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              No appointments match your current filter criteria. Try adjusting your filters or create a new appointment.
            </Typography>
            <Button 
              variant="contained"
              onClick={() => router.visit('/appointments/create')}
              sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 600 }}
            >
              Create New Appointment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {activeTab === 0 && (
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
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
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 200 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <MedicalIcon fontSize="small" />
                          Healthcare Provider
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 120 }}>Status</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 120 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PaymentIcon fontSize="small" />
                          Payment
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 180 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.data.map((appointment, index) => (
                      <Fade in={true} timeout={300 + index * 100} key={appointment.id}>
                        <TableRow 
                          hover
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
                          <TableCell sx={{ py: 3, minWidth: 200 }}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar sx={{ 
                                bgcolor: '#20a09f', 
                                width: 40, 
                                height: 40,
                                boxShadow: '0 2px 4px rgba(32, 160, 159, 0.3)',
                                border: '2px solid white'
                              }}>
                                <MedicalIcon fontSize="small" />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="600" color="#20a09f">
                                  Dr. {appointment.provider.name}
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                  <MedicalIcon fontSize="small" color="action" />
                                  <Typography variant="caption" color="text.secondary">
                                    Healthcare Provider • {appointment.provider.email}
                                  </Typography>
                                </Stack>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 3, minWidth: 120 }}>
                            <Tooltip title={isAdmin ? "Read-only for admin users" : "Click to cycle: Pending → Confirmed → Cancelled"} arrow>
                              <Chip
                                label={`${appointment.status === 'confirmed' ? '🟢' : appointment.status === 'pending' ? '🟡' : '🔴'} ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}`}
                                color={getStatusColor(appointment.status)}
                                size="medium"
                                onClick={isAdmin ? undefined : () => {
                                  const newStatus = appointment.status === 'pending' ? 'confirmed' : 
                                                  appointment.status === 'confirmed' ? 'cancelled' : 'pending';
                                  handleQuickStatusUpdate(appointment.id, newStatus);
                                }}
                                sx={{ 
                                  cursor: isAdmin ? 'default' : 'pointer',
                                  fontWeight: 600,
                                  minWidth: 100,
                                  height: 32,
                                  borderRadius: 2,
                                  '&:hover': {
                                    transform: isAdmin ? 'none' : 'scale(1.05)',
                                    boxShadow: isAdmin ? 'none' : '0 4px 8px rgba(0,0,0,0.2)',
                                  },
                                  transition: 'all 0.2s ease',
                                  opacity: isAdmin ? 0.7 : 1,
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
                            </Tooltip>
                          </TableCell>
                          <TableCell sx={{ py: 3, minWidth: 120 }}>
                            <Box display="flex" flexDirection="column" gap={1}>
                              <Tooltip title={isAdmin ? "Read-only for admin users" : "Click to toggle payment status"} arrow>
                                <Chip
                                  icon={<PaymentIcon fontSize="small" />}
                                  label={appointment.payment_status.charAt(0).toUpperCase() + appointment.payment_status.slice(1)}
                                  color={getPaymentStatusColor(appointment.payment_status)}
                                  size="medium"
                                  onClick={isAdmin ? undefined : () => {
                                    const newPaymentStatus = appointment.payment_status === 'pending' ? 'paid' : 'pending';
                                    handlePaymentStatusUpdate(appointment.id, newPaymentStatus);
                                  }}
                                  sx={{ 
                                    cursor: isAdmin ? 'default' : 'pointer',
                                    fontWeight: 600,
                                    minWidth: 100,
                                    height: 32,
                                    borderRadius: 2,
                                    '&:hover': {
                                      transform: isAdmin ? 'none' : 'scale(1.05)',
                                      boxShadow: isAdmin ? 'none' : '0 4px 8px rgba(0,0,0,0.2)',
                                    },
                                    transition: 'all 0.2s ease',
                                    opacity: isAdmin ? 0.7 : 1,
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
                              </Tooltip>
                              
                              {appointment.payment_status === 'cancelled' && (
                                <Typography variant="caption" color="warning.main" fontWeight="500" sx={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                                  Refund will be processed
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 3, minWidth: 180 }}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="View Patient Details" arrow>
                                <IconButton
                                  size="medium"
                                  onClick={() => router.visit(`/appointments/${appointment.id}`)}
                                  sx={{
                                    bgcolor: '#20a09f',
                                    color: 'white',
                                    width: 36,
                                    height: 36,
                                    borderRadius: 2,
                                    boxShadow: '0 2px 4px rgba(32, 160, 159, 0.3)',
                                    '&:hover': {
                                      bgcolor: '#178f8e',
                                      transform: 'scale(1.1) rotate(5deg)',
                                      boxShadow: '0 4px 8px rgba(32, 160, 159, 0.4)',
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                  }}
                                >
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Appointment" arrow>
                                <IconButton
                                  size="medium"
                                  onClick={() => router.visit(`/appointments/${appointment.id}/edit`)}
                                  sx={{
                                    bgcolor: '#ff9800',
                                    color: 'white',
                                    width: 36,
                                    height: 36,
                                    borderRadius: 2,
                                    boxShadow: '0 2px 4px rgba(255, 152, 0, 0.3)',
                                    '&:hover': {
                                      bgcolor: '#f57c00',
                                      transform: 'scale(1.1) rotate(-5deg)',
                                      boxShadow: '0 4px 8px rgba(255, 152, 0, 0.4)',
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancel Appointment" arrow>
                                <IconButton
                                  size="medium"
                                  onClick={() => handleDelete(appointment.id)}
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
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      </Fade>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}

          {activeTab === 1 && (
            <AppointmentCalendar
              appointments={appointments.data || []}
              userRole="admin"
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

      {/* Admin Authorization Dialog */}
      <Dialog
        open={authDialogOpen}
        onClose={handleAuthCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
          ⚠️ Administrative Action Required
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            You are about to modify an appointment {pendingAction?.action === 'payment' ? 'payment status' : 'status'}.
          </DialogContentText>
          <DialogContentText sx={{ 
            backgroundColor: '#fff3cd', 
            padding: 2, 
            borderRadius: 1, 
            border: '1px solid #ffeaa7',
            color: '#856404'
          }}>
            <strong>Important:</strong> This action is primarily intended for healthcare providers. 
            Admin access is provided for exceptional circumstances only, such as:
            <br />• Provider is unable to access their account
            <br />• Technical issues preventing provider action
            <br />• Emergency situations requiring immediate intervention
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, fontWeight: 'bold' }}>
            Do you confirm that you have the necessary authorization to proceed with this action?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={handleAuthCancel}
            variant="outlined"
            sx={{ px: 4, py: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAuthConfirm}
            variant="contained"
            color="error"
            sx={{ px: 4, py: 1 }}
          >
            Proceed with Administrative Override
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}