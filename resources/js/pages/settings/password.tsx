import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import { Lock, Save, CheckCircle, LockOpen, Security } from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button as MuiButton,
    Typography,
    Fade,
    Divider,
    Stack
} from '@mui/material';
import { edit } from '@/routes/password';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: edit().url,
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

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
                            {...PasswordController.update.form()}
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
            </SettingsLayout>
        </AppLayout>
    );
}
