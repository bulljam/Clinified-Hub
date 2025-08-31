import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
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
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    useMediaQuery,
    ToggleButton,
    ToggleButtonGroup,
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
    KeyboardArrowUp,
    Menu as MenuIcon,
    Close as CloseIcon,
    ContactMail,
    Home as HomeIcon,
    Star,
    Build,
    Reviews,
    Login as LoginIcon,
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
    { id: 'hero', label: 'Home', icon: HomeIcon },
    { id: 'features', label: 'Features', icon: Star },
    { id: 'how-it-works', label: 'How It Works', icon: Build },
    { id: 'testimonials', label: 'Testimonials', icon: Reviews },
    { id: 'cta', label: 'Contact', icon: ContactMail },
];

// Custom hook for scroll detection and progress
const useScrollSpy = (sectionIds: string[], offset = 100) => {
    const [activeSection, setActiveSection] = useState('');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + offset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min((window.scrollY / documentHeight) * 100, 100);
            setScrollProgress(progress);
            setShowScrollToTop(window.scrollY > 300);
            
            for (let i = sectionIds.length - 1; i >= 0; i--) {
                const section = document.getElementById(sectionIds[i]);
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(sectionIds[i]);
                    break;
                }
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sectionIds, offset]);

    return { activeSection, scrollProgress, showScrollToTop };
};

// Smooth scroll function
const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
        });
    }
};

