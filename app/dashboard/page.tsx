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
import DashboardTour from '@/components/DashboardTour';
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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: '8px',
        color: '#FC523F',
        background: 'rgba(252, 82, 63, 0.1)',
        '& svg': { fontSize: 19 },
      }}
    >
      {icon}
    </Box>
    <Typography sx={{ fontWeight: 600, fontSize: '1.0625rem', color: '#0F172A', letterSpacing: '-0.01em' }}>
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
          color: '#64748B',
          usePointStyle: true,
          pointStyle: 'circle' as const,
          boxWidth: 8,
          boxHeight: 8,
          padding: 18,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#0F172A',
        bodyColor: '#334155',
        borderColor: 'rgba(15, 23, 42, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
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
        grid: { color: 'rgba(15, 23, 42, 0.04)', drawBorder: false } as any,
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
        borderColor: makeStroke('#FC523F', '#FDA294'),
        backgroundColor: makeFill('252, 82, 63'),
        tension: 0.45,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBorderColor: '#F8FAFC',
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
        pointHoverBorderColor: '#F8FAFC',
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
        pointHoverBorderColor: '#F8FAFC',
        pointHoverBorderWidth: 2,
        borderWidth: 2.5,
      },
    ],
  };

  return (
    <ProtectedRoute>
      <Layout>
        {/* First-visit guided tour */}
        <DashboardTour enabled={!loading} />
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
                  sx={{ fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}
                >
                  {userName ? `Welcome back, ${userName.split(' ')[0]}` : 'Dashboard'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                  Here&apos;s how your websites are performing.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  startIcon={<HelpOutlineIcon />}
                  onClick={() => window.dispatchEvent(new Event('sitescore:start-tour'))}
                  sx={{
                    px: 2.25,
                    py: 1.25,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    borderColor: 'rgba(15,23,42,0.15)',
                    color: '#64748B',
                    '&:hover': { borderColor: 'rgba(252,82,63,0.5)', background: 'rgba(252,82,63,0.08)', color: '#0F172A' },
                  }}
                >
                  Take a tour
                </Button>
                <Button
                  data-tour="analyze"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/analyzer')}
                  sx={{
                    px: 3,
                    py: 1.25,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    background: '#FC523F',
                    boxShadow: '0 1px 2px rgba(252, 82, 63, 0.3)',
                    '&:hover': {
                      background: '#E13E2C',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Analyze New Site
                </Button>
              </Box>
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
              <Grid container spacing={2} sx={{ mb: 3 }} data-tour="stats">
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
                      data-tour="trends"
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        height: '100%',
                        background: '#FFFFFF',
                        border: '1px solid #E5E9F0',
                        borderRadius: '10px',
                        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                      }}
                    >
                      <SectionTitle icon={<ShowChartIcon />}>Score Trends</SectionTitle>
                      <Box sx={{ height: 300 }}>
                        <Line data={lineData} options={chartOptions} plugins={[crosshairPlugin]} />
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
                      data-tour="recent"
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        height: '100%',
                        background: '#FFFFFF',
                        border: '1px solid #E5E9F0',
                        borderRadius: '10px',
                        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                      }}
                    >
                      <SectionTitle icon={<HistoryIcon />}>Recent Scans</SectionTitle>
                      {scans.length > 0 ? (
                        <ScanTable scans={scans.slice(0, 5)} />
                      ) : (
                        <Typography variant="body2" sx={{ color: '#64748B', textAlign: 'center', py: 4 }}>
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
                      data-tour="all-scans"
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        background: '#FFFFFF',
                        border: '1px solid #E5E9F0',
                        borderRadius: '10px',
                        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                      }}
                    >
                      <SectionTitle icon={<StorageIcon />}>All Scans</SectionTitle>
                      {scans.length > 0 ? (
                        <ScanTable scans={scans} />
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              mx: 'auto',
                              mb: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '12px',
                              color: '#FC523F',
                              background: 'rgba(252, 82, 63, 0.1)',
                            }}
                          >
                            <SearchIcon sx={{ fontSize: 32 }} />
                          </Box>
                          <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 600, mb: 0.5 }}>
                            No scans yet
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                            Analyze your first website to see scores, trends and AI insights here.
                          </Typography>
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => router.push('/analyzer')}
                            sx={{
                              px: 3,
                              py: 1.1,
                              fontWeight: 600,
                              textTransform: 'none',
                              borderRadius: '8px',
                              background: '#FC523F',
                              boxShadow: '0 1px 2px rgba(252, 82, 63, 0.3)',
                              '&:hover': {
                                background: '#E13E2C',
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
