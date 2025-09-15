import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Alert,
  Typography,
  Avatar,
  Divider,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  LocalHospital as MedicalIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Notes as NotesIcon,
  BookOnline as BookIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface Provider {
  id: number;
  name: string;
  email: string;
}

interface Appointment {
  id: number;
  provider_id: number;
  user_id?: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'on_hold' | 'cancelled';
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface NewAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  providers: Provider[];
  allAppointments: Appointment[];
  currentUser: User;
}

export default function NewAppointmentModal({ 
  open, 
  onClose, 
  providers,
  allAppointments,
  currentUser 
}: NewAppointmentModalProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    provider_id: '',
    date: '',
    time: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasAppointmentWithProvider(data.provider_id, data.date)) {
      return;
    }
    
    post('/appointments', {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (errors) => {
        console.error('Post errors:', errors);
      }
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const today = dayjs();
  const minDate = today.add(1, 'day');

  const getProviderAppointmentsForDate = (providerId: string, date: string): Appointment[] => {
    if (!providerId || !date) return [];
    
    return allAppointments.filter(appointment => 
      appointment.provider_id === parseInt(providerId) &&
      appointment.date.substring(0, 10) === date &&
      appointment.status !== 'cancelled'
    );
  };

  const getPatientAppointmentsForDate = (date: string): Appointment[] => {
    if (!date) return [];
    
    return allAppointments.filter(appointment => 
      appointment.user_id === currentUser.id &&
      appointment.date.substring(0, 10) === date &&
      appointment.status !== 'cancelled'
    );
  };

  const hasAppointmentWithProvider = (providerId: string, date: string): boolean => {
    if (!providerId || !date) return false;
    
    return allAppointments.some(appointment => 
      appointment.user_id === currentUser.id &&
      appointment.provider_id === parseInt(providerId) &&
      appointment.date.substring(0, 10) === date &&
      appointment.status !== 'cancelled'
    );
  };

  const isTimeSlotAvailable = (timeStr: string) => {
    if (!data.provider_id || !data.date) return true;
    
    const providerAppointments = getProviderAppointmentsForDate(data.provider_id, data.date);
    const isProviderBooked = providerAppointments.some(appointment => {
      const appointmentTime = appointment.time ? appointment.time.substring(0, 5) : '';
      return appointmentTime === timeStr;
    });
    
    const patientAppointments = getPatientAppointmentsForDate(data.date);
    const hasPatientConflict = patientAppointments.some(appointment => {
      const appointmentTime = appointment.time ? appointment.time.substring(0, 5) : '';
      return appointmentTime === timeStr;
    });
    
    return !isProviderBooked && !hasPatientConflict;
  };

  const getAvailableTimeSlots = () => {
    if (!data.provider_id || !data.date) return [];
    
    const slots = [];
    for (let i = 0; i < 18; i++) {
      const hour = 8 + Math.floor(i / 2);
      const minute = (i % 2) * 30;
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      if (isTimeSlotAvailable(timeStr)) {
        slots.push(timeStr);
      }
    }
    
    return slots;
  };


  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          }
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: '#5c6bc0',
          color: 'white',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 40, height: 40 }}>
          <BookIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" component="h2" fontWeight="bold">
            Book New Appointment
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            Schedule your healthcare appointment with ease
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Paper elevation={0} sx={{ p: 4, m: 0 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                <Box>
                  <Typography variant="h6" color="#5c6bc0" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MedicalIcon fontSize="small" />
                    Healthcare Provider
                  </Typography>
                  <FormControl fullWidth error={!!errors.provider_id}>
                    <InputLabel shrink>Select Provider</InputLabel>
                    <Select
                      value={data.provider_id}
                      label="Select Provider"
                      onChange={(e) => {
                        setData('provider_id', e.target.value);
                        if (data.time) {
                          setData('time', '');
                        }
                      }}
                      sx={{ 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#5c6bc0',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#5c6bc0',
                          },
                        },
                      }}
                      startAdornment={
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#5c6bc0' }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Choose a healthcare provider...</em>
                      </MenuItem>
                      {providers && providers.length > 0 && providers.map((provider) => (
                        <MenuItem key={provider.id} value={provider.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#5c6bc0', width: 32, height: 32 }}>
                              <MedicalIcon fontSize="small" />
                            </Avatar>
                            Dr. {provider.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.provider_id && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {errors.provider_id}
                      </Alert>
                    )}
                  </FormControl>
                </Box>

                <Box>
                  <Typography variant="h6" color="#5c6bc0" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon fontSize="small" />
                    Appointment Date
                  </Typography>
                  <DatePicker
                    label="Appointment Date"
                    value={data.date ? dayjs(data.date) : null}
                    onChange={(newValue) => {
                      setData('date', newValue ? newValue.format('YYYY-MM-DD') : '');
                      if (data.time) {
                        setData('time', '');
                      }
                    }}
                    minDate={minDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.date,
                        helperText: errors.date,
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: '#e0e0e0',
                            },
                            '&:hover fieldset': {
                              borderColor: '#5c6bc0',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#5c6bc0',
                            },
                          },
                        },
                        slotProps: {
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarIcon sx={{ color: '#5c6bc0' }} />
                              </InputAdornment>
                            ),
                          },
                        },
                      },
                    }}
                  />
                </Box>

              {data.provider_id && data.date && hasAppointmentWithProvider(data.provider_id, data.date) && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  You already have an appointment with this provider on the selected date. Please choose a different provider or date.
                </Alert>
              )}

                <Box>
                  <Typography variant="h6" color="#5c6bc0" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimeIcon fontSize="small" />
                    Appointment Time
                  </Typography>
                  <FormControl fullWidth error={!!errors.time}>
                    <InputLabel shrink>Appointment Time</InputLabel>
                    <Select
                      value={data.time}
                      label="Appointment Time"
                      onChange={(e) => setData('time', e.target.value)}
                      disabled={!data.provider_id || !data.date || hasAppointmentWithProvider(data.provider_id, data.date)}
                      sx={{ 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#5c6bc0',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#5c6bc0',
                          },
                        },
                      }}
                      startAdornment={
                        <InputAdornment position="start">
                          <TimeIcon sx={{ color: '#5c6bc0' }} />
                        </InputAdornment>
                      }
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                    >
                  {!data.provider_id || !data.date ? (
                    <MenuItem disabled value="">
                      Select provider and date first
                    </MenuItem>
                  ) : hasAppointmentWithProvider(data.provider_id, data.date) ? (
                    <MenuItem disabled value="">
                      Cannot book multiple appointments with same provider on same date
                    </MenuItem>
                  ) : getAvailableTimeSlots().length === 0 ? (
                    <MenuItem disabled value="">
                      No available time slots for selected date
                    </MenuItem>
                  ) : (
                    getAvailableTimeSlots().map((timeStr) => {
                      const [hours, minutes] = timeStr.split(':');
                      const hour24 = parseInt(hours);
                      const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
                      const ampm = hour24 >= 12 ? 'PM' : 'AM';
                      const displayTime = `${hour12}:${minutes} ${ampm}`;
                      
                      return (
                        <MenuItem key={timeStr} value={timeStr}>
                          {displayTime}
                        </MenuItem>
                      );
                    })
                  )}
                </Select>
                {(errors.time || 
                  (!data.provider_id || !data.date) || 
                  hasAppointmentWithProvider(data.provider_id, data.date) || 
                  (data.provider_id && data.date && getAvailableTimeSlots().length > 0)) && (
                  <Box sx={{ mt: 1, fontSize: '0.75rem', color: errors.time ? 'error.main' : 'text.secondary' }}>
                    {errors.time || 
                     (!data.provider_id || !data.date ? 'Please select provider and date first' : 
                      hasAppointmentWithProvider(data.provider_id, data.date) ? 'Cannot book multiple appointments with same provider on same date' : 
                      getAvailableTimeSlots().length === 0 ? 'No available time slots for selected date' : 
                      `${getAvailableTimeSlots().length} slot${getAvailableTimeSlots().length !== 1 ? 's' : ''} available`)}
                  </Box>
                )}
                  </FormControl>
                </Box>

                <Box>
                  <Typography variant="h6" color="#5c6bc0" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotesIcon fontSize="small" />
                    Notes & Symptoms
                  </Typography>
                  <TextField
                    label="Notes / Symptoms"
                    multiline
                    rows={4}
                    fullWidth
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    placeholder="Describe your symptoms or what you'd like to discuss during your appointment..."
                    error={!!errors.notes}
                    helperText={errors.notes}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#5c6bc0',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5c6bc0',
                        },
                      },
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                            <NotesIcon sx={{ color: '#5c6bc0' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>

              </Box>
            </Box>
          </Paper>
        </LocalizationProvider>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 4, gap: 2, bgcolor: '#fafafa' }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={processing}
          size="large"
          sx={{ 
            borderRadius: 2,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#5c6bc0',
            color: '#5c6bc0',
            '&:hover': {
              borderColor: '#26418f',
              bgcolor: 'rgba(92, 107, 192, 0.08)'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={processing || !data.provider_id || !data.date || !data.time || hasAppointmentWithProvider(data.provider_id, data.date)}
          onClick={handleSubmit}
          size="large"
          sx={{ 
            bgcolor: '#5c6bc0',
            borderRadius: 2,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(92, 107, 192, 0.3)',
            '&:hover': {
              bgcolor: '#26418f',
              boxShadow: '0 6px 16px rgba(92, 107, 192, 0.4)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              bgcolor: '#e0e0e0',
              color: '#9e9e9e',
            },
            transition: 'all 0.3s ease'
          }}
        >
          {processing ? 'Booking...' : 'Book Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}