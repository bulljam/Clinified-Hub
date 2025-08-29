import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  LocalHospital as MedicalIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  UploadFile as FileIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  specialty: string;
  license_number: string;
  years_of_experience: number;
  clinic_address: string;
  credentials: File[];
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
    clinic_address: '',
    credentials: [],
  });

  const [success, setSuccess] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

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
    setFileInputKey(prev => prev + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'credentials') {
        data.credentials.forEach((file, index) => {
          formData.append(`credentials[${index}]`, file);
        });
      } else {
        formData.append(key, data[key as keyof FormData] as string);
      }
    });

    post('/doctor-application', formData, {
      forceFormData: true,
      onSuccess: () => {
        setSuccess(true);
        reset();
      },
    });
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
              Thank you for applying to join our medical team. We will review your application and credentials, then contact you via email with our decision within 2-3 business days.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: '#20a09f', '&:hover': { bgcolor: '#178f8e' } }}
              onClick={() => router.visit('/')}
            >
              Back to Home
            </Button>
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
            Apply to become a healthcare provider on our platform. We'll review your credentials and get back to you within 2-3 business days.
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
                    label="Clinic Address (Optional)"
                    value={data.clinic_address}
                    onChange={(e) => setData('clinic_address', e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.clinic_address}
                    helperText={errors.clinic_address}
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
                      }
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
                            <ListItemText
                              primary={file.name}
                              secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                            />
                            <IconButton 
                              edge="end" 
                              onClick={() => removeFile(index)}
                              color="error"
                              sx={{ ml: 'auto' }}
                            >
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
                    and contact you via email within 2-3 business days. If approved, you will receive login credentials 
                    to access the platform.
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
    </Box>
  );
}