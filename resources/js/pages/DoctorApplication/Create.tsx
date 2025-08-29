import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Alert,
  Grid,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  LocalHospital as MedicalIcon,
  Person as PersonIcon,
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const currentFiles = Array.from(data.credentials);
    const newFiles = [...currentFiles, ...files].slice(0, 5);
    setData('credentials', newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = data.credentials.filter((_, i) => i !== index);
    setData('credentials', newFiles);
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

    post('/doctor-application', {
      data: formData,
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
          bgcolor: '#fafafa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Card sx={{ maxWidth: 600, width: '100%' }}>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <MedicalIcon sx={{ fontSize: 80, color: '#20a09f', mb: 3 }} />
            <Typography variant="h4" fontWeight="bold" color="#20a09f" mb={2}>
              Application Submitted Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Thank you for applying to join our medical team. We will review your application and credentials, then contact you via email with our decision.
            </Typography>
            <Button
              variant="contained"
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', py: 4 }}>
      <Box sx={{ maxWidth: 800, mx: 'auto', px: 3 }}>
        <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <MedicalIcon sx={{ fontSize: 60, color: '#20a09f', mb: 2 }} />
            <Typography variant="h4" component="h1" fontWeight="bold" color="#20a09f" mb={1}>
              Become a Doctor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join our healthcare platform and start helping patients
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid xs={12}>
                  <Typography variant="h6" fontWeight="600" color="#20a09f" mb={2}>
                    Personal Information
                  </Typography>
                </Grid>

                <Grid xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    value={data.full_name}
                    onChange={(e) => setData('full_name', e.target.value)}
                    fullWidth
                    required
                    error={!!errors.full_name}
                    helperText={errors.full_name}
                  />
                </Grid>

                <Grid xs={12} sm={6}>
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
                </Grid>

                <Grid xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    fullWidth
                    required
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Grid>

                <Grid xs={12} sm={6}>
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
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.specialty}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid xs={12}>
                  <Typography variant="h6" fontWeight="600" color="#20a09f" mb={2} mt={2}>
                    Professional Information
                  </Typography>
                </Grid>

                <Grid xs={12} sm={6}>
                  <TextField
                    label="Medical License Number"
                    value={data.license_number}
                    onChange={(e) => setData('license_number', e.target.value)}
                    fullWidth
                    required
                    error={!!errors.license_number}
                    helperText={errors.license_number}
                  />
                </Grid>

                <Grid xs={12} sm={6}>
                  <TextField
                    label="Years of Experience"
                    type="number"
                    value={data.years_of_experience}
                    onChange={(e) => setData('years_of_experience', parseInt(e.target.value) || 0)}
                    fullWidth
                    required
                    inputProps={{ min: 0, max: 50 }}
                    error={!!errors.years_of_experience}
                    helperText={errors.years_of_experience}
                  />
                </Grid>

                <Grid xs={12}>
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
                </Grid>

                <Grid xs={12}>
                  <Typography variant="h6" fontWeight="600" color="#20a09f" mb={2}>
                    Documents & Credentials
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Upload your medical license, certificates, or other relevant documents (PDF, JPG, PNG - Max 2MB each, up to 5 files)
                  </Typography>
                  
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    sx={{ mb: 2 }}
                    disabled={data.credentials.length >= 5}
                  >
                    Upload Documents
                    <input
                      type="file"
                      hidden
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                    />
                  </Button>

                  {data.credentials.length > 0 && (
                    <List sx={{ bgcolor: '#f5f5f5', borderRadius: 2 }}>
                      {data.credentials.map((file, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={file.name}
                            secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => removeFile(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}

                  {errors.credentials && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {errors.credentials}
                    </Typography>
                  )}
                </Grid>

                <Grid xs={12}>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    After submitting your application, our admin team will review your credentials and contact you via email. If approved, you will receive login credentials to access the platform.
                  </Alert>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={processing}
                    sx={{
                      bgcolor: '#20a09f',
                      '&:hover': { bgcolor: '#178f8e' },
                      px: 6,
                      py: 1.5,
                    }}
                  >
                    {processing ? 'Submitting Application...' : 'Submit Application'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}