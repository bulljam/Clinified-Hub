import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import { Lock, Save, CheckCircle, LockOpen, Security, Warning } from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button as MuiButton,
    Typography,
    Fade,
    Divider,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from '@mui/material';
import { edit, update as updatePassword } from '@/routes/password';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: edit().url,
    },
];

interface PasswordProps {
    flash?: {
        passwordChanged?: boolean;
    };
}

export default function Password({ flash }: PasswordProps) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    useEffect(() => {
        if (flash?.passwordChanged) {
            setShowLogoutDialog(true);
        }
    }, [flash?.passwordChanged]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />

            <SettingsLayout>
                <Card 
                    elevation={2} 
                    sx={{ 
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'primary.main'
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Security
                                sx={{ 
                                    width: 56, 
                                    height: 56, 
                                    mr: 3, 
                                    p: 1.5,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    borderRadius: 2
                                }}
                            />
                            <Box>
                                <Typography variant="h5" fontWeight="600" color="primary.main">
                                    Update Password
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Ensure your account is using a long, random password to stay secure
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Form
                            {...updatePassword.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnError={['password', 'password_confirmation', 'current_password']}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) {
                                    passwordInput.current?.focus();
                                }

                                if (errors.current_password) {
                                    currentPasswordInput.current?.focus();
                                }
                            }}
                        >
                            {({ errors, processing, recentlySuccessful }) => (
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Current Password"
                                        name="current_password"
                                        inputRef={currentPasswordInput}
                                        autoComplete="current-password"
                                        error={!!errors.current_password}
                                        helperText={errors.current_password}
                                        slotProps={{
                                            input: {
                                                startAdornment: <LockOpen sx={{ color: 'action.active', mr: 1 }} />
                                            }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'primary.main',
                                                }
                                            }
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="New Password"
                                        name="password"
                                        inputRef={passwordInput}
                                        autoComplete="new-password"
                                        error={!!errors.password}
                                        helperText={errors.password}
                                        slotProps={{
                                            input: {
                                                startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} />
                                            }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'primary.main',
                                                }
                                            }
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Confirm New Password"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        error={!!errors.password_confirmation}
                                        helperText={errors.password_confirmation}
                                        slotProps={{
                                            input: {
                                                startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} />
                                            }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'primary.main',
                                                }
                                            }
                                        }}
                                    />

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 1 }}>
                                        <MuiButton
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            disabled={processing}
                                            startIcon={<Save />}
                                            sx={{ 
                                                borderRadius: 2,
                                                px: 4,
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontWeight: 600
                                            }}
                                        >
                                            {processing ? 'Updating Password...' : 'Update Password'}
                                        </MuiButton>

                                        <Fade in={recentlySuccessful} timeout={300}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                                                <CheckCircle sx={{ mr: 1, fontSize: '1.2rem' }} />
                                                <Typography variant="body2" fontWeight={500}>
                                                    Password updated successfully
                                                </Typography>
                                            </Box>
                                        </Fade>
                                    </Box>
                                </Stack>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                <Dialog
                    open={showLogoutDialog}
                    onClose={() => setShowLogoutDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        pb: 2
                    }}>
                        <Warning color="warning" />
                        Password Updated Successfully
                    </DialogTitle>
                    <DialogContent>
                        <Alert
                            severity="info"
                            sx={{ mb: 2 }}
                            icon={<Security />}
                        >
                            <Typography variant="body2">
                                For your security, you have been logged out of all other devices and sessions.
                                Your current session will remain active.
                            </Typography>
                        </Alert>
                        <Typography variant="body2" color="text.secondary">
                            This helps protect your account by ensuring that only you have access with your new password.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <MuiButton
                            onClick={() => setShowLogoutDialog(false)}
                            variant="contained"
                            size="large"
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Got it
                        </MuiButton>
                    </DialogActions>
                </Dialog>
            </SettingsLayout>
        </AppLayout>
    );
}
