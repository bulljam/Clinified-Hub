import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Stack,
  Avatar,
  Paper,
  InputAdornment,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  PersonAdd as PersonAddIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { Crown as CrownIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
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

interface PaginationData {
  current_page: number;
  data: Admin[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface Props {
  admins: PaginationData;
  filters: {
    search: string;
    role: string;
    per_page: number;
  };
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function AdminsIndex({ admins, filters, flash }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [roleFilter, setRoleFilter] = useState(filters.role || '');
  const [perPage, setPerPage] = useState(filters.per_page || 10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (flash?.success) {
      setSnackbar({ open: true, message: flash.success, severity: 'success' });
    } else if (flash?.error) {
      setSnackbar({ open: true, message: flash.error, severity: 'error' });
    }
  }, [flash]);

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get(superAdmin.admins.index().url, {
      search: value,
      role: roleFilter,
      per_page: perPage,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    router.get(superAdmin.admins.index().url, {
      search,
      role,
      per_page: perPage,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    router.get(superAdmin.admins.index().url, {
      search,
      role: roleFilter,
      per_page: newPerPage,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePageChange = (page: number) => {
    router.get(superAdmin.admins.index().url, {
      search,
      role: roleFilter,
      per_page: perPage,
      page: page + 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleDeleteClick = (admin: Admin) => {
    setAdminToDelete(admin);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return;

    setDeleteDialogOpen(false);
    setAdminToDelete(null);
    
    router.delete(superAdmin.admins.destroy(adminToDelete.id).url);
  };

  const getRoleIcon = (role: string) => {
    return role === 'super_admin' ? (
      <CrownIcon sx={{ fontSize: 18, color: '#dc2626' }} />
    ) : (
      <ShieldIcon sx={{ fontSize: 18, color: '#7c3aed' }} />
    );
  };

  const getRoleChip = (role: string) => {
    return role === 'super_admin' ? (
      <Chip 
        icon={<CrownIcon />}
        label="Super Admin" 
        size="small" 
        sx={{ 
          backgroundColor: '#fee2e2', 
          color: '#dc2626',
          border: '1px solid #fecaca',
          fontWeight: 600 
        }} 
      />
    ) : (
      <Chip 
        icon={<ShieldIcon />}
        label="Admin" 
        size="small" 
        sx={{ 
          backgroundColor: '#f0fdfa', 
          color: '#14b8a6',
          border: '1px solid #ccfbf1',
          fontWeight: 600 
        }} 
      />
    );
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin Management', href: superAdmin.admins.index().url },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Admin Management" />
      
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#1f2937', mb: 1 }}>
                Admin Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage system administrators and super administrators
              </Typography>
            </Box>
            <Button
              component={Link}
              href={superAdmin.admins.create().url}
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{
                bgcolor: '#0f172a',
                '&:hover': { bgcolor: '#1e293b' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
              }}
            >
              Add New Admin
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <TextField
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />
              
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Role Filter</InputLabel>
                <Select
                  value={roleFilter}
                  label="Role Filter"
                  onChange={(e) => handleRoleFilter(e.target.value)}
                  startAdornment={<FilterIcon color="action" sx={{ mr: 1 }} />}
                >
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="super_admin">Super Admin</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Per Page</InputLabel>
                <Select
                  value={perPage}
                  label="Per Page"
                  onChange={(e) => handlePerPageChange(Number(e.target.value))}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* Table */}
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Admin</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Created</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: '#374151' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.data.map((admin) => (
                  <TableRow 
                    key={admin.id}
                    hover
                    sx={{ '&:hover': { bgcolor: '#fafbfc' } }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: admin.role === 'super_admin' ? '#dc2626' : '#14b8a6', color: 'white', fontWeight: 600 }}>
                          {admin.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600} color="#1f2937">
                            {admin.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {admin.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      {getRoleChip(admin.role)}
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(admin.created_at).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="View Details">
                          <IconButton
                            component={Link}
                            href={superAdmin.admins.show(admin.id).url}
                            size="small"
                            sx={{ 
                              color: '#6b7280',
                              '&:hover': { 
                                bgcolor: '#e5e7eb',
                                color: '#374151' 
                              }
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Edit Admin">
                          <IconButton
                            component={Link}
                            href={superAdmin.admins.edit(admin.id).url}
                            size="small"
                            sx={{ 
                              color: '#2563eb',
                              '&:hover': { 
                                bgcolor: '#dbeafe',
                                color: '#1d4ed8' 
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete Admin">
                          <IconButton
                            onClick={() => handleDeleteClick(admin)}
                            size="small"
                            sx={{ 
                              color: '#dc2626',
                              '&:hover': { 
                                bgcolor: '#fee2e2',
                                color: '#b91c1c' 
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={admins.total}
            page={admins.current_page - 1}
            onPageChange={(_, page) => handlePageChange(page)}
            rowsPerPage={perPage}
            onRowsPerPageChange={(e) => handlePerPageChange(Number(e.target.value))}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              borderTop: '1px solid #e5e7eb',
              bgcolor: '#f8fafc',
              '& .MuiTablePagination-toolbar': {
                fontWeight: 500,
              }
            }}
          />
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600, color: '#dc2626' }}>
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete <strong>{adminToDelete?.name}</strong>? 
              This action cannot be undone and will permanently remove their admin access.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              sx={{ textTransform: 'none' }}
            >
              Delete Admin
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AppLayout>
  );
}