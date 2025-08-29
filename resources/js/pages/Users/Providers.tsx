import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Collapse,
    Fade,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    TextField,
    Typography,
    IconButton,
    Stack,
} from '@mui/material';
import {
    LocalHospital as MedicalIcon,
    Person as PersonIcon,
    Search as SearchIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Work as WorkIcon,
    FilterAlt as FilterIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Star as StarIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import dayjs from 'dayjs';

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

interface ProvidersProps {
    providers: Provider[];
    userRole: string;
    specialties: string[];
    cities: string[];
    filters: {
        specialty?: string;
        city?: string;
        gender?: string;
        min_experience?: number;
        max_experience?: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Healthcare Providers',
        href: '/providers',
    },
];

export default function Providers({ providers, userRole, specialties, cities, filters }: ProvidersProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);
    const itemsPerPage = 12;

    const filteredProviders = providers.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (provider.specialty && provider.specialty.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (provider.city && provider.city.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProviders = filteredProviders.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (key: string, value: string | number) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value || undefined
        }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        Object.entries(localFilters).forEach(([key, value]) => {
            if (value) params.append(key, value.toString());
        });
        router.get(`/providers?${params.toString()}`);
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get('/providers');
    };

    const getGenderIcon = (gender?: string) => {
        switch (gender) {
            case 'male': return '👨';
            case 'female': return '👩';
            default: return '👤';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Healthcare Providers" />
            <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh', bgcolor: '#fafafa' }}>
                {/* Header Section */}
                <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: '#20a09f', width: 56, height: 56 }}>
                                    <MedicalIcon sx={{ fontSize: 28 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" component="h1" fontWeight="bold" color="#20a09f">
                                        Healthcare Providers
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {userRole === 'admin' || userRole === 'super_admin' 
                                            ? 'Manage and view all healthcare providers in the system'
                                            : userRole === 'provider'
                                            ? 'Connect with fellow healthcare providers'
                                            : 'Find and connect with qualified healthcare providers'
                                        }
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Search and Filter Section */}
                <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            {/* Search Bar */}
                            <TextField
                                fullWidth
                                placeholder="Search providers by name, specialty, or location..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#20a09f' }} />
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
                                }}
                            />
                            
                            {/* Filter Toggle */}
                            <Box display="flex" alignItems="center" gap={2}>
                                <Button
                                    startIcon={<FilterIcon />}
                                    endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    onClick={() => setShowFilters(!showFilters)}
                                    variant="outlined"
                                    sx={{
                                        borderColor: '#20a09f',
                                        color: '#20a09f',
                                        '&:hover': {
                                            borderColor: '#178f8e',
                                            bgcolor: 'rgba(32, 160, 159, 0.04)',
                                        },
                                    }}
                                >
                                    Advanced Filters
                                </Button>
                                {Object.values(localFilters).some(v => v) && (
                                    <Button
                                        variant="text"
                                        color="error"
                                        onClick={clearFilters}
                                        size="small"
                                    >
                                        Clear All
                                    </Button>
                                )}
                            </Box>

                            {/* Filters */}
                            <Collapse in={showFilters}>
                                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 3 }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <FormControl fullWidth>
                                                <InputLabel>Specialty</InputLabel>
                                                <Select
                                                    value={localFilters.specialty || ''}
                                                    label="Specialty"
                                                    onChange={(e) => handleFilterChange('specialty', e.target.value)}
                                                >
                                                    <MenuItem value="">All Specialties</MenuItem>
                                                    {specialties.map((specialty) => (
                                                        <MenuItem key={specialty} value={specialty}>
                                                            {specialty}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <FormControl fullWidth>
                                                <InputLabel>City</InputLabel>
                                                <Select
                                                    value={localFilters.city || ''}
                                                    label="City"
                                                    onChange={(e) => handleFilterChange('city', e.target.value)}
                                                >
                                                    <MenuItem value="">All Cities</MenuItem>
                                                    {cities.map((city) => (
                                                        <MenuItem key={city} value={city}>
                                                            {city}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <FormControl fullWidth>
                                                <InputLabel>Gender</InputLabel>
                                                <Select
                                                    value={localFilters.gender || ''}
                                                    label="Gender"
                                                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                                                >
                                                    <MenuItem value="">All Genders</MenuItem>
                                                    <MenuItem value="male">👨 Male</MenuItem>
                                                    <MenuItem value="female">👩 Female</MenuItem>
                                                    <MenuItem value="other">👤 Other</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Min Experience (Years)"
                                                type="number"
                                                value={localFilters.min_experience || ''}
                                                onChange={(e) => handleFilterChange('min_experience', parseInt(e.target.value))}
                                                InputProps={{ inputProps: { min: 0 } }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <Button onClick={clearFilters} variant="outlined">
                                            Clear
                                        </Button>
                                        <Button
                                            onClick={applyFilters}
                                            variant="contained"
                                            sx={{
                                                bgcolor: '#20a09f',
                                                '&:hover': { bgcolor: '#178f8e' },
                                            }}
                                        >
                                            Apply Filters
                                        </Button>
                                    </Box>
                                </Box>
                            </Collapse>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Statistics */}
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3, 1fr)' }} gap={3} mb={4}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold" color="#20a09f" mb={1}>
                                {filteredProviders.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {searchQuery ? 'Matching Providers' : 'Total Providers'}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold" color="success.main" mb={1}>
                                {specialties.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Specialties
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold" color="info.main" mb={1}>
                                {cities.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Cities
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Providers Grid */}
                {filteredProviders.length > 0 ? (
                    <>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {paginatedProviders.map((provider, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={provider.id}>
                                    <Fade in={true} timeout={300 + index * 50}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                borderRadius: 3,
                                                border: '1px solid #e0e0e0',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 8px 25px rgba(32, 160, 159, 0.15)',
                                                    borderColor: '#20a09f',
                                                },
                                                cursor: 'pointer',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <CardContent sx={{ p: 3, flexGrow: 1 }}>
                                                {/* Provider Header */}
                                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                                    {provider.photo ? (
                                                        <Avatar 
                                                            src={`/storage/${provider.photo}`}
                                                            sx={{ 
                                                                width: 80, 
                                                                height: 80,
                                                                border: '3px solid #20a09f',
                                                                mb: 1,
                                                            }}
                                                        />
                                                    ) : (
                                                        <Avatar sx={{ 
                                                            bgcolor: '#20a09f', 
                                                            width: 80, 
                                                            height: 80,
                                                            fontSize: '2rem',
                                                            fontWeight: 'bold',
                                                            mb: 1,
                                                        }}>
                                                            {provider.name.charAt(0)}
                                                        </Avatar>
                                                    )}
                                                    
                                                    <Typography variant="h6" fontWeight="600" textAlign="center" color="#20a09f">
                                                        Dr. {provider.name}
                                                    </Typography>
                                                    
                                                    {provider.specialty && (
                                                        <Chip 
                                                            label={provider.specialty}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: '#20a09f',
                                                                color: 'white',
                                                                fontWeight: 500,
                                                                mb: 1,
                                                            }}
                                                        />
                                                    )}
                                                </Box>

                                                {/* Provider Details */}
                                                <Stack spacing={1}>
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
                                                        <Typography variant="body2" color="text.secondary" noWrap>
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
                                                </Stack>

                                                {provider.bio && (
                                                    <Box mt={2}>
                                                        <Typography variant="body2" color="text.secondary" sx={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}>
                                                            {provider.bio}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </CardContent>

                                            {/* Provider Footer */}
                                            <Box sx={{ 
                                                px: 3, 
                                                py: 2, 
                                                borderTop: '1px solid #f0f0f0',
                                                bgcolor: 'rgba(32, 160, 159, 0.02)',
                                            }}>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <StarIcon fontSize="small" sx={{ color: '#20a09f' }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {provider.appointments_count} appointments
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Since {dayjs(provider.created_at).format('MMM YYYY')}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Card>
                                    </Fade>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                mt: 4, 
                                mb: 2,
                                gap: 2
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    Showing {startIndex + 1}-{Math.min(endIndex, filteredProviders.length)} of {filteredProviders.length} providers
                                </Typography>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={(_event, page) => handlePageChange(page)}
                                    size="large"
                                    shape="rounded"
                                    showFirstButton
                                    showLastButton
                                    sx={{
                                        color: '#20a09f',
                                        '& .MuiPaginationItem-root': {
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            minWidth: 40,
                                            height: 40,
                                            border: '1px solid #e0e0e0',
                                            '&:hover': {
                                                bgcolor: '#20a09f',
                                                color: 'white',
                                                transform: 'scale(1.05)',
                                                boxShadow: '0 4px 8px rgba(32, 160, 159, 0.3)',
                                            },
                                            '&.Mui-selected': {
                                                bgcolor: '#20a09f',
                                                color: 'white',
                                                boxShadow: '0 4px 12px rgba(32, 160, 159, 0.4)',
                                                '&:hover': {
                                                    bgcolor: '#178f8e',
                                                },
                                            },
                                            transition: 'all 0.2s ease',
                                        },
                                        '& .MuiPaginationItem-ellipsis': {
                                            color: 'text.secondary',
                                        },
                                    }}
                                />
                            </Box>
                        )}
                    </>
                ) : (
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ textAlign: 'center', py: 8 }}>
                            <Avatar sx={{ bgcolor: 'grey.100', width: 80, height: 80, mx: 'auto', mb: 3 }}>
                                <MedicalIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                            </Avatar>
                            <Typography variant="h6" fontWeight="600" color="text.primary" mb={1}>
                                No Providers Found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {searchQuery || Object.values(localFilters).some(v => v) 
                                    ? 'Try adjusting your search criteria or filters.' 
                                    : 'No healthcare providers are currently available.'
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </AppLayout>
    );
}