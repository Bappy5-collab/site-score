'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';
import { scanService, Scan } from '@/services/scanService';
import { aiService } from '@/services/aiService';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import PremiumCard from '@/components/PremiumCard';
import ChatPanel from '@/components/ChatPanel';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
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
      display: false,
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

const AnalyzerPage = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanResult, setScanResult] = useState<Scan | null>(null);
  const [capturingScreenshot, setCapturingScreenshot] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setError('');
    setLoading(true);
    setScanResult(null);

    try {
      const result = await scanService.createScan({ url: url.trim() });
      setScanResult(result);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to analyze website';
      setError(err.response?.status === 403 ? `${msg} Upgrade your plan for more scans.` : msg);
    } finally {
      setLoading(false);
    }
  };

  const chartData = scanResult
    ? {
        labels: ['Performance', 'SEO', 'Security'],
        datasets: [
          {
            label: 'Scores',
            data: [
              scanResult.performanceScore,
              scanResult.seoScore,
              scanResult.securityScore,
            ],
            backgroundColor: [
              'rgba(139, 92, 246, 0.8)',
              'rgba(34, 197, 94, 0.8)',
              'rgba(245, 158, 11, 0.8)',
            ],
            borderRadius: 8,
          },
        ],
      }
    : null;

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ width: '100%' }}>
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
                textAlign: 'center',
                background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Website Analyzer
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
                mb: 2,
                mx: 'auto',
                maxWidth: 900,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={9}>
                  <TextField
                    fullWidth
                    placeholder="Enter website URL (e.g., https://example.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !loading) {
                        handleAnalyze();
                      }
                    }}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 2, color: '#8B5CF6' }}>
                          <SearchIcon />
                        </Box>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '1.125rem',
                        py: 1.5,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleAnalyze}
                    disabled={loading}
                    sx={{
                      height: '56px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: loading
                        ? 'rgba(139, 92, 246, 0.3)'
                        : 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                      boxShadow: loading
                        ? 'none'
                        : '0 8px 24px rgba(139, 92, 246, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)',
                        boxShadow: '0 12px 32px rgba(139, 92, 246, 0.5)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'rgba(139, 92, 246, 0.3)',
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: '#F1F5F9' }} />
                    ) : (
                      'Analyze'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
          </AnimatePresence>

          <AnimatePresence>
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={4}>
                    <PremiumCard
                      title="Performance Score"
                      value={scanResult.performanceScore}
                      subtitle="/100"
                      progress={scanResult.performanceScore}
                      icon={<SpeedIcon />}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <PremiumCard
                      title="SEO Score"
                      value={scanResult.seoScore}
                      subtitle="/100"
                      progress={scanResult.seoScore}
                      icon={<TrendingUpIcon />}
                      color="success"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <PremiumCard
                      title="Security Score"
                      value={scanResult.securityScore}
                      subtitle="/100"
                      progress={scanResult.securityScore}
                      icon={<SecurityIcon />}
                      color="warning"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 3, maxWidth: 1200, mx: 'auto' }}>
                  <Grid item xs={12} lg={8}>
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
                        Score Breakdown
                      </Typography>
                      {chartData && (
                        <Box sx={{ height: 300 }}>
                          <Bar data={chartData} options={chartOptions} />
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <Paper
                      sx={{
                        p: 3,
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        height: '100%',
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#F1F5F9' }}>
                        Website Information
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1.5 }}>
                        <strong style={{ color: '#F1F5F9' }}>Title:</strong> {scanResult.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1.5 }}>
                        <strong style={{ color: '#F1F5F9' }}>Description:</strong>{' '}
                        {scanResult.description}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                        <strong style={{ color: '#F1F5F9' }}>URL:</strong>{' '}
                        <a
                          href={scanResult.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#8B5CF6', textDecoration: 'none' }}
                        >
                          {scanResult.url}
                        </a>
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {scanResult.issues && scanResult.issues.length > 0 && (
                  <Paper
                    sx={{
                      p: 3,
                      mb: 3,
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '20px',
                      maxWidth: 1200,
                      mx: 'auto',
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#F1F5F9' }}>
                      Issues Found
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {scanResult.issues.map((issue, index) => (
                        <Chip
                          key={index}
                          label={issue}
                          sx={{
                            background: 'rgba(244, 63, 94, 0.1)',
                            border: '1px solid rgba(244, 63, 94, 0.3)',
                            color: '#F43F5E',
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                )}

                {scanResult.aiSummary && (
                  <Paper
                    sx={{
                      p: 3,
                      mb: 3,
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '20px',
                      maxWidth: 1200,
                      mx: 'auto',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: 600, color: '#F1F5F9', display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <span>🤖</span> AI Analysis Summary
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#94A3B8' }}>
                      {scanResult.aiSummary}
                    </Typography>
                  </Paper>
                )}

                {scanResult.aiRecommendations && scanResult.aiRecommendations.length > 0 && (
                  <Paper
                    sx={{
                      p: 3,
                      mb: 3,
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '20px',
                      maxWidth: 1200,
                      mx: 'auto',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: 600, color: '#F1F5F9', display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <span>💡</span> AI Recommendations
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, mt: 2, listStyle: 'none' }}>
                      {scanResult.aiRecommendations.map((recommendation, index) => (
                        <Typography
                          key={index}
                          component="li"
                          variant="body1"
                          sx={{ color: '#94A3B8', mb: 1.5, position: 'relative', pl: 2 }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              left: 0,
                              top: '0.5rem',
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: '#8B5CF6',
                            }}
                          />
                          {recommendation}
                        </Typography>
                      ))}
                    </Box>
                  </Paper>
                )}

                {scanResult.aiSuggestions && scanResult.aiSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        mb: 3,
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '20px',
                        maxWidth: 1200,
                        mx: 'auto',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, fontWeight: 600, color: '#F1F5F9', display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <span>✨</span> AI Suggestions
                      </Typography>
                      <Box component="ul" sx={{ pl: 3, mt: 2, listStyle: 'none' }}>
                        {scanResult.aiSuggestions.map((suggestion, index) => (
                          <Typography
                            key={index}
                            component="li"
                            variant="body1"
                            sx={{ color: '#94A3B8', mb: 1.5, position: 'relative', pl: 2 }}
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                left: 0,
                                top: '0.5rem',
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                              }}
                            />
                            {suggestion}
                          </Typography>
                        ))}
                      </Box>
                    </Paper>
                  </motion.div>
                )}

                <Paper
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    maxWidth: 1200,
                    mx: 'auto',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Tooltip title={scanResult.isBookmarked ? 'Remove bookmark' : 'Bookmark this scan'}>
                      <IconButton
                        component={motion.button}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={async () => {
                          try {
                            const updated = await scanService.toggleBookmark(scanResult._id);
                            setScanResult({ ...scanResult, isBookmarked: updated.isBookmarked });
                          } catch (err: any) {
                            setError(err.response?.data?.message || 'Failed to toggle bookmark');
                          }
                        }}
                        sx={{
                          color: scanResult.isBookmarked ? '#8B5CF6' : '#94A3B8',
                          background: scanResult.isBookmarked
                            ? 'rgba(139, 92, 246, 0.1)'
                            : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${scanResult.isBookmarked ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                          '&:hover': {
                            background: 'rgba(139, 92, 246, 0.2)',
                            borderColor: 'rgba(139, 92, 246, 0.5)',
                          },
                        }}
                      >
                        {scanResult.isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Capture screenshot">
                      <IconButton
                        component={motion.button}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={async () => {
                          try {
                            setCapturingScreenshot(true);
                            const result = await scanService.captureScreenshot(
                              scanResult.url,
                              scanResult._id
                            );
                            setScanResult({ ...scanResult, screenshotUrl: result.screenshotUrl });
                            setError('');
                          } catch (err: any) {
                            setError(err.response?.data?.message || 'Failed to capture screenshot');
                          } finally {
                            setCapturingScreenshot(false);
                          }
                        }}
                        disabled={capturingScreenshot}
                        sx={{
                          color: '#06B6D4',
                          background: 'rgba(6, 182, 212, 0.1)',
                          border: '1px solid rgba(6, 182, 212, 0.3)',
                          '&:hover': {
                            background: 'rgba(6, 182, 212, 0.2)',
                            borderColor: 'rgba(6, 182, 212, 0.5)',
                          },
                        }}
                      >
                        {capturingScreenshot ? (
                          <CircularProgress size={24} sx={{ color: '#06B6D4' }} />
                        ) : (
                          <CameraAltIcon />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Download PDF Report">
                      <IconButton
                        component={motion.button}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={async () => {
                          try {
                            setGeneratingReport(true);
                            const blob = await scanService.generateReport(scanResult._id);
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `scan-report-${scanResult._id}.pdf`;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(a);
                          } catch (err: any) {
                            setError(err.response?.data?.message || 'Failed to generate report');
                          } finally {
                            setGeneratingReport(false);
                          }
                        }}
                        disabled={generatingReport}
                        sx={{
                          color: '#F43F5E',
                          background: 'rgba(244, 63, 94, 0.1)',
                          border: '1px solid rgba(244, 63, 94, 0.3)',
                          '&:hover': {
                            background: 'rgba(244, 63, 94, 0.2)',
                            borderColor: 'rgba(244, 63, 94, 0.5)',
                          },
                        }}
                      >
                        {generatingReport ? (
                          <CircularProgress size={24} sx={{ color: '#F43F5E' }} />
                        ) : (
                          <PictureAsPdfIcon />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Button
                      variant="outlined"
                      onClick={async () => {
                        try {
                          setGeneratingSuggestions(true);
                          setError('');
                          const result = await aiService.generateSuggestions(scanResult._id);
                          setScanResult({ ...scanResult, aiSuggestions: result.suggestions });
                        } catch (err: any) {
                          setError(err.response?.data?.message || 'Failed to generate suggestions');
                        } finally {
                          setGeneratingSuggestions(false);
                        }
                      }}
                      disabled={generatingSuggestions}
                      sx={{
                        ml: 'auto',
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                        color: '#8B5CF6',
                        '&:hover': {
                          borderColor: 'rgba(139, 92, 246, 0.5)',
                          background: 'rgba(139, 92, 246, 0.1)',
                        },
                        '&:disabled': {
                          borderColor: 'rgba(139, 92, 246, 0.2)',
                          color: 'rgba(139, 92, 246, 0.5)',
                        },
                      }}
                    >
                      {generatingSuggestions ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} sx={{ color: '#8B5CF6' }} />
                          Generating...
                        </Box>
                      ) : (
                        'Generate AI Suggestions'
                      )}
                    </Button>
                  </Box>

                  {scanResult.screenshotUrl && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: '#94A3B8' }}>
                        Screenshot:
                      </Typography>
                      <Box
                        component="img"
                        src={`http://localhost:5000${scanResult.screenshotUrl}`}
                        alt="Website screenshot"
                        sx={{
                          maxWidth: '100%',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                        }}
                      />
                    </Box>
                  )}
                </Paper>

                {/* Chat Panel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Box sx={{ mt: 3, maxWidth: 1200, mx: 'auto' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      💬 Chat with AI Assistant
                    </Typography>
                    <Box sx={{ height: '600px' }}>
                      <ChatPanel scanId={scanResult._id} />
                    </Box>
                  </Box>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default AnalyzerPage;
