import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Snackbar,
    Typography,
    Box,
    Stack,
    Paper,
    Divider,
    InputAdornment,
    Card,
    CardContent,
} from '@mui/material';
import {
    CreditCard,
    Lock,
    CheckCircle,
    Security,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';

interface CreatePaymentProps {
    open: boolean;
    onClose: () => void;
    amount?: number;
    doctorId?: number;
    userId?: number;
    appointmentId?: number;
    onSuccess?: () => void;
}

interface FormData {
    card_number: string;
    expiration: string;
    cvv: string;
    amount: number;
    doctor_id: number;
    user_id: number;
    appointment_id?: number;
}

export default function CreatePayment({
    open,
    onClose,
    amount = 30,
    doctorId = 1,
    userId = 1,
    appointmentId,
    onSuccess,
}: CreatePaymentProps) {
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const [formData, setFormData] = useState<FormData>({
        card_number: '',
        expiration: '',
        cvv: '',
        amount: amount,
        doctor_id: doctorId,
        user_id: userId,
        appointment_id: appointmentId,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof FormData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = field === 'amount' ? parseFloat(event.target.value) || 0 : event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const limited = cleaned.slice(0, 16);

        return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const getCardNumberForStorage = (value: string) => {
        return value.replace(/\s/g, '');
    };

    const formatExpiration = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        }
        return cleaned;
    };

    const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(event.target.value);
        const cleanedForStorage = getCardNumberForStorage(formatted);
        
        setFormData(prev => ({
            ...prev,
            card_number: cleanedForStorage,
        }));

        event.target.value = formatted;

        if (errors.card_number) {
            setErrors(prev => ({
                ...prev,
                card_number: '',
            }));
        }
    };

    const handleExpirationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiration(event.target.value);
        setFormData(prev => ({
            ...prev,
            expiration: formatted,
        }));

        if (errors.expiration) {
            setErrors(prev => ({
                ...prev,
                expiration: '',
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.card_number || formData.card_number.length !== 16) {
            newErrors.card_number = 'Card number must be 16 digits';
        }

        if (!formData.expiration || !/^\d{2}\/\d{2}$/.test(formData.expiration)) {
            newErrors.expiration = 'Expiration must be MM/YY format';
        }

        if (!formData.cvv || formData.cvv.length !== 3) {
            newErrors.cvv = 'CVV must be 3 digits';
        }

        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2500));

            router.post('/payments', {
                card_number: formData.card_number,
                expiration: formData.expiration,
                cvv: formData.cvv,
                amount: formData.amount,
                doctor_id: formData.doctor_id,
                user_id: formData.user_id,
                appointment_id: formData.appointment_id,
            }, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: 'Payment submitted successfully! Awaiting doctor approval.',
                        severity: 'success',
                    });
                    
                    onSuccess?.();
                    setTimeout(() => {
                        onClose();
                        setFormData({
                            card_number: '',
                            expiration: '',
                            cvv: '',
                            amount: amount,
                            doctor_id: doctorId,
                            user_id: userId,
                            appointment_id: appointmentId,
                        });
                    }, 1500);
                },
                onError: (errors) => {
                    const errorMessage = typeof errors === 'object' && errors 
                        ? Object.values(errors)[0] as string
                        : 'An error occurred while processing payment';
                    
                    setSnackbar({
                        open: true,
                        message: errorMessage,
                        severity: 'error',
                    });
                },
                onFinish: () => {
                    setLoading(false);
                },
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'An error occurred while processing payment',
                severity: 'error',
            });
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <>
            <Dialog 
                open={open} 
                onClose={handleClose} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
                    }
                }}
            >
                <Box sx={{ p: 0 }}>
                    <Box sx={{
                        p: 4, 
                        pb: 2,
                        background: 'linear-gradient(135deg, #5c6bc0 0%, #26418f 100%)',
                        color: 'white',
                        textAlign: 'center'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <Security sx={{ fontSize: 32, mr: 1 }} />
                            <Typography variant="h5" fontWeight="600">
                                Secure Payment
                            </Typography>
                        </Box>
                        <Typography variant="h4" fontWeight="bold">
                            ${formData.amount.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                            Complete your appointment payment
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <DialogContent sx={{ p: 4, pt: 3 }}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                        Payment Method
                                    </Typography>
                                    <Card variant="outlined" sx={{ 
                                        border: '2px solid #e0f7fa',
                                        bgcolor: '#fafbfc',
                                        '&:hover': { borderColor: '#5c6bc0' }
                                    }}>
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CreditCard sx={{ color: '#5c6bc0', mr: 1 }} />
                                                <Typography variant="body2" fontWeight="500">
                                                    Credit or Debit Card
                                                </Typography>
                                                <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                                                    <Box sx={{ 
                                                        width: 32, height: 20, bgcolor: '#5c6bc0', 
                                                        borderRadius: 0.5, display: 'flex', alignItems: 'center', 
                                                        justifyContent: 'center', fontSize: '8px', color: 'white', fontWeight: 'bold'
                                                    }}>
                                                        VISA
                                                    </Box>
                                                    <Box sx={{ 
                                                        width: 32, height: 20, bgcolor: '#26418f', 
                                                        borderRadius: 0.5, display: 'flex', alignItems: 'center', 
                                                        justifyContent: 'center', fontSize: '8px', color: 'white', fontWeight: 'bold'
                                                    }}>
                                                        MC
                                                    </Box>
                                                    <Box sx={{ 
                                                        width: 32, height: 20, bgcolor: '#00bcd4', 
                                                        borderRadius: 0.5, display: 'flex', alignItems: 'center', 
                                                        justifyContent: 'center', fontSize: '8px', color: 'white', fontWeight: 'bold'
                                                    }}>
                                                        AMEX
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                        Card Information
                                    </Typography>
                                    <Stack spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="Card Number"
                                            value={formatCardNumber(formData.card_number || '')}
                                            onChange={handleCardNumberChange}
                                            error={!!errors.card_number}
                                            helperText={errors.card_number}
                                            placeholder="1234 5678 9012 3456"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CreditCard color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            inputProps={{
                                                maxLength: 19,
                                                pattern: '[0-9\\s]*',
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#5c6bc0',
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#5c6bc0',
                                                    },
                                                }
                                            }}
                                        />

                                        <Stack direction="row" spacing={2}>
                                            <TextField
                                                fullWidth
                                                label="Expiration Date"
                                                value={formData.expiration}
                                                onChange={handleExpirationChange}
                                                error={!!errors.expiration}
                                                helperText={errors.expiration}
                                                placeholder="MM/YY"
                                                inputProps={{
                                                    maxLength: 5,
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#5c6bc0',
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#5c6bc0',
                                                        },
                                                    }
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Security Code"
                                                value={formData.cvv}
                                                onChange={handleChange('cvv')}
                                                error={!!errors.cvv}
                                                helperText={errors.cvv}
                                                placeholder="123"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Lock color="action" fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                inputProps={{
                                                    maxLength: 3,
                                                    pattern: '[0-9]*',
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#5c6bc0',
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#5c6bc0',
                                                        },
                                                    }
                                                }}
                                            />
                                        </Stack>
                                    </Stack>
                                </Box>

                                <Paper
                                    elevation={0} 
                                    sx={{ 
                                        p: 2, 
                                        bgcolor: '#f8f9fa',
                                        border: '1px solid #e9ecef',
                                        borderRadius: 2
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Lock sx={{ color: '#5c6bc0', mr: 1, fontSize: 20 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Your payment information is encrypted and secure
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Stack>
                        </DialogContent>

                        <Divider />

                        <DialogActions sx={{ p: 4, pt: 3 }}>
                            <Button 
                                onClick={handleClose} 
                                disabled={loading}
                                sx={{ 
                                    borderRadius: 2, 
                                    px: 4, 
                                    py: 1.5,
                                    color: 'text.secondary'
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                                sx={{ 
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1.5,
                                    minWidth: 140,
                                    background: 'linear-gradient(135deg, #5c6bc0 0%, #26418f 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #26418f 0%, #1f3167 100%)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 8px 25px rgba(92, 107, 192, 0.4)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {loading ? 'Processing...' : `Pay $${formData.amount.toFixed(2)}`}
                            </Button>
                        </DialogActions>
                    </form>
                </Box>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ 
                        width: '100%',
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    }}
                    icon={snackbar.severity === 'success' ? <CheckCircle /> : undefined}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}