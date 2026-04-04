import AnimatedAuthLayout from '@/layouts/auth/animated-auth-layout';
import { login } from '@/routes';
import { email as passwordResetEmail } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { Email as EmailIcon, Home as HomeIcon, Send as SendIcon } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, Divider, IconButton, InputAdornment, TextField, Typography } from '@mui/material';

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
                        color: '#5c6bc0',
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 1)',
                            color: '#26418f',
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
                            color: '#5c6bc0',
                        },
                    }}
                >
                    {status}
                </Alert>
            )}

            <Form {...passwordResetEmail.form()}>
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
                                            <EmailIcon sx={{ color: '#5c6bc0' }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#5c6bc0',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#5c6bc0',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    '&.Mui-focused': {
                                        color: '#5c6bc0',
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
                            startIcon={
                                processing ? <CircularProgress size={18} color="inherit" /> : <SendIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
                            }
                            sx={{
                                bgcolor: '#5c6bc0',
                                py: { xs: 1.2, md: 1.5 },
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: { xs: '0.875rem', md: '1rem' },
                                boxShadow: '0 4px 12px rgba(92, 107, 192, 0.3)',
                                '&:hover': {
                                    bgcolor: '#26418f',
                                    boxShadow: '0 6px 16px rgba(92, 107, 192, 0.4)',
                                },
                                '&:disabled': {
                                    bgcolor: 'rgba(92, 107, 192, 0.6)',
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
                                        color: '#5c6bc0',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                    onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
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
