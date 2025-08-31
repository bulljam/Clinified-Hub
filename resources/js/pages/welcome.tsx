import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    AppBar,
    Toolbar,
    Stack,
    Avatar,
    Rating,
    Chip,
    useTheme,
    alpha,
    Paper,
    Fade,
    Slide,
} from '@mui/material';
import {
    CalendarMonth,
    Schedule,
    Security,
    PersonAdd,
    Assessment,
    Payment,
    ArrowForward,
    Search,
    Notifications,
    Dashboard as DashboardIcon,
    History,
    LocationOn,
    MedicalServices,
    CheckCircle,
    People,
} from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';

const patientFeatures = [
    {
        icon: Search,
        title: 'Search Doctors',
        description: 'Find doctors by specialty, location, or availability near you.',
    },
    {
        icon: CalendarMonth,
        title: 'Easy Booking',
        description: 'Book, reschedule, or cancel appointments with just a few clicks.',
    },
    {
        icon: Notifications,
        title: 'Smart Reminders',
        description: 'Get automated reminders via email and SMS for upcoming appointments.',
    },
];

const doctorFeatures = [
    {
        icon: DashboardIcon,
        title: 'Personal Dashboard',
        description: 'Manage all your appointments from a comprehensive dashboard.',
    },
    {
        icon: History,
        title: 'Patient History',
        description: 'Access complete patient history and medical records securely.',
    },
    {
        icon: Schedule,
        title: 'Smart Scheduling',
        description: 'Set availability and receive automated appointment notifications.',
    },
];

const patientSteps = [
    {
        number: '01',
        title: 'Search',
        description: 'Find doctors by specialty or location',
        icon: Search,
    },
    {
        number: '02',
        title: 'Book',
        description: 'Select time slot and confirm appointment',
        icon: CalendarMonth,
    },
    {
        number: '03',
        title: 'Confirm',
        description: 'Receive confirmation and reminders',
        icon: CheckCircle,
    },
];

const doctorSteps = [
    {
        number: '01',
        title: 'Register',
        description: 'Create your professional profile',
        icon: PersonAdd,
    },
    {
        number: '02',
        title: 'Set Availability',
        description: 'Configure your schedule and preferences',
        icon: Schedule,
    },
    {
        number: '03',
        title: 'Manage',
        description: 'Handle appointments from your dashboard',
        icon: DashboardIcon,
    },
];

const testimonials = [
    {
        name: 'Sarah Johnson',
        role: 'Patient',
        avatar: '/api/placeholder/60/60',
        rating: 5,
        text: 'Clinify has revolutionized how I book appointments. The interface is intuitive and I never miss appointments thanks to the smart reminders.',
    },
    {
        name: 'Dr. Michael Chen',
        role: 'Cardiologist',
        avatar: '/api/placeholder/60/60',
        rating: 5,
        text: 'As a busy physician, this platform streamlines my practice. The dashboard helps me manage everything efficiently while focusing on patient care.',
    },
    {
        name: 'Lisa Rodriguez',
        role: 'Practice Manager',
        avatar: '/api/placeholder/60/60',
        rating: 5,
        text: 'The admin features are outstanding. We can track appointments, payments, and analytics all in one comprehensive platform.',
    },
];

const navigationSections = [
    { id: 'hero', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'cta', label: 'Get Started' },
];

// Custom hook for scroll detection and progress
const useScrollSpy = (sectionIds: string[], offset = 100) => {
    const [activeSection, setActiveSection] = useState('');
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + offset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min((window.scrollY / documentHeight) * 100, 100);
            setScrollProgress(progress);
            
            for (let i = sectionIds.length - 1; i >= 0; i--) {
                const section = document.getElementById(sectionIds[i]);
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(sectionIds[i]);
                    break;
                }
            }
        };

        handleScroll(); // Set initial active section
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sectionIds, offset]);

    return { activeSection, scrollProgress };
};

