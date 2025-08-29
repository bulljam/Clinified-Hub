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
  DialogActions,
  DialogContent,
  DialogTitle,
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

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface PatientAppointmentsProps {
  appointments: {
    data: Appointment[];
    from?: number;
    to?: number;
    total?: number;
  };
  allAppointments: Appointment[];
  currentUser?: User;
}

export default function PatientAppointments({ appointments, allAppointments, currentUser }: PatientAppointmentsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const appointmentStats = {
    total: appointments.data.length,
    confirmed: appointments.data.filter(a => a.status === 'confirmed').length,
    pending: appointments.data.filter(a => a.status === 'pending').length,
    paid: appointments.data.filter(a => a.payment_status === 'paid').length,
  };

  const handlePaymentStatusUpdate = (appointmentId: number, paymentStatus: string) => {
    router.patch(`/appointments/${appointmentId}`, {
      payment_status: paymentStatus,
    });
  };

  // Filter appointments based on current filter values
  const filteredAppointments = appointments.data.filter(appointment => {
    // Status filter
    if (statusFilter && appointment.status !== statusFilter) {
      return false;
    }
    
    // Payment filter
    if (paymentFilter && appointment.payment_status !== paymentFilter) {
      return false;
    }
    
    // Date filter
    if (dateFilter) {
      const appointmentDate = appointment.date.split('T')[0]; // Handle both date formats
      if (appointmentDate !== dateFilter) {
        return false;
      }
    }
    
    return true;
  });

  // Update stats to use filtered data
  const filteredStats = {
    total: filteredAppointments.length,
    confirmed: filteredAppointments.filter(a => a.status === 'confirmed').length,
    pending: filteredAppointments.filter(a => a.status === 'pending').length,
    paid: filteredAppointments.filter(a => a.payment_status === 'paid').length,
  };

  const handleFilterChange = () => {
    // Filters are applied automatically through filteredAppointments
    console.log('Applying filters:', { statusFilter, paymentFilter, dateFilter });
  };

  const clearFilters = () => {
    setStatusFilter('');
    setPaymentFilter('');
    setDateFilter('');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh', bgcolor: '#fafafa' }}>
      {isLoading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />}
      
      {/* Header Section */}
      <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <PersonIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
                  My Appointments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage your healthcare appointments
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setShowNewAppointmentModal(true)}
              sx={{ 
                borderRadius: 3,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(32, 160, 159, 0.3)',
                '&:hover': {
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
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {filteredStats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Appointments
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
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
                    {filteredStats.confirmed}
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
                    {filteredStats.pending}
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
                    {filteredStats.paid}
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
              <FilterIcon color="primary" />
              <Typography variant="h6" fontWeight="600" color="primary.main">
                Filter My Appointments
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center" flexWrap="wrap">
              <FormControl size="medium" sx={{ minWidth: 220 }}>
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

              <FormControl size="medium" sx={{ minWidth: 220 }}>
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
                </Select>
              </FormControl>

              <TextField
                size="medium"
                label="Filter by Date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true }
                }}
                sx={{ 
                  minWidth: 220,
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
              />

              <Box display="flex" gap={2}>
                <Button 
                  variant="contained" 
                  onClick={handleFilterChange}
                  startIcon={<SearchIcon />}
                  size="large"
                  sx={{ 
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(32, 160, 159, 0.2)'
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
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500
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
                  color: 'primary.main',
                  bgcolor: 'primary.main',
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

      {filteredAppointments.length === 0 ? (
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
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.main' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 2 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <MedicalIcon fontSize="small" />
                          Appointment ID
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 2 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <TimeIcon fontSize="small" />
                          Date & Time
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 2 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <MedicalIcon fontSize="small" />
                          Healthcare Provider
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 2 }}>Status</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 2 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PaymentIcon fontSize="small" />
                          Payment
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 600, py: 2 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAppointments.map((appointment, index) => (
                      <Fade in={true} timeout={300 + index * 100} key={appointment.id}>
                        <TableRow 
                          hover
                          sx={{
                            '&:hover': {
                              bgcolor: 'rgba(32, 160, 159, 0.04)',
                              transform: 'scale(1.01)',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 8px rgba(32, 160, 159, 0.1)',
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
                          <TableCell sx={{ py: 3 }}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar sx={{ 
                                bgcolor: 'primary.main', 
                                width: 32, 
                                height: 32, 
                                fontSize: '0.8rem',
                                boxShadow: '0 2px 4px rgba(32, 160, 159, 0.3)',
                                border: '2px solid white'
                              }}>
                                <MedicalIcon fontSize="small" />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontFamily="monospace" fontWeight="600" color="primary.main">
                                  APT-{appointment.id}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: #{appointment.id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 3 }}>
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
                          <TableCell sx={{ py: 3 }}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar sx={{ 
                                bgcolor: 'primary.main', 
                                width: 40, 
                                height: 40,
                                boxShadow: '0 2px 4px rgba(32, 160, 159, 0.3)',
                                border: '2px solid white'
                              }}>
                                <MedicalIcon fontSize="small" />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="600" color="primary.main">
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
                          <TableCell sx={{ py: 3 }}>
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
                          <TableCell sx={{ py: 3 }}>
                            <Tooltip title="Click to mark as paid" arrow>
                              <Chip
                                icon={<PaymentIcon fontSize="small" />}
                                label={appointment.payment_status.charAt(0).toUpperCase() + appointment.payment_status.slice(1)}
                                color={getPaymentStatusColor(appointment.payment_status)}
                                size="medium"
                                onClick={() => {
                                  if (appointment.payment_status === 'pending') {
                                    handlePaymentStatusUpdate(appointment.id, 'paid');
                                  }
                                }}
                                sx={{ 
                                  cursor: appointment.payment_status === 'pending' ? 'pointer' : 'default',
                                  fontWeight: 600,
                                  minWidth: 100,
                                  height: 32,
                                  borderRadius: 2,
                                  '&:hover': appointment.payment_status === 'pending' ? {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                  } : {},
                                  transition: 'all 0.2s ease',
                                  '&.MuiChip-colorWarning': {
                                    bgcolor: '#fff3cd',
                                    color: '#856404',
                                    borderColor: '#ffeaa7',
                                  },
                                  '&.MuiChip-colorSuccess': {
                                    bgcolor: '#d4edda',
                                    color: '#155724',
                                    borderColor: '#a7d8a7',
                                  }
                                }}
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 3 }}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="View Appointment Details" arrow>
                                <IconButton
                                  size="medium"
                                  onClick={() => setEditingAppointment(appointment)}
                                  sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    width: 36,
                                    height: 36,
                                    borderRadius: 2,
                                    boxShadow: '0 2px 4px rgba(32, 160, 159, 0.3)',
                                    '&:hover': {
                                      bgcolor: 'primary.dark',
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
                                  onClick={() => setEditingAppointment(appointment)}
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
                              {appointment.status === 'pending' && (
                                <Tooltip title="Cancel Appointment" arrow>
                                  <IconButton
                                    size="medium"
                                    onClick={() => setDeletingAppointment(appointment)}
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
              appointments={filteredAppointments}
              userRole="client"
            />
          )}
        </Box>
      )}

      {/* Pagination Footer - Only show in list view */}
      {filteredAppointments.length > 0 && activeTab === 0 && (
        <Card elevation={0} sx={{ mt: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Showing <strong>{filteredAppointments.length}</strong> of <strong>{appointments.data.length}</strong> appointments
              {(statusFilter || paymentFilter || dateFilter) && (
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 600, ml: 1 }}>
                  (filtered)
                </Box>
              )}
            </Typography>
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
        currentUser={currentUser || (appointments.data.length > 0 ? appointments.data[0].user : { id: 0, name: '', email: '', role: 'client' })}
      />
    </Box>
  );
}