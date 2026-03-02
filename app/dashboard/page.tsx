'use client';

import { useEffect, useState } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import PremiumCard from '@/components/PremiumCard';
import ScanTable from '@/components/ScanTable';
import ScoreHistoryChart from '@/components/ScoreHistoryChart';
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '@/components/LoadingSkeleton';
import { scanService, DashboardStats, Scan } from '@/services/scanService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, scansData] = await Promise.all([
          scanService.getStats(),
          scanService.getMyScans(),
        ]);
        setStats(statsData);
        setScans(scansData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#94A3B8',
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#F1F5F9',
        bodyColor: '#94A3B8',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#94A3B8',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#94A3B8',
        },
        min: 0,
        max: 100,
      },
    },
  };

  const lineData = {
    labels: scans.slice(0, 10).reverse().map((scan) => new Date(scan.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Performance Score',
        data: scans.slice(0, 10).reverse().map((scan) => scan.performanceScore),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'SEO Score',
        data: scans.slice(0, 10).reverse().map((scan) => scan.seoScore),
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Security Score',
        data: scans.slice(0, 10).reverse().map((scan) => scan.securityScore),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ width: '100%', maxWidth: '1400px', mx: 'auto', px: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Dashboard
            </Typography>
          </motion.div>

          {loading ? (
            <Grid container spacing={2}>
              {[...Array(4)].map((_, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <CardSkeleton />
                </Grid>
              ))}
            </Grid>
          ) : (
            <>
              {/* Stats Cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <PremiumCard
                    title="Total Scans"
                    value={stats?.totalScans || 0}
                    icon={<AssessmentIcon />}
                    color="info"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <PremiumCard
                    title="Avg Performance"
                    value={stats?.avgPerformanceScore || 0}
                    subtitle="/100"
                    progress={stats?.avgPerformanceScore}
                    icon={<SpeedIcon />}
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <PremiumCard
                    title="Avg SEO Score"
                    value={stats?.avgSeoScore || 0}
                    subtitle="/100"
                    progress={stats?.avgSeoScore}
                    icon={<TrendingUpIcon />}
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <PremiumCard
                    title="Avg Security"
                    value={stats?.avgSecurityScore || 0}
                    subtitle="/100"
                    progress={stats?.avgSecurityScore}
                    icon={<SecurityIcon />}
                    color="warning"
                  />
                </Grid>
              </Grid>

              {/* Charts Section */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={8}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#F1F5F9' }}>
                        Score Trends
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <Line data={lineData} options={chartOptions} />
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#F1F5F9' }}>
                        Recent Scans
                      </Typography>
                      {scans.length > 0 ? (
                        <ScanTable scans={scans.slice(0, 5)} />
                      ) : (
                        <Typography variant="body2" sx={{ color: '#94A3B8', textAlign: 'center', py: 4 }}>
                          No scans yet
                        </Typography>
                      )}
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>

              {/* Score History Charts */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <ScoreHistoryChart
                    scans={scans}
                    scoreType="performanceScore"
                    title="Performance Score History"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ScoreHistoryChart
                    scans={scans}
                    scoreType="seoScore"
                    title="SEO Score History"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ScoreHistoryChart
                    scans={scans}
                    scoreType="securityScore"
                    title="Security Score History"
                  />
                </Grid>
              </Grid>

              {/* All Scans Table */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#F1F5F9' }}>
                        All Scans
                      </Typography>
                      {scans.length > 0 ? (
                        <ScanTable scans={scans} />
                      ) : (
                        <Typography variant="body2" sx={{ color: '#94A3B8', textAlign: 'center', py: 4 }}>
                          No scans yet. Start analyzing websites to see your scan history.
                        </Typography>
                      )}
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default DashboardPage;
