'use client';

import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { compareService, ComparisonResult } from '@/services/compareService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ScriptableContext,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

// Vertical gradient fill for a bar (lighter at the base, full colour at the top)
const makeBarGradient = (rgb: string) => (ctx: ScriptableContext<'bar'>) => {
  const { chart } = ctx;
  const { ctx: canvas, chartArea } = chart;
  if (!chartArea) return `rgba(${rgb}, 0.9)`;
  const g = canvas.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  g.addColorStop(0, `rgba(${rgb}, 0.35)`);
  g.addColorStop(1, `rgba(${rgb}, 1)`);
  return g;
};

const YOUR_RGB = '252, 82, 63'; // orange
const COMP_RGB = '56, 189, 248'; // sky blue

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 900, easing: 'easeOutQuart' as const },
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
      ticks: { color: '#64748B', font: { size: 12 } },
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

const ComparePage = () => {
  const [yourUrl, setYourUrl] = useState('');
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);

  const handleCompare = async () => {
    if (!yourUrl.trim() || !competitorUrl.trim()) {
      setError('Please enter both URLs');
      return;
    }

    setError('');
    setLoading(true);
    setComparison(null);

    try {
      const result = await compareService.compareWebsites(yourUrl.trim(), competitorUrl.trim());
      setComparison(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to compare websites');
    } finally {
      setLoading(false);
    }
  };

  const chartData = comparison
    ? {
        labels: ['Performance', 'SEO', 'Security', 'Overall'],
        datasets: [
          {
            label: 'Your Site',
            data: [
              comparison.yourSite.performanceScore,
              comparison.yourSite.seoScore,
              comparison.yourSite.securityScore,
              comparison.yourSite.overallScore,
            ],
            backgroundColor: makeBarGradient(YOUR_RGB),
            hoverBackgroundColor: `rgba(${YOUR_RGB}, 1)`,
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 44,
            categoryPercentage: 0.6,
            barPercentage: 0.85,
          },
          {
            label: 'Competitor',
            data: [
              comparison.competitorSite.performanceScore,
              comparison.competitorSite.seoScore,
              comparison.competitorSite.securityScore,
              comparison.competitorSite.overallScore,
            ],
            backgroundColor: makeBarGradient(COMP_RGB),
            hoverBackgroundColor: `rgba(${COMP_RGB}, 1)`,
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 44,
            categoryPercentage: 0.6,
            barPercentage: 0.85,
          },
        ],
      }
    : null;

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
              sx={{ fontWeight: 700, mb: 3, color: '#0F172A', letterSpacing: '-0.02em' }}
            >
              Competitor Comparison
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Paper
              sx={{
                p: { xs: 2.5, md: 3 },
                mb: 3,
                background: 'linear-gradient(155deg, #FFFFFF 0%, #F8FAFC 100%)',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                borderRadius: '10px',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="Your Website URL"
                    placeholder="https://yoursite.com"
                    value={yourUrl}
                    onChange={(e) => setYourUrl(e.target.value)}
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: '#FFFFFF',
                        border: '1px solid rgba(15, 23, 42, 0.08)',
                        borderRadius: '8px',
                        color: '#0F172A',
                        '&:hover': {
                          borderColor: 'rgba(252, 82, 63, 0.3)',
                        },
                        '&.Mui-focused': {
                          borderColor: '#FC523F',
                        },
                        '& fieldset': {
                          border: 'none',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748B',
                      },
                      '& .MuiInputBase-input': {
                        color: '#0F172A',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="Competitor Website URL"
                    placeholder="https://competitor.com"
                    value={competitorUrl}
                    onChange={(e) => setCompetitorUrl(e.target.value)}
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: '#FFFFFF',
                        border: '1px solid rgba(15, 23, 42, 0.08)',
                        borderRadius: '8px',
                        color: '#0F172A',
                        '&:hover': {
                          borderColor: 'rgba(252, 82, 63, 0.3)',
                        },
                        '&.Mui-focused': {
                          borderColor: '#FC523F',
                        },
                        '& fieldset': {
                          border: 'none',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748B',
                      },
                      '& .MuiInputBase-input': {
                        color: '#0F172A',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleCompare}
                    disabled={loading}
                    sx={{
                      height: '56px',
                      background: loading
                        ? 'rgba(252, 82, 63, 0.3)'
                        : '#FC523F',
                      boxShadow: loading ? 'none' : 'none',
                      '&:hover': {
                        background: '#C9341F',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /> : 'Compare'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          {comparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      background: 'linear-gradient(155deg, #FFFFFF 0%, #F8FAFC 100%)',
                      border: '1px solid rgba(15, 23, 42, 0.08)',
                      borderRadius: '10px',
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#0F172A' }}>
                      Comparison Chart
                    </Typography>
                    <Box sx={{ height: 400 }}>
                      {chartData && <Bar data={chartData} options={chartOptions} />}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      background: 'linear-gradient(155deg, #FFFFFF 0%, #F8FAFC 100%)',
                      border: '1px solid rgba(15, 23, 42, 0.08)',
                      borderRadius: '10px',
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#0F172A' }}>
                      Insights
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {comparison.insights.map((insight, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{
                            color: '#64748B',
                            p: 2,
                            background: 'rgba(15, 23, 42, 0.04)',
                            borderRadius: '8px',
                            border: '1px solid rgba(15, 23, 42, 0.08)',
                          }}
                        >
                          {insight}
                        </Typography>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default ComparePage;
