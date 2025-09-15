import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Paper,
  Avatar,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Shield as ShieldIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { Crown as CrownIcon } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
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
  appointments?: any[];
  providedAppointments?: any[];
}

interface Props {
  admin: Admin;
}

export default function ShowAdmin({ admin }: Props) {
  const getRoleIcon = (role: string) => {
    return role === 'super_admin' ? (
      <CrownIcon sx={{ fontSize: 24, color: '#dc2626' }} />
    ) : (
      <ShieldIcon sx={{ fontSize: 24, color: '#5c6bc0' }} />
    );
  };

  const getRoleChip = (role: string) => {
    return role === 'super_admin' ? (
      <Chip 
        icon={<CrownIcon />}
        label="Super Admin" 
        sx={{ 
          backgroundColor: '#fee2e2', 
          color: '#dc2626',
          border: '1px solid #fecaca',
          fontWeight: 600,
          fontSize: '0.875rem'
        }} 
      />
    ) : (
      <Chip 
        icon={<ShieldIcon />}
        label="Admin" 
        sx={{ 
          backgroundColor: '#f0fdfa', 
          color: '#5c6bc0',
          border: '1px solid #ccfbf1',
          fontWeight: 600,
          fontSize: '0.875rem'
        }} 
      />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin Management', href: superAdmin.admins.index().url },
    { title: admin.name, href: '' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Admin Details - ${admin.name}`} />
      
      <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
        {/* Header */}
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
            Admin Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View detailed information about this administrator
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Main Profile Card */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <Box 
                sx={{ 
                  bgcolor: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  color: 'white',
                  p: 4,
                  position: 'relative'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: admin.role === 'super_admin' ? '#dc2626' : '#5c6bc0',
                      color: 'white', 
                      fontWeight: 600,
                      fontSize: '2rem'
                    }}
                  >
                    {admin.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                      {admin.name}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                      {admin.email}
                    </Typography>
                    {getRoleChip(admin.role)}
                  </Box>
                </Box>
                
                {/* Decorative elements */}
                <Box sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  right: 16, 
                  opacity: 0.1,
                  fontSize: '3rem',
                  fontWeight: 600,
                  color: 'white'
                }}>
                  {admin.name.charAt(0).toUpperCase()}
                </Box>
              </Box>

              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#374151' }}>
                  Account Information
                </Typography>
                
                <List sx={{ p: 0 }}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemIcon>
                      <PersonIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Full Name" 
                      secondary={admin.name}
                      primaryTypographyProps={{ fontWeight: 600, color: '#6b7280' }}
                      secondaryTypographyProps={{ fontSize: '1rem', color: '#1f2937' }}
                    />
                  </ListItem>
                  
                  <Divider />
                  
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemIcon>
                      <EmailIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email Address" 
                      secondary={admin.email}
                      primaryTypographyProps={{ fontWeight: 600, color: '#6b7280' }}
                      secondaryTypographyProps={{ fontSize: '1rem', color: '#1f2937' }}
                    />
                  </ListItem>
                  
                  <Divider />
                  
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemIcon>
                      {admin.role === 'super_admin' ? 
                        <CrownIcon sx={{ color: '#dc2626' }} /> : 
                        <ShieldIcon sx={{ color: '#5c6bc0' }} />
                      }
                    </ListItemIcon>
                    <ListItemText 
                      primary="Role & Permissions" 
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          {getRoleChip(admin.role)}
                          <Typography variant="caption" display="block" sx={{ mt: 1, color: '#6b7280' }}>
                            {admin.role === 'super_admin' 
                              ? 'Full system control including admin management'
                              : 'Standard administrator with system management access'
                            }
                          </Typography>
                        </Box>
                      }
                      primaryTypographyProps={{ fontWeight: 600, color: '#6b7280' }}
                    />
                  </ListItem>
                  
                  <Divider />
                  
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemIcon>
                      <CalendarIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Account Created" 
                      secondary={formatDate(admin.created_at)}
                      primaryTypographyProps={{ fontWeight: 600, color: '#6b7280' }}
                      secondaryTypographyProps={{ fontSize: '1rem', color: '#1f2937' }}
                    />
                  </ListItem>
                  
                  <Divider />
                  
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemIcon>
                      <ScheduleIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Last Updated" 
                      secondary={formatDate(admin.updated_at)}
                      primaryTypographyProps={{ fontWeight: 600, color: '#6b7280' }}
                      secondaryTypographyProps={{ fontSize: '1rem', color: '#1f2937' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Paper>
          </Grid>

          {/* Actions & Stats */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Action Buttons */}
              <Paper sx={{ borderRadius: 3, p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#374151' }}>
                  Actions
                </Typography>
                
                <Stack spacing={2}>
                  <Button
                    component={Link}
                    href={superAdmin.admins.edit(admin.id).url}
                    variant="contained"
                    startIcon={<EditIcon />}
                    fullWidth
                    sx={{
                      bgcolor: '#2563eb',
                      '&:hover': { bgcolor: '#1d4ed8' },
                      textTransform: 'none',
                      py: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    Edit Admin
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    fullWidth
                    color="error"
                    sx={{ 
                      textTransform: 'none',
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: '#dc2626',
                      color: '#dc2626',
                      '&:hover': { 
                        borderColor: '#b91c1c',
                        backgroundColor: '#fee2e2'
                      }
                    }}
                  >
                    Delete Admin
                  </Button>
                </Stack>
              </Paper>

              {/* Quick Stats */}
              <Paper sx={{ borderRadius: 3, p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#374151' }}>
                  Account Statistics
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupIcon sx={{ fontSize: 20, color: '#6b7280' }} />
                      <Typography variant="body2" color="#6b7280" fontWeight={500}>
                        Account Age
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600} color="#1f2937">
                      {Math.floor((new Date().getTime() - new Date(admin.created_at).getTime()) / (1000 * 60 * 60 * 24))} days
                    </Typography>
                  </Box>
                  
                  <Divider />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon sx={{ fontSize: 20, color: '#6b7280' }} />
                      <Typography variant="body2" color="#6b7280" fontWeight={500}>
                        Status
                      </Typography>
                    </Box>
                    <Chip 
                      label="Active" 
                      size="small"
                      sx={{ 
                        backgroundColor: '#dcfce7', 
                        color: '#16a34a',
                        fontWeight: 600 
                      }} 
                    />
                  </Box>
                </Stack>
              </Paper>

              {/* Role Information */}
              <Paper sx={{ borderRadius: 3, p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#374151' }}>
                  Role Information
                </Typography>
                
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      mx: 'auto', 
                      mb: 2,
                      bgcolor: admin.role === 'super_admin' ? '#dc2626' : '#5c6bc0',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1.5rem'
                    }}
                  >
                    {admin.name.charAt(0).toUpperCase()}
                  </Avatar>
                  {getRoleChip(admin.role)}
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {admin.role === 'super_admin' 
                    ? 'Has complete control over the system including user management, system configuration, and administrative oversight.'
                    : 'Can manage system operations, user accounts, and administrative tasks within their designated permissions.'
                  }
                </Typography>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
}