import { router, useForm } from '@inertiajs/react';
import { Alert, Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { type Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

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
    status: string;
    payment_status: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface AppointmentFormProps {
    appointment?: Appointment | null;
    providers?: Provider[];
    isEdit?: boolean;
}

interface AppointmentFormData {
    provider_id: number | '';
    date: string;
    time: string;
    status: string;
    payment_status: string;
}

export default function AppointmentForm({ appointment = null, providers = [], isEdit = false }: AppointmentFormProps) {
    const { data, setData, post, patch, processing, errors } = useForm<AppointmentFormData>({
        provider_id: appointment?.provider_id || '',
        date: appointment?.date || '',
        time: appointment?.time ? dayjs(appointment.time, 'HH:mm:ss').format('HH:mm') : '',
        status: appointment?.status || 'pending',
        payment_status: appointment?.payment_status || 'pending',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            if (!appointment) {
                return;
            }

            patch(`/appointments/${appointment.id}`, {
                onSuccess: () => {
                    router.visit('/appointments');
                },
                onError: (errors) => {
                    console.error('Patch errors:', errors);
                },
            });
        } else {
            post('/appointments', {
                onSuccess: () => {
                    router.visit('/appointments');
                },
                onError: (errors) => {
                    console.error('Post errors:', errors);
                },
            });
        }
    };

    const handleCancel = () => {
        router.visit('/appointments');
    };

    const today = dayjs();
    const minDate = isEdit ? undefined : today.add(1, 'day');
    const selectedDate = data.date ? dayjs(data.date) : null;

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
                                    onChange={(e) => setData('provider_id', Number(e.target.value))}
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
                                value={selectedDate}
                                onChange={(newValue: Dayjs | null) => setData('date', newValue ? newValue.format('YYYY-MM-DD') : '')}
                                minDate={minDate}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: !!errors.date,
                                        helperText: errors.date,
                                    },
                                }}
                            />

                            <FormControl fullWidth error={!!errors.time}>
                                <InputLabel>Appointment Time</InputLabel>
                                <Select
                                    value={data.time}
                                    label="Appointment Time"
                                    onChange={(e) => {
                                        const timeStr = e.target.value;
                                        setData('time', timeStr);
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Select a time...</em>
                                    </MenuItem>
                                    {Array.from({ length: 18 }, (_, i) => {
                                        const hour = 8 + Math.floor(i / 2);
                                        const minute = (i % 2) * 30;
                                        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                                        const displayTime = `${timeStr} (${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'})`;
                                        return (
                                            <MenuItem key={timeStr} value={timeStr}>
                                                {displayTime}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                                {errors.time && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, mx: 1.75 }}>
                                        {errors.time}
                                    </Typography>
                                )}
                            </FormControl>

                            {isEdit && (
                                <>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select value={data.status} label="Status" onChange={(e) => setData('status', e.target.value)}>
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
                                <Button variant="outlined" onClick={handleCancel} disabled={processing}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" disabled={processing || !data.provider_id || !data.date || !data.time}>
                                    {processing ? (isEdit ? 'Updating...' : 'Booking...') : isEdit ? 'Update Appointment' : 'Book Appointment'}
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
