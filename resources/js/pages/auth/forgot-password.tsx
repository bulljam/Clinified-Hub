import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import AnimatedAuthLayout from '@/layouts/auth/animated-auth-layout';
import { login } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import {
    Email as EmailIcon,
    Home as HomeIcon,
    Send as SendIcon,
} from '@mui/icons-material';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AnimatedAuthLayout
            title="Reset Password"
            description="Enter your email address and we'll send you a link to reset your password"
            mode="login"
            imagePosition="left"
        >
            <Head title="Forgot password" />

            <Box sx={{ position: 'absolute', top: { xs: 16, md: 24 }, right: { xs: 16, md: 24 } }}>
                <IconButton
                    component={Link}
                    href="/"
                    size="medium"
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        color: '#20a09f',
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 1)',
                            color: '#178f8e',
                        },
                    }}
                    title="Go to Home"
                >
                    <HomeIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
                </IconButton>
            </Box>

            {status && (
                <Alert
                    severity="success"
                    sx={{
                        mb: { xs: 2, md: 3 },
                        borderRadius: 2,
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        '& .MuiAlert-icon': {
                            color: '#20a09f',
                        },
                    }}
                >
                    {status}
                </Alert>
            )}

            <Form {...PasswordResetLinkController.store.form()}>
                {({ processing, errors }) => (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            required
                            autoFocus
                            autoComplete="email"
                            placeholder="Enter your email address"
                            error={!!errors.email}
                            helperText={errors.email}
                            variant="outlined"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon sx={{ color: '#20a09f' }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#20a09f',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#20a09f',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    '&.Mui-focused': {
                                        color: '#20a09f',
                                    },
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={processing}
                            startIcon={processing ? <CircularProgress size={18} color="inherit" /> : <SendIcon sx={{ fontSize: { xs: 20, md: 24 } }} />}
                            sx={{
                                bgcolor: '#20a09f',
                                py: { xs: 1.2, md: 1.5 },
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: { xs: '0.875rem', md: '1rem' },
                                boxShadow: '0 4px 12px rgba(32, 160, 159, 0.3)',
                                '&:hover': {
                                    bgcolor: '#178f8e',
                                    boxShadow: '0 6px 16px rgba(32, 160, 159, 0.4)',
                                },
                                '&:disabled': {
                                    bgcolor: 'rgba(32, 160, 159, 0.6)',
                                },
                            }}
                        >
                            {processing ? 'Sending reset link...' : 'Send Reset Link'}
                        </Button>

                        <Divider sx={{ my: { xs: 1, md: 2 } }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', px: 2, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                Remember your password?
                            </Typography>
                        </Divider>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                <Link
                                    href={login()}
                                    style={{
                                        color: '#20a09f',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                    onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                                >
                                    Return to Sign In
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Form>
        </AnimatedAuthLayout>
    );
}
