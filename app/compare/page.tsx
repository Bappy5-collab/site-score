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
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

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
        min: 0,
        max: 100,
      },
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
            backgroundColor: 'rgba(139, 92, 246, 0.8)',
            borderRadius: 8,
          },
          {
            label: 'Competitor',
            data: [
              comparison.competitorSite.performanceScore,
              comparison.competitorSite.seoScore,
              comparison.competitorSite.securityScore,
              comparison.competitorSite.overallScore,
            ],
            backgroundColor: 'rgba(236, 72, 153, 0.8)',
            borderRadius: 8,
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
              sx={{
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
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
                p: 3,
                mb: 3,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
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
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        color: '#F1F5F9',
                        '&:hover': {
                          borderColor: 'rgba(139, 92, 246, 0.3)',
                        },
                        '&.Mui-focused': {
                          borderColor: '#8B5CF6',
                        },
                        '& fieldset': {
                          border: 'none',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#94A3B8',
                      },
                      '& .MuiInputBase-input': {
                        color: '#F1F5F9',
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
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        color: '#F1F5F9',
                        '&:hover': {
                          borderColor: 'rgba(139, 92, 246, 0.3)',
                        },
                        '&.Mui-focused': {
                          borderColor: '#8B5CF6',
                        },
                        '& fieldset': {
                          border: 'none',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#94A3B8',
                      },
                      '& .MuiInputBase-input': {
                        color: '#F1F5F9',
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
                        ? 'rgba(139, 92, 246, 0.3)'
                        : 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                      boxShadow: loading ? 'none' : '0 8px 24px rgba(139, 92, 246, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)',
                        boxShadow: '0 12px 32px rgba(139, 92, 246, 0.5)',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: '#F1F5F9' }} /> : 'Compare'}
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
                  borderRadius: '12px',
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
                      p: 3,
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '20px',
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#F1F5F9' }}>
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
                      p: 3,
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '20px',
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#F1F5F9' }}>
                      Insights
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {comparison.insights.map((insight, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{
                            color: '#94A3B8',
                            p: 2,
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
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
