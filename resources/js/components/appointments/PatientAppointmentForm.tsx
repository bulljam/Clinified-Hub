import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { router, useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useState } from 'react';

dayjs.extend(utc);
dayjs.extend(timezone);

interface Appointment {
  id: number;
  provider_id: number;
  date: string;
  time: string;
  status: string;
  payment_status: string;
  notes?: string;
  user?: {
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

interface PatientAppointmentFormProps {
  appointment: Appointment;
  open: boolean;
  onClose: () => void;
}

export default function PatientAppointmentForm({ 
  appointment, 
  open, 
  onClose 
}: PatientAppointmentFormProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  
  const { data, setData, patch, processing, errors, transform } = useForm({
    date: appointment?.date ? dayjs(appointment.date) : null,
    time: appointment?.time ? dayjs(appointment.time, 'HH:mm:ss') : null,
    notes: appointment?.notes || '',
  });

  transform((data) => ({
    ...data,
    date: data.date ? data.date.format('YYYY-MM-DD') : '',
    time: data.time ? data.time.format('HH:mm') : '',
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (appointment.status === 'cancelled' || appointment.status === 'confirmed') {
      return;
    }

    patch(`/appointments/${appointment.id}/patient`, {
      onSuccess: () => {
        onClose();
      },
      onError: (errors) => {
        console.error('Update errors:', errors);
      }
    });
  };

  const handleCancel = () => {
    router.delete(`/appointments/${appointment.id}`, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const today = dayjs();
  const minDate = today.add(1, 'day');
  const canEdit = appointment.status === 'pending';

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Appointment
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Provider:</strong> {appointment.provider.name} ({appointment.provider.email})
                </Typography>
              </Alert>

              {!canEdit && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  This appointment cannot be modified because it is {appointment.status}.
                </Alert>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <DatePicker
                  label="Appointment Date"
                  value={data.date}
                  onChange={(newValue) => setData('date', newValue)}
                  minDate={minDate}
                  disabled={!canEdit}
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
                  value={data.time ? data.time.format('HH:mm') : ''}
                  onChange={(e) => {
                    const timeStr = e.target.value;
                    if (timeStr) {
                      const [hours, minutes] = timeStr.split(':');
                      const timeObj = dayjs().hour(parseInt(hours)).minute(parseInt(minutes));
                      setData('time', timeObj);
                    } else {
                      setData('time', null);
                    }
                  }}
                  disabled={!canEdit}
                  error={!!errors.time}
                  helperText={errors.time}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Select a time...</option>
                  {Array.from({ length: 18 }, (_, i) => {
                    const hour = 8 + Math.floor(i / 2);
                    const minute = (i % 2) * 30;
                    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    const displayTime = `${timeStr} (${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'})`;
                    return (
                      <option key={timeStr} value={timeStr}>
                        {displayTime}
                      </option>
                    );
                  })}
                </TextField>

                <TextField
                  label="Notes / Symptoms"
                  multiline
                  rows={4}
                  fullWidth
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  placeholder="Describe your symptoms or what you'd like to discuss during your appointment..."
                  disabled={!canEdit}
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
            onClick={onClose}
            disabled={processing}
          >
            Close
          </Button>
          {canEdit && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowCancelConfirm(true)}
              disabled={processing}
            >
              Cancel Appointment
            </Button>
          )}
          {canEdit && (
            <Button
              type="submit"
              variant="contained"
              disabled={processing || !data.date || !data.time}
              onClick={handleSubmit}
            >
              {processing ? 'Updating...' : 'Update Appointment'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={showCancelConfirm} onClose={() => setShowCancelConfirm(false)}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelConfirm(false)}>
            Keep Appointment
          </Button>
          <Button 
            color="error" 
            variant="contained"
            onClick={() => {
              setShowCancelConfirm(false);
              handleCancel();
            }}
          >
            Yes, Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}