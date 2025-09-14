import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import AnimatedAuthLayout from '@/layouts/auth/animated-auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import {
    Email as EmailIcon,
    Home as HomeIcon,
    Lock as LockIcon,
    Login as LoginIcon,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <AnimatedAuthLayout 
            title="Welcome Back" 
            description="Please sign in to your account to continue"
            mode="login"
            imagePosition="right"
        >
            <Head title="Log in" />
            
            <Box sx={{ position: 'absolute', top: { xs: 16, md: 24 }, right: { xs: 16, md: 24 } }}>
                <IconButton
                    component={Link}
                    href="/"
                    size={{ xs: 'small', md: 'medium' }}
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

            <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
                        {/* Email Field */}
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="Enter your email address"
                            error={!!errors.email}
                            helperText={errors.email}
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon sx={{ color: '#20a09f' }} />
                                    </InputAdornment>
                                ),
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

                        {/* Password Field */}
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            error={!!errors.password}
                            helperText={errors.password}
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: '#20a09f' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button
                                            onClick={() => setShowPassword(!showPassword)}
                                            sx={{ 
                                                minWidth: 'auto', 
                                                p: 1, 
                                                color: 'text.secondary',
                                                '&:hover': { color: '#20a09f' } 
                                            }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </Button>
                                    </InputAdornment>
                                ),
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

                        {/* Remember Me and Forgot Password */}
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: { xs: 2, sm: 0 } }}>
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        name="remember" 
                                        tabIndex={3}
                                        size="small"
                                        sx={{
                                            color: '#20a09f',
                                            '&.Mui-checked': {
                                                color: '#20a09f',
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                        Remember me
                                    </Typography>
                                }
                            />
                            {canResetPassword && (
                                <Link
                                    href={request()}
                                    style={{
                                        color: '#20a09f',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                    }}
                                    tabIndex={5}
                                    onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                    onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </Box>

                        {/* Sign In Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size={{ xs: 'medium', md: 'large' }}
                            tabIndex={4}
                            disabled={processing}
                            startIcon={processing ? <CircularProgress size={{ xs: 16, md: 18 }} color="inherit" /> : <LoginIcon sx={{ fontSize: { xs: 20, md: 24 } }} />}
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
                            {processing ? 'Signing in...' : 'Sign In'}
                        </Button>

                        {/* Divider */}
                        <Divider sx={{ my: { xs: 1, md: 2 } }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', px: 2, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                New to Clinified Hub?
                            </Typography>
                        </Divider>

                        {/* Sign Up Link */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                Don't have an account?{' '}
                                <Link
                                    href={register()}
                                    style={{
                                        color: '#20a09f',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                    }}
                                    tabIndex={6}
                                    onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                    onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                                >
                                    Create an account
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Form>
        </AnimatedAuthLayout>
    );
}