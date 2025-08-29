import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Avatar,
  Tooltip,
  Stack,
  Fade,
  Alert,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Preview as PreviewIcon,
  LocalHospital as MedicalIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import dayjs from 'dayjs';

interface DoctorApplication {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  specialty: string;
  license_number: string;
  years_of_experience: number;
  office_address: string | null;
  credentials: string[] | null;
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

export default function DoctorApplications({ applications }: Props) {
  const [viewingApplication, setViewingApplication] = useState<DoctorApplication | null>(null);
  const [rejectingApplication, setRejectingApplication] = useState<DoctorApplication | null>(null);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    rejection_reason: '',
  });

  const handleApprove = (application: DoctorApplication) => {
    router.post(`/admin/doctor-applications/${application.id}/approve`);
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

  const previewCredential = (applicationId: number, path: string) => {
    const filename = path.split('/').pop() || 'document';
    window.open(`/admin/doctor-applications/${applicationId}/credential/${filename}`, '_blank');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Header */}
      <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: '#20a09f', width: 56, height: 56 }}>
              <MedicalIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" color="#20a09f">
                Doctor Applications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Review and manage pending doctor applications
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats */}
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3, 1fr)' }} gap={3} mb={4}>
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" color="warning.main" mb={1}>
              {applications.filter(app => app.status === 'pending').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Review
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" color="success.main" mb={1}>
              {applications.filter(app => app.status === 'approved').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Approved
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" color="error.main" mb={1}>
              {applications.filter(app => app.status === 'rejected').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rejected
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Applications Table */}
      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
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
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#20a09f' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 200 }}>
                  Doctor Details
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 150 }}>
                  Specialty
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 120 }}>
                  Experience
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 120 }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 150 }}>
                  Applied Date
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600, py: 2, minWidth: 200 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application, index) => (
                <Fade in={true} timeout={300 + index * 100} key={application.id}>
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
                    <TableCell sx={{ py: 3, minWidth: 200 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        {application.photo ? (
                          <Avatar 
                            src={`/storage/${application.photo}`}
                            sx={{ 
                              width: 40, 
                              height: 40,
                              border: '1px solid #20a09f',
                              cursor: 'pointer',
                              '&:hover': {
                                opacity: 0.8,
                                transform: 'scale(1.05)'
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                            onClick={() => handlePhotoPreview(application.photo!)}
                          />
                        ) : (
                          <Avatar sx={{ 
                            bgcolor: '#20a09f', 
                            width: 40, 
                            height: 40,
                            fontSize: '1.1rem',
                            fontWeight: 'bold'
                          }}>
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
                      <Typography variant="body2">
                        {application.years_of_experience} years
                      </Typography>
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
                      <Typography variant="body2">
                        {dayjs(application.created_at).format('MMM D, YYYY')}
                      </Typography>
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
                              bgcolor: '#20a09f',
                              color: 'white',
                              '&:hover': { bgcolor: '#178f8e' },
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
      </Card>

      {/* View Application Dialog */}
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
          {viewingApplication && (
            <Stack spacing={4}>
              {/* Header with doctor info */}
              <Card elevation={0} sx={{ bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={3} mb={2}>
                    {viewingApplication.photo ? (
                      <Avatar 
                        src={`/storage/${viewingApplication.photo}`}
                        sx={{ 
                          width: 64, 
                          height: 64,
                          border: '2px solid #20a09f',
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 0.8,
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onClick={() => handlePhotoPreview(viewingApplication.photo!)}
                      />
                    ) : (
                      <Avatar 
                        sx={{ 
                          bgcolor: '#20a09f', 
                          width: 64, 
                          height: 64, 
                          fontSize: '1.5rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {viewingApplication.full_name.charAt(0)}
                      </Avatar>
                    )}
                    <Box>
                      <Typography variant="h5" fontWeight="bold" color="#20a09f">
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

                  {/* Application Status & Timeline */}
                  <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2, border: '1px solid #e0e0e0' }}>
                    <Typography variant="subtitle2" fontWeight="600" mb={2}>Application Timeline</Typography>
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

              {/* Contact Information */}
              <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" mb={3} color="#20a09f">
                    Contact Information
                  </Typography>
                  <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">
                        Email Address
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {viewingApplication.email}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">
                        Phone Number
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {viewingApplication.phone}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" mb={3} color="#20a09f">
                    Professional Details
                  </Typography>
                  <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">
                        Medical License Number
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {viewingApplication.license_number}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">
                        Medical Specialty
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {viewingApplication.specialty}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {viewingApplication.office_address && (
                    <Box mt={3}>
                      <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">
                        Office Address
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {viewingApplication.office_address}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Credentials Section */}
              {viewingApplication.credentials && viewingApplication.credentials.length > 0 && (
                <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" mb={3} color="#20a09f">
                      Uploaded Documents ({viewingApplication.credentials.length})
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
                      {viewingApplication.credentials.map((credential, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          startIcon={<PreviewIcon />}
                          onClick={() => previewCredential(viewingApplication.id, credential)}
                          sx={{ 
                            borderColor: '#20a09f',
                            color: '#20a09f',
                            fontWeight: 500,
                            px: 3,
                            py: 1.5,
                            '&:hover': {
                              borderColor: '#178f8e',
                              bgcolor: 'rgba(32, 160, 159, 0.04)',
                            }
                          }}
                        >
                          Document {index + 1}
                        </Button>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* Rejection Reason */}
              {viewingApplication.status === 'rejected' && viewingApplication.rejection_reason && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                    Rejection Reason
                  </Typography>
                  <Typography variant="body2">
                    {viewingApplication.rejection_reason}
                  </Typography>
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={() => setViewingApplication(null)}
            variant="outlined"
            sx={{ px: 4 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Application Dialog */}
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
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleReject}
            disabled={processing || !data.rejection_reason.trim()}
          >
            {processing ? 'Rejecting...' : 'Reject Application'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}