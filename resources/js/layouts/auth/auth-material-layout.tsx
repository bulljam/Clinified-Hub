import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { MedicalServices as StethoscopeIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Container, Fade, Typography, Zoom } from '@mui/material';
import { keyframes, styled } from '@mui/material/styles';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
    opacity: 0.9;
  }
  66% {
    transform: translateY(-10px) rotate(240deg);
    opacity: 0.8;
  }
`;

const drift = keyframes`
  0%, 100% {
    transform: translateX(0px) translateY(0px);
  }
  25% {
    transform: translateX(10px) translateY(-10px);
  }
  50% {
    transform: translateX(-5px) translateY(-20px);
  }
  75% {
    transform: translateX(-10px) translateY(-5px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.1);
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedBackground = styled(Box)(() => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 183, 197, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 158, 255, 0.2) 0%, transparent 50%)
        `,
        animation: `${drift} 20s ease-in-out infinite`,
    },
}));

const FloatingShape = styled(Box)<{ delay?: number; size?: number; top?: string; left?: string; duration?: number }>(
    ({ delay = 0, size = 20, top = '50%', left = '50%', duration = 10 }) => ({
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: `${float} ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
    }),
);

const FogLayer = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '200%',
    height: '200%',
    background: `
        radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 25%),
        radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.08) 0%, transparent 30%)
    `,
    animation: `${drift} 25s linear infinite`,
    animationDelay: `${delay}s`,
}));

const StyledCard = styled(Card)(() => ({
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    borderRadius: 24,
    overflow: 'visible',
    animation: `${fadeInUp} 0.8s ease-out`,
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        background: 'linear-gradient(45deg, #5c6bc0, #667eea, #764ba2, #5c6bc0)',
        borderRadius: 26,
        zIndex: -1,
        opacity: 0.3,
        animation: `${pulse} 3s ease-in-out infinite`,
    },
}));

const LogoContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    animation: `${fadeInUp} 0.6s ease-out 0.2s both`,
});

const StyledStethoscopeIcon = styled(StethoscopeIcon)({
    fontSize: 48,
    color: '#5c6bc0',
    animation: `${pulse} 2s ease-in-out infinite`,
});

export default function AuthMaterialLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const shapes = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        delay: i * 0.5,
        size: Math.random() * 30 + 10,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 10 + 8,
    }));

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh' }}>
            <AnimatedBackground />

            <FogLayer delay={0} />
            <FogLayer delay={8} />
            <FogLayer delay={16} />

            {shapes.map((shape) => (
                <FloatingShape key={shape.id} delay={shape.delay} size={shape.size} top={shape.top} left={shape.left} duration={shape.duration} />
            ))}

            <Container
                maxWidth="sm"
                sx={{
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex',
                    minHeight: '100vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                }}
            >
                <Fade in={true} timeout={1000}>
                    <Box sx={{ width: '100%', maxWidth: 400 }}>
                        <LogoContainer>
                            <Link href={home()} style={{ textDecoration: 'none' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: '50%',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(92, 107, 192, 0.3)',
                                            boxShadow: '0 8px 32px rgba(92, 107, 192, 0.3)',
                                        }}
                                    >
                                        <StyledStethoscopeIcon />
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: 'white',
                                            fontWeight: 700,
                                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                            letterSpacing: 1,
                                        }}
                                    >
                                        Clinified Hub
                                    </Typography>
                                </Box>
                            </Link>
                        </LogoContainer>

                        <Zoom in={true} timeout={1200} style={{ transitionDelay: '300ms' }}>
                            <StyledCard>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 700,
                                                color: '#333',
                                                mb: 1,
                                                background: 'linear-gradient(45deg, #5c6bc0, #667eea)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            {title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: '1rem',
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {description}
                                        </Typography>
                                    </Box>
                                    {children}
                                </CardContent>
                            </StyledCard>
                        </Zoom>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
}
