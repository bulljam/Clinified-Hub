import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper,
  Alert,
  InputAdornment,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Shield as ShieldIcon,
  VpnKey as ResetIcon,
  MailOutline as MailIcon,
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { Crown as CrownIcon } from 'lucide-react';
import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { dashboard } from '@/routes';
import superAdmin from '@/routes/super-admin';
import AppLayout from '@/layouts/app-layout';

interface Admin {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  updated_at: string;
}

interface FormData {
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
}

interface Props {
  admin: Admin;
}

export default function EditAdmin({ admin }: Props) {
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { data, setData, put, processing, errors } = useForm<FormData>({
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(superAdmin.admins.update(admin.id).url);
  };

  const handlePasswordResetClick = () => {
    setShowConfirmDialog(true);
  };

  const handlePasswordResetConfirm = () => {
    setIsResettingPassword(true);
    
    const resetPasswordUrl = `/super-admin/admins/${admin.id}/reset-password`;
    
    fetch(resetPasswordUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
    })
    .then(response => response.json())
    .then((data) => {
      setIsResettingPassword(false);
      setShowConfirmDialog(false);
      if (data.message) {
        setShowSuccessSnackbar(true);
      }
    })
    .catch((error) => {
      setIsResettingPassword(false);
      setShowConfirmDialog(false);
      console.error('Password reset error:', error);
      setErrorMessage('Failed to reset password. Please try again.');
      setShowErrorSnackbar(true);
    });
  };

  const handlePasswordResetCancel = () => {
    setShowConfirmDialog(false);
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin Management', href: superAdmin.admins.index().url },
    { title: `Edit ${admin.name}`, href: '' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Admin - ${admin.name}`} />
      
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Button
              component={Link}
              href={superAdmin.admins.index().url}
              startIcon={<BackIcon />}
              variant="outlined"
              sx={{ textTransform: 'none' }}
            >
              Back to Admin List
            </Button>
          </Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#1f2937', mb: 1 }}>
            Edit Admin - {admin.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Update administrator information and permissions
          </Typography>
        </Box>

        {/* Form */}
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box 
            sx={{ 
              bgcolor: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: 'white',
              p: 3 
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Admin Information
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Update the administrator account details
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Personal Information Section */}
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#374151' }}>
                    Personal Information
                  </Typography>
                  
                  <Stack spacing={3}>
                    <TextField
                      label="Full Name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      error={!!errors.name}
                      helperText={errors.name}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />

                    <TextField
                      label="Email Address"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Stack>
                </Box>

                {/* Role Selection */}
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#374151' }}>
                    Role & Permissions
                  </Typography>
                  
                  <FormControl fullWidth error={!!errors.role}>
                    <InputLabel>Admin Role</InputLabel>
                    <Select
                      value={data.role}
                      label="Admin Role"
                      onChange={(e) => setData('role', e.target.value as 'admin' | 'super_admin')}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="admin">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <ShieldIcon sx={{ color: '#7c3aed' }} />
                          <Box>
                            <Typography fontWeight={600}>Admin</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Standard administrator with system management access
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value="super_admin">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CrownIcon style={{ color: '#dc2626', width: 20, height: 20 }} />
                          <Box>
                            <Typography fontWeight={600}>Super Admin</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Full system control including admin management
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    </Select>
                    {errors.role && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                        {errors.role}
                      </Typography>
                    )}
                  </FormControl>
                </Box>

                {/* Password Reset Section */}
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#374151' }}>
                    Password Management
                  </Typography>
                  
                  <Alert 
                    severity="warning" 
                    icon={<ResetIcon />}
                    sx={{ mb: 3, borderRadius: 2 }}
                  >
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                      Password Reset Available
                    </Typography>
                    <Typography variant="body2">
                      You can reset this admin's password to a new temporary password. 
                      They will receive the new credentials via email and can change it immediately.
                    </Typography>
                  </Alert>
                  
                  <Button
                    onClick={handlePasswordResetClick}
                    disabled={isResettingPassword}
                    startIcon={<MailIcon />}
                    variant="outlined"
                    color="warning"
                    sx={{
                      textTransform: 'none',
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: '#f59e0b',
                      color: '#f59e0b',
                      '&:hover': {
                        borderColor: '#d97706',
                        bgcolor: '#fef3c7',
                      },
                    }}
                  >
                    {isResettingPassword ? 'Resetting Password...' : 'Reset Password & Send Email'}
                  </Button>
                </Box>

                {/* Account Information */}
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#374151' }}>
                    Account Information
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Created
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {new Date(admin.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {new Date(admin.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                  <Button
                    component={Link}
                    href={superAdmin.admins.index().url}
                    variant="outlined"
                    sx={{ 
                      textTransform: 'none',
                      px: 3,
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={processing}
                    startIcon={<SaveIcon />}
                    sx={{
                      bgcolor: '#0f172a',
                      '&:hover': { bgcolor: '#1e293b' },
                      textTransform: 'none',
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    {processing ? 'Updating...' : 'Update Admin'}
                  </Button>
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Paper>

        {/* Confirmation Dialog */}
        <Dialog
          open={showConfirmDialog}
          onClose={handlePasswordResetCancel}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>
            Confirm Password Reset
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: '#374151', fontSize: '1rem' }}>
              Are you sure you want to reset <strong>{admin.name}'s</strong> password? 
              A new temporary password will be generated and sent to their email address ({admin.email}).
            </DialogContentText>
            <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
              <Typography variant="body2">
                This action will immediately invalidate their current password. 
                They will need to use the new temporary password to log in.
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={handlePasswordResetCancel}
              variant="outlined"
              sx={{ 
                textTransform: 'none',
                borderRadius: 2,
                px: 3
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordResetConfirm}
              variant="contained"
              color="warning"
              disabled={isResettingPassword}
              startIcon={isResettingPassword ? (
                <CircularProgress 
                  size={16} 
                  sx={{ color: 'white' }}
                />
              ) : undefined}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                bgcolor: '#f59e0b',
                '&:hover': { bgcolor: '#d97706' },
                '&:disabled': { 
                  bgcolor: '#fbbf24',
                  color: 'white',
                  opacity: 0.8
                }
              }}
            >
              {isResettingPassword ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccessSnackbar}
          autoHideDuration={6000}
          onClose={() => setShowSuccessSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setShowSuccessSnackbar(false)}
            severity="success"
            variant="filled"
            sx={{ borderRadius: 2 }}
          >
            <Typography variant="body2" fontWeight={600}>
              Password Reset Successful!
            </Typography>
            <Typography variant="body2">
              New temporary credentials have been sent to {admin.email}
            </Typography>
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={showErrorSnackbar}
          autoHideDuration={6000}
          onClose={() => setShowErrorSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setShowErrorSnackbar(false)}
            severity="error"
            variant="filled"
            sx={{ borderRadius: 2 }}
          >
            <Typography variant="body2" fontWeight={600}>
              Password Reset Failed
            </Typography>
            <Typography variant="body2">
              {errorMessage}
            </Typography>
          </Alert>
        </Snackbar>
      </Box>
    </AppLayout>
  );
}