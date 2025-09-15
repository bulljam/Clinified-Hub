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
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Divider,
} from '@mui/material';
import {
    People as PeopleIcon,
    Person as PersonIcon,
    Search as SearchIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    FilterAlt as FilterIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Event as EventIcon,
    Cake as CakeIcon,
    PersonAdd as PersonAddIcon,
    CheckCircle as CheckCircleIcon,
    Visibility as VisibilityIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Patient {
    id: number;
    name: string;
    email: string;
    photo?: string;
    gender?: string;
    city?: string;
    date_of_birth?: string;
    phone?: string;
    created_at: string;
    appointments_count: number;
    age?: number;
}

interface PatientsProps {
    patients: Patient[];
    userRole: string;
    cities: string[];
    filters: {
        gender?: string;
        city?: string;
        min_age?: number;
        max_age?: number;
        min_appointments?: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Patients',
        href: '/patients',
    },
];

export default function Patients({ patients, userRole, cities, filters }: PatientsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    const [localFilters, setLocalFilters] = useState(filters);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');

    const searchFilteredPatients = patients.filter(patient => {
        if (searchQuery && !(
            patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (patient.city && patient.city.toLowerCase().includes(searchQuery.toLowerCase()))
        )) {
            return false;
        }
        return true;
    });

    const handleFilterChange = (key: string, value: string | number) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value || undefined
        }));
    };

    const applyFilters = () => {
        const filterParams: Record<string, string> = {};
        Object.entries(localFilters).forEach(([key, value]) => {
            if (value) filterParams[key] = value.toString();
        });
        
        router.get('/patients', filterParams, {
            preserveState: true,
            preserveScroll: true,
            only: ['patients', 'filters']
        });
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get('/patients', {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['patients', 'filters']
        });
    };

    const handleViewPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setOpenViewModal(true);
    };

    const handleDeletePatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setOpenDeleteDialog(true);
    };

    const confirmDeletePatient = () => {
        if (selectedPatient && deleteReason.trim()) {
            router.delete(`/patients/${selectedPatient.id}`, {
                data: { reason: deleteReason },
                onSuccess: () => {
                    setOpenDeleteDialog(false);
                    setDeleteReason('');
                    setSelectedPatient(null);
                },
                onError: (errors) => {
                    console.error('Delete failed:', errors);
                },
            });
        }
    };

    const getPageDescription = () => {
        switch (userRole) {
            case 'admin':
            case 'super_admin':
                return 'Manage and view all patients in the system';
            case 'provider':
                return 'View patients you have treated and provided care for';
            default:
                return 'Patient information';
        }
    };

    const getGenderIcon = (gender?: string) => {
        switch (gender) {
            case 'male': return '👨';
            case 'female': return '👩';
            case 'other': return '';
            default: return '👤';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients" />
            <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh', bgcolor: '#fafafa' }}>
                {/* Header Section */}
                <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: '#5c6bc0', width: 56, height: 56 }}>
                                    <PeopleIcon sx={{ fontSize: 28 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" component="h1" fontWeight="bold" color="#5c6bc0">
                                        {userRole === 'provider' ? 'My Patients' : 'Patients'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {getPageDescription()}
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
                                placeholder="Search patients by name, email, or city..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#5c6bc0' }} />
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
                            
                            {/* Filter Toggle */}
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
                                    {showFilters ? 'Hide Filters' : 'Advanced Filters'}
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
                                    <Box sx={{ 
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                                        gap: 3
                                    }}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel shrink>Gender</InputLabel>
                                            <Select
                                                value={localFilters.gender || ''}
                                                label="Gender"
                                                onChange={(e) => handleFilterChange('gender', e.target.value)}
                                                displayEmpty
                                                sx={{ minHeight: 56 }}
                                            >
                                                <MenuItem value="">All Genders</MenuItem>
                                                <MenuItem value="male">👨 Male</MenuItem>
                                                <MenuItem value="female">👩 Female</MenuItem>
                                                <MenuItem value="other">Other</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel shrink>City</InputLabel>
                                            <Select
                                                value={localFilters.city || ''}
                                                label="City"
                                                onChange={(e) => handleFilterChange('city', e.target.value)}
                                                displayEmpty
                                                sx={{ minHeight: 56 }}
                                            >
                                                <MenuItem value="">All Cities</MenuItem>
                                                {cities.map((city) => (
                                                    <MenuItem key={city} value={city}>
                                                        {city}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            fullWidth
                                            label="Min Age"
                                            type="number"
                                            value={localFilters.min_age || ''}
                                            onChange={(e) => handleFilterChange('min_age', parseInt(e.target.value))}
                                            InputProps={{ inputProps: { min: 0, max: 120 } }}
                                            variant="outlined"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Max Age"
                                            type="number"
                                            value={localFilters.max_age || ''}
                                            onChange={(e) => handleFilterChange('max_age', parseInt(e.target.value))}
                                            InputProps={{ inputProps: { min: 0, max: 120 } }}
                                            variant="outlined"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <Box sx={{ gridColumn: { xs: '1', md: '1 / 3' } }}>
                                            <TextField
                                                fullWidth
                                                label="Min Appointments"
                                                type="number"
                                                value={localFilters.min_appointments || ''}
                                                onChange={(e) => handleFilterChange('min_appointments', parseInt(e.target.value))}
                                                InputProps={{ inputProps: { min: 0 } }}
                                                variant="outlined"
                                                InputLabelProps={{ shrink: true }}
                                                helperText="Minimum number of appointments"
                                            />
                                        </Box>
                                    </Box>
                                    <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <Button onClick={clearFilters} variant="outlined">
                                            Clear
                                        </Button>
                                        <Button
                                            onClick={applyFilters}
                                            variant="contained"
                                            sx={{
                                                bgcolor: '#5c6bc0',
                                                '&:hover': { bgcolor: '#26418f' },
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
                            <Typography variant="h3" fontWeight="bold" color="#5c6bc0" mb={1}>
                                {searchFilteredPatients.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {searchQuery || Object.values(localFilters).some(v => v) ? 'Matching Patients' : userRole === 'provider' ? 'My Patients' : 'Total Patients'}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold" color="success.main" mb={1}>
                                {searchFilteredPatients.reduce((sum, patient) => sum + patient.appointments_count, 0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {searchQuery || Object.values(localFilters).some(v => v) ? 'Filtered Appointments' : 'Total Appointments'}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold" color="info.main" mb={1}>
                                {[...new Set(searchFilteredPatients.map(patient => patient.city).filter(city => city))].length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {searchQuery || Object.values(localFilters).some(v => v) ? 'Filtered Cities' : 'Cities'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Patients Table */}
                {searchFilteredPatients.length > 0 ? (
                    <>
                        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                            <TableContainer sx={{ 
                                overflowX: 'auto',
                                width: '100%',
                                '&::-webkit-scrollbar': {
                                    height: 8,
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: '#f1f1f1',
                                    borderRadius: 4,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: '#5c6bc0',
                                    borderRadius: 4,
                                    '&:hover': {
                                        backgroundColor: '#26418f',
                                    },
                                }
                            }}>
                                <Table sx={{ minWidth: 1000 }}>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#5c6bc0' }}>
                                            <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 250 }}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <PersonIcon fontSize="small" />
                                                    Patient Details
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 200 }}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <EmailIcon fontSize="small" />
                                                    Contact
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 150 }}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <LocationIcon fontSize="small" />
                                                    Location
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 120 }}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <CakeIcon fontSize="small" />
                                                    Age
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 140 }}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <EventIcon fontSize="small" />
                                                    Appointments
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 140 }}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <PersonAddIcon fontSize="small" />
                                                    Registration
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 100 }}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <CheckCircleIcon fontSize="small" />
                                                    Status
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 120 }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {searchFilteredPatients.map((patient, index) => (
                                            <Fade in={true} timeout={300 + index * 50} key={patient.id}>
                                                <TableRow 
                                                    hover
                                                    sx={{
                                                        '&:hover': {
                                                            bgcolor: 'rgba(92, 107, 192, 0.08)',
                                                            transition: 'background-color 0.2s ease',
                                                        },
                                                        '&:nth-of-type(even)': {
                                                            bgcolor: '#fafafa',
                                                        },
                                                        '&:nth-of-type(odd)': {
                                                            bgcolor: 'white',
                                                        },
                                                        borderBottom: '1px solid #f0f0f0',
                                                    }}
                                                >
                                                    <TableCell sx={{ py: 3 }}>
                                                        <Box display="flex" alignItems="center" gap={2}>
                                                            {patient.photo ? (
                                                                <Avatar 
                                                                    src={`/storage/${patient.photo}`}
                                                                    sx={{ 
                                                                        width: 50, 
                                                                        height: 50,
                                                                        border: '2px solid #5c6bc0',
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Avatar sx={{ 
                                                                    bgcolor: '#4caf50', 
                                                                    width: 50, 
                                                                    height: 50,
                                                                    fontSize: '1.2rem',
                                                                    fontWeight: 'bold'
                                                                }}>
                                                                    {patient.name.charAt(0)}
                                                                </Avatar>
                                                            )}
                                                            <Box>
                                                                <Typography variant="body1" fontWeight="600" color="text.primary">
                                                                    {patient.name}
                                                                </Typography>
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        ID: #{patient.id}
                                                                    </Typography>
                                                                    {patient.gender && (
                                                                        <Chip
                                                                            label={`${getGenderIcon(patient.gender)} ${patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}`}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{
                                                                                height: 20,
                                                                                fontSize: '0.7rem',
                                                                                borderColor: '#5c6bc0',
                                                                                color: '#5c6bc0',
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ py: 3 }}>
                                                        <Typography variant="body2" fontWeight="500" mb={0.5}>
                                                            {patient.email}
                                                        </Typography>
                                                        {patient.phone && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                📞 {patient.phone}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell sx={{ py: 3 }}>
                                                        <Typography variant="body2">
                                                            {patient.city || 'Not specified'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ py: 3 }}>
                                                        <Typography variant="body2" fontWeight="500">
                                                            {patient.age !== null && patient.age !== undefined ? `${patient.age} years` : 'N/A'}
                                                        </Typography>
                                                        {patient.date_of_birth && (
                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                {dayjs(patient.date_of_birth).format('MMM D, YYYY')}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell sx={{ py: 3 }}>
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Chip
                                                                label={patient.appointments_count}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: patient.appointments_count > 0 ? '#5c6bc0' : 'grey.300',
                                                                    color: patient.appointments_count > 0 ? 'white' : 'grey.600',
                                                                    fontWeight: 600,
                                                                    minWidth: 40,
                                                                }}
                                                            />
                                                            <Typography variant="caption" color="text.secondary">
                                                                visits
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ py: 3 }}>
                                                        <Typography variant="body2" fontWeight="500">
                                                            {dayjs(patient.created_at).format('MMM D, YYYY')}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {dayjs(patient.created_at).fromNow()}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ py: 3 }}>
                                                        <Chip
                                                            label={patient.appointments_count > 0 ? "Active" : "Idle"}
                                                            color={patient.appointments_count > 0 ? "success" : "default"}
                                                            size="small"
                                                            sx={{ 
                                                                fontWeight: 600,
                                                                minWidth: 70,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ py: 3 }}>
                                                        <Box display="flex" gap={1}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleViewPatient(patient)}
                                                                sx={{
                                                                    color: '#5c6bc0',
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(92, 107, 192, 0.1)',
                                                                    },
                                                                }}
                                                            >
                                                                <VisibilityIcon fontSize="small" />
                                                            </IconButton>
                                                            {(userRole === 'admin' || userRole === 'super_admin') && (
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleDeletePatient(patient)}
                                                                    sx={{
                                                                        color: 'error.main',
                                                                        '&:hover': {
                                                                            bgcolor: 'rgba(211, 47, 47, 0.1)',
                                                                        },
                                                                    }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            </Fade>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>
                    </>
                ) : (
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ textAlign: 'center', py: 8 }}>
                            <Avatar sx={{ bgcolor: 'grey.100', width: 80, height: 80, mx: 'auto', mb: 3 }}>
                                <PeopleIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                            </Avatar>
                            <Typography variant="h6" fontWeight="600" color="text.primary" mb={1}>
                                No Patients Found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {searchQuery || Object.values(localFilters).some(v => v)
                                    ? 'Try adjusting your search criteria or filters.' 
                                    : userRole === 'provider' 
                                    ? 'You haven\'t treated any patients yet.' 
                                    : 'No patients are currently registered in the system.'
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                )}

                {/* Patient View Modal */}
                <Dialog
                    open={openViewModal}
                    onClose={() => setOpenViewModal(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{ bgcolor: '#5c6bc0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <PersonIcon />
                            Patient Information
                        </Box>
                        <IconButton onClick={() => setOpenViewModal(false)} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: 0 }}>
                        {selectedPatient && (
                            <Box>
                                {/* Header Section with Avatar and Status */}
                                <Box sx={{ bgcolor: 'rgba(92, 107, 192, 0.05)', p: 4, textAlign: 'center' }}>
                                    {selectedPatient.photo ? (
                                        <Avatar 
                                            src={`/storage/${selectedPatient.photo}`}
                                            sx={{ width: 100, height: 100, mx: 'auto', mb: 2, border: '3px solid #5c6bc0' }}
                                        />
                                    ) : (
                                        <Avatar sx={{ 
                                            bgcolor: '#4caf50', 
                                            width: 100, 
                                            height: 100,
                                            fontSize: '2rem',
                                            fontWeight: 'bold',
                                            mx: 'auto',
                                            mb: 2
                                        }}>
                                            {selectedPatient.name.charAt(0)}
                                        </Avatar>
                                    )}
                                    <Typography variant="h4" fontWeight="bold" mb={1}>
                                        {selectedPatient.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        Patient ID: #{selectedPatient.id}
                                    </Typography>
                                    <Chip
                                        label={selectedPatient.appointments_count > 0 ? "Active Patient" : "Idle Patient"}
                                        color={selectedPatient.appointments_count > 0 ? "success" : "default"}
                                        sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                                        size="medium"
                                    />
                                </Box>

                                {/* Details Section */}
                                <Box sx={{ p: 4 }}>
                                    <Box sx={{ 
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                        gap: 4,
                                        mb: 4
                                    }}>
                                        {/* Contact Information */}
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" mb={2} color="#5c6bc0">
                                                Contact Information
                                            </Typography>
                                            <Stack spacing={2}>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                                                        <EmailIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                                        Email Address
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="500">
                                                        {selectedPatient.email}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                                                        <PhoneIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                                        Phone Number
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="500">
                                                        {selectedPatient.phone || 'Not provided'}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                                                        <LocationIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                                        City
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="500">
                                                        {selectedPatient.city || 'Not specified'}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>

                                        {/* Personal Information */}
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" mb={2} color="#5c6bc0">
                                                Personal Information
                                            </Typography>
                                            <Stack spacing={2}>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                                                        <PersonIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                                        Gender
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="500">
                                                        {selectedPatient.gender ? `${getGenderIcon(selectedPatient.gender)} ${selectedPatient.gender.charAt(0).toUpperCase() + selectedPatient.gender.slice(1)}` : 'Not specified'}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                                                        <CakeIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                                        Age
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="500">
                                                        {selectedPatient.age !== null && selectedPatient.age !== undefined ? `${selectedPatient.age} years old` : 'Not available'}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                                                        Date of Birth
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="500">
                                                        {selectedPatient.date_of_birth ? dayjs(selectedPatient.date_of_birth).format('MMMM D, YYYY') : 'Not provided'}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </Box>

                                    {/* Medical Summary */}
                                    <Box>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="h6" fontWeight="bold" mb={2} color="#5c6bc0">
                                            Medical Summary
                                        </Typography>
                                        <Box sx={{
                                            display: 'grid',
                                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                                            gap: 3
                                        }}>
                                            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(92, 107, 192, 0.05)' }}>
                                                <EventIcon sx={{ fontSize: 40, color: '#5c6bc0', mb: 1 }} />
                                                <Typography variant="h4" fontWeight="bold" color="#5c6bc0">
                                                    {selectedPatient.appointments_count}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Total Appointments
                                                </Typography>
                                            </Card>
                                            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(76, 175, 80, 0.05)' }}>
                                                <PersonAddIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                                                <Typography variant="h6" fontWeight="bold" color="success.main">
                                                    {dayjs(selectedPatient.created_at).format('MMM YYYY')}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Member Since
                                                </Typography>
                                            </Card>
                                            <Card sx={{ p: 2, textAlign: 'center', bgcolor: selectedPatient.appointments_count > 0 ? 'rgba(76, 175, 80, 0.05)' : 'rgba(158, 158, 158, 0.05)' }}>
                                                <CheckCircleIcon sx={{ fontSize: 40, color: selectedPatient.appointments_count > 0 ? 'success.main' : 'text.secondary', mb: 1 }} />
                                                <Typography variant="h6" fontWeight="bold" color={selectedPatient.appointments_count > 0 ? 'success.main' : 'text.secondary'}>
                                                    {selectedPatient.appointments_count > 0 ? 'Active' : 'Idle'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Patient Status
                                                </Typography>
                                            </Card>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button
                            onClick={() => setOpenViewModal(false)}
                            variant="contained"
                            sx={{
                                bgcolor: '#5c6bc0',
                                '&:hover': { bgcolor: '#26418f' },
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DeleteIcon />
                        Delete Patient
                    </DialogTitle>
                    <DialogContent>
                        {selectedPatient && (
                            <Box>
                                <Typography variant="body1" mb={3}>
                                    Are you sure you want to delete <strong>{selectedPatient.name}</strong>? This action cannot be undone.
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Reason for deletion (required)"
                                    value={deleteReason}
                                    onChange={(e) => setDeleteReason(e.target.value)}
                                    placeholder="Please provide a reason for deleting this patient (e.g., duplicate record, patient request, data cleanup, etc.)"
                                    required
                                    error={deleteReason.length > 0 && deleteReason.trim().length < 10}
                                    helperText={
                                        deleteReason.length > 0 && deleteReason.trim().length < 10
                                            ? `Minimum 10 characters required (${deleteReason.trim().length}/10)`
                                            : deleteReason.trim().length >= 10
                                            ? `✓ Valid reason (${deleteReason.trim().length}/1000)`
                                            : 'Minimum 10 characters required'
                                    }
                                    sx={{ mb: 2 }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    Note: This will permanently remove the patient and all associated appointment history from the system.
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button
                            onClick={() => {
                                setOpenDeleteDialog(false);
                                setDeleteReason('');
                            }}
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDeletePatient}
                            variant="contained"
                            color="error"
                            disabled={deleteReason.trim().length < 10}
                        >
                            Delete Patient
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AppLayout>
    );
}