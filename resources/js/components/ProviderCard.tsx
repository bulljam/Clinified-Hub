import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Work as WorkIcon,
    Star as StarIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { getImageUrl } from '@/utils/imageHelpers';

interface Provider {
    id: number;
    name: string;
    email: string;
    photo?: string;
    gender?: string;
    city?: string;
    specialty?: string;
    years_of_experience?: number;
    bio?: string;
    phone?: string;
    created_at: string;
    appointments_count: number;
}

interface ProviderCardProps {
    provider: Provider;
    onClick?: () => void;
}

const getGenderIcon = (gender?: string) => {
    switch (gender) {
        case 'male': return '👨';
        case 'female': return '👩';
        default: return '👤';
    }
};


export default function ProviderCard({ provider, onClick }: ProviderCardProps) {
    return (
        <Card
            onClick={onClick}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                border: '1px solid #e0e0e0',
                '&:hover': onClick ? {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    borderColor: '#20a09f',
                } : {},
            }}
        >
            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                    <Avatar
                        src={getImageUrl(provider.photo)}
                        sx={{ 
                            width: 64,
                            height: 64,
                            bgcolor: '#20a09f',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            mb: 1,
                            '& img': {
                                objectPosition: 'top center',
                                transform: 'translateY(8px) scale(1.3)',
                                objectFit: 'cover',
                            },
                        }}
                    >
                        {!provider.photo && provider.name.charAt(0)}
                    </Avatar>
                    
                    <Typography variant="h6" fontWeight="600" textAlign="center" mb={0.5}>
                        {provider.name}
                    </Typography>
                    
                    {provider.specialty && (
                        <Chip 
                            label={provider.specialty}
                            size="small"
                            sx={{
                                bgcolor: '#20a09f',
                                color: 'white',
                                fontSize: '0.75rem',
                            }}
                        />
                    )}
                </Box>

                <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                    {provider.years_of_experience && (
                        <Box display="flex" alignItems="center" gap={1}>
                            <WorkIcon fontSize="small" sx={{ color: '#20a09f' }} />
                            <Typography variant="body2" color="text.secondary">
                                {provider.years_of_experience} years experience
                            </Typography>
                        </Box>
                    )}
                    
                    {provider.city && (
                        <Box display="flex" alignItems="center" gap={1}>
                            <LocationIcon fontSize="small" sx={{ color: '#20a09f' }} />
                            <Typography variant="body2" color="text.secondary">
                                {provider.city}
                            </Typography>
                        </Box>
                    )}
                    
                    {provider.gender && (
                        <Box display="flex" alignItems="center" gap={1}>
                            <PersonIcon fontSize="small" sx={{ color: '#20a09f' }} />
                            <Typography variant="body2" color="text.secondary">
                                {getGenderIcon(provider.gender)} {provider.gender.charAt(0).toUpperCase() + provider.gender.slice(1)}
                            </Typography>
                        </Box>
                    )}

                    <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon fontSize="small" sx={{ color: '#20a09f' }} />
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {provider.email}
                        </Typography>
                    </Box>

                    {provider.phone && (
                        <Box display="flex" alignItems="center" gap={1}>
                            <PhoneIcon fontSize="small" sx={{ color: '#20a09f' }} />
                            <Typography variant="body2" color="text.secondary">
                                {provider.phone}
                            </Typography>
                        </Box>
                    )}

                    {provider.bio && (
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mt: 1,
                            }}
                        >
                            {provider.bio}
                        </Typography>
                    )}
                </Stack>

                <Box 
                    sx={{ 
                        mt: 2,
                        pt: 2, 
                        borderTop: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <StarIcon fontSize="small" sx={{ color: '#20a09f' }} />
                        <Typography variant="caption" color="text.secondary">
                            {provider.appointments_count} appointments
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        Since {dayjs(provider.created_at).format('MMM YYYY')}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}