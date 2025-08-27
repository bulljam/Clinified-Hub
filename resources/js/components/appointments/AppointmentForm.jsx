import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { router, useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import { useEffect } from 'react';

export default function AppointmentForm({ 
  appointment = null, 
  providers = [], 
  isEdit = false 
}) {
  const { data, setData, post, patch, processing, errors, reset } = useForm({
    provider_id: appointment?.provider_id || '',
    date: appointment?.date ? dayjs(appointment.date) : null,
    time: appointment?.time ? dayjs(appointment.time, 'HH:mm:ss') : null,
    status: appointment?.status || 'pending',
    payment_status: appointment?.payment_status || 'pending',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      provider_id: data.provider_id,
      date: data.date ? data.date.format('YYYY-MM-DD') : null,
      time: data.time ? data.time.format('HH:mm') : null,
    };

    if (isEdit) {
      formData.status = data.status;
      formData.payment_status = data.payment_status;
      patch(route('appointments.update', appointment.id), {
        onSuccess: () => {
          router.visit(route('appointments.index'));
        }
      });
    } else {
      post(route('appointments.store'), {
        data: formData,
        onSuccess: () => {
          router.visit(route('appointments.index'));
        }
      });
    }
  };

  const handleCancel = () => {
    router.visit(route('appointments.index'));
  };

  const today = dayjs();
  const minDate = isEdit ? null : today.add(1, 'day');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box maxWidth="md" mx="auto">
        <Typography variant="h4" component="h1" mb={3}>
          {isEdit ? 'Edit Appointment' : 'Book New Appointment'}
        </Typography>

        <Card>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {appointment && isEdit && (
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Patient:</strong> {appointment.user?.name} ({appointment.user?.email})
                  </Typography>
                </Alert>
              )}

              <FormControl fullWidth error={!!errors.provider_id}>
                <InputLabel id="provider-select-label">Select Provider</InputLabel>
                <Select
                  labelId="provider-select-label"
                  value={data.provider_id}
                  label="Select Provider"
                  onChange={(e) => setData('provider_id', e.target.value)}
                  disabled={isEdit}
                >
                  <MenuItem value="">
                    <em>Choose a provider...</em>
                  </MenuItem>
                  {providers.map((provider) => (
                    <MenuItem key={provider.id} value={provider.id}>
                      {provider.name} - {provider.email}
                    </MenuItem>
                  ))}
                </Select>
                {errors.provider_id && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.provider_id}
                  </Typography>
                )}
              </FormControl>

              <DatePicker
                label="Appointment Date"
                value={data.date}
                onChange={(newValue) => setData('date', newValue)}
                minDate={minDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.date,
                    helperText: errors.date,
                  },
                }}
              />

              <TimePicker
                label="Appointment Time"
                value={data.time}
                onChange={(newValue) => setData('time', newValue)}
                minTime={dayjs().set('hour', 8).set('minute', 0)}
                maxTime={dayjs().set('hour', 17).set('minute', 0)}
                minutesStep={30}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.time,
                    helperText: errors.time || 'Available times: 8:00 AM - 5:00 PM',
                  },
                }}
              />

              {isEdit && (
                <>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={data.status}
                      label="Status"
                      onChange={(e) => setData('status', e.target.value)}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="confirmed">Confirmed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Payment Status</InputLabel>
                    <Select
                      value={data.payment_status}
                      label="Payment Status"
                      onChange={(e) => setData('payment_status', e.target.value)}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}

              <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={processing || !data.provider_id || !data.date || !data.time}
                >
                  {processing ? (isEdit ? 'Updating...' : 'Booking...') : (isEdit ? 'Update Appointment' : 'Book Appointment')}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {!isEdit && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Booking Guidelines
              </Typography>
              <Typography variant="body2" color="textSecondary" component="div">
                <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
                  <li>Appointments must be booked at least 24 hours in advance</li>
                  <li>Available appointment times are between 8:00 AM and 5:00 PM</li>
                  <li>Time slots are available in 30-minute intervals</li>
                  <li>You can cancel pending appointments</li>
                  <li>Please arrive 10 minutes early for your appointment</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </LocalizationProvider>
  );
}