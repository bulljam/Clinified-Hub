import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import AnimatedAuthLayout from '@/layouts/auth/animated-auth-layout';
import { login } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import {
    Email as EmailIcon,
    Home as HomeIcon,
    Lock as LockIcon,
    MonitorHeart as DoctorIcon,
    Person as PersonIcon,
    PersonAdd as RegisterIcon,
    MedicalServices,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isDoctorDialogOpen, setIsDoctorDialogOpen] = useState(true);

    return (
        <AnimatedAuthLayout 
            title="Create Account" 
            description="Join Clinified Hub to access our healthcare services"
            mode="register"
            imagePosition="left"
        >
            <Head title="Register" />
            
            <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
                <IconButton
                    component={Link}
                    href="/"
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
                    <HomeIcon />
                </IconButton>
            </Box>

            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
            >
                {({ processing, errors }) => (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Full Name Field */}
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            placeholder="Enter your full name"
                            error={!!errors.name}
                            helperText={errors.name}
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon sx={{ color: '#20a09f' }} />
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

                        {/* Email Field */}
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            required
                            tabIndex={2}
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
                            tabIndex={3}
                            autoComplete="new-password"
                            placeholder="Create a strong password"
                            error={!!errors.password}
                            helperText={errors.password || 'Password must be at least 8 characters long'}
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

                        {/* Confirm Password Field */}
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            placeholder="Confirm your password"
                            error={!!errors.password_confirmation}
                            helperText={errors.password_confirmation}
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
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            sx={{ 
                                                minWidth: 'auto', 
                                                p: 1, 
                                                color: 'text.secondary',
                                                '&:hover': { color: '#20a09f' } 
                                            }}
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

                        {/* Create Account Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            tabIndex={5}
                            disabled={processing}
                            startIcon={processing ? <CircularProgress size={18} color="inherit" /> : <RegisterIcon />}
                            sx={{
                                bgcolor: '#20a09f',
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
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
                            {processing ? 'Creating account...' : 'Create Account'}
                        </Button>

                        {/* Divider */}
                        <Divider sx={{ my: 1 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', px: 2 }}>
                                Already a member?
                            </Typography>
                        </Divider>

                        {/* Sign In Link */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Already have an account?{' '}
                                <Link
                                    href={login()}
                                    style={{
                                        color: '#20a09f',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                    }}
                                    tabIndex={6}
                                    onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                    onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                                >
                                    Sign in instead
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Form>

            <Dialog
                open={isDoctorDialogOpen}
                onClose={() => setIsDoctorDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                    <DoctorIcon sx={{ fontSize: 48, color: '#20a09f', mb: 2 }} />
                    <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                        Are you a healthcare provider?
                    </Typography>
                </DialogTitle>
                
                <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                        If you're a doctor or healthcare provider, you'll need to complete a separate application process to join our platform.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Patient registration is available directly on this page.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3, gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setIsDoctorDialogOpen(false)}
                        sx={{
                            color: 'text.secondary',
                            borderColor: 'divider',
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                                borderColor: '#20a09f',
                                color: '#20a09f',
                            },
                        }}
                    >
                        No, I'm a patient
                    </Button>
                    
                    <Button
                        variant="contained"
                        onClick={() => window.location.href = 'http://localhost:8000/doctor-application'}
                        startIcon={<MedicalServices />}
                        sx={{
                            bgcolor: '#20a09f',
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(32, 160, 159, 0.3)',
                            '&:hover': {
                                bgcolor: '#178f8e',
                                boxShadow: '0 6px 16px rgba(32, 160, 159, 0.4)',
                            },
                        }}
                    >
                        Yes, I'm a doctor
                    </Button>
                </DialogActions>
            </Dialog>
        </AnimatedAuthLayout>
    );
}