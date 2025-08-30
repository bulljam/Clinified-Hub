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
} from '@mui/material';
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
  payment_status: 'pending' | 'paid';
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
    
    // Frontend validation: Check if patient already has appointment with this provider on this date
    if (hasAppointmentWithProvider(data.provider_id, data.date)) {
      // This validation should be handled by backend, but we can prevent the request
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

  // Filter appointments for the selected provider and date
  const getProviderAppointmentsForDate = (providerId: string, date: string): Appointment[] => {
    if (!providerId || !date) return [];
    
    return allAppointments.filter(appointment => 
      appointment.provider_id === parseInt(providerId) &&
      appointment.date.substring(0, 10) === date && // Compare only YYYY-MM-DD part
      appointment.status !== 'cancelled'
    );
  };

  // Get patient's own appointments for the selected date (to prevent self-conflicts)
  const getPatientAppointmentsForDate = (date: string): Appointment[] => {
    if (!date) return [];
    
    return allAppointments.filter(appointment => 
      appointment.user_id === currentUser.id &&
      appointment.date.substring(0, 10) === date &&
      appointment.status !== 'cancelled'
    );
  };

  // Check if patient already has an appointment with the selected provider on the selected date
  const hasAppointmentWithProvider = (providerId: string, date: string): boolean => {
    if (!providerId || !date) return false;
    
    return allAppointments.some(appointment => 
      appointment.user_id === currentUser.id &&
      appointment.provider_id === parseInt(providerId) &&
      appointment.date.substring(0, 10) === date &&
      appointment.status !== 'cancelled'
    );
  };

  // Check if a time slot is available for the selected provider and date, and if patient doesn't have conflict
  const isTimeSlotAvailable = (timeStr: string) => {
    if (!data.provider_id || !data.date) return true;
    
    // Check if provider is already booked at this time
    const providerAppointments = getProviderAppointmentsForDate(data.provider_id, data.date);
    const isProviderBooked = providerAppointments.some(appointment => {
      const appointmentTime = appointment.time ? appointment.time.substring(0, 5) : '';
      return appointmentTime === timeStr;
    });
    
    // Check if patient has a conflict (appointment with any provider at this time)
    const patientAppointments = getPatientAppointmentsForDate(data.date);
    const hasPatientConflict = patientAppointments.some(appointment => {
      const appointmentTime = appointment.time ? appointment.time.substring(0, 5) : '';
      return appointmentTime === timeStr;
    });
    
    return !isProviderBooked && !hasPatientConflict;
  };

  // Generate available time slots
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Book New Appointment</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth error={!!errors.provider_id}>
                <InputLabel>Select Provider</InputLabel>
                <Select
                  value={data.provider_id}
                  label="Select Provider"
                  onChange={(e) => {
                    setData('provider_id', e.target.value);
                    // Clear time selection when provider changes
                    if (data.time) {
                      setData('time', '');
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Choose a provider...</em>
                  </MenuItem>
                  {providers && providers.length > 0 && providers.map((provider) => (
                    <MenuItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.provider_id && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.provider_id}
                  </Alert>
                )}
              </FormControl>

              <DatePicker
                label="Appointment Date"
                value={data.date ? dayjs(data.date) : null}
                onChange={(newValue) => {
                  setData('date', newValue ? newValue.format('YYYY-MM-DD') : '');
                  // Clear time selection when date changes
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
                  },
                }}
              />

              {data.provider_id && data.date && hasAppointmentWithProvider(data.provider_id, data.date) && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  You already have an appointment with this provider on the selected date. Please choose a different provider or date.
                </Alert>
              )}

              <FormControl fullWidth error={!!errors.time}>
                <InputLabel>Appointment Time</InputLabel>
                <Select
                  value={data.time}
                  label="Appointment Time"
                  onChange={(e) => setData('time', e.target.value)}
                  disabled={!data.provider_id || !data.date || hasAppointmentWithProvider(data.provider_id, data.date)}
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
              />
            </Box>
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={processing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={processing || !data.provider_id || !data.date || !data.time || hasAppointmentWithProvider(data.provider_id, data.date)}
          onClick={handleSubmit}
        >
          {processing ? 'Booking...' : 'Book Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}