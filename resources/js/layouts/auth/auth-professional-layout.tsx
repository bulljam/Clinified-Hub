import { Box, Card, CardContent, Typography, Container } from '@mui/material';
import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import { MedicalServices as StethoscopeIcon } from '@mui/icons-material';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthProfessionalLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
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
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        radial-gradient(circle at 20% 20%, rgba(92, 107, 192, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(92, 107, 192, 0.08) 0%, transparent 50%)
                    `,
                    zIndex: 1,
                },
            }}
        >
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
                <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}>
                    {/* Logo Section */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Link href={home()} style={{ textDecoration: 'none' }}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    mb: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: '#5c6bc0',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(92, 107, 192, 0.3)',
                                    }}
                                >
                                    <StethoscopeIcon sx={{ fontSize: 32 }} />
                                </Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        color: '#5c6bc0',
                                        letterSpacing: '-0.5px',
                                    }}
                                >
                                    Clinified Hub
                                </Typography>
                            </Box>
                        </Link>
                    </Box>

                    {/* Main Card */}
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
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

                    {/* Footer */}
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.secondary',
                                fontSize: '0.75rem',
                            }}
                        >
                            © 2024 Clinified Hub. All rights reserved.
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}