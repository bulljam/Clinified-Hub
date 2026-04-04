import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { FilterList as FilterIcon, CreditCard as PaymentIcon, AccountBalanceWallet as WalletIcon } from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    MenuItem,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';

interface Transaction {
    id: number;
    user_id: number;
    doctor_id: number;
    amount: string;
    card_last4: string | null;
    status: 'pending' | 'paid' | 'on_hold' | 'cancelled';
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
        photo: string | null;
    };
    doctor: {
        id: number;
        name: string;
        email: string;
        photo: string | null;
        specialty: string | null;
    };
}

interface PaginatedTransactions {
    data: Transaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    transactions: PaginatedTransactions;
    users?: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
    }>;
    providers?: Array<{
        id: number;
        name: string;
        email: string;
        specialty: string | null;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payments',
        href: '/payments',
    },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'paid':
            return 'success';
        case 'on_hold':
            return 'info';
        case 'cancelled':
            return 'error';
        default:
            return 'default';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'pending':
            return 'Pending';
        case 'paid':
            return 'Approved';
        case 'on_hold':
            return 'On Hold';
        case 'cancelled':
            return 'Cancelled';
        default:
            return status;
    }
};

export default function Payments({ transactions, users = [], providers = [] }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [filterPatient, setFilterPatient] = useState('');
    const [filterProvider, setFilterProvider] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');

    const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'super_admin';
    const isProvider = auth.user?.role === 'provider';
    const isPatient = auth.user?.role === 'client';

    const filteredTransactions = transactions.data.filter((transaction) => {
        if (filterPatient && transaction.user_id !== parseInt(filterPatient)) return false;
        if (filterProvider && transaction.doctor_id !== parseInt(filterProvider)) return false;
        if (filterStatus && transaction.status !== filterStatus) return false;

        const transactionDate = dayjs(transaction.created_at);
        if (filterDateFrom && transactionDate.isBefore(dayjs(filterDateFrom))) return false;
        if (filterDateTo && transactionDate.isAfter(dayjs(filterDateTo))) return false;

        return true;
    });

    const totalAmount = filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const paidAmount = filteredTransactions.filter((t) => t.status === 'paid').reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const getRoleTitle = () => {
        if (isAdmin) return 'All Payments Management';
        if (isProvider) return 'Payment History from Patients';
        return 'My Payment History';
    };

    const getRoleDescription = () => {
        if (isAdmin) return 'Monitor and manage all payments between patients and providers';
        if (isProvider) return 'View payments received from your patients';
        return 'Track your payments to healthcare providers';
    };

    const getPhotoUrl = (photo: string | null) => {
        if (!photo) return undefined;

        if (photo.startsWith('/')) {
            return photo;
        }

        return `/storage/${photo}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />

            <Box sx={{ maxWidth: '100%', mx: 'auto', p: 2 }}>
                <Card elevation={0} sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" gap={3} mb={2}>
                            <Avatar sx={{ bgcolor: '#5c6bc0', width: 56, height: 56 }}>
                                <PaymentIcon fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    {getRoleTitle()}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {getRoleDescription()}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap={3} mb={4}>
                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <WalletIcon sx={{ fontSize: 40, color: '#5c6bc0', mb: 1 }} />
                            <Typography variant="h5" fontWeight="600" color="#5c6bc0">
                                ${totalAmount.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Amount
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <PaymentIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                            <Typography variant="h5" fontWeight="600" color="#4caf50">
                                ${paidAmount.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Approved Amount
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <FilterIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                            <Typography variant="h5" fontWeight="600" color="#ff9800">
                                {filteredTransactions.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Transactions
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {isAdmin && (
                    <Card elevation={0} sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="600" mb={3} color="#5c6bc0">
                                Filters
                            </Typography>
                            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr 1fr 1fr' }} gap={2}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Patient"
                                    value={filterPatient}
                                    onChange={(e) => setFilterPatient(e.target.value)}
                                    size="small"
                                >
                                    <MenuItem value="">All Patients</MenuItem>
                                    {users
                                        .filter((u) => u.role === 'client')
                                        .map((user) => (
                                            <MenuItem key={user.id} value={user.id.toString()}>
                                                {user.name} ({user.email})
                                            </MenuItem>
                                        ))}
                                </TextField>

                                <TextField
                                    select
                                    fullWidth
                                    label="Provider"
                                    value={filterProvider}
                                    onChange={(e) => setFilterProvider(e.target.value)}
                                    size="small"
                                >
                                    <MenuItem value="">All Providers</MenuItem>
                                    {providers.map((provider) => (
                                        <MenuItem key={provider.id} value={provider.id.toString()}>
                                            {provider.name} - {provider.specialty || 'General'}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    select
                                    fullWidth
                                    label="Status"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    size="small"
                                >
                                    <MenuItem value="">All Status</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="paid">Paid</MenuItem>
                                    <MenuItem value="on_hold">On Hold</MenuItem>
                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                </TextField>

                                <TextField
                                    type="date"
                                    fullWidth
                                    label="From Date"
                                    value={filterDateFrom}
                                    onChange={(e) => setFilterDateFrom(e.target.value)}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                />

                                <TextField
                                    type="date"
                                    fullWidth
                                    label="To Date"
                                    value={filterDateTo}
                                    onChange={(e) => setFilterDateTo(e.target.value)}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                )}

                <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                    {filteredTransactions.length === 0 ? (
                        <Box p={4} textAlign="center">
                            <Alert severity="info">
                                <Typography variant="h6" gutterBottom>
                                    No payments found
                                </Typography>
                                <Typography variant="body2">
                                    {isPatient && "You haven't made any payments yet."}
                                    {isProvider && "You haven't received any payments yet."}
                                    {isAdmin && 'No payments match your current filters.'}
                                </Typography>
                            </Alert>
                        </Box>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableRow>
                                            {!isProvider && <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>}
                                            {!isPatient && <TableCell sx={{ fontWeight: 600 }}>Provider</TableCell>}
                                            <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredTransactions.map((transaction, index) => (
                                            <TableRow
                                                key={transaction.id}
                                                sx={{
                                                    opacity: 1,
                                                    transition: `opacity ${(index + 1) * 100}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                                                    '&:hover': { bgcolor: '#f9f9f9' },
                                                }}
                                            >
                                                {!isProvider && (
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center" gap={2}>
                                                            <Avatar src={getPhotoUrl(transaction.user.photo)} sx={{ width: 32, height: 32 }}>
                                                                {transaction.user.name.charAt(0)}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" fontWeight="500">
                                                                    {transaction.user.name}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {transaction.user.email}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                )}

                                                {!isPatient && (
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center" gap={2}>
                                                            <Avatar src={getPhotoUrl(transaction.doctor.photo)} sx={{ width: 32, height: 32 }}>
                                                                {transaction.doctor.name.charAt(0)}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" fontWeight="500">
                                                                    {transaction.doctor.name}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {transaction.doctor.specialty || 'General'}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                )}

                                                <TableCell>
                                                    <Typography variant="body1" fontWeight="600" color="#5c6bc0">
                                                        ${parseFloat(transaction.amount).toFixed(2)}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {transaction.card_last4 ? `**** ${transaction.card_last4}` : 'Cash'}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Chip
                                                        label={getStatusLabel(transaction.status)}
                                                        color={getStatusColor(transaction.status)}
                                                        size="small"
                                                        sx={{ fontWeight: 500 }}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <Typography variant="body2">{dayjs(transaction.created_at).format('MMM D, YYYY')}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {dayjs(transaction.created_at).format('h:mm A')}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {transactions.last_page > 1 && (
                                <Box display="flex" justifyContent="space-between" alignItems="center" p={2} borderTop="1px solid #e0e0e0">
                                    <Typography variant="body2" color="text.secondary">
                                        Showing {transactions.from || 0}-{transactions.to || 0} of {transactions.total} transactions
                                    </Typography>
                                    <Pagination
                                        count={transactions.last_page}
                                        page={transactions.current_page}
                                        onChange={(_, page) => {
                                            const url = new URL(window.location.href);
                                            url.searchParams.set('page', page.toString());
                                            window.location.href = url.toString();
                                        }}
                                        color="primary"
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                borderRadius: 2,
                                                fontWeight: 600,
                                                minWidth: 40,
                                                height: 40,
                                                border: '1px solid #e0e0e0',
                                                '&:hover': {
                                                    bgcolor: '#5c6bc0',
                                                    color: 'white',
                                                    transform: 'scale(1.05)',
                                                    boxShadow: '0 4px 8px rgba(92, 107, 192, 0.3)',
                                                },
                                                '&.Mui-selected': {
                                                    bgcolor: '#5c6bc0',
                                                    color: 'white',
                                                    boxShadow: '0 4px 12px rgba(92, 107, 192, 0.4)',
                                                    '&:hover': {
                                                        bgcolor: '#26418f',
                                                    },
                                                },
                                                transition: 'all 0.2s ease',
                                            },
                                            '& .MuiPaginationItem-ellipsis': {
                                                color: 'text.secondary',
                                            },
                                        }}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </Card>
            </Box>
        </AppLayout>
    );
}
