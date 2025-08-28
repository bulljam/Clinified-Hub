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
import { useEffect, useState } from 'react';

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
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid';
}

interface NewAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  providers: Provider[];
  existingAppointments: Appointment[];
}

export default function NewAppointmentModal({ 
  open, 
  onClose, 
  providers,
  existingAppointments 
}: NewAppointmentModalProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    provider_id: '',
    date: '',
    time: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

  // Check if a time slot is available for the selected provider and date
  const isTimeSlotAvailable = (timeStr: string) => {
    if (!data.provider_id || !data.date) return true;
    
    // Check if this time slot is already booked for the selected provider and date
    return !existingAppointments.some(appointment => 
      appointment.provider_id === parseInt(data.provider_id) &&
      appointment.date === data.date &&
      appointment.time.substring(0, 5) === timeStr &&
      appointment.status !== 'cancelled'
    );
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
                  {providers.map((provider) => (
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

              <TextField
                select
                fullWidth
                label="Appointment Time"
                value={data.time}
                onChange={(e) => setData('time', e.target.value)}
                error={!!errors.time}
                helperText={errors.time || (!data.provider_id || !data.date ? 'Please select provider and date first' : '')}
                disabled={!data.provider_id || !data.date}
                InputLabelProps={{
                  shrink: true,
                }}
                slotProps={{
                  select: {
                    native: true,
                  },
                }}
              >
                <option value="">
                  {!data.provider_id || !data.date 
                    ? 'Select provider and date first...' 
                    : 'Select a time...'
                  }
                </option>
                {data.provider_id && data.date && Array.from({ length: 18 }, (_, i) => {
                  const hour = 8 + Math.floor(i / 2);
                  const minute = (i % 2) * 30;
                  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                  const isAvailable = isTimeSlotAvailable(timeStr);
                  
                  // Only return available time slots
                  if (!isAvailable) return null;
                  
                  const displayTime = `${timeStr} (${displayHour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'})`;
                  
                  return (
                    <option key={timeStr} value={timeStr}>
                      {displayTime}
                    </option>
                  );
                }).filter(Boolean)}
              </TextField>

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
          disabled={processing || !data.provider_id || !data.date || !data.time}
          onClick={handleSubmit}
        >
          {processing ? 'Booking...' : 'Book Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}