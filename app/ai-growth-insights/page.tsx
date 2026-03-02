'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  LinearProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getInsights, type InsightsResponse } from '@/services/insightsService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend, Filler);

const cardSx = {
  p: 3,
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': { borderColor: 'rgba(139, 92, 246, 0.25)' },
};

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94A3B8', usePointStyle: true } },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      titleColor: '#F1F5F9',
      bodyColor: '#94A3B8',
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A3B8' } },
    y: {
      min: 0,
      max: 100,
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#94A3B8' },
    },
  },
};

const defaultInsights: InsightsResponse = {
  performanceOverTime: { labels: [], datasets: [] },
  growthSummary: { trend: 0, scansAnalyzed: 0, trendLabel: 'No data yet' },
  suggestions: [],
};

export default function AIGrowthInsightsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<InsightsResponse>(defaultInsights);

  useEffect(() => {
    let cancelled = false;
    getInsights()
      .then((data) => {
        if (!cancelled) setInsights(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || err.message || 'Failed to load insights');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const performanceOverTime = {
    ...insights.performanceOverTime,
    datasets: (insights.performanceOverTime.datasets || []).map((d) => ({
      ...d,
      fill: true,
      tension: 0.4,
    })),
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 0, sm: 1 } }}>
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <InsightsIcon sx={{ color: '#8B5CF6', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em' }}>
                  AI Growth Insights
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.25 }}>
                  Trends and smart improvement suggestions from your scan history
                </Typography>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {loading ? (
              <Typography sx={{ color: '#94A3B8' }}>Loading insights...</Typography>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <Paper elevation={0} sx={cardSx}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#F1F5F9', mb: 2 }}>
                        Performance Over Time
                      </Typography>
                      <Box sx={{ height: 320 }}>
                        {performanceOverTime.labels?.length ? (
                          <Line data={performanceOverTime} options={chartOptions} />
                        ) : (
                          <Typography sx={{ color: '#64748B', pt: 4 }}>Run scans to see performance over time.</Typography>
                        )}
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Paper elevation={0} sx={cardSx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <TrendingUpIcon sx={{ color: '#22C55E' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
                          Growth Summary
                        </Typography>
                      </Box>
                      <Box sx={{ '& > *': { mb: 2 } }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>Performance trend</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: insights.growthSummary.trend >= 0 ? '#22C55E' : '#F87171' }}>
                            {insights.growthSummary.trend >= 0 ? '+' : ''}{insights.growthSummary.trend} pts
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>Scans analyzed</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9' }}>{insights.growthSummary.scansAnalyzed}</Typography>
                        </Box>
                        <Chip label={insights.growthSummary.trendLabel} size="small" sx={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80', border: '1px solid rgba(34, 197, 94, 0.3)' }} />
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
                <Grid item xs={12}>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <Paper elevation={0} sx={cardSx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <BuildCircleIcon sx={{ color: '#8B5CF6' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
                          What to Fix Next
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        {(insights.suggestions && insights.suggestions.length > 0 ? insights.suggestions : []).map((s, i) => (
                          <Grid item xs={12} sm={6} md={3} key={s.id}>
                            <Paper
                              component={motion.div}
                              whileHover={{ y: -2 }}
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: '14px',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.06)',
                              }}
                            >
                              <Typography variant="body2" sx={{ color: '#F1F5F9', fontWeight: 500, mb: 1 }}>
                                {s.title}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Chip label={s.impact} size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
                                <Typography variant="caption" sx={{ color: '#64748B' }}>Priority {s.priority}%</Typography>
                              </Box>
                              <LinearProgress variant="determinate" value={s.priority} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { bgcolor: '#8B5CF6' } }} />
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                      {insights.suggestions?.length === 0 && (
                        <Typography variant="body2" sx={{ color: '#64748B', mt: 2 }}>Run more scans to get AI improvement suggestions.</Typography>
                      )}
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>
            )}
          </motion.div>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
}
