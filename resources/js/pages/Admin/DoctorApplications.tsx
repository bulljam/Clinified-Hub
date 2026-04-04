import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    CheckCircle as ApproveIcon,
    LocalHospital as MedicalIcon,
    Preview as PreviewIcon,
    Cancel as RejectIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    IconButton,
    Pagination,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';

interface DoctorApplication {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    gender: string | null;
    bio: string | null;
    specialty: string;
    license_number: string;
    years_of_experience: number;
    office_address: string | null;
    credentials: string | string[] | null;
    photo: string | null;
    status: 'pending' | 'approved' | 'rejected';
    rejection_reason: string | null;
    created_at: string;
    reviewed_at: string | null;
    user: {
        id: number;
        name: string;
        email: string;
    };
    reviewer: {
        id: number;
        name: string;
        email: string;
    } | null;
}

interface Props {
    applications: DoctorApplication[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '#',
    },
    {
        title: 'Doctor Applications',
        href: '/admin/doctor-applications',
    },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'approved':
            return 'success';
        case 'rejected':
            return 'error';
        default:
            return 'default';
    }
};

const parseCredentials = (credentials: string | string[] | null): string[] => {
    if (!credentials) return [];
    if (Array.isArray(credentials)) return credentials;

    try {
        const parsed = JSON.parse(credentials);
        if (typeof parsed === 'object' && parsed !== null) {
            if (Array.isArray(parsed)) {
                return parsed;
            }
            return Object.entries(parsed).map(([key, value]) => `${key}: ${value}`);
        }
        return [];
    } catch {
        return [credentials];
    }
};

const isFilePath = (str: string): boolean => {
    return (
        str.includes('/') &&
        (str.endsWith('.pdf') ||
            str.endsWith('.jpg') ||
            str.endsWith('.jpeg') ||
            str.endsWith('.png') ||
            str.endsWith('.doc') ||
            str.endsWith('.docx'))
    );
};

const getFileName = (filePath: string, index: number): string => {
    const extension = filePath.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'pdf':
            return `Medical Certificate ${index + 1}`;
        case 'jpg':
        case 'jpeg':
        case 'png':
            return `Medical License Image ${index + 1}`;
        case 'doc':
        case 'docx':
            return `Medical Document ${index + 1}`;
        default:
            return `Credential Document ${index + 1}`;
    }
};

const previewFile = (applicationId: number, filePath: string): void => {
    const filename = filePath.split('/').pop();

    if (!filename) {
        return;
    }

    window.open(`/admin/doctor-applications/${applicationId}/credential/${encodeURIComponent(filename)}`, '_blank');
};

