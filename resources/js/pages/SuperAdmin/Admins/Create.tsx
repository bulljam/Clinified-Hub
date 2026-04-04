import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import superAdmin from '@/routes/super-admin';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowBack as BackIcon,
    Email as EmailIcon,
    MailOutline as MailIcon,
    Person as PersonIcon,
    Save as SaveIcon,
    Shield as ShieldIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    CardContent,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Crown as CrownIcon } from 'lucide-react';

interface FormData {
    name: string;
    email: string;
    role: 'admin' | 'super_admin' | '';
}

export default function CreateAdmin() {
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        name: '',
        email: '',
        role: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(superAdmin.admins.store().url, {
            onSuccess: () => {
                reset();
            },
        });
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Admin Management', href: superAdmin.admins.index().url },
        { title: 'Create Admin', href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Admin" />

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
                        Create New Admin
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Add a new administrator to the system with appropriate permissions
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
                            Fill in the details for the new administrator account
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
                                                    <CrownIcon sx={{ color: '#dc2626' }} />
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

                                <Alert
                                    severity="info"
                                    icon={<MailIcon />}
                                    sx={{
                                        borderRadius: 2,
                                        '& .MuiAlert-message': { fontWeight: 500 },
                                    }}
                                >
                                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                                        Automatic Email Notification
                                    </Typography>
                                    <Typography variant="body2">
                                        The new admin will receive a welcome email with temporary login credentials. They can login immediately and
                                        change their password for security.
                                    </Typography>
                                </Alert>

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
                                        {processing ? 'Creating Admin...' : 'Create Admin'}
                                    </Button>
                                </Box>
                            </Stack>
                        </form>
                    </CardContent>
                </Paper>
            </Box>
        </AppLayout>
    );
}
