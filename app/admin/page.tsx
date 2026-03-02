'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { adminService, AdminStats } from '@/services/adminService';
import AdminUsersTable from '@/components/AdminUsersTable';
import AdminScansTable from '@/components/AdminScansTable';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    const fetchStats = async () => {
      try {
        const statsData = await adminService.getStats();
        setStats(statsData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchStats();
    }
  }, [user, router]);

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Admin Panel
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {stats && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {stats.totalUsers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Users
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {stats.totalScans}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Scans
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {stats.recentScans}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recent Scans (7 days)
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {stats.totalAdmins}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Admins
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Users Management
                    </Typography>
                    <AdminUsersTable />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      All Scans
                    </Typography>
                    <AdminScansTable />
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminPage;
