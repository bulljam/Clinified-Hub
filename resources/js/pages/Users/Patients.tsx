import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Fade,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Stack,
    InputAdornment,
    TextField,
} from '@mui/material';
import {
    People as PeopleIcon,
    Person as PersonIcon,
    Search as SearchIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import dayjs from 'dayjs';

interface User {
    id: number;
    name: string;
    email: string;
    photo?: string;
    created_at: string;
}

interface PatientsProps {
    patients: User[];
    userRole: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Patients',
        href: '/patients',
    },
];

export default function Patients({ patients, userRole }: PatientsProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 8;

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients" />
            <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh', bgcolor: '#fafafa' }}>
                {/* Header Section */}
                <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: '#20a09f', width: 56, height: 56 }}>
                                    <PeopleIcon sx={{ fontSize: 28 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" component="h1" fontWeight="bold" color="#20a09f">
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

                {/* Search Section */}
                <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 3 }}>
                        <TextField
                            fullWidth
                            placeholder="Search patients by name or email..."
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
                    </CardContent>
                </Card>

                {/* Statistics */}
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)' }} gap={3} mb={4}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold" color="#20a09f" mb={1}>
                                {filteredPatients.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {searchQuery ? 'Matching Patients' : userRole === 'provider' ? 'My Patients' : 'Total Patients'}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold" color="success.main" mb={1}>
                                {patients.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Active Patients
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Patients Table */}
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
                            backgroundColor: '#20a09f',
                            borderRadius: 4,
                            '&:hover': {
                                backgroundColor: '#178f8e',
                            },
                        }
                    }}>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#20a09f' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 250 }}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <PersonIcon fontSize="small" />
                                            Patient Details
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 200 }}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <EmailIcon fontSize="small" />
                                            Contact Information
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 150 }}>
                                        Registration Date
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 100 }}>
                                        Status
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedPatients.map((patient, index) => (
                                    <Fade in={true} timeout={300 + index * 100} key={patient.id}>
                                        <TableRow 
                                            hover
                                            sx={{
                                                '&:hover': {
                                                    bgcolor: 'rgba(32, 160, 159, 0.08)',
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
                                            <TableCell sx={{ py: 3, minWidth: 250 }}>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    {patient.photo ? (
                                                        <Avatar 
                                                            src={`/storage/${patient.photo}`}
                                                            sx={{ 
                                                                width: 40, 
                                                                height: 40,
                                                                border: '1px solid #20a09f',
                                                            }}
                                                        />
                                                    ) : (
                                                        <Avatar sx={{ 
                                                            bgcolor: '#4caf50', 
                                                            width: 40, 
                                                            height: 40,
                                                            fontSize: '1.1rem',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {patient.name.charAt(0)}
                                                        </Avatar>
                                                    )}
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="600" color="text.primary">
                                                            {patient.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Patient ID: #{patient.id}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ py: 3, minWidth: 200 }}>
                                                <Typography variant="body2" fontWeight="500">
                                                    {patient.email}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ py: 3, minWidth: 150 }}>
                                                <Typography variant="body2">
                                                    {dayjs(patient.created_at).format('MMM D, YYYY')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ py: 3, minWidth: 100 }}>
                                                <Chip
                                                    label="Active"
                                                    color="success"
                                                    size="small"
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        minWidth: 70,
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </Fade>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
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
                                Showing {startIndex + 1}-{Math.min(endIndex, filteredPatients.length)} of {filteredPatients.length} patients
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
                </Card>

                {filteredPatients.length === 0 && (
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ textAlign: 'center', py: 8 }}>
                            <Avatar sx={{ bgcolor: 'grey.100', width: 80, height: 80, mx: 'auto', mb: 3 }}>
                                <PeopleIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                            </Avatar>
                            <Typography variant="h6" fontWeight="600" color="text.primary" mb={1}>
                                No Patients Found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {searchQuery 
                                    ? 'Try adjusting your search criteria.' 
                                    : userRole === 'provider' 
                                    ? 'You haven\'t treated any patients yet.' 
                                    : 'No patients are currently registered in the system.'
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </AppLayout>
    );
}