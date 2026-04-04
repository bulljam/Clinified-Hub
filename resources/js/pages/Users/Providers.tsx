import ProviderCard from '@/components/ProviderCard';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    FilterAlt as FilterIcon,
    LocalHospital as MedicalIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Collapse,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';

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
    providers: {
        data: Provider[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    userRole: string;
    specialties: string[];
    cities: string[];
    filters: {
        specialty?: string;
        city?: string;
        gender?: string;
        experience?: string;
    };
    search?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Healthcare Providers',
        href: '/providers',
    },
];

export default function Providers({ providers, userRole, specialties, cities, filters, search }: ProvidersProps) {
    const [searchQuery, setSearchQuery] = useState(search || '');
    const [showFilters, setShowFilters] = useState(true);
    const [localFilters, setLocalFilters] = useState(filters);

    const filteredSpecialties = Array.from(new Set(providers.data.map((provider) => provider.specialty).filter((specialty) => specialty))).length;

    const filteredCities = Array.from(new Set(providers.data.map((provider) => provider.city).filter((city) => city))).length;

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());

        Object.entries(localFilters).forEach(([key, value]) => {
            if (value) params.append(key, value.toString());
        });

        if (searchQuery) params.append('search', searchQuery);

        router.get(`/providers?${params.toString()}`);
    };

    const handleSearch = () => {
        const params = new URLSearchParams();

        Object.entries(localFilters).forEach(([key, value]) => {
            if (value) params.append(key, value.toString());
        });

        if (searchQuery) params.append('search', searchQuery);

        router.get(`/providers?${params.toString()}`);
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleFilterChange = (key: string, value: string | number) => {
        const newFilters = {
            ...localFilters,
            [key]: value || undefined,
        };
        setLocalFilters(newFilters);

        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([filterKey, filterValue]) => {
            if (filterValue) params.append(filterKey, filterValue.toString());
        });

        if (searchQuery) params.append('search', searchQuery);

        router.get(`/providers?${params.toString()}`);
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        Object.entries(localFilters).forEach(([key, value]) => {
            if (value) params.append(key, value.toString());
        });

        if (searchQuery) params.append('search', searchQuery);

        router.get(`/providers?${params.toString()}`);
    };

    const clearFilters = () => {
        setLocalFilters({});
        setSearchQuery('');
        router.get('/providers');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Healthcare Providers" />
            <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh', bgcolor: '#fafafa' }}>
                <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: '#5c6bc0', width: 56, height: 56 }}>
                                    <MedicalIcon sx={{ fontSize: 28 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" component="h1" fontWeight="bold" color="#5c6bc0">
                                        Healthcare Providers
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {userRole === 'admin' || userRole === 'super_admin'
                                            ? 'Manage and view all healthcare providers in the system'
                                            : userRole === 'provider'
                                              ? 'Connect with fellow healthcare providers'
                                              : 'Find and connect with qualified healthcare providers'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                placeholder="Search providers by name, specialty, or location..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                }}
                                onKeyPress={handleSearchKeyPress}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#5c6bc0' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchQuery && (
                                        <InputAdornment position="end">
                                            <Button
                                                onClick={handleSearch}
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    bgcolor: '#5c6bc0',
                                                    '&:hover': { bgcolor: '#26418f' },
                                                    minWidth: 'auto',
                                                    px: 2,
                                                }}
                                            >
                                                Search
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#5c6bc0',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#5c6bc0',
                                        },
                                    },
                                }}
                            />

                            <Box display="flex" alignItems="center" gap={2}>
                                <Button
                                    startIcon={<FilterIcon />}
                                    endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    onClick={() => setShowFilters(!showFilters)}
                                    variant="outlined"
                                    sx={{
                                        borderColor: '#5c6bc0',
                                        color: '#5c6bc0',
                                        '&:hover': {
                                            borderColor: '#26418f',
                                            bgcolor: 'rgba(92, 107, 192, 0.04)',
                                        },
                                    }}
                                >
                                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                                </Button>
                                {(Object.values(localFilters).some((v) => v) || searchQuery) && (
                                    <Button variant="text" color="error" onClick={clearFilters} size="small">
                                        Clear All
                                    </Button>
                                )}
                            </Box>

                            <Collapse in={showFilters}>
                                <Box
                                    sx={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 2,
                                        p: 3,
                                        mt: 2,
                                        bgcolor: 'rgba(92, 107, 192, 0.02)',
                                    }}
                                >
                                    <Grid container spacing={3} alignItems="flex-end">
                                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                                            <FormControl fullWidth>
                                                <InputLabel>Specialty</InputLabel>
                                                <Select
                                                    value={localFilters.specialty || ''}
                                                    label="Specialty"
                                                    onChange={(e) => handleFilterChange('specialty', e.target.value)}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': {
                                                                borderColor: '#5c6bc0',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#5c6bc0',
                                                            },
                                                        },
                                                    }}
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
                                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                                            <FormControl fullWidth>
                                                <InputLabel>City</InputLabel>
                                                <Select
                                                    value={localFilters.city || ''}
                                                    label="City"
                                                    onChange={(e) => handleFilterChange('city', e.target.value)}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': {
                                                                borderColor: '#5c6bc0',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#5c6bc0',
                                                            },
                                                        },
                                                    }}
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
                                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                                            <FormControl fullWidth>
                                                <InputLabel>Gender</InputLabel>
                                                <Select
                                                    value={localFilters.gender || ''}
                                                    label="Gender"
                                                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': {
                                                                borderColor: '#5c6bc0',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#5c6bc0',
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <MenuItem value="">All Genders</MenuItem>
                                                    <MenuItem value="male">👨 Male</MenuItem>
                                                    <MenuItem value="female">👩 Female</MenuItem>
                                                    <MenuItem value="other">Other</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                                            <FormControl fullWidth>
                                                <InputLabel>Experience (Years)</InputLabel>
                                                <Select
                                                    value={localFilters.experience || ''}
                                                    label="Experience (Years)"
                                                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': {
                                                                borderColor: '#5c6bc0',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#5c6bc0',
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <MenuItem value="">All Experience Levels</MenuItem>
                                                    <MenuItem value="0-2">0-2 years</MenuItem>
                                                    <MenuItem value="3-5">3-5 years</MenuItem>
                                                    <MenuItem value="6-10">6-10 years</MenuItem>
                                                    <MenuItem value="11-15">11-15 years</MenuItem>
                                                    <MenuItem value="16-20">16-20 years</MenuItem>
                                                    <MenuItem value="20+">20+ years</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Box
                                        sx={{
                                            mt: 3,
                                            display: 'flex',
                                            gap: 2,
                                            justifyContent: 'flex-end',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Button
                                            onClick={clearFilters}
                                            variant="outlined"
                                            sx={{
                                                borderColor: '#e0e0e0',
                                                color: 'text.secondary',
                                                '&:hover': {
                                                    borderColor: '#5c6bc0',
                                                    bgcolor: 'rgba(92, 107, 192, 0.04)',
                                                    color: '#5c6bc0',
                                                },
                                            }}
                                        >
                                            Clear Filters
                                        </Button>
                                        <Button
                                            onClick={applyFilters}
                                            variant="contained"
                                            sx={{
                                                bgcolor: '#5c6bc0',
                                                color: 'white',
                                                px: 3,
                                                py: 1,
                                                fontWeight: 600,
                                                '&:hover': {
                                                    bgcolor: '#26418f',
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: '0 4px 12px rgba(92, 107, 192, 0.3)',
                                                },
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

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h3" fontWeight="bold" color="#5c6bc0" mb={1}>
                                    {providers.total}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Providers
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h3" fontWeight="bold" color="success.main" mb={1}>
                                    {filteredSpecialties}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Specialties
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h3" fontWeight="bold" color="info.main" mb={1}>
                                    {filteredCities}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Cities
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {providers.data.length > 0 ? (
                    <>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {providers.data.map((provider) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={provider.id}>
                                    <ProviderCard provider={provider} />
                                </Grid>
                            ))}
                        </Grid>

                        {providers.last_page > 1 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mt: 4,
                                    mb: 2,
                                    gap: 2,
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    Showing {providers.from || 0}-{providers.to || 0} of {providers.total} providers
                                </Typography>
                                <Pagination
                                    count={providers.last_page}
                                    page={providers.current_page}
                                    onChange={(_event, page) => handlePageChange(page)}
                                    size="large"
                                    shape="rounded"
                                    showFirstButton
                                    showLastButton
                                    sx={{
                                        color: '#5c6bc0',
                                        '& .MuiPaginationItem-root': {
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            minWidth: 40,
                                            height: 40,
                                            border: '1px solid #e0e0e0',
                                            '&:hover': {
                                                bgcolor: '#5c6bc0',
                                                color: 'white',
                                                transform: 'scale(1.05)',
                                                boxShadow: '0 4px 8px rgba(92, 107, 192, 0.3)',
                                            },
                                            '&.Mui-selected': {
                                                bgcolor: '#5c6bc0',
                                                color: 'white',
                                                boxShadow: '0 4px 12px rgba(92, 107, 192, 0.4)',
                                                '&:hover': {
                                                    bgcolor: '#26418f',
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
                                {search || Object.values(localFilters).some((v) => v)
                                    ? 'Try adjusting your search criteria or filters.'
                                    : 'No healthcare providers are currently available.'}
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </AppLayout>
    );
}