// Smooth scroll function
const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for navbar height
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
        });
    }
};

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const theme = useTheme();
    const { activeSection, scrollProgress } = useScrollSpy(navigationSections.map(s => s.id));

    const turquoise = '#20a09f';
    const deepTeal = '#0f7673';

    return (
        <>
            <Head title="Clinify - Book Your Medical Appointments in Minutes">
                <meta name="description" content="Find doctors near you and manage your appointments easily. Modern healthcare scheduling platform for patients and providers." />
            </Head>

            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                {/* Top Scroll Progress Bar */}
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: `${scrollProgress}%`,
                        height: 4,
                        bgcolor: turquoise,
                        zIndex: 9999,
                        background: `linear-gradient(90deg, ${turquoise}, ${deepTeal})`,
                        boxShadow: `0 0 20px ${alpha(turquoise, 0.5)}`,
                        transition: 'width 0.3s ease-out',
                    }}
                />

                {/* Sticky Navigation with Progress Indicator */}
                <AppBar 
                    position="sticky" 
                    elevation={0} 
                    sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.95)', 
                        backdropFilter: 'blur(20px)',
                        borderBottom: 1, 
                        borderColor: 'divider',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: theme.shadows[4],
                        }
                    }}
                >
                    <Container maxWidth="lg">
                        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                            <Typography 
                                variant="h5" 
                                component="div" 
                                sx={{ 
                                    fontWeight: 700, 
                                    color: turquoise,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    }
                                }}
                                onClick={() => scrollToSection('hero')}
                            >
                                Clinify
                            </Typography>

                            {/* Navigation Menu - Hidden on mobile, shown on desktop */}
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                                {navigationSections.map((section) => (
                                    <Box key={section.id} sx={{ position: 'relative' }}>
                                        <Button
                                            onClick={() => scrollToSection(section.id)}
                                            sx={{
                                                textTransform: 'none',
                                                color: activeSection === section.id ? turquoise : 'text.secondary',
                                                fontWeight: activeSection === section.id ? 600 : 400,
                                                px: 2,
                                                py: 1,
                                                borderRadius: 2,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': {
                                                    color: turquoise,
                                                    bgcolor: alpha(turquoise, 0.05),
                                                }
                                            }}
                                        >
                                            {section.label}
                                        </Button>
                                        {/* Glowing Progress Bar */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: -2,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: activeSection === section.id ? '100%' : '0%',
                                                height: 4,
                                                bgcolor: turquoise,
                                                borderRadius: 3,
                                                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                                boxShadow: activeSection === section.id 
                                                    ? `0 0 15px ${alpha(turquoise, 0.8)}, 0 0 30px ${alpha(turquoise, 0.4)}, 0 0 45px ${alpha(turquoise, 0.2)}` 
                                                    : 'none',
                                                background: activeSection === section.id 
                                                    ? `linear-gradient(90deg, ${alpha(turquoise, 0.6)}, ${turquoise}, ${alpha(turquoise, 0.6)})`
                                                    : turquoise,
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: -2,
                                                    left: -3,
                                                    right: -3,
                                                    bottom: -2,
                                                    background: `linear-gradient(90deg, transparent, ${alpha(turquoise, 0.3)}, transparent)`,
                                                    borderRadius: 6,
                                                    opacity: activeSection === section.id ? 1 : 0,
                                                    transition: 'opacity 0.5s ease',
                                                    animation: activeSection === section.id ? 'glow 2s ease-in-out infinite alternate' : 'none',
                                                }
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>

                            <Stack direction="row" spacing={2}>
                                {auth.user ? (
                                    <Button
                                        component={Link}
                                        href={dashboard().url}
                                        variant="contained"
                                        sx={{ 
                                            textTransform: 'none',
                                            bgcolor: turquoise,
                                            boxShadow: `0 4px 14px ${alpha(turquoise, 0.4)}`,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: deepTeal,
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 6px 20px ${alpha(turquoise, 0.4)}`,
                                            }
                                        }}
                                    >
                                        Dashboard
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            component={Link}
                                            href={login().url}
                                            variant="text"
                                            sx={{ 
                                                textTransform: 'none',
                                                color: 'text.primary',
                                                transition: 'color 0.3s ease',
                                                display: { xs: 'none', sm: 'inline-flex' },
                                                '&:hover': {
                                                    color: turquoise,
                                                }
                                            }}
                                        >
                                            Log in
                                        </Button>
                                        <Button
                                            component={Link}
                                            href={register().url}
                                            variant="outlined"
                                            size="small"
                                            sx={{ 
                                                textTransform: 'none',
                                                borderColor: turquoise,
                                                color: turquoise,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: turquoise,
                                                    color: 'white',
                                                    transform: 'translateY(-2px)',
                                                }
                                            }}
                                        >
                                            Register
                                        </Button>
                                        <Button
                                            component={Link}
                                            href="/doctor-application"
                                            variant="contained"
                                            size="small"
                                            sx={{ 
                                                textTransform: 'none',
                                                bgcolor: turquoise,
                                                boxShadow: `0 4px 14px ${alpha(turquoise, 0.4)}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: deepTeal,
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 6px 20px ${alpha(turquoise, 0.4)}`,
                                                }
                                            }}
                                        >
                                            Join as Doctor
                                        </Button>
                                    </>
                                )}
                            </Stack>
                        </Toolbar>
                    </Container>
                </AppBar>

                {/* Hero Section with Turquoise Gradient */}
                <Box 
                    id="hero"
                    sx={{ 
                        minHeight: '90vh',
                        background: `linear-gradient(135deg, ${turquoise} 0%, ${alpha(turquoise, 0.8)} 50%, ${alpha(deepTeal, 0.9)} 100%)`,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                            animation: 'float 20s infinite linear',
                        }
                    }}
                >
                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                        <Fade in timeout={1000}>
                            <Stack
                                direction={{ xs: 'column', md: 'row' }}
                                spacing={6}
                                alignItems="center"
                                sx={{ py: 8 }}
                            >
                                <Box sx={{ flex: 1, color: 'white' }}>
                                    <Typography 
                                        variant="h1" 
                                        sx={{ 
                                            fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' }, 
                                            fontWeight: 800, 
                                            lineHeight: 1.1, 
                                            mb: 3,
                                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                            animation: 'fadeInUp 1s ease-out',
                                        }}
                                    >
                                        Book Your Medical Appointments 
                                        <Box component="span" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)' }}>
                                            in Minutes
                                        </Box>
                                    </Typography>
                                    <Typography 
                                        variant="h5" 
                                        sx={{ 
                                            mb: 5, 
                                            color: 'rgba(255,255,255,0.9)', 
                                            fontWeight: 400, 
                                            lineHeight: 1.6,
                                            animation: 'fadeInUp 1s ease-out 0.3s both',
                                        }}
                                    >
                                        Find doctors near you and manage your appointments easily. 
                                        Experience the future of healthcare scheduling.
                                    </Typography>
                                    <Stack 
                                        direction={{ xs: 'column', sm: 'row' }} 
                                        spacing={3}
                                        sx={{ animation: 'fadeInUp 1s ease-out 0.6s both' }}
                                    >
                                        {!auth.user && (
                                            <>
                                                <Button
                                                    component={Link}
                                                    href={register().url}
                                                    variant="contained"
                                                    size="large"
                                                    endIcon={<ArrowForward />}
                                                    sx={{ 
                                                        textTransform: 'none', 
                                                        py: 2, 
                                                        px: 4,
                                                        fontSize: '1.1rem',
                                                        bgcolor: 'white',
                                                        color: turquoise,
                                                        fontWeight: 600,
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(255,255,255,0.95)',
                                                            transform: 'translateY(-3px) scale(1.02)',
                                                            boxShadow: '0 12px 35px rgba(0,0,0,0.2)',
                                                        }
                                                    }}
                                                >
                                                    Book an Appointment
                                                </Button>
                                                <Button
                                                    component={Link}
                                                    href="/doctor-application"
                                                    variant="outlined"
                                                    size="large"
                                                    sx={{ 
                                                        textTransform: 'none', 
                                                        py: 2, 
                                                        px: 4,
                                                        fontSize: '1.1rem',
                                                        borderColor: 'white',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        borderWidth: 2,
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        '&:hover': {
                                                            borderColor: 'white',
                                                            bgcolor: 'white',
                                                            color: turquoise,
                                                            transform: 'translateY(-3px) scale(1.02)',
                                                        }
                                                    }}
                                                >
                                                    Join as a Doctor
                                                </Button>
                                            </>
                                        )}
                                    </Stack>
                                </Box>
                                <Box 
                                    sx={{ 
                                        flex: 1, 
                                        display: 'flex', 
                                        justifyContent: 'center',
                                        animation: 'float 6s ease-in-out infinite',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: { xs: 300, md: 400 },
                                            height: { xs: 300, md: 400 },
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        <MedicalServices sx={{ fontSize: { xs: 120, md: 160 }, color: 'white', opacity: 0.9 }} />
                                    </Box>
                                </Box>
                            </Stack>
                        </Fade>
                    </Container>

                    {/* Floating medical icons */}
                    <Box sx={{ position: 'absolute', top: '20%', left: '10%', animation: 'float 8s ease-in-out infinite' }}>
                        <CalendarMonth sx={{ fontSize: 30, color: 'rgba(255,255,255,0.3)' }} />
                    </Box>
                    <Box sx={{ position: 'absolute', top: '60%', right: '15%', animation: 'float 10s ease-in-out infinite 2s' }}>
                        <Security sx={{ fontSize: 40, color: 'rgba(255,255,255,0.3)' }} />
                    </Box>
                    <Box sx={{ position: 'absolute', top: '30%', right: '5%', animation: 'float 12s ease-in-out infinite 4s' }}>
                        <People sx={{ fontSize: 35, color: 'rgba(255,255,255,0.3)' }} />
                    </Box>
                </Box>

                {/* Split Features Section */}
                <Container id="features" maxWidth="lg" sx={{ py: 12 }}>
                    <Box textAlign="center" sx={{ mb: 8 }}>
                        <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: deepTeal }}>
                            Built for Everyone
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
                            Whether you're a patient seeking care or a doctor managing your practice, 
                            we've got the perfect tools for you.
                        </Typography>
                    </Box>
                    
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                        {/* Patient Features */}
                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                p: 6,
                                borderRadius: 4,
                                background: `linear-gradient(135deg, ${alpha(turquoise, 0.05)} 0%, ${alpha(turquoise, 0.1)} 100%)`,
                                border: `1px solid ${alpha(turquoise, 0.1)}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: `0 20px 40px ${alpha(turquoise, 0.15)}`,
                                }
                            }}
                        >
                            <Box textAlign="center" sx={{ mb: 4 }}>
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: turquoise,
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 3,
                                        boxShadow: `0 8px 25px ${alpha(turquoise, 0.3)}`,
                                    }}
                                >
                                    <People sx={{ fontSize: 40 }} />
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: deepTeal, mb: 2 }}>
                                    For Patients
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    Find and book appointments with qualified healthcare providers
                                </Typography>
                            </Box>
                            <Stack spacing={3}>
                                {patientFeatures.map((feature, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                bgcolor: alpha(turquoise, 0.1),
                                                color: turquoise,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <feature.icon sx={{ fontSize: 24 }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                                {feature.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>

                        {/* Doctor Features */}
                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                p: 6,
                                borderRadius: 4,
                                background: `linear-gradient(135deg, ${alpha(deepTeal, 0.05)} 0%, ${alpha(deepTeal, 0.1)} 100%)`,
                                border: `1px solid ${alpha(deepTeal, 0.1)}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: `0 20px 40px ${alpha(deepTeal, 0.15)}`,
                                }
                            }}
                        >
                            <Box textAlign="center" sx={{ mb: 4 }}>
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: deepTeal,
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 3,
                                        boxShadow: `0 8px 25px ${alpha(deepTeal, 0.3)}`,
                                    }}
                                >
                                    <MedicalServices sx={{ fontSize: 40 }} />
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: deepTeal, mb: 2 }}>
                                    For Doctors
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    Manage your practice and connect with patients efficiently
                                </Typography>
                            </Box>
                            <Stack spacing={3}>
                                {doctorFeatures.map((feature, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                bgcolor: alpha(deepTeal, 0.1),
                                                color: deepTeal,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <feature.icon sx={{ fontSize: 24 }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                                {feature.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    </Stack>
                </Container>

                {/* How It Works Section */}
                <Box 
                    id="how-it-works"
                    sx={{ 
                        py: 12, 
                        background: `linear-gradient(135deg, ${alpha(turquoise, 0.02)} 0%, white 50%, ${alpha(turquoise, 0.02)} 100%)`,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <Container maxWidth="lg">
                        <Box textAlign="center" sx={{ mb: 10 }}>
                            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: deepTeal }}>
                                How It Works
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
                                Get started in just three simple steps
                            </Typography>
                        </Box>

                        {/* Patient Process */}
                        <Box sx={{ mb: 10 }}>
                            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 600, mb: 6, color: turquoise }}>
                                For Patients
                            </Typography>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                                    gap: 6,
                                }}
                            >
                                {patientSteps.map((step, index) => (
                                    <Box 
                                        key={index} 
                                        textAlign="center"
                                        sx={{
                                            position: 'relative',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-10px)',
                                                '& .step-circle': {
                                                    bgcolor: deepTeal,
                                                    transform: 'scale(1.1)',
                                                },
                                                '& .step-icon': {
                                                    color: turquoise,
                                                }
                                            }
                                        }}
                                    >
                                        <Box
                                            className="step-circle"
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                borderRadius: '50%',
                                                bgcolor: turquoise,
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 3,
                                                fontSize: '2rem',
                                                fontWeight: 700,
                                                boxShadow: `0 8px 25px ${alpha(turquoise, 0.3)}`,
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            {step.number}
                                        </Box>
                                        <step.icon 
                                            className="step-icon"
                                            sx={{ 
                                                fontSize: 40, 
                                                color: 'text.secondary', 
                                                mb: 2,
                                                transition: 'color 0.3s ease',
                                            }} 
                                        />
                                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: deepTeal }}>
                                            {step.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                            {step.description}
                                        </Typography>
                                        {index < patientSteps.length - 1 && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 50,
                                                    right: { xs: '50%', md: -40 },
                                                    transform: { xs: 'translateX(50%) rotate(90deg)', md: 'none' },
                                                    width: 80,
                                                    height: 2,
                                                    bgcolor: alpha(turquoise, 0.3),
                                                    display: { xs: 'none', md: 'block' },
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        right: -5,
                                                        top: -3,
                                                        width: 0,
                                                        height: 0,
                                                        borderLeft: `8px solid ${alpha(turquoise, 0.3)}`,
                                                        borderTop: '4px solid transparent',
                                                        borderBottom: '4px solid transparent',
                                                    }
                                                }}
                                            />
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* Doctor Process */}
                        <Box>
                            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 600, mb: 6, color: deepTeal }}>
                                For Doctors
                            </Typography>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                                    gap: 6,
                                }}
                            >
                                {doctorSteps.map((step, index) => (
                                    <Box 
                                        key={index} 
                                        textAlign="center"
                                        sx={{
                                            position: 'relative',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-10px)',
                                                '& .step-circle': {
                                                    bgcolor: turquoise,
                                                    transform: 'scale(1.1)',
                                                },
                                                '& .step-icon': {
                                                    color: deepTeal,
                                                }
                                            }
                                        }}
                                    >
                                        <Box
                                            className="step-circle"
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                borderRadius: '50%',
                                                bgcolor: deepTeal,
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 3,
                                                fontSize: '2rem',
                                                fontWeight: 700,
                                                boxShadow: `0 8px 25px ${alpha(deepTeal, 0.3)}`,
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            {step.number}
                                        </Box>
                                        <step.icon 
                                            className="step-icon"
                                            sx={{ 
                                                fontSize: 40, 
                                                color: 'text.secondary', 
                                                mb: 2,
                                                transition: 'color 0.3s ease',
                                            }} 
                                        />
                                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: deepTeal }}>
                                            {step.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                            {step.description}
                                        </Typography>
                                        {index < doctorSteps.length - 1 && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 50,
                                                    right: { xs: '50%', md: -40 },
                                                    transform: { xs: 'translateX(50%) rotate(90deg)', md: 'none' },
                                                    width: 80,
                                                    height: 2,
                                                    bgcolor: alpha(deepTeal, 0.3),
                                                    display: { xs: 'none', md: 'block' },
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        right: -5,
                                                        top: -3,
                                                        width: 0,
                                                        height: 0,
                                                        borderLeft: `8px solid ${alpha(deepTeal, 0.3)}`,
                                                        borderTop: '4px solid transparent',
                                                        borderBottom: '4px solid transparent',
                                                    }
                                                }}
                                            />
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Container>
                </Box>

                {/* Testimonials Section */}
                <Box id="testimonials" sx={{ py: 12, bgcolor: '#F5F5F5' }}>
                    <Container maxWidth="lg">
                        <Box textAlign="center" sx={{ mb: 8 }}>
                            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: deepTeal }}>
                                Trusted by Thousands
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
                                See what healthcare providers and patients are saying about Clinify
                            </Typography>
                        </Box>
                        
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                                gap: 4,
                            }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <Card 
                                    key={index} 
                                    sx={{ 
                                        height: '100%', 
                                        p: 4,
                                        borderRadius: 4,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                            <Avatar 
                                                sx={{ 
                                                    width: 64, 
                                                    height: 64, 
                                                    mr: 3, 
                                                    bgcolor: turquoise,
                                                    boxShadow: `0 4px 15px ${alpha(turquoise, 0.3)}`,
                                                }}
                                            >
                                                {testimonial.name.split(' ').map(n => n[0]).join('')}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                    {testimonial.name}
                                                </Typography>
                                                <Chip 
                                                    label={testimonial.role} 
                                                    size="small" 
                                                    sx={{ 
                                                        bgcolor: alpha(turquoise, 0.1),
                                                        color: turquoise,
                                                        fontWeight: 500,
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                        <Rating 
                                            value={testimonial.rating} 
                                            readOnly 
                                            sx={{ 
                                                mb: 3,
                                                '& .MuiRating-iconFilled': {
                                                    color: '#FFD700',
                                                }
                                            }} 
                                        />
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                color: 'text.secondary', 
                                                fontStyle: 'italic', 
                                                lineHeight: 1.7,
                                                fontSize: '1rem',
                                            }}
                                        >
                                            "{testimonial.text}"
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Container>
                </Box>

                {/* CTA Banner */}
                <Box 
                    id="cta"
                    sx={{ 
                        py: 10, 
                        background: `linear-gradient(135deg, ${turquoise} 0%, ${deepTeal} 100%)`,
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        }
                    }}
                >
                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                        <Box textAlign="center">
                            <Typography 
                                variant="h3" 
                                sx={{ 
                                    fontWeight: 700, 
                                    mb: 3,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                            >
                                Ready to simplify your medical appointments?
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 6, opacity: 0.95, maxWidth: 600, mx: 'auto' }}>
                                Join thousands of healthcare providers and patients who trust Clinify 
                                for their appointment management needs.
                            </Typography>
                            {!auth.user && (
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                                    <Button
                                        component={Link}
                                        href={register().url}
                                        variant="contained"
                                        size="large"
                                        sx={{ 
                                            bgcolor: 'white', 
                                            color: turquoise,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            py: 2,
                                            px: 5,
                                            fontSize: '1.1rem',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                            animation: 'pulse 2s infinite',
                                            transition: 'all 0.3s ease',
                                            '&:hover': { 
                                                bgcolor: 'rgba(255,255,255,0.95)',
                                                transform: 'translateY(-3px) scale(1.05)',
                                                boxShadow: '0 12px 35px rgba(0,0,0,0.2)',
                                            }
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                    <Button
                                        component={Link}
                                        href="/doctor-application"
                                        variant="outlined"
                                        size="large"
                                        sx={{ 
                                            borderColor: 'white',
                                            color: 'white',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            py: 2,
                                            px: 5,
                                            fontSize: '1.1rem',
                                            borderWidth: 2,
                                            animation: 'pulse 2s infinite 0.5s',
                                            transition: 'all 0.3s ease',
                                            '&:hover': { 
                                                borderColor: 'white', 
                                                bgcolor: 'white',
                                                color: turquoise,
                                                transform: 'translateY(-3px) scale(1.05)',
                                            }
                                        }}
                                    >
                                        Join as a Doctor
                                    </Button>
                                </Stack>
                            )}
                        </Box>
                    </Container>
                </Box>

                {/* Footer */}
                <Box sx={{ py: 8, bgcolor: deepTeal, color: 'white' }}>
                    <Container maxWidth="lg">
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' },
                                gap: 6,
                                mb: 6,
                            }}
                        >
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: turquoise }}>
                                    Clinify
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 350, lineHeight: 1.6 }}>
                                    Modern healthcare appointment management platform designed for efficiency, 
                                    security, and exceptional user experience.
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Quick Links
                                </Typography>
                                <Stack spacing={2}>
                                    {!auth.user && (
                                        <>
                                            <Link href={login().url}>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        color: 'rgba(255,255,255,0.7)', 
                                                        transition: 'color 0.3s ease',
                                                        '&:hover': { color: turquoise }
                                                    }}
                                                >
                                                    Log in
                                                </Typography>
                                            </Link>
                                            <Link href={register().url}>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        color: 'rgba(255,255,255,0.7)', 
                                                        transition: 'color 0.3s ease',
                                                        '&:hover': { color: turquoise }
                                                    }}
                                                >
                                                    Register
                                                </Typography>
                                            </Link>
                                            <Link href="/doctor-application">
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        color: 'rgba(255,255,255,0.7)', 
                                                        transition: 'color 0.3s ease',
                                                        '&:hover': { color: turquoise }
                                                    }}
                                                >
                                                    Join as Doctor
                                                </Typography>
                                            </Link>
                                        </>
                                    )}
                                </Stack>
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    About Us
                                </Typography>
                                <Stack spacing={2}>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Contact
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        FAQ
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Support
                                    </Typography>
                                </Stack>
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Legal
                                </Typography>
                                <Stack spacing={2}>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Terms & Conditions
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Privacy Policy
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        HIPAA Compliance
                                    </Typography>
                                </Stack>
                            </Box>
                        </Box>
                        <Box sx={{ pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                © {new Date().getFullYear()} Clinify – Made with care for better healthcare
                            </Typography>
                        </Box>
                    </Container>
                </Box>
            </Box>

            {/* Global Styles for Animations */}
            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                @keyframes glow {
                    0% { opacity: 0.5; }
                    100% { opacity: 1; }
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }

                .float {
                    animation: float 20s infinite linear;
                }

                /* Smooth scrolling for the entire page */
                html {
                    scroll-behavior: smooth;
                }

                /* Custom scrollbar styling */
                ::-webkit-scrollbar {
                    width: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }

                ::-webkit-scrollbar-thumb {
                    background: ${turquoise};
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: ${deepTeal};
                }
            `}</style>
        </>
    );
}