import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Stack,
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
    LocationCity as CityIcon,
    CalendarToday as CalendarIcon,
    Phone as PhoneIcon,
    LocalHospital as HospitalIcon,
    Favorite as HeartIcon,
    HealthAndSafety as HealthIcon,
    Vaccines as VaccineIcon,
    Psychology as BrainIcon,
    Emergency as EmergencyIcon,
    Healing as HealingIcon,
    Biotech as BiotechIcon,
} from '@mui/icons-material';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isDoctorDialogOpen, setIsDoctorDialogOpen] = useState(true);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #5c6bc0 0%, #7986cb 50%, #8e99f3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                position: 'relative',
            }}
        >
            <Head title="Register" />

            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '5%',
                    animation: 'float1 7s ease-in-out infinite',
                    zIndex: 0,
                    opacity: 0.2,
                    '@keyframes float1': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-15px) rotate(3deg)' },
                    },
                }}
            >
                <HospitalIcon sx={{ fontSize: 52, color: 'rgba(255,255,255,0.9)' }} />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    top: '45%',
                    left: '3%',
                    animation: 'float2 9s ease-in-out infinite 1.5s',
                    zIndex: 0,
                    opacity: 0.18,
                    '@keyframes float2': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-20px) rotate(-4deg)' },
                    },
                }}
            >
                <VaccineIcon sx={{ fontSize: 46, color: 'rgba(255,255,255,0.9)' }} />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    bottom: '25%',
                    left: '6%',
                    animation: 'float3 8s ease-in-out infinite 3s',
                    zIndex: 0,
                    opacity: 0.22,
                    '@keyframes float3': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-18px) rotate(5deg)' },
                    },
                }}
            >
                <HealingIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.9)' }} />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    top: '70%',
                    left: '2%',
                    animation: 'float4 10s ease-in-out infinite 2s',
                    zIndex: 0,
                    opacity: 0.16,
                    '@keyframes float4': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-12px) rotate(-2deg)' },
                    },
                }}
            >
                <BiotechIcon sx={{ fontSize: 44, color: 'rgba(255,255,255,0.9)' }} />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    top: '18%',
                    right: '4%',
                    animation: 'float5 8.5s ease-in-out infinite 0.5s',
                    zIndex: 0,
                    opacity: 0.2,
                    '@keyframes float5': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-16px) rotate(-3deg)' },
                    },
                }}
            >
                <HeartIcon sx={{ fontSize: 50, color: 'rgba(255,255,255,0.9)' }} />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    top: '42%',
                    right: '6%',
                    animation: 'float6 9.5s ease-in-out infinite 2.5s',
                    zIndex: 0,
                    opacity: 0.19,
                    '@keyframes float6': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-22px) rotate(4deg)' },
                    },
                }}
            >
                <BrainIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.9)' }} />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    bottom: '30%',
                    right: '3%',
                    animation: 'float7 7.5s ease-in-out infinite 1s',
                    zIndex: 0,
                    opacity: 0.21,
                    '@keyframes float7': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-14px) rotate(-5deg)' },
                    },
                }}
            >
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    top: '65%',
                    right: '2%',
                    animation: 'float8 11s ease-in-out infinite 4s',
                    zIndex: 0,
                    opacity: 0.17,
                    '@keyframes float8': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-19px) rotate(3deg)' },
                    },
                }}
            >
                <EmergencyIcon sx={{ fontSize: 44, color: 'rgba(255,255,255,0.9)' }} />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '8%',
                    animation: 'float9 6.5s ease-in-out infinite 3.5s',
                    zIndex: 0,
                    opacity: 0.15,
                    '@keyframes float9': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-10px) rotate(2deg)' },
                    },
                }}
            >
                <HealthIcon sx={{ fontSize: 42, color: 'rgba(255,255,255,0.9)' }} />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    bottom: '12%',
                    left: '8%',
                    animation: 'float10 8.8s ease-in-out infinite 1.8s',
                    zIndex: 0,
                    opacity: 0.16,
                    '@keyframes float10': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-13px) rotate(-1deg)' },
                    },
                }}
            >
                <MedicalServices sx={{ fontSize: 45, color: 'rgba(255,255,255,0.9)' }} />
            </Box>

            <IconButton
                component={Link}
                href="/"
                sx={{
                    position: 'absolute',
                    top: 24,
                    left: 24,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    color: '#5c6bc0',
                    '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 1)',
                        color: '#26418f',
                    },
                    zIndex: 1000,
                }}
                title="Go to Home"
            >
                <HomeIcon />
            </IconButton>


            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '90vh',
                        py: 4,
                    }}
                >
                    <Box sx={{ width: '100%', maxWidth: '1200px' }}>
                        <Card
                            elevation={24}
                            sx={{
                                borderRadius: 4,
                                overflow: 'visible',
                                background: 'rgba(255, 255, 255, 0.98)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 32px 64px rgba(0, 0, 0, 0.15)',
                                position: 'relative',
                                zIndex: 2,
                            }}
                        >
                            <CardContent sx={{ p: { xs: 4, sm: 6, md: 8 } }}>
                                <Box sx={{ textAlign: 'center', mb: 6 }}>
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '20px',
                                            background: 'linear-gradient(135deg, #5c6bc0 0%, #7986cb 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto',
                                            mb: 3,
                                            boxShadow: '0 12px 32px rgba(92, 107, 192, 0.3)',
                                            animation: 'logoGlow 3s ease-in-out infinite',
                                            '@keyframes logoGlow': {
                                                '0%, 100%': {
                                                    boxShadow: '0 12px 32px rgba(92, 107, 192, 0.3)',
                                                    transform: 'scale(1)',
                                                },
                                                '50%': {
                                                    boxShadow: '0 16px 48px rgba(92, 107, 192, 0.4)',
                                                    transform: 'scale(1.05)',
                                                },
                                            },
                                        }}
                                    >
                                        <DoctorIcon sx={{ fontSize: 45, color: 'white' }} />
                                    </Box>

                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: 800,
                                            mb: 2,
                                            background: 'linear-gradient(45deg, #5c6bc0 30%, #7986cb 90%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        Clinified Hub
                                    </Typography>

                                    <Typography variant="h5" fontWeight="bold" color="#5c6bc0" gutterBottom>
                                        Create Your Account
                                    </Typography>

                                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                                        Join our healthcare platform and start your wellness journey with expert doctors and modern medical services
                                    </Typography>
                                </Box>

                                <Form
                                    {...RegisteredUserController.store.form()}
                                    resetOnSuccess={['password', 'password_confirmation']}
                                    disableWhileProcessing
                                >
                                    {({ processing, errors }) => (
                                        <Stack spacing={3}>
                                            <Typography
                                                variant="h6"
                                                color="#5c6bc0"
                                                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                            >
                                                <PersonIcon /> Personal Information
                                            </Typography>

                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                                    gap: 2,
                                                }}
                                            >
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
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PersonIcon sx={{ color: '#5c6bc0' }} />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': { borderColor: '#5c6bc0' },
                                                            '&.Mui-focused fieldset': { borderColor: '#5c6bc0' },
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#5c6bc0' },
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Email Address"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="email"
                                                    placeholder="Enter your email"
                                                    error={!!errors.email}
                                                    helperText={errors.email}
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
                                                            '&:hover fieldset': { borderColor: '#5c6bc0' },
                                                            '&.Mui-focused fieldset': { borderColor: '#5c6bc0' },
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#5c6bc0' },
                                                    }}
                                                />
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                                    gap: 2,
                                                }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    label="Phone Number"
                                                    name="phone"
                                                    type="tel"
                                                    tabIndex={3}
                                                    autoComplete="tel"
                                                    placeholder="Enter your phone"
                                                    error={!!errors.phone}
                                                    helperText={errors.phone}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PhoneIcon sx={{ color: '#5c6bc0' }} />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': { borderColor: '#5c6bc0' },
                                                            '&.Mui-focused fieldset': { borderColor: '#5c6bc0' },
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#5c6bc0' },
                                                    }}
                                                />
                                                <FormControl fullWidth error={!!errors.gender}>
                                                    <InputLabel>Gender</InputLabel>
                                                    <Select
                                                        name="gender"
                                                        label="Gender"
                                                        tabIndex={4}
                                                        startAdornment={
                                                            <PersonIcon sx={{ color: '#5c6bc0', mr: 1 }} />
                                                        }
                                                        sx={{
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: '#5c6bc0',
                                                            },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: '#5c6bc0',
                                                            },
                                                        }}
                                                    >
                                                        <MenuItem value="">Select Gender</MenuItem>
                                                        <MenuItem value="male">👨 Male</MenuItem>
                                                        <MenuItem value="female">👩 Female</MenuItem>
                                                        <MenuItem value="other">Other</MenuItem>
                                                    </Select>
                                                    {errors.gender && (
                                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                                            {errors.gender}
                                                        </Typography>
                                                    )}
                                                </FormControl>
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                                    gap: 2,
                                                }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    label="Date of Birth"
                                                    name="date_of_birth"
                                                    type="date"
                                                    required
                                                    tabIndex={5}
                                                    error={!!errors.date_of_birth}
                                                    helperText={errors.date_of_birth}
                                                    slotProps={{
                                                        inputLabel: { shrink: true },
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <CalendarIcon sx={{ color: '#5c6bc0' }} />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': { borderColor: '#5c6bc0' },
                                                            '&.Mui-focused fieldset': { borderColor: '#5c6bc0' },
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#5c6bc0' },
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="City"
                                                    name="city"
                                                    type="text"
                                                    required
                                                    tabIndex={6}
                                                    autoComplete="address-level2"
                                                    placeholder="Enter your city"
                                                    error={!!errors.city}
                                                    helperText={errors.city}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <CityIcon sx={{ color: '#5c6bc0' }} />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': { borderColor: '#5c6bc0' },
                                                            '&.Mui-focused fieldset': { borderColor: '#5c6bc0' },
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#5c6bc0' },
                                                    }}
                                                />
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            <Typography
                                                variant="h6"
                                                color="#5c6bc0"
                                                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                            >
                                                <LockIcon /> Security
                                            </Typography>

                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                                    gap: 2,
                                                }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    label="Password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    tabIndex={7}
                                                    autoComplete="new-password"
                                                    placeholder="Create password"
                                                    error={!!errors.password}
                                                    helperText={errors.password || 'Min 8 characters'}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <LockIcon sx={{ color: '#5c6bc0' }} />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                        edge="end"
                                                                        sx={{ color: '#5c6bc0' }}
                                                                    >
                                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': { borderColor: '#5c6bc0' },
                                                            '&.Mui-focused fieldset': { borderColor: '#5c6bc0' },
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#5c6bc0' },
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Confirm Password"
                                                    name="password_confirmation"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    required
                                                    tabIndex={8}
                                                    autoComplete="new-password"
                                                    placeholder="Confirm password"
                                                    error={!!errors.password_confirmation}
                                                    helperText={errors.password_confirmation}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <LockIcon sx={{ color: '#5c6bc0' }} />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                        edge="end"
                                                                        sx={{ color: '#5c6bc0' }}
                                                                    >
                                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': { borderColor: '#5c6bc0' },
                                                            '&.Mui-focused fieldset': { borderColor: '#5c6bc0' },
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#5c6bc0' },
                                                    }}
                                                />
                                            </Box>

                                            <Button
                                                type="submit"
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                tabIndex={9}
                                                disabled={processing}
                                                startIcon={processing ? <CircularProgress size={18} color="inherit" /> : <RegisterIcon />}
                                                sx={{
                                                    bgcolor: '#5c6bc0',
                                                    py: 1.5,
                                                    mt: 3,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    fontSize: '1.1rem',
                                                    borderRadius: 2,
                                                    boxShadow: '0 8px 32px rgba(92, 107, 192, 0.3)',
                                                    '&:hover': {
                                                        bgcolor: '#26418f',
                                                        boxShadow: '0 12px 48px rgba(92, 107, 192, 0.4)',
                                                        transform: 'translateY(-2px)',
                                                    },
                                                    '&:disabled': {
                                                        bgcolor: 'rgba(92, 107, 192, 0.6)',
                                                    },
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                {processing ? 'Creating Account...' : 'Create Account'}
                                            </Button>

                                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Already have an account?{' '}
                                                    <Link
                                                        href={login()}
                                                        style={{
                                                            color: '#5c6bc0',
                                                            textDecoration: 'none',
                                                            fontWeight: 600,
                                                        }}
                                                        tabIndex={10}
                                                        onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                                        onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                                                    >
                                                        Sign in instead
                                                    </Link>
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Container>

            <Dialog
                open={isDoctorDialogOpen}
                onClose={() => setIsDoctorDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                        },
                    },
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                    <DoctorIcon sx={{ fontSize: 48, color: '#5c6bc0', mb: 2 }} />
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
                            borderRadius: 2,
                            '&:hover': {
                                borderColor: '#5c6bc0',
                                color: '#5c6bc0',
                            },
                        }}
                    >
                        No, I'm a patient
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => (window.location.href = 'http://localhost:8000/doctor-application')}
                        startIcon={<MedicalServices />}
                        sx={{
                            bgcolor: '#5c6bc0',
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(92, 107, 192, 0.3)',
                            '&:hover': {
                                bgcolor: '#26418f',
                                boxShadow: '0 6px 16px rgba(92, 107, 192, 0.4)',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        Yes, I'm a doctor
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}