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
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Statistics for medical dashboard feel
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
    
    // Provider filter
    if (providerFilter && appointment.provider.id.toString() !== providerFilter) {
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

  const appointmentStats = {
    total: appointments.data.length,
    confirmed: appointments.data.filter(a => a.status === 'confirmed').length,
    pending: appointments.data.filter(a => a.status === 'pending').length,
    paid: appointments.data.filter(a => a.payment_status === 'paid').length,
  };

  const handleFilterChange = () => {
    // Filters are applied automatically through filteredAppointments
    console.log('Applying filters:', { statusFilter, paymentFilter, providerFilter, dateFilter });
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
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                <MedicalIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
                  Patient Appointments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage and track all patient appointments
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => router.visit('/appointments/create')}
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
              + New Appointment
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
              <FilterIcon color="primary" />
              <Typography variant="h6" fontWeight="600" color="primary.main">
                Advanced Filters
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={6} alignItems="center" justifyContent="center" flexWrap="wrap">
              <FormControl size="medium" sx={{ minWidth: 200 }}>
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

              <FormControl size="medium" sx={{ minWidth: 180 }}>
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
                  minWidth: 170,
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
              />

              <Box display="flex" gap={2}>
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
                minWidth: 1200, 
                overflowX: 'auto',
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
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.main' }}>
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
                    {paginatedAppointments.map((appointment, index) => (
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
                          <TableCell sx={{ py: 3, minWidth: 120 }}>
                            <Tooltip title="Click to cycle: Pending → Confirmed → Cancelled" arrow>
                              <Chip
                                label={`${appointment.status === 'confirmed' ? '🟢' : appointment.status === 'pending' ? '🟡' : '🔴'} ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}`}
                                color={getStatusColor(appointment.status)}
                                size="medium"
                                onClick={() => {
                                  const newStatus = appointment.status === 'pending' ? 'confirmed' : 
                                                  appointment.status === 'confirmed' ? 'cancelled' : 'pending';
                                  handleQuickStatusUpdate(appointment.id, newStatus);
                                }}
                                sx={{ 
                                  cursor: 'pointer',
                                  fontWeight: 600,
                                  minWidth: 100,
                                  height: 32,
                                  borderRadius: 2,
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                  },
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
                            <Tooltip title="Click to toggle: Pending ↔ Paid" arrow>
                              <Chip
                                icon={<PaymentIcon fontSize="small" />}
                                label={appointment.payment_status.charAt(0).toUpperCase() + appointment.payment_status.slice(1)}
                                color={getPaymentStatusColor(appointment.payment_status)}
                                size="medium"
                                onClick={() => {
                                  const newPaymentStatus = appointment.payment_status === 'pending' ? 'paid' : 'pending';
                                  handlePaymentStatusUpdate(appointment.id, newPaymentStatus);
                                }}
                                sx={{ 
                                  cursor: 'pointer',
                                  fontWeight: 600,
                                  minWidth: 100,
                                  height: 32,
                                  borderRadius: 2,
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                  },
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
                          <TableCell align="right" sx={{ py: 3, minWidth: 180 }}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="View Patient Details" arrow>
                                <IconButton
                                  size="medium"
                                  onClick={() => router.visit(`/appointments/${appointment.id}`)}
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
                    color="primary"
                    size="large"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        fontWeight: 600,
                        minWidth: 40,
                        height: 40,
                        border: '1px solid #e0e0e0',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 8px rgba(32, 160, 159, 0.3)',
                        },
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(32, 160, 159, 0.4)',
                          '&:hover': {
                            bgcolor: 'primary.dark',
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
              appointments={appointments.data || []}
              userRole="admin"
            />
          )}
        </Box>
      )}

      {/* Pagination Footer - Only show in list view */}
      {appointments.data.length > 0 && activeTab === 0 && (
        <Card elevation={0} sx={{ mt: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Showing <strong>{appointments.from || 0}-{appointments.to || 0}</strong> of <strong>{appointments.total || 0}</strong> appointments
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}