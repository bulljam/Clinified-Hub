import { Box, Card, CardContent, Typography, Container, useTheme, useMediaQuery } from '@mui/material';
import { Link, router } from '@inertiajs/react';
import { home } from '@/routes';
import { LocalHospital as MedicalIcon } from '@mui/icons-material';
import { type PropsWithChildren, useEffect, useState } from 'react';

interface AnimatedAuthLayoutProps {
    title?: string;
    description?: string;
    mode: 'login' | 'register';
    imagePosition: 'left' | 'right';
}

export default function AnimatedAuthLayout({ 
    children, 
    title, 
    description, 
    mode,
    imagePosition 
}: PropsWithChildren<AnimatedAuthLayoutProps>) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [currentImagePosition, setCurrentImagePosition] = useState(imagePosition);

    useEffect(() => {
        if (currentImagePosition !== imagePosition) {
            setIsTransitioning(true);
            const timer = setTimeout(() => {
                setCurrentImagePosition(imagePosition);
                setIsTransitioning(false);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [imagePosition, currentImagePosition]);

    const handleNavigation = (href: string) => {
        setIsTransitioning(true);
        setTimeout(() => {
            router.visit(href);
        }, 300);
    };

    const medicalImage = (
        <Box
            sx={{
                flex: 1,
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(32, 160, 159, 0.1) 0%, rgba(20, 184, 166, 0.15) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: currentImagePosition === 'left' ? '24px 0 0 24px' : '0 24px 24px 0',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
                opacity: isTransitioning ? 0.7 : 1,
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        radial-gradient(circle at 30% 30%, rgba(32, 160, 159, 0.2) 0%, transparent 60%),
                        radial-gradient(circle at 70% 70%, rgba(20, 184, 166, 0.15) 0%, transparent 60%)
                    `,
                    zIndex: 1,
                },
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    p: 6,
                    transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        bgcolor: 'rgba(32, 160, 159, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 4,
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(32, 160, 159, 0.3)',
                        animation: 'float 3s ease-in-out infinite',
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-10px)' },
                        },
                    }}
                >
                    <MedicalIcon sx={{ fontSize: 60, color: '#20a09f' }} />
                </Box>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: '#20a09f',
                        mb: 2,
                        letterSpacing: '-0.5px',
                    }}
                >
                    {mode === 'login' ? 'Welcome Back!' : 'Join Clinify'}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: '#4a5568',
                        maxWidth: 300,
                        mx: 'auto',
                        lineHeight: 1.6,
                        opacity: 0.8,
                    }}
                >
                    {mode === 'login' 
                        ? 'Access your healthcare dashboard and manage your appointments with ease.' 
                        : 'Create your account and start connecting with healthcare professionals today.'
                    }
                </Typography>
                
                <Box
                    sx={{
                        mt: 6,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 3,
                    }}
                >
                    {[1, 2, 3].map((i) => (
                        <Box
                            key={i}
                            sx={{
                                width: 60,
                                height: 4,
                                borderRadius: 2,
                                bgcolor: 'rgba(32, 160, 159, 0.3)',
                                animation: `pulse-${i} 2s ease-in-out infinite ${i * 0.3}s`,
                                '@keyframes pulse-1': {
                                    '0%, 100%': { opacity: 0.3 },
                                    '50%': { opacity: 1 },
                                },
                                '@keyframes pulse-2': {
                                    '0%, 100%': { opacity: 0.3 },
                                    '50%': { opacity: 1 },
                                },
                                '@keyframes pulse-3': {
                                    '0%, 100%': { opacity: 0.3 },
                                    '50%': { opacity: 1 },
                                },
                            }}
                        />
                    ))}
                </Box>
            </Box>
            
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    textAlign: 'center',
                    opacity: 0.6,
                }}
            >
                <Typography variant="caption" sx={{ color: '#4a5568' }}>
                    Trusted by healthcare professionals worldwide
                </Typography>
            </Box>
        </Box>
    );

    const formSection = (
        <Box
            sx={{
                flex: 1,
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isTransitioning ? 'translateX(20px)' : 'translateX(0)',
                opacity: isTransitioning ? 0.7 : 1,
            }}
        >
            <Link href={home()} style={{ textDecoration: 'none', alignSelf: 'flex-start', marginBottom: '2rem' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                    }}
                >
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: 1.5,
                            bgcolor: '#20a09f',
                            color: 'white',
                            boxShadow: '0 2px 8px rgba(32, 160, 159, 0.3)',
                        }}
                    >
                        <MedicalIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: '#20a09f',
                            letterSpacing: '-0.3px',
                        }}
                    >
                        Clinify
                    </Typography>
                </Box>
            </Link>

            <Box sx={{ maxWidth: 400, width: '100%' }}>
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 600,
                            color: '#1a1a1a',
                            mb: 1,
                            fontSize: { xs: '1.75rem', sm: '2rem' },
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            lineHeight: 1.6,
                        }}
                    >
                        {description}
                    </Typography>
                </Box>
                {children}
            </Box>
        </Box>
    );

    if (isMobile) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                    position: 'relative',
                }}
            >
                <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, rgba(32, 160, 159, 0.1) 0%, rgba(20, 184, 166, 0.15) 100%)',
                                p: 4,
                                textAlign: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(32, 160, 159, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 2,
                                }}
                            >
                                <MedicalIcon sx={{ fontSize: 40, color: '#20a09f' }} />
                            </Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    color: '#20a09f',
                                    mb: 1,
                                }}
                            >
                                {mode === 'login' ? 'Welcome Back!' : 'Join Clinify'}
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#1a1a1a',
                                        mb: 1,
                                    }}
                                >
                                    {title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {description}
                                </Typography>
                            </Box>
                            {children}
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: `
                        radial-gradient(circle at 25% 25%, rgba(32, 160, 159, 0.05) 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, rgba(20, 184, 166, 0.05) 0%, transparent 50%)
                    `,
                    animation: 'float-bg 20s ease-in-out infinite',
                    '@keyframes float-bg': {
                        '0%, 100%': { transform: 'rotate(0deg)' },
                        '50%': { transform: 'rotate(180deg)' },
                    },
                },
            }}
        >
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 6,
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(20px)',
                        overflow: 'hidden',
                        maxWidth: 1200,
                        mx: 'auto',
                        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            minHeight: 600,
                        }}
                    >
                        {currentImagePosition === 'left' ? (
                            <>
                                {medicalImage}
                                {formSection}
                            </>
                        ) : (
                            <>
                                {formSection}
                                {medicalImage}
                            </>
                        )}
                    </Box>
                </Card>
            </Container>
        </Box>
    );
}