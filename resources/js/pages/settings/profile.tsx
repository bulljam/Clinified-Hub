import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Email, Person, Save, CheckCircle } from '@mui/icons-material';
import { 
    Box, 
    Card, 
    CardContent, 
    TextField, 
    Button as MuiButton, 
    Typography, 
    Alert, 
    Fade, 
    Divider,
    Avatar,
    Stack
} from '@mui/material';

import DeleteUser from '@/components/delete-user';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit, update as updateProfile } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <Stack spacing={4}>
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
                                <Avatar 
                                    sx={{ 
                                        width: 64, 
                                        height: 64, 
                                        mr: 3, 
                                        bgcolor: 'primary.main',
                                        fontSize: '1.5rem'
                                    }}
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="600" color="primary.main">
                                        Profile Information
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Update your personal information and email address
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Form
                                {...updateProfile.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                            >
                                {({ processing, recentlySuccessful, errors }) => (
                                    <Stack spacing={3}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            name="name"
                                            defaultValue={user.name}
                                            required
                                            autoComplete="name"
                                            error={!!errors.name}
                                            helperText={errors.name}
                                            slotProps={{
                                                input: {
                                                    startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />
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
                                            type="email"
                                            label="Email Address"
                                            name="email"
                                            defaultValue={user.email}
                                            required
                                            autoComplete="username"
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            slotProps={{
                                                input: {
                                                    startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />
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

                                        {mustVerifyEmail && user.email_verified_at === null && (
                                            <Alert severity="warning" sx={{ borderRadius: 2 }}>
                                                <Typography variant="body2">
                                                    Your email address is unverified.{' '}
                                                    <Link
                                                        href={send()}
                                                        as="button"
                                                        style={{ 
                                                            color: 'inherit', 
                                                            textDecoration: 'underline',
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Click here to resend the verification email.
                                                    </Link>
                                                </Typography>
                                                {status === 'verification-link-sent' && (
                                                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                                                        A new verification link has been sent to your email address.
                                                    </Typography>
                                                )}
                                            </Alert>
                                        )}

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
                                                {processing ? 'Saving...' : 'Save Changes'}
                                            </MuiButton>

                                            <Fade in={recentlySuccessful} timeout={300}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                                                    <CheckCircle sx={{ mr: 1, fontSize: '1.2rem' }} />
                                                    <Typography variant="body2" fontWeight={500}>
                                                        Profile updated successfully
                                                    </Typography>
                                                </Box>
                                            </Fade>
                                        </Box>
                                    </Stack>
                                )}
                            </Form>
                        </CardContent>
                    </Card>

                    <DeleteUser />
                </Stack>
            </SettingsLayout>
        </AppLayout>
    );
}
