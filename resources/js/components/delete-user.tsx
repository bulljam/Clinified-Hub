import { destroy as destroyProfile } from '@/routes/profile';
import { Form } from '@inertiajs/react';
import { DeleteForever, Warning } from '@mui/icons-material';
import {
    Alert,
    Box,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Button as MuiButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useRef, useState } from 'react';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Card elevation={2} sx={{ borderRadius: 3, borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <DeleteForever sx={{ color: 'error.main', mr: 2, mt: 0.5 }} />
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="600" color="error.main" gutterBottom>
                            Delete Account
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Permanently delete your account and all associated data
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Warning sx={{ mr: 1 }} />
                        <Box>
                            <Typography variant="body2" fontWeight="600">
                                Warning
                            </Typography>
                            <Typography variant="body2">Please proceed with caution, this cannot be undone.</Typography>
                        </Box>
                    </Box>
                </Alert>

                <MuiButton
                    variant="contained"
                    color="error"
                    size="large"
                    startIcon={<DeleteForever />}
                    onClick={() => setOpen(true)}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                    }}
                >
                    Delete Account
                </MuiButton>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth="sm"
                    fullWidth
                    slotProps={{
                        paper: {
                            sx: { borderRadius: 3 },
                        },
                    }}
                >
                    <DialogTitle sx={{ pb: 2 }}>
                        <Typography variant="h6" fontWeight="600" color="error.main">
                            Are you sure you want to delete your account?
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 3 }}>
                            Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password
                            to confirm you would like to permanently delete your account.
                        </DialogContentText>

                        <Form
                            {...destroyProfile.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Password"
                                        name="password"
                                        inputRef={passwordInput}
                                        autoComplete="current-password"
                                        error={!!errors.password}
                                        helperText={errors.password}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'error.main',
                                                },
                                            },
                                        }}
                                    />

                                    <DialogActions sx={{ px: 0, pb: 0 }}>
                                        <MuiButton
                                            variant="outlined"
                                            onClick={() => {
                                                resetAndClearErrors();
                                                handleClose();
                                            }}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 500,
                                                px: 3,
                                            }}
                                        >
                                            Cancel
                                        </MuiButton>
                                        <MuiButton
                                            type="submit"
                                            variant="contained"
                                            color="error"
                                            disabled={processing}
                                            startIcon={<DeleteForever />}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                px: 3,
                                            }}
                                        >
                                            {processing ? 'Deleting...' : 'Delete Account'}
                                        </MuiButton>
                                    </DialogActions>
                                </Stack>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
