import { Box, Card, CardContent, Typography, Container, useTheme, useMediaQuery } from '@mui/material';
import { MedicalServices as StethoscopeIcon } from '@mui/icons-material';
import { type PropsWithChildren, useEffect, useState, useRef } from 'react';

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
    const [currentImagePosition, setCurrentImagePosition] = useState(imagePosition);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (currentImagePosition !== imagePosition) {
            setTimeout(() => {
                setCurrentImagePosition(imagePosition);
            }, 400);
        }
    }, [imagePosition, currentImagePosition]);


    const medicalImage = (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(92, 107, 192, 0.1) 0%, rgba(122, 134, 203, 0.15) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: currentImagePosition === 'left' ? '24px 0 0 24px' : '0 24px 24px 0',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        radial-gradient(circle at 30% 30%, rgba(92, 107, 192, 0.2) 0%, transparent 60%),
                        radial-gradient(circle at 70% 70%, rgba(122, 134, 203, 0.15) 0%, transparent 60%)
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
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        bgcolor: 'rgba(92, 107, 192, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 4,
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(92, 107, 192, 0.3)',
                        animation: 'float 3s ease-in-out infinite',
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-10px)' },
                        },
                    }}
                >
                    <StethoscopeIcon sx={{ fontSize: 60, color: '#5c6bc0' }} />
                </Box>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: '#5c6bc0',
                        mb: 2,
                        letterSpacing: '-0.5px',
                    }}
                >
                    {mode === 'login' ? 'Welcome Back!' : 'Join Clinified Hub'}
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
                                bgcolor: 'rgba(92, 107, 192, 0.3)',
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
                width: '100%',
                height: '100%',
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                overflowY: 'auto',
                position: 'relative',
            }}
        >
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
                                background: 'linear-gradient(135deg, rgba(92, 107, 192, 0.1) 0%, rgba(122, 134, 203, 0.15) 100%)',
                                p: 4,
                                textAlign: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(92, 107, 192, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 2,
                                }}
                            >
                                <StethoscopeIcon sx={{ fontSize: 40, color: '#5c6bc0' }} />
                            </Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    color: '#5c6bc0',
                                    mb: 1,
                                }}
                            >
                                {mode === 'login' ? 'Welcome Back!' : 'Join Clinified Hub'}
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
                        radial-gradient(circle at 25% 25%, rgba(92, 107, 192, 0.05) 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, rgba(122, 134, 203, 0.05) 0%, transparent 50%)
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
                    ref={containerRef}
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
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            minHeight: 800,
                            position: 'relative',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '50%',
                                height: '100%',
                                transition: 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                transform: currentImagePosition === 'left' ? 'translateX(0)' : 'translateX(100%)',
                            }}
                        >
                            {medicalImage}
                        </Box>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '50%',
                                height: '100%',
                                transition: 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                transform: currentImagePosition === 'left' ? 'translateX(100%)' : 'translateX(0)',
                            }}
                        >
                            {formSection}
                        </Box>
                    </Box>
                </Card>
            </Container>
        </Box>
    );
}