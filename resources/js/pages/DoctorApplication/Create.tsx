import { router, useForm } from '@inertiajs/react';
import {
    Delete as DeleteIcon,
    UploadFile as FileIcon,
    LocalHospital as MedicalIcon,
    Person as PersonIcon,
    CloudUpload as UploadIcon,
    Work as WorkIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
        specialty: '',
        license_number: '',
        years_of_experience: 0,
        office_address: '',
        credentials: [],
        photo: null,
    });

    const [success, setSuccess] = useState(false);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);

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
                setSuccess(true);
                setShowConfirmDialog(true);
                setShowSnackbar(true);
                reset();
            },
        });
    };

    const handleConfirmRedirect = () => {
        setShowConfirmDialog(false);
        router.visit('/');
    };

    const handleStayOnPage = () => {
        setShowConfirmDialog(false);
        setSuccess(false);
    };


    if (success) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                }}
            >
                <Card sx={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
                    <CardContent sx={{ p: 6 }}>
                        <MedicalIcon sx={{ fontSize: 80, color: '#20a09f', mb: 3 }} />
                        <Typography variant="h4" fontWeight="bold" color="#20a09f" mb={2}>
                            Application Submitted Successfully!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" mb={4}>
                            Thank you for applying to join our medical team. We will review your application and credentials, then contact you via
                            email with our decision within 2-3 business days.
                        </Typography>

                        <Alert severity="success" sx={{ mb: 4, textAlign: 'left' }}>
                            <Typography variant="body2" mb={1}>
                                <strong>What happens next:</strong>
                            </Typography>
                            <Typography variant="body2" component="ul" sx={{ mb: 0, pl: 2 }}>
                                <li>Our admin team will review your application</li>
                                <li>We'll verify your credentials and documents</li>
                                <li>You'll receive an email notification with our decision</li>
                                <li>If approved, you'll get login credentials to access the platform</li>
                            </Typography>
                        </Alert>

                        <Box mb={3}>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                You can now safely navigate away from this page.
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                                <Button
                                    variant="contained"
                                    onClick={() => router.visit('/')}
                                    sx={{
                                        bgcolor: '#20a09f',
                                        '&:hover': { bgcolor: '#178f8e' },
                                        px: 4,
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Go to Home
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setSuccess(false)}
                                    sx={{
                                        borderColor: '#20a09f',
                                        color: '#20a09f',
                                        '&:hover': {
                                            borderColor: '#178f8e',
                                            color: '#178f8e',
                                            bgcolor: 'rgba(32, 160, 159, 0.04)',
                                        },
                                        px: 4,
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Submit Another Application
                                </Button>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
            {/* Header */}
            <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0', py: 4 }}>
                <Box sx={{ maxWidth: 900, mx: 'auto', px: 3, textAlign: 'center' }}>
                    <MedicalIcon sx={{ fontSize: 60, color: '#20a09f', mb: 2 }} />
                    <Typography variant="h4" component="h1" fontWeight="bold" color="#20a09f" mb={1}>
                        Join Our Medical Team
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        Apply to become a healthcare provider on our platform. We'll review your credentials and get back to you within 2-3 business
                        days.
                    </Typography>
                </Box>
            </Box>

            {/* Form Container */}
            <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        {/* Personal Information Section */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box display="flex" alignItems="center" gap={2} mb={3}>
                                    <PersonIcon sx={{ color: '#20a09f' }} />
                                    <Typography variant="h6" fontWeight="600" color="#20a09f">
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
                                        />
                                    </Box>

                                    <TextField
                                        label="Phone Number"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        fullWidth
                                        required
                                        error={!!errors.phone}
                                        helperText={errors.phone}
                                        sx={{ maxWidth: { sm: '50%' } }}
                                    />

                                    {/* Photo Upload Section */}
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="600" mb={2}>
                                            Profile Photo <span style={{ color: '#d32f2f' }}>*</span>
                                        </Typography>
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
                                                    borderColor: '#20a09f',
                                                    color: '#20a09f',
                                                    '&:hover': {
                                                        borderColor: '#178f8e',
                                                        bgcolor: 'rgba(32, 160, 159, 0.04)',
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

                        {/* Professional Information Section */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box display="flex" alignItems="center" gap={2} mb={3}>
                                    <WorkIcon sx={{ color: '#20a09f' }} />
                                    <Typography variant="h6" fontWeight="600" color="#20a09f">
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
                                        />
                                    </Box>

                                    <TextField
                                        label="Years of Experience"
                                        type="number"
                                        value={data.years_of_experience}
                                        onChange={(e) => setData('years_of_experience', parseInt(e.target.value) || 0)}
                                        fullWidth
                                        required
                                        slotProps={{ htmlInput: { min: 0, max: 50 } }}
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
                                    />
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Documents & Credentials Section */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box display="flex" alignItems="center" gap={2} mb={3}>
                                    <FileIcon sx={{ color: '#20a09f' }} />
                                    <Typography variant="h6" fontWeight="600" color="#20a09f">
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
                                            borderColor: '#20a09f',
                                            color: '#20a09f',
                                            '&:hover': {
                                                borderColor: '#178f8e',
                                                bgcolor: 'rgba(32, 160, 159, 0.04)',
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

                        {/* Submit Section */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
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
                                            bgcolor: '#20a09f',
                                            '&:hover': { bgcolor: '#178f8e' },
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

            {/* Confirmation Dialog */}
            <Dialog
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 2,
                    },
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
                    <MedicalIcon sx={{ fontSize: 60, color: '#20a09f', mb: 2 }} />
                    <Typography variant="h5" fontWeight="bold" color="#20a09f">
                        Application Submitted Successfully!
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
                    <Typography variant="body1" color="text.secondary" mb={2}>
                        Thank you for applying to join our medical team. We will review your application and notify you within 2-3 business days.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        What would you like to do next?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button
                        onClick={handleStayOnPage}
                        variant="outlined"
                        sx={{
                            borderColor: '#20a09f',
                            color: '#20a09f',
                            '&:hover': {
                                borderColor: '#178f8e',
                                bgcolor: 'rgba(32, 160, 159, 0.04)',
                            },
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Submit Another
                    </Button>
                    <Button
                        onClick={handleConfirmRedirect}
                        variant="contained"
                        sx={{
                            bgcolor: '#20a09f',
                            '&:hover': { bgcolor: '#178f8e' },
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Go to Home
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
            <Snackbar
                open={showSnackbar}
                autoHideDuration={6000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowSnackbar(false)} 
                    severity="success" 
                    sx={{ 
                        width: '100%',
                        borderRadius: 2,
                        fontWeight: 600,
                        '& .MuiAlert-icon': {
                            fontSize: '1.5rem',
                        },
                    }}
                >
                    Doctor application submitted successfully! Check your email for updates.
                </Alert>
            </Snackbar>
        </Box>
    );
}
