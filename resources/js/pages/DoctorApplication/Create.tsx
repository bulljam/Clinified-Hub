import { Link, router, useForm } from '@inertiajs/react';
import {
    Badge as BadgeIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
    AccessTime as ExperienceIcon,
    UploadFile as FileIcon,
    Home as HomeIcon,
    LocationOn as LocationIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    CameraAlt as PhotoIcon,
    School as SchoolIcon,
    LocalHospital as StethoscopeIcon,
    CloudUpload as UploadIcon,
    Work as WorkIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';

interface FormData {
    full_name: string;
    email: string;
    phone: string;
    gender: string;
    bio: string;
    specialty: string;
    license_number: string;
    years_of_experience: number;
    office_address: string;
    credentials: File[];
    photo: File | null;
}

const specialties = [
    'General Practice',
    'Internal Medicine',
    'Pediatrics',
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Gynecology',
    'Ophthalmology',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Anesthesiology',
    'Emergency Medicine',
    'Pathology',
    'Neurology',
    'Oncology',
];

export default function DoctorApplicationCreate() {
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        full_name: '',
        email: '',
        phone: '',
        gender: '',
        bio: '',
        specialty: '',
        license_number: '',
        years_of_experience: 0,
        office_address: '',
        credentials: [],
        photo: null,
    });

    const [fileInputKey, setFileInputKey] = useState(0);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            const currentFiles = Array.from(data.credentials);
            const newFiles = [...currentFiles, ...files].slice(0, 5);
            setData('credentials', newFiles);
        }
        event.target.value = '';
    };

    const removeFile = (index: number) => {
        const newFiles = data.credentials.filter((_, i) => i !== index);
        setData('credentials', newFiles);
        setFileInputKey((prev) => prev + 1);
    };

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setData('photo', file);
        }
    };

    const removePhoto = () => {
        setData('photo', null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/doctor-application', {
            onSuccess: () => {
                setShowSuccessToast(true);
                reset();
                setFileInputKey((prev) => prev + 1);

                setTimeout(() => {
                    router.visit('/');
                }, 3000);
            },
        });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 25%, #9fa8da 50%, #7986cb 75%, #5c6bc0 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '40%',
                    height: '40%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    animation: 'pulse 4s ease-in-out infinite',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-15%',
                    left: '-5%',
                    width: '30%',
                    height: '30%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                    animation: 'pulse 6s ease-in-out infinite reverse',
                },
                '@keyframes pulse': {
                    '0%, 100%': {
                        transform: 'scale(1)',
                        opacity: 0.7,
                    },
                    '50%': {
                        transform: 'scale(1.1)',
                        opacity: 0.9,
                    },
                },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-20px)' },
                    },
                }}
            >
                <StethoscopeIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.3)', transform: 'rotate(15deg)' }} />
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    right: '15%',
                    animation: 'float 4s ease-in-out infinite 1s',
                }}
            >
                <PersonIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.25)', transform: 'rotate(-10deg)' }} />
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '25%',
                    left: '10%',
                    animation: 'float 3.5s ease-in-out infinite 2s',
                }}
            >
                <BadgeIcon sx={{ fontSize: 50, color: 'rgba(255,255,255,0.2)', transform: 'rotate(20deg)' }} />
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '8%',
                    animation: 'float 4.5s ease-in-out infinite 0.5s',
                }}
            >
                <SchoolIcon sx={{ fontSize: 45, color: 'rgba(255,255,255,0.15)', transform: 'rotate(-15deg)' }} />
            </Box>

            <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
                <IconButton
                    component={Link}
                    href="/"
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        color: '#5c6bc0',
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 1)',
                            color: '#26418f',
                        },
                    }}
                    title="Go to Home"
                >
                    <HomeIcon />
                </IconButton>
            </Box>

            <Box sx={{ maxWidth: 900, mx: 'auto', p: 4, position: 'relative', zIndex: 1 }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        <Card
                            elevation={0}
                            sx={{
                                border: '1px solid rgba(255,255,255,0.3)',
                                bgcolor: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 3,
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box display="flex" alignItems="center" gap={2} mb={3}>
                                    <PersonIcon sx={{ color: '#5c6bc0' }} />
                                    <Typography variant="h6" fontWeight="600" color="#5c6bc0">
                                        Personal Information
                                    </Typography>
                                </Box>

                                <Stack spacing={3}>
                                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
                                        <TextField
                                            label="Full Name"
                                            value={data.full_name}
                                            onChange={(e) => setData('full_name', e.target.value)}
                                            fullWidth
                                            required
                                            error={!!errors.full_name}
                                            helperText={errors.full_name}
                                            slotProps={{
                                                input: {
                                                    startAdornment: <PersonIcon sx={{ color: '#5c6bc0', mr: 1 }} />,
                                                },
                                            }}
                                        />

                                        <TextField
                                            label="Email Address"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            fullWidth
                                            required
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            slotProps={{
                                                input: {
                                                    startAdornment: <EmailIcon sx={{ color: '#5c6bc0', mr: 1 }} />,
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
                                        <TextField
                                            label="Phone Number"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            fullWidth
                                            required
                                            error={!!errors.phone}
                                            helperText={errors.phone}
                                            slotProps={{
                                                input: {
                                                    startAdornment: <PhoneIcon sx={{ color: '#5c6bc0', mr: 1 }} />,
                                                },
                                            }}
                                        />

                                        <FormControl fullWidth error={!!errors.gender}>
                                            <InputLabel>Gender</InputLabel>
                                            <Select
                                                value={data.gender}
                                                label="Gender"
                                                onChange={(e) => setData('gender', e.target.value)}
                                                startAdornment={<PersonIcon sx={{ color: '#5c6bc0', mr: 1 }} />}
                                            >
                                                <MenuItem value="">Select Gender</MenuItem>
                                                <MenuItem value="male">👨 Male</MenuItem>
                                                <MenuItem value="female">👩 Female</MenuItem>
                                                <MenuItem value="other">Other</MenuItem>
                                            </Select>
                                            {errors.gender && (
                                                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                                    {errors.gender}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Box>

                                    <TextField
                                        label="Professional Bio"
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        error={!!errors.bio}
                                        helperText={errors.bio || 'Brief description of your medical background and expertise'}
                                        placeholder="Describe your medical background, areas of expertise, and approach to patient care..."
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <Box sx={{ alignSelf: 'flex-start', pt: 1 }}>
                                                        <PersonIcon sx={{ color: '#5c6bc0', mr: 1 }} />
                                                    </Box>
                                                ),
                                            },
                                        }}
                                    />

                                    <Box>
                                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                                            <PhotoIcon sx={{ color: '#5c6bc0' }} />
                                            <Typography variant="subtitle1" fontWeight="600">
                                                Profile Photo <span style={{ color: '#d32f2f' }}>*</span>
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" mb={2}>
                                            Upload a professional headshot (JPG, PNG - Max 2MB)
                                        </Typography>

                                        {data.photo ? (
                                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                                <Box
                                                    sx={{
                                                        width: 100,
                                                        height: 100,
                                                        borderRadius: 2,
                                                        overflow: 'hidden',
                                                        border: '2px solid #e0e0e0',
                                                    }}
                                                >
                                                    <img
                                                        src={URL.createObjectURL(data.photo)}
                                                        alt="Profile preview"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="500">
                                                        {data.photo.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {(data.photo.size / 1024 / 1024).toFixed(2)} MB
                                                    </Typography>
                                                    <Box mt={1}>
                                                        <Button size="small" color="error" onClick={removePhoto} startIcon={<DeleteIcon />}>
                                                            Remove Photo
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Button
                                                component="label"
                                                variant="outlined"
                                                startIcon={<UploadIcon />}
                                                sx={{
                                                    borderColor: '#5c6bc0',
                                                    color: '#5c6bc0',
                                                    '&:hover': {
                                                        borderColor: '#26418f',
                                                        bgcolor: 'rgba(92, 107, 192, 0.04)',
                                                    },
                                                }}
                                            >
                                                Upload Profile Photo
                                                <input type="file" hidden accept=".jpg,.jpeg,.png" onChange={handlePhotoUpload} />
                                            </Button>
                                        )}

                                        {errors.photo && (
                                            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                                {errors.photo}
                                            </Typography>
                                        )}
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card
                            elevation={0}
                            sx={{
                                border: '1px solid rgba(255,255,255,0.3)',
                                bgcolor: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 3,
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box display="flex" alignItems="center" gap={2} mb={3}>
                                    <WorkIcon sx={{ color: '#5c6bc0' }} />
                                    <Typography variant="h6" fontWeight="600" color="#5c6bc0">
                                        Professional Information
                                    </Typography>
                                </Box>

                                <Stack spacing={3}>
                                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
                                        <FormControl fullWidth required error={!!errors.specialty}>
                                            <InputLabel>Medical Specialty</InputLabel>
                                            <Select
                                                value={data.specialty}
                                                label="Medical Specialty"
                                                onChange={(e) => setData('specialty', e.target.value)}
                                                startAdornment={<SchoolIcon sx={{ color: '#5c6bc0', mr: 1 }} />}
                                            >
                                                {specialties.map((specialty) => (
                                                    <MenuItem key={specialty} value={specialty}>
                                                        {specialty}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.specialty && (
                                                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                                    {errors.specialty}
                                                </Typography>
                                            )}
                                        </FormControl>

                                        <TextField
                                            label="Medical License Number"
                                            value={data.license_number}
                                            onChange={(e) => setData('license_number', e.target.value)}
                                            fullWidth
                                            required
                                            error={!!errors.license_number}
                                            helperText={errors.license_number}
                                            slotProps={{
                                                input: {
                                                    startAdornment: <BadgeIcon sx={{ color: '#5c6bc0', mr: 1 }} />,
                                                },
                                            }}
                                        />
                                    </Box>

                                    <TextField
                                        label="Years of Experience"
                                        type="number"
                                        value={data.years_of_experience}
                                        onChange={(e) => setData('years_of_experience', parseInt(e.target.value) || 0)}
                                        fullWidth
                                        required
                                        slotProps={{
                                            htmlInput: { min: 0, max: 50 },
                                            input: {
                                                startAdornment: <ExperienceIcon sx={{ color: '#5c6bc0', mr: 1 }} />,
                                            },
                                        }}
                                        error={!!errors.years_of_experience}
                                        helperText={errors.years_of_experience}
                                        sx={{ maxWidth: { sm: '50%' } }}
                                    />

                                    <TextField
                                        label="Office Address"
                                        value={data.office_address}
                                        onChange={(e) => setData('office_address', e.target.value)}
                                        fullWidth
                                        required
                                        multiline
                                        rows={3}
                                        error={!!errors.office_address}
                                        helperText={errors.office_address}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <Box sx={{ alignSelf: 'flex-start', pt: 1 }}>
                                                        <LocationIcon sx={{ color: '#5c6bc0', mr: 1 }} />
                                                    </Box>
                                                ),
                                            },
                                        }}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card
                            elevation={0}
                            sx={{
                                border: '1px solid rgba(255,255,255,0.3)',
                                bgcolor: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 3,
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box display="flex" alignItems="center" gap={2} mb={3}>
                                    <FileIcon sx={{ color: '#5c6bc0' }} />
                                    <Typography variant="h6" fontWeight="600" color="#5c6bc0">
                                        Documents & Credentials
                                    </Typography>
                                </Box>

                                <Typography variant="body2" color="text.secondary" mb={3}>
                                    Upload your medical license, certificates, or other relevant documents.
                                    <br />
                                    Accepted formats: PDF, JPG, PNG (Max 2MB each, up to 5 files)
                                </Typography>

                                <Box>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<UploadIcon />}
                                        disabled={data.credentials.length >= 5}
                                        sx={{
                                            mb: 3,
                                            borderColor: '#5c6bc0',
                                            color: '#5c6bc0',
                                            '&:hover': {
                                                borderColor: '#26418f',
                                                bgcolor: 'rgba(92, 107, 192, 0.04)',
                                            },
                                        }}
                                    >
                                        {data.credentials.length >= 5 ? 'Maximum Files Reached' : 'Upload Documents'}
                                        <input
                                            key={fileInputKey}
                                            type="file"
                                            hidden
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleFileUpload}
                                        />
                                    </Button>

                                    {data.credentials.length > 0 && (
                                        <Box sx={{ bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                            <List>
                                                {data.credentials.map((file, index) => (
                                                    <ListItem key={index}>
                                                        <ListItemText primary={file.name} secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`} />
                                                        <IconButton edge="end" onClick={() => removeFile(index)} color="error" sx={{ ml: 'auto' }}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    )}

                                    {errors.credentials && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                            {errors.credentials}
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>

                        <Card
                            elevation={0}
                            sx={{
                                border: '1px solid rgba(255,255,255,0.3)',
                                bgcolor: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 3,
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Alert severity="info" sx={{ mb: 3 }}>
                                    <Typography variant="body2">
                                        <strong>Next Steps:</strong> After submitting your application, our admin team will review your credentials
                                        and contact you via email within 2-3 business days. If approved, you will receive login credentials to access
                                        the platform.
                                    </Typography>
                                </Alert>

                                <Box display="flex" justifyContent="center">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={processing}
                                        sx={{
                                            bgcolor: '#5c6bc0',
                                            '&:hover': { bgcolor: '#26418f' },
                                            px: 8,
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {processing ? 'Submitting Application...' : 'Submit Application'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Stack>
                </form>
            </Box>

            <Snackbar
                open={showSuccessToast}
                autoHideDuration={3000}
                onClose={() => setShowSuccessToast(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        padding: 0,
                    },
                }}
            >
                <Alert
                    onClose={() => setShowSuccessToast(false)}
                    severity="success"
                    variant="filled"
                    sx={{
                        minWidth: '400px',
                        borderRadius: 3,
                        fontWeight: 600,
                        fontSize: '1rem',
                        bgcolor: '#2e7d32',
                        color: 'white',
                        boxShadow: '0 8px 32px rgba(46, 125, 50, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        '& .MuiAlert-icon': {
                            fontSize: '1.8rem',
                            color: 'white',
                        },
                        '& .MuiAlert-action .MuiIconButton-root': {
                            color: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                                color: 'white',
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                            },
                        },
                    }}
                >
                    <Box>
                        <Typography variant="body1" fontWeight="700" sx={{ mb: 0.5 }}>
                            Application Submitted Successfully! 🎉
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                            Redirecting to home page...
                        </Typography>
                    </Box>
                </Alert>
            </Snackbar>
        </Box>
    );
}
