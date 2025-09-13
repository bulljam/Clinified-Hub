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
  Dialog,
  Collapse,
  Grid,
  InputAdornment,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CreditCard as CreditCardIcon,
  CalendarMonth as CalendarIcon,
  List as ListIcon,
  LocalHospital as MedicalIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  AttachMoney as PaymentIcon,
  TrendingUp as StatsIcon,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import AppointmentCalendar from '../calendar/AppointmentCalendar';
import PatientAppointmentForm from './PatientAppointmentForm';
import NewAppointmentModal from './NewAppointmentModal';
import CreatePayment from '../../Pages/Payments/Create';
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
  payment_status: 'pending' | 'paid' | 'on_hold' | 'cancelled';
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

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface PatientAppointmentsProps {
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
  allAppointments: Appointment[];
  providers: Provider[];
  filters?: {
    status?: string;
    payment_status?: string;
    date?: string;
  };
  currentUser?: User;
}

export default function PatientAppointments({ appointments, allAppointments, providers, filters = {}, currentUser }: PatientAppointmentsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [payingAppointment, setPayingAppointment] = useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [paymentFilter, setPaymentFilter] = useState(filters.payment_status || '');
  const [dateFilter, setDateFilter] = useState(filters.date || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);


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

  const appointmentStats = {
    total: appointments.data.length,
    confirmed: appointments.data.filter(a => a.status === 'confirmed').length,
    pending: appointments.data.filter(a => a.status === 'pending').length,
    paid: appointments.data.filter(a => a.payment_status === 'paid').length,
    onHold: appointments.data.filter(a => a.payment_status === 'on_hold').length,
  };

  const handlePaymentStatusUpdate = (appointmentId: number, paymentStatus: string) => {
    router.patch(`/appointments/${appointmentId}`, {
      payment_status: paymentStatus,
    });
  };

  const handlePaymentSuccess = () => {
    setPayingAppointment(null);
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

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh', bgcolor: '#fafafa' }}>
      {isLoading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />}
      
      {/* Header Section */}
      <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: '#20a09f', width: 56, height: 56 }}>
                <PersonIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold" color="#20a09f">
                  My Appointments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage your healthcare appointments
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={() => setShowNewAppointmentModal(true)}
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
              + Book New Appointment
            </Button>
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
                <StatsIcon sx={{ fontSize: 80 }} />
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
                  <MedicalIcon />
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
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              {/* Filter Toggle */}
              <Box display="flex" alignItems="center" gap={2}>
                <Button
                  startIcon={<FilterIcon />}
                  endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outlined"
                  sx={{
                    borderColor: '#20a09f',
                    color: '#20a09f',
                    '&:hover': {
                      borderColor: '#178f8e',
                      bgcolor: 'rgba(32, 160, 159, 0.04)',
                    },
                  }}
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                {(statusFilter || paymentFilter || dateFilter) && (
                  <Button
                    variant="text"
                    color="error"
                    onClick={clearFilters}
                    size="small"
                  >
                    Clear All
                  </Button>
                )}
              </Box>

              {/* Filters */}
              <Collapse in={showFilters}>
                <Box sx={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 2, 
                  p: 3, 
                  mt: 2,
                  bgcolor: 'rgba(32, 160, 159, 0.02)' 
                }}>
                  <Grid container spacing={3} alignItems="flex-end">
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <FormControl fullWidth>
                        <InputLabel>Appointment Status</InputLabel>
                        <Select
                          value={statusFilter}
                          label="Appointment Status"
                          onChange={(e) => setStatusFilter(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': {
                                borderColor: '#20a09f',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#20a09f',
                              },
                            },
                          }}
                        >
                          <MenuItem value="">All Status</MenuItem>
                          <MenuItem value="pending">🟡 Pending</MenuItem>
                          <MenuItem value="confirmed">🟢 Confirmed</MenuItem>
                          <MenuItem value="cancelled">🔴 Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <FormControl fullWidth>
                        <InputLabel>Payment Status</InputLabel>
                        <Select
                          value={paymentFilter}
                          label="Payment Status"
                          onChange={(e) => setPaymentFilter(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': {
                                borderColor: '#20a09f',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#20a09f',
                              },
                            },
                          }}
                        >
                          <MenuItem value="">All Payments</MenuItem>
                          <MenuItem value="pending">🟡 Pending</MenuItem>
                          <MenuItem value="on_hold">🔵 On Hold</MenuItem>
                          <MenuItem value="paid">🟢 Paid</MenuItem>
                          <MenuItem value="cancelled">🔴 Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Filter by Date"
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        slotProps={{
                          inputLabel: { shrink: true }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#20a09f',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#20a09f',
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ 
                    mt: 3, 
                    display: 'flex', 
                    gap: 2, 
                    justifyContent: 'flex-end',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <Button 
                      onClick={clearFilters} 
                      variant="outlined"
                      sx={{
                        borderColor: '#e0e0e0',
                        color: 'text.secondary',
                        '&:hover': {
                          borderColor: '#20a09f',
                          bgcolor: 'rgba(32, 160, 159, 0.04)',
                          color: '#20a09f',
                        },
                      }}
                    >
                      Clear Filters
                    </Button>
                    <Button
                      onClick={() => applyFilters()}
                      variant="contained"
                      sx={{
                        bgcolor: '#20a09f',
                        color: 'white',
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        '&:hover': { 
                          bgcolor: '#178f8e',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(32, 160, 159, 0.3)',
                        },
                      }}
                    >
                      Apply Filters
                    </Button>
                  </Box>
                </Box>
              </Collapse>
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
              label="My Appointments List"
              iconPosition="start"
            />
            <Tab
              icon={<CalendarIcon />}
              label="Calendar View"
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Card>

      {appointments.data.length === 0 ? (
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Avatar sx={{ bgcolor: 'grey.100', width: 80, height: 80, mx: 'auto', mb: 3 }}>
              <PersonIcon sx={{ fontSize: 40, color: 'grey.400' }} />
            </Avatar>
            <Typography variant="h6" fontWeight="600" color="text.primary" mb={1}>
              No Appointments Found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {appointments.data.length === 0 
                ? "You haven't booked any appointments yet. Book your first appointment to get started!"
                : "No appointments match your current filter criteria. Try adjusting your filters."
              }
            </Typography>
            <Button 
              variant="contained"
              onClick={() => setShowNewAppointmentModal(true)}
              sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 600 }}
            >
              Book Your First Appointment
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
                          <MedicalIcon fontSize="small" />
                          Healthcare Provider
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
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 180 }}>
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
                          onClick={() => setViewingAppointment(appointment)}
                          sx={{
                            '&:hover': {
                              bgcolor: 'rgba(32, 160, 159, 0.08)',
                              transition: 'background-color 0.2s ease',
                              transform: 'scale(1.002)',
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
                          <TableCell sx={{ py: 3, minWidth: 120 }}>
                            <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.5}>
                              <Chip
                                label={`${
                                  appointment.status === 'cancelled' 
                                    ? '🔴 Cancelled'
                                    : appointment.payment_status === 'paid'
                                    ? '🟢 Paid' 
                                    : appointment.payment_status === 'on_hold' 
                                    ? '🔵 On Hold' 
                                    : '🟡 Pending'
                                }`}
                                color={appointment.status === 'cancelled' ? 'error' : getPaymentStatusColor(appointment.payment_status)}
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
                              {appointment.status === 'cancelled' && appointment.payment_status === 'cancelled' && (
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
                                  Refund will be processed
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 3, minWidth: 180 }}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              {appointment.payment_status === 'pending' && appointment.status !== 'cancelled' && (
                                <Tooltip title="Pay with Credit Card" arrow>
                                  <IconButton
                                    size="medium"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPayingAppointment(appointment);
                                    }}
                                    sx={{
                                      bgcolor: '#4caf50',
                                      color: 'white',
                                      width: 36,
                                      height: 36,
                                      borderRadius: 2,
                                      boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)',
                                      '&:hover': {
                                        bgcolor: '#45a049',
                                        transform: 'scale(1.1) rotate(5deg)',
                                        boxShadow: '0 4px 8px rgba(76, 175, 80, 0.4)',
                                      },
                                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                  >
                                    <CreditCardIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {appointment.status !== 'cancelled' && appointment.payment_status !== 'paid' && (
                                <Tooltip title="Edit Appointment" arrow>
                                  <IconButton
                                    size="medium"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingAppointment(appointment);
                                    }}
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
                              )}
                              {appointment.status === 'pending' && (
                                <Tooltip title="Cancel Appointment" arrow>
                                  <IconButton
                                    size="medium"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeletingAppointment(appointment);
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
                                    <DeleteIcon fontSize="small" />
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
              
            </Card>
          )}

          {activeTab === 1 && (
            <AppointmentCalendar
              appointments={appointments.data}
              userRole="client"
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

      {editingAppointment && (
        <PatientAppointmentForm
          appointment={editingAppointment}
          open={!!editingAppointment}
          onClose={() => setEditingAppointment(null)}
        />
      )}

      {viewingAppointment && (
        <Dialog open={!!viewingAppointment} onClose={() => setViewingAppointment(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: '#20a09f', color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
            <MedicalIcon />
            Appointment Details
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  Patient Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Name:</strong> {viewingAppointment.user?.name || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Email:</strong> {viewingAppointment.user?.email || 'N/A'}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  Provider Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Doctor:</strong> Dr. {viewingAppointment.provider?.name || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Email:</strong> {viewingAppointment.provider?.email || 'N/A'}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  Appointment Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Date:</strong> {dayjs(viewingAppointment.date).format('MMMM D, YYYY')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Time:</strong> {viewingAppointment.time ? dayjs(`1970-01-01 ${viewingAppointment.time}`).format('h:mm A') : 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <strong>Status:</strong> 
                  <Chip
                    label={viewingAppointment.status.charAt(0).toUpperCase() + viewingAppointment.status.slice(1)}
                    color={getStatusColor(viewingAppointment.status)}
                    size="small"
                  />
                </Typography>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <strong>Payment:</strong> 
                    <Chip
                      label={viewingAppointment.payment_status.charAt(0).toUpperCase() + viewingAppointment.payment_status.slice(1)}
                      color={getPaymentStatusColor(viewingAppointment.payment_status)}
                      size="small"
                    />
                  </Typography>
                  {viewingAppointment.payment_status === 'cancelled' && (
                    <Typography variant="caption" color="warning.main" fontWeight="600" sx={{ fontSize: '0.75rem', ml: 9 }}>
                      Refund will be processed within 3-5 business days
                    </Typography>
                  )}
                </Box>
                {viewingAppointment.notes && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Notes:</strong> {viewingAppointment.notes}
                  </Typography>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => setViewingAppointment(null)}
            >
              Close
            </Button>
            {viewingAppointment.status !== 'cancelled' && viewingAppointment.payment_status !== 'paid' && (
              <Button
                variant="contained"
                onClick={() => {
                  setEditingAppointment(viewingAppointment);
                  setViewingAppointment(null);
                }}
                sx={{ bgcolor: '#20a09f' }}
              >
                Edit Appointment
              </Button>
            )}
          </DialogActions>
        </Dialog>
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
        currentUser={currentUser || { id: 0, name: '', email: '', role: 'client' }}
      />

      {payingAppointment && (
        <CreatePayment
          open={!!payingAppointment}
          onClose={() => setPayingAppointment(null)}
          amount={30}
          doctorId={payingAppointment.provider_id}
          userId={payingAppointment.user.id}
          appointmentId={payingAppointment.id}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </Box>
  );
}