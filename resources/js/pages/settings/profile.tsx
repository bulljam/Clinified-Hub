import DeleteUser from '@/components/delete-user';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { send } from '@/routes/verification';
import { edit, update as updateProfile } from '@/routes/profile';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { getImageUrl } from '@/utils/imageHelpers';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CameraAlt, CheckCircle, DeleteOutline, Email, Person, Save } from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    Divider,
    Fade,
    Button as MuiButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useMemo, useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { data, setData, patch, processing, recentlySuccessful, errors } = useForm<{
        name: string;
        email: string;
        photo: File | null;
        remove_photo: boolean;
    }>({
        name: user.name,
        email: user.email,
        photo: null,
        remove_photo: false,
    });

    const currentPhotoUrl = useMemo(() => getImageUrl(user.photo), [user.photo]);
    const previewUrl = useMemo(() => (data.photo ? URL.createObjectURL(data.photo) : null), [data.photo]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const avatarSrc = previewUrl ?? (data.remove_photo ? undefined : currentPhotoUrl);

    const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setData('photo', file);
        setData('remove_photo', false);
    };

    const handleRemovePhoto = () => {
        setData('photo', null);
        setData('remove_photo', true);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        patch(updateProfile().url, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setData('photo', null);
                setData('remove_photo', false);

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

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
                            borderColor: 'primary.main',
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box sx={{ mr: 3 }}>
                                    <Avatar
                                        src={avatarSrc}
                                        sx={{
                                            width: 72,
                                            height: 72,
                                            bgcolor: 'primary.main',
                                            fontSize: '1.75rem',
                                        }}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                </Box>

                                <Box>
                                    <Typography variant="h5" fontWeight="600" color="primary.main">
                                        Profile Information
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Update your personal information, email address, and profile image
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Box component="form" onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                    <Box>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            hidden
                                            onChange={handlePhotoSelect}
                                        />

                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
                                            <MuiButton
                                                type="button"
                                                variant="outlined"
                                                startIcon={<CameraAlt />}
                                                onClick={() => fileInputRef.current?.click()}
                                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                            >
                                                {avatarSrc ? 'Change Image' : 'Upload Image'}
                                            </MuiButton>

                                            {(currentPhotoUrl || data.photo) && (
                                                <MuiButton
                                                    type="button"
                                                    color="error"
                                                    variant="text"
                                                    startIcon={<DeleteOutline />}
                                                    onClick={handleRemovePhoto}
                                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                                >
                                                    Remove Image
                                                </MuiButton>
                                            )}
                                        </Box>

                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                            JPG or PNG up to 2MB.
                                        </Typography>

                                        {errors.photo && (
                                            <Typography variant="caption" color="error.main" sx={{ mt: 1, display: 'block' }}>
                                                {errors.photo}
                                            </Typography>
                                        )}
                                    </Box>

                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        name="name"
                                        value={data.name}
                                        onChange={(event) => setData('name', event.target.value)}
                                        required
                                        autoComplete="name"
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        slotProps={{
                                            input: {
                                                startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />,
                                            },
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'primary.main',
                                                },
                                            },
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        type="email"
                                        label="Email Address"
                                        name="email"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        required
                                        autoComplete="username"
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        slotProps={{
                                            input: {
                                                startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />,
                                            },
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'primary.main',
                                                },
                                            },
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
                                                        cursor: 'pointer',
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
                                                fontWeight: 600,
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
                            </Box>
                        </CardContent>
                    </Card>

                    <DeleteUser />
                </Stack>
            </SettingsLayout>
        </AppLayout>
    );
}
