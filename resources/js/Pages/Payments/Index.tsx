import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Box, Card, CardContent, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, type ChipProps } from '@mui/material';
import React from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Transaction {
    id: number;
    amount: string;
    card_last4: string;
    status: 'pending' | 'paid' | 'failed';
    created_at: string;
    user: User;
    doctor: User;
}

interface PaymentsIndexProps {
    transactions: Transaction[];
}

export default function PaymentsIndex({ transactions }: PaymentsIndexProps) {
    const getStatusColor = (status: string): ChipProps['color'] => {
        switch (status) {
            case 'paid':
                return 'success';
            case 'failed':
                return 'error';
            case 'pending':
            default:
                return 'warning';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return '🟢';
            case 'failed':
                return '🔴';
            case 'pending':
            default:
                return '🟡';
        }
    };

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(parseFloat(amount));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Head title="Payments" />

            <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Payment Transactions
                </Typography>

                <Card>
                    <CardContent sx={{ p: 0 }}>
                        <TableContainer component={Paper} elevation={0}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                                        <TableCell>Patient</TableCell>
                                        <TableCell>Doctor</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell>Card</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                                No transactions found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.map((transaction) => (
                                            <TableRow
                                                key={transaction.id}
                                                hover
                                                sx={{
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                }}
                                            >
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {transaction.user.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {transaction.user.email}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {transaction.doctor.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {transaction.doctor.email}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                <TableCell align="right">
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {formatCurrency(transaction.amount)}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                                                        •••• {transaction.card_last4}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Chip
                                                        label={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <span>{getStatusIcon(transaction.status)}</span>
                                                                <span style={{ textTransform: 'capitalize' }}>{transaction.status}</span>
                                                            </Box>
                                                        }
                                                        color={getStatusColor(transaction.status)}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatDate(transaction.created_at)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}

PaymentsIndex.layout = (page: React.ReactElement) => <AppLayout children={page} />;
