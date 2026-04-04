import { useForm } from '@inertiajs/react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

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

export default function PatientAppointmentForm({ appointment, open, onClose }: PatientAppointmentFormProps) {
    const { data, setData, patch, processing, errors } = useForm({
        date: appointment?.date || '',
        time: appointment?.time ? appointment.time.substring(0, 5) : '',
        notes: appointment?.notes || '',
    });

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
            },
        });
    };

    const today = dayjs();
    const minDate = today.add(1, 'day');
    const canEdit = appointment.status === 'pending';

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ pb: { xs: 1, md: 2 } }}>
                    <Typography variant="h5" component="h2">
                        Edit Appointment
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ px: { xs: 2, md: 3 } }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
                            <Alert severity="info" sx={{ mb: { xs: 2, md: 3 } }}>
                                <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                    <strong>Provider:</strong> {appointment.provider.name}
                                </Typography>
                            </Alert>

                            {!canEdit && (
                                <Alert severity="warning" sx={{ mb: { xs: 2, md: 3 } }}>
                                    <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                        This appointment cannot be modified because it is {appointment.status}.
                                    </Typography>
                                </Alert>
                            )}

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
                                <DatePicker
                                    label="Appointment Date"
                                    value={data.date ? dayjs(data.date) : null}
                                    onChange={(newValue) => setData('date', newValue ? newValue.format('YYYY-MM-DD') : '')}
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
                                    value={data.time ? data.time.substring(0, 5) : ''}
                                    onChange={(e) => setData('time', e.target.value)}
                                    disabled={!canEdit}
                                    error={!!errors.time}
                                    helperText={errors.time}
                                    slotProps={{
                                        select: {
                                            native: true,
                                        },
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
                <DialogActions sx={{ p: { xs: 2, md: 3 }, gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        disabled={processing}
                        sx={{ order: { xs: 2, sm: 1 }, width: { xs: '100%', sm: 'auto' } }}
                    >
                        Close
                    </Button>
                    {canEdit && (
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing || !data.date || !data.time}
                            onClick={handleSubmit}
                            sx={{ order: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 'auto' } }}
                        >
                            {processing ? 'Updating...' : 'Update'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}