// Scroll to top function
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const theme = useTheme();
    const { activeSection, scrollProgress, showScrollToTop } = useScrollSpy(navigationSections.map(s => s.id));
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

                {/* Glassmorphic Navbar */}
                <Box 
                    sx={{ 
                        position: 'sticky', 
                        top: 20, 
                        zIndex: 1000, 
                        px: 2,
                        animation: 'slideDown 0.8s ease-out',
                    }}
                >
                    <Container maxWidth="lg">
                        <Paper
                            elevation={0}
                            sx={{
                                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))`,
                                backdropFilter: 'blur(12px)',
                                borderRadius: 8,
                                border: `1px solid rgba(255, 255, 255, 0.3)`,
                                boxShadow: `0 8px 32px rgba(68, 175, 174, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: `0 12px 40px rgba(68, 175, 174, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)`,
                                }
                            }}
                        >
                            <Toolbar sx={{ 
                                justifyContent: 'space-between', 
                                py: 1.5,
                                minHeight: { xs: 60, md: 70 }
                            }}>
                                {/* Logo */}
                                <Typography 
                                    variant="h5" 
                                    component="div" 
                                    sx={{ 
                                        fontWeight: 700, 
                                        color: turquoise,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            filter: 'drop-shadow(0 0 8px rgba(32, 160, 159, 0.5))',
                                        }
                                    }}
                                    onClick={() => scrollToSection('hero')}
                                >
                                    Clinify
                                </Typography>

                                {/* Desktop Navigation */}
                                <Box sx={{ 
                                    display: { xs: 'none', md: 'flex' }, 
                                    alignItems: 'center', 
                                    gap: 1,
                                    position: 'absolute',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                }}>
                                    {navigationSections.map((section) => (
                                        <Box key={section.id} sx={{ position: 'relative' }}>
                                            <Button
                                                onClick={() => scrollToSection(section.id)}
                                                sx={{
                                                    textTransform: 'none',
                                                    color: activeSection === section.id ? turquoise : 'text.primary',
                                                    fontWeight: activeSection === section.id ? 600 : 500,
                                                    px: 3,
                                                    py: 1.5,
                                                    borderRadius: 6,
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    '&:hover': {
                                                        color: turquoise,
                                                        bgcolor: alpha(turquoise, 0.08),
                                                        transform: 'translateY(-1px)',
                                                        filter: 'drop-shadow(0 4px 8px rgba(32, 160, 159, 0.2))',
                                                    }
                                                }}
                                            >
                                                {section.label}
                                            </Button>
                                            {/* Glowing Underline */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 4,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    width: activeSection === section.id ? '80%' : '0%',
                                                    height: 3,
                                                    bgcolor: turquoise,
                                                    borderRadius: 2,
                                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    boxShadow: activeSection === section.id 
                                                        ? `0 0 12px ${alpha(turquoise, 0.8)}` 
                                                        : 'none',
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>

                                {/* Right Side */}
                                <Stack direction="row" spacing={1} alignItems="center">
                                    {/* Auth Buttons */}
                                    {auth.user ? (
                                        <Button
                                            component={Link}
                                            href={dashboard().url}
                                            variant="contained"
                                            sx={{ 
                                                textTransform: 'none',
                                                bgcolor: turquoise,
                                                boxShadow: `0 4px 14px ${alpha(turquoise, 0.4)}`,
                                                borderRadius: 6,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: deepTeal,
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 6px 20px ${alpha(turquoise, 0.5)}`,
                                                }
                                            }}
                                        >
                                            Dashboard
                                        </Button>
                                    ) : (
                                        <>
                                            {!isMobile && (
                                                <Button
                                                    component={Link}
                                                    href={login().url}
                                                    variant="text"
                                                    startIcon={<LoginIcon />}
                                                    sx={{ 
                                                        textTransform: 'none',
                                                        color: 'text.primary',
                                                        borderRadius: 6,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            color: turquoise,
                                                            bgcolor: alpha(turquoise, 0.05),
                                                        }
                                                    }}
                                                >
                                                    Log in
                                                </Button>
                                            )}
                                            <Button
                                                component={Link}
                                                href={register().url}
                                                variant="contained"
                                                startIcon={<PersonAdd />}
                                                size="small"
                                                sx={{ 
                                                    textTransform: 'none',
                                                    bgcolor: turquoise,
                                                    borderRadius: 6,
                                                    boxShadow: `0 4px 14px ${alpha(turquoise, 0.4)}`,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        bgcolor: deepTeal,
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: `0 6px 20px ${alpha(turquoise, 0.5)}`,
                                                    }
                                                }}
                                            >
                                                Register
                                            </Button>
                                        </>
                                    )}

                                    {/* Mobile Menu Button */}
                                    {isMobile && (
                                        <IconButton
                                            onClick={() => setMobileMenuOpen(true)}
                                            sx={{ 
                                                color: turquoise,
                                                '&:hover': {
                                                    bgcolor: alpha(turquoise, 0.08),
                                                }
                                            }}
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                    )}
                                </Stack>
                            </Toolbar>
                        </Paper>
                    </Container>
                </Box>

                {/* Mobile Drawer */}
                <Drawer
                    anchor="right"
                    open={mobileMenuOpen}
                    onClose={() => setMobileMenuOpen(false)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: 280,
                            background: `linear-gradient(135deg, ${alpha(turquoise, 0.1)}, ${alpha(turquoise, 0.05)})`,
                            backdropFilter: 'blur(20px)',
                            border: `1px solid ${alpha(turquoise, 0.2)}`,
                        }
                    }}
                >
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ color: turquoise, fontWeight: 700 }}>
                                Clinify
                            </Typography>
                            <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: turquoise }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <List>
                            {navigationSections.map((section) => (
                                <ListItem
                                    key={section.id}
                                    onClick={() => {
                                        scrollToSection(section.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 1,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        bgcolor: activeSection === section.id ? alpha(turquoise, 0.1) : 'transparent',
                                        '&:hover': {
                                            bgcolor: alpha(turquoise, 0.08),
                                            transform: 'translateX(4px)',
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: activeSection === section.id ? turquoise : 'text.secondary' }}>
                                        <section.icon />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={section.label}
                                        sx={{ 
                                            '& .MuiListItemText-primary': {
                                                color: activeSection === section.id ? turquoise : 'text.primary',
                                                fontWeight: activeSection === section.id ? 600 : 500,
                                            }
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        {!auth.user && (
                            <Box sx={{ mt: 4, space: 2 }}>
                                <Button
                                    component={Link}
                                    href={login().url}
                                    variant="outlined"
                                    startIcon={<LoginIcon />}
                                    fullWidth
                                    sx={{ 
                                        mb: 2,
                                        textTransform: 'none',
                                        borderColor: turquoise,
                                        color: turquoise,
                                        borderRadius: 6,
                                        '&:hover': {
                                            bgcolor: alpha(turquoise, 0.08),
                                        }
                                    }}
                                >
                                    Log in
                                </Button>
                                <Button
                                    component={Link}
                                    href={register().url}
                                    variant="contained"
                                    startIcon={<PersonAdd />}
                                    fullWidth
                                    sx={{ 
                                        textTransform: 'none',
                                        bgcolor: turquoise,
                                        borderRadius: 6,
                                        boxShadow: `0 4px 14px ${alpha(turquoise, 0.4)}`,
                                        '&:hover': {
                                            bgcolor: deepTeal,
                                        }
                                    }}
                                >
                                    Register
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Drawer>

                {/* Hero Section with ECG Animation */}
                <Box 
                    id="hero"
                    sx={{ 
                        bgcolor: '#f3f7f9',
                        minHeight: '90vh',
                        mt: -12,
                        pt: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        px: 2,
                    }}
                >
                    {/* Headline */}
                    <Typography
                        variant="h2"
                        fontWeight="bold"
                        color="#1E2A2F"
                        mb={2}
                        sx={{ fontSize: { xs: "2rem", md: "3rem" }, lineHeight: 1.2 }}
                    >
                        Book Your Medical Appointments in Minutes
                    </Typography>

                    {/* Subtext */}
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        mb={4}
                        sx={{ maxWidth: "600px" }}
                    >
                        Find trusted doctors, manage your schedule, and take control of your
                        health — all in one place.
                    </Typography>

                    {/* CTA Buttons */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" mb={6}>
                        {!auth.user && (
                            <>
                                <Button
                                    component={Link}
                                    href={register().url}
                                    variant="contained"
                                    sx={{
                                        bgcolor: "#44AFAE",
                                        color: "white",
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 3,
                                        boxShadow: "0 4px 15px rgba(68,175,174,0.4)",
                                        fontWeight: "bold",
                                        textTransform: "none",
                                        "&:hover": { bgcolor: "#369392" },
                                    }}
                                >
                                    Book Appointment
                                </Button>
                                <Button
                                    component={Link}
                                    href={register().url}
                                    variant="outlined"
                                    sx={{
                                        color: "#44AFAE",
                                        borderColor: "#44AFAE",
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 3,
                                        fontWeight: "bold",
                                        textTransform: "none",
                                        "&:hover": {
                                            bgcolor: "rgba(68,175,174,0.1)",
                                            borderColor: "#369392",
                                        },
                                    }}
                                >
                                    Join as Doctor
                                </Button>
                            </>
                        )}
                    </Stack>

                    {/* ECG Animation */}
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 60,
                            left: 0,
                            right: 0,
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            opacity: 0.8,
                        }}
                    >
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 500 100"
                            width="80%"
                            height="100"
                            style={{
                                stroke: "#44AFAE",
                                fill: "none",
                                strokeWidth: 2,
                                filter: "drop-shadow(0px 0px 6px #44AFAE)",
                            }}
                            initial={{ strokeDasharray: 500, strokeDashoffset: 500 }}
                            animate={{ strokeDashoffset: 0 }}
                            transition={{
                                repeat: Infinity,
                                duration: 3,
                                ease: "linear",
                            }}
                        >
                            <motion.path
                                d="M0 50 L50 50 L80 20 L100 80 L130 50 L200 50 L230 20 L250 80 L280 50 L350 50 L380 30 L400 70 L430 50 L500 50"
                                animate={{
                                    scale: [1, 1.05, 1],
                                    strokeWidth: [2, 3, 2],
                                    stroke: ["#44AFAE", "#5CD5D4", "#44AFAE"],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "easeInOut",
                                }}
                            />
                        </motion.svg>
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

                {/* Scroll to Top Button */}
                <Fade in={showScrollToTop} timeout={300}>
                    <Box
                        onClick={scrollToTop}
                        sx={{
                            position: 'fixed',
                            bottom: 30,
                            right: 30,
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: turquoise,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 1000,
                            boxShadow: `0 4px 20px ${alpha(turquoise, 0.4)}`,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            animation: 'subtlePulse 3s ease-in-out infinite',
                            '&:hover': {
                                transform: 'scale(1.1) translateY(-2px)',
                                boxShadow: `0 8px 30px ${alpha(turquoise, 0.6)}, 0 0 0 8px ${alpha(turquoise, 0.1)}, 0 0 0 16px ${alpha(turquoise, 0.05)}`,
                                bgcolor: deepTeal,
                            },
                            '&:active': {
                                transform: 'scale(1.05) translateY(-1px)',
                            }
                        }}
                    >
                        {/* Progress Ring */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -4,
                                left: -4,
                                right: -4,
                                bottom: -4,
                                borderRadius: '50%',
                                background: `conic-gradient(${turquoise} ${scrollProgress * 3.6}deg, ${alpha(turquoise, 0.2)} 0deg)`,
                                padding: '4px',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: 4,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                                }
                            }}
                        />
                        
                        {/* Arrow Icon */}
                        <KeyboardArrowUp 
                            sx={{ 
                                fontSize: 28,
                                position: 'relative',
                                zIndex: 1,
                                transition: 'transform 0.2s ease',
                            }} 
                        />
                    </Box>
                </Fade>
            </Box>

            {/* Global Styles for Animations */}
            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                @keyframes subtlePulse {
                    0%, 100% { 
                        transform: scale(1);
                        box-shadow: 0 4px 20px ${alpha(turquoise, 0.4)};
                    }
                    50% { 
                        transform: scale(1.02);
                        box-shadow: 0 6px 25px ${alpha(turquoise, 0.5)};
                    }
                }

                @keyframes slideDown {
                    0% {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
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