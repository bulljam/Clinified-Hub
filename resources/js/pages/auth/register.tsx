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
    useTheme,
    useMediaQuery,
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
    Healing as HealingIcon,
    Favorite as HeartIcon,
    Psychology as BrainIcon,
    Vaccines as VaccineIcon,
    Emergency as EmergencyIcon,
    Biotech as BiotechIcon,
    Science as ScienceIcon,
    MedicalInformation as MedicalInfoIcon,
    HealthAndSafety as HealthIcon,
    Medication as MedicationIcon,
    MonitorWeight as MonitorIcon,
    Spa as WellnessIcon,
    FitnessCenter as FitnessIcon,
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
                background: 'linear-gradient(135deg, #20a09f 0%, #26d0ce 50%, #1dd1a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                position: 'relative',
            }}
        >
            <Head title="Register" />

            {/* Animated Medical Shapes */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    animation: 'float 6s ease-in-out infinite',
                    zIndex: 1,
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-30px) rotate(10deg)' },
                    },
                }}
            >
                <HospitalIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.2)' }} />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    right: '8%',
                    animation: 'float 7s ease-in-out infinite 1s',
                    zIndex: 1,
                }}
            >
                <HeartIcon sx={{ fontSize: 45, color: 'rgba(255,255,255,0.15)' }} />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    top: '60%',
                    left: '3%',
                    animation: 'float 8s ease-in-out infinite 2s',
                    zIndex: 1,
                }}
            >
                <HealingIcon sx={{ fontSize: 50, color: 'rgba(255,255,255,0.18)' }} />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '12%',
                    animation: 'float 5.5s ease-in-out infinite 0.5s',
                    zIndex: 1,
                }}
            >
                <BrainIcon sx={{ fontSize: 55, color: 'rgba(255,255,255,0.25)' }} />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    top: '35%',
                    left: '8%',
                    animation: 'float 9s ease-in-out infinite 3s',
                    zIndex: 1,
                }}
            >
                <VaccineIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.12)' }} />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    bottom: '30%',
                    left: '6%',
                    animation: 'float 6.5s ease-in-out infinite 1.5s',
                    zIndex: 1,
                }}
            >
                <EmergencyIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.2)' }} />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    top: '45%',
                    right: '5%',
                    animation: 'float 7.5s ease-in-out infinite 2.5s',
                    zIndex: 1,
                }}
            >
                <DoctorIcon sx={{ fontSize: 42, color: 'rgba(255,255,255,0.16)' }} />
            </Box>

            {/* Home Button */}
            <IconButton
                component={Link}
                href="/"
                sx={{
                    position: 'absolute',
                    top: 24,
                    right: 24,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    color: '#20a09f',
                    '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 1)',
                        color: '#178f8e',
                    },
                    zIndex: 1000,
                }}
                title="Go to Home"
            >
                <HomeIcon />
            </IconButton>

            {/* Diverse Medical Animated Shapes */}

            {/* Hospital - Top Left */}
            <Box
                sx={{
                    position: 'absolute',
                    left: '3%',
                    top: '12%',
                    animation: 'hospitalFloat 11s ease-in-out infinite',
                    '@keyframes hospitalFloat': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-35px) rotate(15deg)' },
                    },
                }}
            >
                <Box
                    sx={{
                        width: 85,
                        height: 85,
                        borderRadius: '22px',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                        backdropFilter: 'blur(15px)',
                        border: '2px solid rgba(255, 255, 255, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <HospitalIcon sx={{ fontSize: 42, color: 'rgba(255,255,255,0.9)' }} />
                </Box>
            </Box>

            {/* Stethoscope/Heart - Top Right */}
            <Box
                sx={{
                    position: 'absolute',
                    right: '4%',
                    top: '18%',
                    animation: 'heartPulse 9s ease-in-out infinite 1.5s',
                    '@keyframes heartPulse': {
                        '0%, 100%': { transform: 'translateY(0px) scale(1)' },
                        '30%': { transform: 'translateY(-25px) scale(1.1)' },
                        '60%': { transform: 'translateY(10px) scale(0.95)' },
                    },
                }}
            >
                <Box
                    sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                        backdropFilter: 'blur(12px)',
                        border: '2px solid rgba(255, 192, 203, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <HeartIcon sx={{ fontSize: 36, color: 'rgba(255, 192, 203, 0.9)' }} />
                </Box>
            </Box>

            {/* DNA/Science - Left Middle */}
            <Box
                sx={{
                    position: 'absolute',
                    left: '1%',
                    top: '45%',
                    animation: 'dnaRotate 13s linear infinite',
                    '@keyframes dnaRotate': {
                        '0%': { transform: 'rotate(0deg) translateY(0px)' },
                        '25%': { transform: 'rotate(90deg) translateY(-20px)' },
                        '50%': { transform: 'rotate(180deg) translateY(0px)' },
                        '75%': { transform: 'rotate(270deg) translateY(20px)' },
                        '100%': { transform: 'rotate(360deg) translateY(0px)' },
                    },
                }}
            >
                <Box
                    sx={{
                        width: 78,
                        height: 78,
                        borderRadius: '18px',
                        background: 'linear-gradient(135deg, rgba(144, 238, 144, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(144, 238, 144, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <BiotechIcon sx={{ fontSize: 38, color: 'rgba(144, 238, 144, 0.9)' }} />
                </Box>
            </Box>

            {/* Medical Services - Right Middle */}
            <Box
                sx={{
                    position: 'absolute',
                    right: '2%',
                    top: '40%',
                    animation: 'medicalBob 10s ease-in-out infinite 2s',
                    '@keyframes medicalBob': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '25%': { transform: 'translateY(-30px) rotate(5deg)' },
                        '50%': { transform: 'translateY(0px) rotate(0deg)' },
                        '75%': { transform: 'translateY(15px) rotate(-5deg)' },
                    },
                }}
            >
                <Box
                    sx={{
                        width: 68,
                        height: 68,
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(173, 216, 230, 0.18) 0%, rgba(255, 255, 255, 0.06) 100%)',
                        backdropFilter: 'blur(12px)',
                        border: '2px solid rgba(173, 216, 230, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <MedicalServices sx={{ fontSize: 34, color: 'rgba(173, 216, 230, 0.9)' }} />
                </Box>
            </Box>

            {/* Brain/Psychology - Bottom Left */}
            <Box
                sx={{
                    position: 'absolute',
                    left: '6%',
                    bottom: '25%',
                    animation: 'brainThink 15s ease-in-out infinite 0.5s',
                    '@keyframes brainThink': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
                        '33%': { transform: 'translateY(-40px) rotate(10deg) scale(1.05)' },
                        '66%': { transform: 'translateY(20px) rotate(-5deg) scale(0.95)' },
                    },
                }}
            >
                <Box
                    sx={{
                        width: 82,
                        height: 82,
                        borderRadius: '25px',
                        background: 'linear-gradient(135deg, rgba(221, 160, 221, 0.16) 0%, rgba(255, 255, 255, 0.08) 100%)',
                        backdropFilter: 'blur(14px)',
                        border: '2px solid rgba(221, 160, 221, 0.28)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <BrainIcon sx={{ fontSize: 40, color: 'rgba(221, 160, 221, 0.9)' }} />
                </Box>
            </Box>

            {/* Medication/Pills - Bottom Right */}
            <Box
                sx={{
                    position: 'absolute',
                    right: '5%',
                    bottom: '20%',
                    animation: 'pillFloat 8s ease-in-out infinite 3s',
                    '@keyframes pillFloat': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-28px) rotate(180deg)' },
                    },
                }}
            >
                <Box
                    sx={{
                        width: 74,
                        height: 74,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(255, 228, 196, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                        backdropFilter: 'blur(11px)',
                        border: '2px solid rgba(255, 228, 196, 0.32)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <MedicationIcon sx={{ fontSize: 36, color: 'rgba(255, 165, 0, 0.9)' }} />
                </Box>
            </Box>

            {/* Emergency/Ambulance - Far Left */}
            <Box
                sx={{
                    position: 'absolute',
                    left: '0.5%',
                    top: '70%',
                    animation: 'emergencyFlash 7s ease-in-out infinite 4s',
                    '@keyframes emergencyFlash': {
                        '0%, 100%': { transform: 'translateY(0px)', opacity: 0.8 },
                        '25%': { transform: 'translateY(-20px)', opacity: 1 },
                        '50%': { transform: 'translateY(0px)', opacity: 0.9 },
                        '75%': { transform: 'translateY(10px)', opacity: 0.7 },
                    },
                }}
            >
                <Box
                    sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(255, 99, 71, 0.18) 0%, rgba(255, 255, 255, 0.06) 100%)',
                        backdropFilter: 'blur(13px)',
                        border: '2px solid rgba(255, 99, 71, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <EmergencyIcon sx={{ fontSize: 34, color: 'rgba(255, 99, 71, 0.9)' }} />
                </Box>
            </Box>

            {/* Wellness/Spa - Far Right */}
            <Box
                sx={{
                    position: 'absolute',
                    right: '1%',
                    bottom: '35%',
                    animation: 'wellnessGlow 12s ease-in-out infinite 1s',
                    '@keyframes wellnessGlow': {
                        '0%, 100%': { transform: 'translateY(0px) scale(1)', filter: 'brightness(1)' },
                        '50%': { transform: 'translateY(-32px) scale(1.08)', filter: 'brightness(1.2)' },
                    },
                }}
            >
                <Box
                    sx={{
                        width: 76,
                        height: 76,
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(152, 251, 152, 0.16) 0%, rgba(255, 255, 255, 0.08) 100%)',
                        backdropFilter: 'blur(12px)',
                        border: '2px solid rgba(152, 251, 152, 0.28)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <WellnessIcon sx={{ fontSize: 38, color: 'rgba(152, 251, 152, 0.9)' }} />
                </Box>
            </Box>

            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '90vh',
                        py: 4,
                    }}
                >
                    {/* Centered Registration Form */}
                    <Box sx={{ width: '100%', maxWidth: '1200px' }}>
                        <Card
                            elevation={24}
                            sx={{
                                borderRadius: 4,
                                overflow: 'visible',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 32px 64px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <CardContent sx={{ p: { xs: 4, sm: 6, md: 8 } }}>
                                {/* Header with Logo */}
                                <Box sx={{ textAlign: 'center', mb: 6 }}>
                                    {/* Company Logo */}
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '20px',
                                            background: 'linear-gradient(135deg, #20a09f 0%, #26d0ce 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto',
                                            mb: 3,
                                            boxShadow: '0 12px 32px rgba(32, 160, 159, 0.3)',
                                            animation: 'logoGlow 3s ease-in-out infinite',
                                            '@keyframes logoGlow': {
                                                '0%, 100%': {
                                                    boxShadow: '0 12px 32px rgba(32, 160, 159, 0.3)',
                                                    transform: 'scale(1)',
                                                },
                                                '50%': {
                                                    boxShadow: '0 16px 48px rgba(32, 160, 159, 0.4)',
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
                                            background: 'linear-gradient(45deg, #20a09f 30%, #26d0ce 90%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        Clinified Hub
                                    </Typography>

                                    <Typography variant="h5" fontWeight="bold" color="#20a09f" gutterBottom>
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
                                            {/* Personal Information Section */}
                                            <Typography
                                                variant="h6"
                                                color="#20a09f"
                                                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                            >
                                                <PersonIcon /> Personal Information
                                            </Typography>

                                            {/* Name and Email Row */}
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
                                                                    <PersonIcon sx={{ color: '#20a09f' }} />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': { borderColor: '#20a09f' },
                                                            '&.Mui-focused fieldset': { borderColor: '#20a09f' },
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#20a09f' },
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
                                                                    <EmailIcon sx={{ color: '#20a09f' }} />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': { borderColor: '#20a09f' },
                                                            '&.Mui-focused fieldset': { borderColor: '#20a09f' },
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#20a09f' },
                                                    }}
                                                />
                                            </Box>

                                            {/* Phone and Gender Row */}
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
                                                                    <PhoneIcon sx={{ color: '#20a09f' }} />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': { borderColor: '#20a09f' },
                                                            '&.Mui-focused fieldset': { borderColor: '#20a09f' },
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#20a09f' },
                                                    }}
                                                />
                                                <FormControl fullWidth error={!!errors.gender}>
                                                    <InputLabel>Gender</InputLabel>
                                                    <Select
                                                        name="gender"
                                                        label="Gender"
                                                        tabIndex={4}
                                                        startAdornment={
                                                            <PersonIcon sx={{ color: '#20a09f', mr: 1 }} />
                                                        }
                                                        sx={{
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: '#20a09f',
                                                            },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: '#20a09f',
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

                                            {/* Date of Birth and City Row */}
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
                                                                    <CalendarIcon sx={{ color: '#20a09f' }} />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': { borderColor: '#20a09f' },
                                                            '&.Mui-focused fieldset': { borderColor: '#20a09f' },
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#20a09f' },
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
                                                                    <CityIcon sx={{ color: '#20a09f' }} />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': { borderColor: '#20a09f' },
                                                            '&.Mui-focused fieldset': { borderColor: '#20a09f' },
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#20a09f' },
                                                    }}
                                                />
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            {/* Security Section */}
                                            <Typography
                                                variant="h6"
                                                color="#20a09f"
                                                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                            >
                                                <LockIcon /> Security
                                            </Typography>

                                            {/* Password Fields */}
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
                                                                    <LockIcon sx={{ color: '#20a09f' }} />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                        edge="end"
                                                                        sx={{ color: '#20a09f' }}
                                                                    >
                                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': { borderColor: '#20a09f' },
                                                            '&.Mui-focused fieldset': { borderColor: '#20a09f' },
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#20a09f' },
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
                                                                    <LockIcon sx={{ color: '#20a09f' }} />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                        edge="end"
                                                                        sx={{ color: '#20a09f' }}
                                                                    >
                                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': { borderColor: '#20a09f' },
                                                            '&.Mui-focused fieldset': { borderColor: '#20a09f' },
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#20a09f' },
                                                    }}
                                                />
                                            </Box>

                                            {/* Submit Button */}
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                tabIndex={9}
                                                disabled={processing}
                                                startIcon={processing ? <CircularProgress size={18} color="inherit" /> : <RegisterIcon />}
                                                sx={{
                                                    bgcolor: '#20a09f',
                                                    py: 1.5,
                                                    mt: 3,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    fontSize: '1.1rem',
                                                    borderRadius: 2,
                                                    boxShadow: '0 8px 32px rgba(32, 160, 159, 0.3)',
                                                    '&:hover': {
                                                        bgcolor: '#178f8e',
                                                        boxShadow: '0 12px 48px rgba(32, 160, 159, 0.4)',
                                                        transform: 'translateY(-2px)',
                                                    },
                                                    '&:disabled': {
                                                        bgcolor: 'rgba(32, 160, 159, 0.6)',
                                                    },
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                {processing ? 'Creating Account...' : 'Create Account'}
                                            </Button>

                                            {/* Sign In Link */}
                                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Already have an account?{' '}
                                                    <Link
                                                        href={login()}
                                                        style={{
                                                            color: '#20a09f',
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

            {/* Doctor Application Dialog */}
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
                            borderRadius: 2,
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
                        onClick={() => (window.location.href = 'http://localhost:8000/doctor-application')}
                        startIcon={<MedicalServices />}
                        sx={{
                            bgcolor: '#20a09f',
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(32, 160, 159, 0.3)',
                            '&:hover': {
                                bgcolor: '#178f8e',
                                boxShadow: '0 6px 16px rgba(32, 160, 159, 0.4)',
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