import AnimatedAuthLayout from '@/layouts/auth/animated-auth-layout';
import login from '@/routes/login';
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

            <Form {...login.store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.75, md: 2.25, xl: 2.5 } }}>
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
                                        <EmailIcon sx={{ color: '#5c6bc0' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    fontSize: { xs: '0.95rem', xl: '1rem' },
                                    minHeight: { xs: 52, md: 50, xl: 56 },
                                    '&:hover fieldset': {
                                        borderColor: '#5c6bc0',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#5c6bc0',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: { xs: '0.95rem', xl: '1rem' },
                                    '&.Mui-focused': {
                                        color: '#5c6bc0',
                                    },
                                },
                                '& .MuiFormHelperText-root': {
                                    fontSize: '0.8rem',
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
                                        <LockIcon sx={{ color: '#5c6bc0' }} />
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
                                                '&:hover': { color: '#5c6bc0' } 
                                            }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </Button>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    fontSize: { xs: '0.95rem', xl: '1rem' },
                                    minHeight: { xs: 52, md: 50, xl: 56 },
                                    '&:hover fieldset': {
                                        borderColor: '#5c6bc0',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#5c6bc0',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: { xs: '0.95rem', xl: '1rem' },
                                    '&.Mui-focused': {
                                        color: '#5c6bc0',
                                    },
                                },
                                '& .MuiFormHelperText-root': {
                                    fontSize: '0.8rem',
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
                                            color: '#5c6bc0',
                                            '&.Mui-checked': {
                                                color: '#5c6bc0',
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
                                        color: '#5c6bc0',
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
                            size="large"
                            tabIndex={4}
                            disabled={processing}
                            startIcon={processing ? <CircularProgress size={18} color="inherit" /> : <LoginIcon sx={{ fontSize: { xs: 20, md: 24 } }} />}
                            sx={{
                                bgcolor: '#5c6bc0',
                                py: { xs: 1.15, md: 1.2, xl: 1.4 },
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: { xs: '0.9rem', md: '0.95rem', xl: '1rem' },
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
                                        color: '#5c6bc0',
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