export default function DoctorApplications({ applications }: Props) {
    const [viewingApplication, setViewingApplication] = useState<DoctorApplication | null>(null);
    const [rejectingApplication, setRejectingApplication] = useState<DoctorApplication | null>(null);
    const [approvingApplication, setApprovingApplication] = useState<DoctorApplication | null>(null);
    const [isApproving, setIsApproving] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const { data, setData, post, processing, errors, reset } = useForm({
        rejection_reason: '',
    });

    const handleApprove = (application: DoctorApplication) => {
        setApprovingApplication(application);
        setIsApproving(false);
    };

    const confirmApproval = () => {
        if (approvingApplication && !isApproving) {
            setIsApproving(true);
            router.post(
                `/admin/doctor-applications/${approvingApplication.id}/approve`,
                {},
                {
                    onSuccess: () => {
                        setIsApproving(false);
                        setApprovingApplication(null);
                    },
                    onError: () => {
                        setIsApproving(false);
                    },
                },
            );
        }
    };

    const handleReject = () => {
        if (rejectingApplication) {
            post(`/admin/doctor-applications/${rejectingApplication.id}/reject`, {
                onSuccess: () => {
                    setRejectingApplication(null);
                    reset();
                },
            });
        }
    };

    const handlePhotoPreview = (photoPath: string) => {
        window.open(`/storage/${photoPath}`, '_blank');
    };

    const totalPages = Math.ceil(applications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedApplications = applications.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Doctor Applications" />
            <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh', bgcolor: '#fafafa' }}>
                <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: '#5c6bc0', width: 56, height: 56 }}>
                                <MedicalIcon sx={{ fontSize: 28 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" component="h1" fontWeight="bold" color="#5c6bc0">
                                    Doctor Applications
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Review and manage pending doctor applications
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3, 1fr)' }} gap={3} mb={4}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold" color="warning.main" mb={1}>
                                {applications.filter((app) => app.status === 'pending').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Pending Review
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold" color="success.main" mb={1}>
                                {applications.filter((app) => app.status === 'approved').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Approved
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold" color="error.main" mb={1}>
                                {applications.filter((app) => app.status === 'rejected').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Rejected
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <TableContainer
                        sx={{
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
                            },
                        }}
                    >
                        <Table sx={{ minWidth: 1200 }}>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#5c6bc0' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 200 }}>Doctor Details</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 150 }}>Specialty</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 120 }}>Experience</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 120 }}>Status</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 150 }}>Applied Date</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 200 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedApplications.map((application, index) => (
                                    <Fade in={true} timeout={300 + index * 100} key={application.id}>
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
                                            <TableCell sx={{ py: 3, minWidth: 200 }}>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    {application.photo ? (
                                                        <Avatar
                                                            src={`${window.location.origin}/storage/${application.photo}`}
                                                            sx={{
                                                                width: 40,
                                                                height: 40,
                                                                border: '1px solid #5c6bc0',
                                                                cursor: 'pointer',
                                                                '&:hover': {
                                                                    opacity: 0.8,
                                                                    transform: 'scale(1.05)',
                                                                },
                                                                transition: 'all 0.2s ease-in-out',
                                                            }}
                                                            onClick={() => handlePhotoPreview(application.photo!)}
                                                        />
                                                    ) : (
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: '#5c6bc0',
                                                                width: 40,
                                                                height: 40,
                                                                fontSize: '1.1rem',
                                                                fontWeight: 'bold',
                                                            }}
                                                        >
                                                            {application.full_name.charAt(0)}
                                                        </Avatar>
                                                    )}
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="600" color="text.primary">
                                                            {application.full_name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {application.email}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                            License: {application.license_number}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ py: 3, minWidth: 150 }}>
                                                <Typography variant="body2" fontWeight="500">
                                                    {application.specialty}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ py: 3, minWidth: 120 }}>
                                                <Typography variant="body2">{application.years_of_experience} years</Typography>
                                            </TableCell>
                                            <TableCell sx={{ py: 3, minWidth: 120 }}>
                                                <Chip
                                                    label={application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                    color={getStatusColor(application.status)}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 600,
                                                        minWidth: 80,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ py: 3, minWidth: 150 }}>
                                                <Typography variant="body2">{dayjs(application.created_at).format('MMM D, YYYY')}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {dayjs(application.created_at).format('h:mm A')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ py: 3, minWidth: 200 }}>
                                                <Stack direction="row" spacing={1}>
                                                    <Tooltip title="View Details" arrow>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setViewingApplication(application)}
                                                            sx={{
                                                                bgcolor: '#5c6bc0',
                                                                color: 'white',
                                                                '&:hover': { bgcolor: '#26418f' },
                                                            }}
                                                        >
                                                            <ViewIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    {application.status === 'pending' && (
                                                        <>
                                                            <Tooltip title="Approve" arrow>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleApprove(application)}
                                                                    sx={{
                                                                        bgcolor: 'success.main',
                                                                        color: 'white',
                                                                        '&:hover': { bgcolor: 'success.dark' },
                                                                    }}
                                                                >
                                                                    <ApproveIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="Reject" arrow>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => setRejectingApplication(application)}
                                                                    sx={{
                                                                        bgcolor: 'error.main',
                                                                        color: 'white',
                                                                        '&:hover': { bgcolor: 'error.dark' },
                                                                    }}
                                                                >
                                                                    <RejectIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    </Fade>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {totalPages > 1 && (
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
                                Showing {startIndex + 1}-{Math.min(endIndex, applications.length)} of {applications.length} applications
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
                </Card>

                <Dialog open={!!viewingApplication} onClose={() => setViewingApplication(null)} maxWidth="lg" fullWidth>
                    <DialogTitle sx={{ pb: 1 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h5" fontWeight="bold">
                                Doctor Application Details
                            </Typography>
                            {viewingApplication && (
                                <Chip
                                    label={viewingApplication.status.charAt(0).toUpperCase() + viewingApplication.status.slice(1)}
                                    color={getStatusColor(viewingApplication.status)}
                                    sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                                />
                            )}
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        {viewingApplication &&
                            (() => {
                                const parsedCredentials = parseCredentials(viewingApplication.credentials);
                                return (
                                    <Stack spacing={4}>
                                        <Card elevation={0} sx={{ bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Box display="flex" alignItems="center" gap={3} mb={2}>
                                                    {viewingApplication.photo ? (
                                                        <Avatar
                                                            src={`${window.location.origin}/storage/${viewingApplication.photo}`}
                                                            sx={{
                                                                width: 64,
                                                                height: 64,
                                                                border: '2px solid #5c6bc0',
                                                                cursor: 'pointer',
                                                                '&:hover': {
                                                                    opacity: 0.8,
                                                                    transform: 'scale(1.05)',
                                                                },
                                                                transition: 'all 0.2s ease-in-out',
                                                            }}
                                                            onClick={() => handlePhotoPreview(viewingApplication.photo!)}
                                                        />
                                                    ) : (
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: '#5c6bc0',
                                                                width: 64,
                                                                height: 64,
                                                                fontSize: '1.5rem',
                                                                fontWeight: 'bold',
                                                            }}
                                                        >
                                                            {viewingApplication.full_name.charAt(0)}
                                                        </Avatar>
                                                    )}
                                                    <Box>
                                                        <Typography variant="h5" fontWeight="bold" color="#5c6bc0">
                                                            Dr. {viewingApplication.full_name}
                                                        </Typography>
                                                        <Typography variant="subtitle1" color="text.secondary">
                                                            {viewingApplication.specialty}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {viewingApplication.years_of_experience} years of experience
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2, border: '1px solid #e0e0e0' }}>
                                                    <Typography variant="subtitle2" fontWeight="600" mb={2}>
                                                        Application Timeline
                                                    </Typography>
                                                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                                                        <Typography variant="body2" color="text.secondary" minWidth="120px">
                                                            Submitted:
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="500">
                                                            {dayjs(viewingApplication.created_at).format('MMM D, YYYY [at] h:mm A')}
                                                        </Typography>
                                                    </Box>
                                                    {viewingApplication.reviewed_at && (
                                                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                                                            <Typography variant="body2" color="text.secondary" minWidth="120px">
                                                                Reviewed:
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight="500">
                                                                {dayjs(viewingApplication.reviewed_at).format('MMM D, YYYY [at] h:mm A')}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                    {viewingApplication.reviewer && (
                                                        <Box display="flex" alignItems="center" gap={2}>
                                                            <Typography variant="body2" color="text.secondary" minWidth="120px">
                                                                Reviewed by:
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight="500">
                                                                {viewingApplication.reviewer.name}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>

                                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Typography variant="h6" fontWeight="600" mb={3} color="#5c6bc0">
                                                    Contact Information
                                                </Typography>
                                                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap={3}>
                                                    <Box>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            fontWeight="600"
                                                            textTransform="uppercase"
                                                        >
                                                            Email Address
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="500">
                                                            {viewingApplication.email}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            fontWeight="600"
                                                            textTransform="uppercase"
                                                        >
                                                            Phone Number
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="500">
                                                            {viewingApplication.phone}
                                                        </Typography>
                                                    </Box>
                                                    {viewingApplication.gender && (
                                                        <Box>
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                                fontWeight="600"
                                                                textTransform="uppercase"
                                                            >
                                                                Gender
                                                            </Typography>
                                                            <Typography variant="body1" fontWeight="500">
                                                                {viewingApplication.gender === 'male'
                                                                    ? '👨 Male'
                                                                    : viewingApplication.gender === 'female'
                                                                      ? '👩 Female'
                                                                      : 'Other'}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>

                                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Typography variant="h6" fontWeight="600" mb={3} color="#5c6bc0">
                                                    Professional Details
                                                </Typography>
                                                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
                                                    <Box>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            fontWeight="600"
                                                            textTransform="uppercase"
                                                        >
                                                            Medical License Number
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="500">
                                                            {viewingApplication.license_number}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            fontWeight="600"
                                                            textTransform="uppercase"
                                                        >
                                                            Medical Specialty
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="500">
                                                            {viewingApplication.specialty}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {viewingApplication.office_address && (
                                                    <Box mt={3}>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            fontWeight="600"
                                                            textTransform="uppercase"
                                                        >
                                                            Office Address
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="500">
                                                            {viewingApplication.office_address}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {viewingApplication.bio && (
                                                    <Box mt={3}>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            fontWeight="600"
                                                            textTransform="uppercase"
                                                        >
                                                            Professional Bio
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="500" sx={{ mt: 1, lineHeight: 1.7 }}>
                                                            {viewingApplication.bio}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {parsedCredentials.length > 0 && (
                                            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                                                <CardContent sx={{ p: 3 }}>
                                                    <Typography variant="h6" fontWeight="600" mb={3} color="#5c6bc0">
                                                        Professional Credentials ({parsedCredentials.length})
                                                    </Typography>
                                                    <Stack spacing={2}>
                                                        {parsedCredentials.map((credential, index) =>
                                                            isFilePath(credential) ? (
                                                                <Button
                                                                    key={index}
                                                                    variant="outlined"
                                                                    startIcon={<PreviewIcon />}
                                                                    onClick={() => previewFile(viewingApplication.id, credential)}
                                                                    sx={{
                                                                        borderColor: '#5c6bc0',
                                                                        color: '#5c6bc0',
                                                                        fontWeight: 500,
                                                                        justifyContent: 'flex-start',
                                                                        px: 3,
                                                                        py: 2,
                                                                        textTransform: 'none',
                                                                        '&:hover': {
                                                                            borderColor: '#26418f',
                                                                            bgcolor: 'rgba(92, 107, 192, 0.04)',
                                                                        },
                                                                    }}
                                                                >
                                                                    {getFileName(credential, index)}
                                                                </Button>
                                                            ) : (
                                                                <Typography
                                                                    key={index}
                                                                    variant="body2"
                                                                    sx={{
                                                                        p: 2,
                                                                        border: '1px solid #e0e0e0',
                                                                        borderRadius: 1,
                                                                        bgcolor: '#f5f5f5',
                                                                    }}
                                                                >
                                                                    {credential}
                                                                </Typography>
                                                            ),
                                                        )}
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {viewingApplication.status === 'rejected' && viewingApplication.rejection_reason && (
                                            <Alert severity="error" sx={{ borderRadius: 2 }}>
                                                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                                                    Rejection Reason
                                                </Typography>
                                                <Typography variant="body2">{viewingApplication.rejection_reason}</Typography>
                                            </Alert>
                                        )}
                                    </Stack>
                                );
                            })()}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
                        <Button onClick={() => setViewingApplication(null)} variant="outlined" sx={{ px: 4 }}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={!!approvingApplication} onClose={isApproving ? undefined : () => setApprovingApplication(null)} maxWidth="sm" fullWidth>
                    <DialogTitle>Approve Doctor Application</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" gutterBottom>
                            Are you sure you want to approve this doctor application?
                        </Typography>
                        {approvingApplication && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                <Typography variant="subtitle2" fontWeight="600" color="#5c6bc0">
                                    Dr. {approvingApplication.full_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {approvingApplication.specialty} • {approvingApplication.years_of_experience} years experience
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    License: {approvingApplication.license_number}
                                </Typography>
                            </Box>
                        )}
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            This will:
                        </Typography>
                        <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                            <Typography component="li" variant="body2" color="text.secondary">
                                Grant the doctor access to the system as a healthcare provider
                            </Typography>
                            <Typography component="li" variant="body2" color="text.secondary">
                                Send them a temporary password via email
                            </Typography>
                            <Typography component="li" variant="body2" color="text.secondary">
                                Allow them to start managing appointments
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setApprovingApplication(null)} variant="outlined" disabled={isApproving} sx={{ px: 3 }}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={confirmApproval}
                            disabled={isApproving}
                            startIcon={isApproving ? <CircularProgress size={16} color="inherit" /> : null}
                            sx={{ px: 3, fontWeight: 600 }}
                        >
                            {isApproving ? 'Approving...' : 'Approve Application'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={!!rejectingApplication} onClose={() => setRejectingApplication(null)} maxWidth="sm" fullWidth>
                    <DialogTitle>Reject Application</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Please provide a reason for rejecting this application. The applicant will receive this message via email.
                        </Typography>

                        <TextField
                            label="Rejection Reason"
                            multiline
                            rows={4}
                            fullWidth
                            value={data.rejection_reason}
                            onChange={(e) => setData('rejection_reason', e.target.value)}
                            error={!!errors.rejection_reason}
                            helperText={errors.rejection_reason}
                            sx={{ mt: 2 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setRejectingApplication(null)}>Cancel</Button>
                        <Button variant="contained" color="error" onClick={handleReject} disabled={processing || !data.rejection_reason.trim()}>
                            {processing ? 'Rejecting...' : 'Reject Application'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AppLayout>
    );
}
