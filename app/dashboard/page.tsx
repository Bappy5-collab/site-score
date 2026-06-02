'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Grid, Typography, Paper, Button } from '@mui/material';
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
  ScriptableContext,
  Plugin,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import HistoryIcon from '@mui/icons-material/History';
import StorageIcon from '@mui/icons-material/Storage';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

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

// Section header with a coloured icon accent
const SectionTitle = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        borderRadius: '10px',
        color: '#FB923C',
        background: 'rgba(249, 115, 22, 0.12)',
        border: '1px solid rgba(249, 115, 22, 0.2)',
      }}
    >
      {icon}
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
      {children}
    </Typography>
  </Box>
);

const DashboardPage = () => {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUserName(JSON.parse(stored).name || '');
    } catch {
      /* ignore */
    }
  }, []);

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

  const makeFill = (rgb: string) => (ctx: ScriptableContext<'line'>) => {
    const { chart } = ctx;
    const { ctx: canvas, chartArea } = chart;
    if (!chartArea) return `rgba(${rgb}, 0)`;
    const g = canvas.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    g.addColorStop(0, `rgba(${rgb}, 0.3)`);
    g.addColorStop(0.5, `rgba(${rgb}, 0.08)`);
    g.addColorStop(1, `rgba(${rgb}, 0)`);
    return g;
  };

  const makeStroke = (from: string, to: string) => (ctx: ScriptableContext<'line'>) => {
    const { chart } = ctx;
    const { ctx: canvas, chartArea } = chart;
    if (!chartArea) return from;
    const g = canvas.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
    g.addColorStop(0, from);
    g.addColorStop(1, to);
    return g;
  };

  const seriesRgb = ['249, 115, 22', '34, 197, 94', '245, 158, 11'];

  const glowPlugin: Plugin<'line'> = {
    id: 'glow-trends',
    beforeDatasetDraw(chart, args) {
      const { ctx } = chart;
      ctx.save();
      ctx.shadowColor = `rgba(${seriesRgb[args.index] || '249, 115, 22'}, 0.4)`;
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
    },
    afterDatasetDraw(chart) {
      chart.ctx.restore();
    },
  };

  const crosshairPlugin: Plugin<'line'> = {
    id: 'crosshair-trends',
    afterDraw(chart) {
      const active = chart.getActiveElements();
      if (!active.length) return;
      const { ctx, chartArea } = chart;
      const x = active[0].element.x;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, chartArea.top);
      ctx.lineTo(x, chartArea.bottom);
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.stroke();
      ctx.restore();
    },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1100, easing: 'easeOutQuart' as const },
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: '#94A3B8',
          usePointStyle: true,
          pointStyle: 'circle' as const,
          boxWidth: 8,
          boxHeight: 8,
          padding: 18,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(14, 20, 34, 0.95)',
        titleColor: '#F8FAFC',
        bodyColor: '#CBD5E1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        usePointStyle: true,
        titleFont: { weight: 'bold' as const },
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false } as any,
        ticks: { color: '#64748B', maxTicksLimit: 7, font: { size: 11 } },
      },
      y: {
        min: 0,
        max: 100,
        border: { display: false } as any,
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false } as any,
        ticks: { color: '#64748B', stepSize: 25, font: { size: 11 }, padding: 8 },
      },
    },
  };

  const lineData = {
    labels: scans.slice(0, 10).reverse().map((scan) => new Date(scan.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Performance',
        data: scans.slice(0, 10).reverse().map((scan) => scan.performanceScore),
        borderColor: makeStroke('#F97316', '#FDBA74'),
        backgroundColor: makeFill('249, 115, 22'),
        tension: 0.45,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBorderColor: '#0E1422',
        pointHoverBorderWidth: 2,
        borderWidth: 2.5,
      },
      {
        label: 'SEO',
        data: scans.slice(0, 10).reverse().map((scan) => scan.seoScore),
        borderColor: makeStroke('#22C55E', '#86EFAC'),
        backgroundColor: makeFill('34, 197, 94'),
        tension: 0.45,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBorderColor: '#0E1422',
        pointHoverBorderWidth: 2,
        borderWidth: 2.5,
      },
      {
        label: 'Security',
        data: scans.slice(0, 10).reverse().map((scan) => scan.securityScore),
        borderColor: makeStroke('#F59E0B', '#FCD34D'),
        backgroundColor: makeFill('245, 158, 11'),
        tension: 0.45,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBorderColor: '#0E1422',
        pointHoverBorderWidth: 2,
        borderWidth: 2.5,
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
            <Box
              sx={{
                display: 'flex',
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.02em' }}
                >
                  {userName ? `Welcome back, ${userName.split(' ')[0]}` : 'Dashboard'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.5 }}>
                  Here&apos;s how your websites are performing.
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/analyzer')}
                sx={{
                  px: 3,
                  py: 1.25,
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '12px',
                  whiteSpace: 'nowrap',
                  background: '#EA580C',
                  boxShadow: 'none',
                  '&:hover': {
                    background: '#C2410C',
                    boxShadow: 'none',
                  },
                }}
              >
                Analyze New Site
              </Button>
            </Box>
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
                        p: { xs: 2.5, md: 3 },
                        height: '100%',
                        background: 'linear-gradient(155deg, #141B2D 0%, #0E1422 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                      }}
                    >
                      <SectionTitle icon={<ShowChartIcon />}>Score Trends</SectionTitle>
                      <Box sx={{ height: 300 }}>
                        <Line data={lineData} options={chartOptions} plugins={[glowPlugin, crosshairPlugin]} />
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
                        p: { xs: 2.5, md: 3 },
                        height: '100%',
                        background: 'linear-gradient(155deg, #141B2D 0%, #0E1422 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                      }}
                    >
                      <SectionTitle icon={<HistoryIcon />}>Recent Scans</SectionTitle>
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
                        p: { xs: 2.5, md: 3 },
                        background: 'linear-gradient(155deg, #141B2D 0%, #0E1422 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                      }}
                    >
                      <SectionTitle icon={<StorageIcon />}>All Scans</SectionTitle>
                      {scans.length > 0 ? (
                        <ScanTable scans={scans} />
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              mx: 'auto',
                              mb: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '12px',
                              color: '#FB923C',
                              background: 'rgba(249, 115, 22, 0.12)',
                              border: '1px solid rgba(249, 115, 22, 0.2)',
                            }}
                          >
                            <SearchIcon sx={{ fontSize: 32 }} />
                          </Box>
                          <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 600, mb: 0.5 }}>
                            No scans yet
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
                            Analyze your first website to see scores, trends and AI insights here.
                          </Typography>
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => router.push('/analyzer')}
                            sx={{
                              px: 3,
                              py: 1.1,
                              fontWeight: 700,
                              textTransform: 'none',
                              borderRadius: '12px',
                              background: '#EA580C',
                              boxShadow: 'none',
                              '&:hover': {
                                background: '#C2410C',
                              },
                            }}
                          >
                            Run your first scan
                          </Button>
                        </Box>
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
