import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import superAdmin from '@/routes/super-admin';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowBack as BackIcon,
    Email as EmailIcon,
    MailOutline as MailIcon,
    Person as PersonIcon,
    VpnKey as ResetIcon,
    Save as SaveIcon,
    Shield as ShieldIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Crown as CrownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function EditAdmin({ admin, flash }: Props) {
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

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessSnackbar(true);
        }
        if (flash?.error) {
            setErrorMessage(flash.error);
            setShowErrorSnackbar(true);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(superAdmin.admins.update(admin.id).url);
    };

    const handlePasswordResetClick = () => {
        setShowConfirmDialog(true);
    };

    const handlePasswordResetConfirm = () => {
        setIsResettingPassword(true);

        router.post(
            `/super-admin/admins/${admin.id}/reset-password`,
            {},
            {
                onSuccess: () => {
                    setIsResettingPassword(false);
                    setShowConfirmDialog(false);
                    setShowSuccessSnackbar(true);
                },
                onError: (errors) => {
                    setIsResettingPassword(false);
                    setShowConfirmDialog(false);
                    console.error('Password reset error:', errors);
                    setErrorMessage('Failed to reset password. Please try again.');
                    setShowErrorSnackbar(true);
                },
            },
        );
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

                <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Box
                        sx={{
                            bgcolor: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            color: 'white',
                            p: 3,
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

                                <Box>
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#374151' }}>
                                        Password Management
                                    </Typography>

                                    <Alert severity="warning" icon={<ResetIcon />} sx={{ mb: 3, borderRadius: 2 }}>
                                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                                            Password Reset Available
                                        </Typography>
                                        <Typography variant="body2">
                                            You can reset this admin's password to a new temporary password. They will receive the new credentials via
                                            email and can change it immediately.
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
                                                    minute: '2-digit',
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
                                                    minute: '2-digit',
                                                })}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                                    <Button
                                        component={Link}
                                        href={superAdmin.admins.index().url}
                                        variant="outlined"
                                        sx={{
                                            textTransform: 'none',
                                            px: 3,
                                            py: 1.5,
                                            borderRadius: 2,
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

                <Dialog
                    open={showConfirmDialog}
                    onClose={handlePasswordResetCancel}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: { borderRadius: 3 },
                    }}
                >
                    <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Confirm Password Reset</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: '#374151', fontSize: '1rem' }}>
                            Are you sure you want to reset <strong>{admin.name}'s</strong> password? A new temporary password will be generated and
                            sent to their email address ({admin.email}).
                        </DialogContentText>
                        <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                            <Typography variant="body2">
                                This action will immediately invalidate their current password. They will need to use the new temporary password to
                                log in.
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
                                px: 3,
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePasswordResetConfirm}
                            variant="contained"
                            color="warning"
                            disabled={isResettingPassword}
                            startIcon={isResettingPassword ? <CircularProgress size={16} sx={{ color: 'white' }} /> : undefined}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 3,
                                bgcolor: '#f59e0b',
                                '&:hover': { bgcolor: '#d97706' },
                                '&:disabled': {
                                    bgcolor: '#fbbf24',
                                    color: 'white',
                                    opacity: 0.8,
                                },
                            }}
                        >
                            {isResettingPassword ? 'Resetting Password...' : 'Reset Password'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={showSuccessSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setShowSuccessSnackbar(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={() => setShowSuccessSnackbar(false)} severity="success" variant="filled" sx={{ borderRadius: 2 }}>
                        <Typography variant="body2" fontWeight={600}>
                            Password Reset Successful!
                        </Typography>
                        <Typography variant="body2">{flash?.success || `New temporary credentials have been sent to ${admin.email}`}</Typography>
                    </Alert>
                </Snackbar>

                <Snackbar
                    open={showErrorSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setShowErrorSnackbar(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={() => setShowErrorSnackbar(false)} severity="error" variant="filled" sx={{ borderRadius: 2 }}>
                        <Typography variant="body2" fontWeight={600}>
                            Password Reset Failed
                        </Typography>
                        <Typography variant="body2">{errorMessage}</Typography>
                    </Alert>
                </Snackbar>
            </Box>
        </AppLayout>
    );
}
