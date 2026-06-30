'use client';

import { useState, useEffect } from 'react';
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
import BarChartIcon from '@mui/icons-material/BarChart';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { ReactNode } from 'react';
import { scanService, Scan, LighthouseResult } from '@/services/scanService';
import { aiService } from '@/services/aiService';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import PremiumCard from '@/components/PremiumCard';
import ChatPanel from '@/components/ChatPanel';
import LighthousePanel from '@/components/LighthousePanel';
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
import { useThemeMode } from '@/theme/ThemeModeProvider';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

// Shared clean card surface used across every result panel
const panelSx = {
  p: 3,
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  boxShadow: 'var(--shadow-sm)',
} as const;

// Panel header with a tinted icon tile — replaces the emoji headings
const PanelTitle = ({
  icon,
  children,
  color = '#FC523F',
  rgb = '252, 82, 63',
}: {
  icon: ReactNode;
  children: ReactNode;
  color?: string;
  rgb?: string;
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: '8px',
        color,
        background: `rgba(${rgb}, 0.1)`,
        '& svg': { fontSize: 19 },
      }}
    >
      {icon}
    </Box>
    <Typography sx={{ fontWeight: 600, fontSize: '1.0625rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
      {children}
    </Typography>
  </Box>
);

const AnalyzerPage = () => {
  const { mode } = useThemeMode();
  const dark = mode === 'dark';

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: dark ? 'rgba(17,24,39,0.95)' : 'rgba(248, 250, 252, 0.95)',
        titleColor: dark ? '#F1F5F9' : '#0F172A',
        bodyColor: dark ? '#CBD5E1' : '#64748B',
        borderColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(15, 23, 42, 0.08)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: dark ? 'rgba(255,255,255,0.06)' : 'rgba(15, 23, 42, 0.04)',
        },
        ticks: {
          color: dark ? '#94A3B8' : '#64748B',
        },
      },
      y: {
        grid: {
          color: dark ? 'rgba(255,255,255,0.06)' : 'rgba(15, 23, 42, 0.04)',
        },
        ticks: {
          color: dark ? '#94A3B8' : '#64748B',
        },
        min: 0,
        max: 100,
      },
    },
  };

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanResult, setScanResult] = useState<Scan | null>(null);
  const [capturingScreenshot, setCapturingScreenshot] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [lighthouseResult, setLighthouseResult] = useState<LighthouseResult | null>(null);

  // Prefill the URL when arriving from onboarding (e.g. /analyzer?url=example.com).
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const prefill = params.get('url');
      if (prefill) setUrl(prefill);
    } catch {
      /* ignore */
    }
  }, []);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setError('');
    setLoading(true);
    setScanResult(null);
    setLighthouseResult(null);

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
              'rgba(252, 82, 63, 0.8)',
              'rgba(34, 197, 94, 0.8)',
              'rgba(245, 158, 11, 0.8)',
            ],
            borderRadius: 6,
          },
        ],
      }
    : null;

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Website Analyzer
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--text-muted)', mt: 0.5 }}>
                Enter a URL to audit performance, SEO and security in one scan.
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <Paper
              sx={{
                p: { xs: 2, sm: 2.5 },
                mb: 2.5,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                boxShadow: 'var(--shadow-sm)',
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
                        <Box sx={{ mr: 1.5, display: 'flex', color: 'var(--text-faint)' }}>
                          <SearchIcon />
                        </Box>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '1rem',
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
                    startIcon={!loading ? <AutoAwesomeIcon sx={{ fontSize: 18 }} /> : undefined}
                    sx={{
                      height: '52px',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      background: '#FC523F',
                      boxShadow: '0 1px 2px rgba(252, 82, 63, 0.3)',
                      '&:hover': {
                        background: '#E13E2C',
                        boxShadow: 'none',
                      },
                      '&:disabled': {
                        background: 'rgba(252, 82, 63, 0.4)',
                        color: '#FFFFFF',
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={22} sx={{ color: '#FFFFFF' }} />
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
                    background: 'rgba(220, 38, 38, 0.08)',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    color: '#B91C1C',
                    borderRadius: '8px',
                    '& .MuiAlert-icon': { color: '#DC2626' },
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
                      subtitle={lighthouseResult ? '(Lighthouse-weighted)' : '/100'}
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

                {/* ── Lighthouse Panel ─────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.15 }}
                >
                  <Box sx={{ mb: 3, maxWidth: 1200, mx: 'auto' }}>
                    <LighthousePanel
                      url={scanResult.url}
                      scanId={scanResult._id}
                      onAuditComplete={(result) => {
                        setLighthouseResult(result);
                        // Merge the weighted performance score into local state
                        const basicScore = scanResult.performanceScore;
                        const merged = Math.round(result.lighthouseScore * 0.7 + basicScore * 0.3);
                        setScanResult((prev) =>
                          prev ? { ...prev, performanceScore: merged } : prev
                        );
                      }}
                    />
                  </Box>
                </motion.div>

                <Grid container spacing={2} sx={{ mb: 3, maxWidth: 1200, mx: 'auto' }}>
                  <Grid item xs={12} lg={8}>
                    <Paper sx={panelSx}>
                      <PanelTitle icon={<BarChartIcon />}>Score Breakdown</PanelTitle>
                      {chartData && (
                        <Box sx={{ height: 300 }}>
                          <Bar data={chartData} options={chartOptions} />
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <Paper sx={{ ...panelSx, height: '100%' }}>
                      <PanelTitle icon={<InfoOutlinedIcon />}>Website Information</PanelTitle>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                        <Box>
                          <Typography sx={{ color: 'var(--text-faint)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', mb: 0.25 }}>
                            Title
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>{scanResult.title || '—'}</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ color: 'var(--text-faint)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', mb: 0.25 }}>
                            Description
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'var(--text-tertiary)' }}>{scanResult.description || '—'}</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ color: 'var(--text-faint)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', mb: 0.25 }}>
                            URL
                          </Typography>
                          <a
                            href={scanResult.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#FC523F', textDecoration: 'none', fontSize: '0.875rem', wordBreak: 'break-all' }}
                          >
                            {scanResult.url}
                          </a>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                {scanResult.issues && scanResult.issues.length > 0 && (
                  <Paper sx={{ ...panelSx, mb: 3 }}>
                    <PanelTitle icon={<ReportProblemOutlinedIcon />} color="#DC2626" rgb="220, 38, 38">
                      Issues Found
                    </PanelTitle>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {scanResult.issues.map((issue, index) => (
                        <Chip
                          key={index}
                          label={issue}
                          sx={{
                            background: 'rgba(220, 38, 38, 0.08)',
                            border: '1px solid rgba(220, 38, 38, 0.2)',
                            color: '#B91C1C',
                            fontWeight: 500,
                            borderRadius: '6px',
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                )}

                {scanResult.aiSummary && (
                  <Paper sx={{ ...panelSx, mb: 3, borderLeft: '3px solid #FC523F' }}>
                    <PanelTitle icon={<SmartToyOutlinedIcon />}>AI Analysis Summary</PanelTitle>
                    <Typography variant="body1" sx={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
                      {scanResult.aiSummary}
                    </Typography>
                  </Paper>
                )}

                {scanResult.aiRecommendations && scanResult.aiRecommendations.length > 0 && (
                  <Paper sx={{ ...panelSx, mb: 3 }}>
                    <PanelTitle icon={<LightbulbOutlinedIcon />} color="#D97706" rgb="217, 119, 6">
                      AI Recommendations
                    </PanelTitle>
                    <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                      {scanResult.aiRecommendations.map((recommendation, index) => (
                        <Box
                          component="li"
                          key={index}
                          sx={{ display: 'flex', gap: 1.5, mb: 1.5, '&:last-child': { mb: 0 } }}
                        >
                          <Box
                            sx={{
                              flexShrink: 0,
                              mt: '0.45rem',
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: '#FC523F',
                            }}
                          />
                          <Typography variant="body1" sx={{ color: 'var(--text-tertiary)', lineHeight: 1.65 }}>
                            {recommendation}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                )}

                {scanResult.aiSuggestions && scanResult.aiSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Paper sx={{ ...panelSx, mb: 3, borderLeft: '3px solid #FC523F' }}>
                      <PanelTitle icon={<AutoAwesomeOutlinedIcon />}>AI Suggestions</PanelTitle>
                      <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                        {scanResult.aiSuggestions.map((suggestion, index) => (
                          <Box
                            component="li"
                            key={index}
                            sx={{ display: 'flex', gap: 1.5, mb: 1.5, '&:last-child': { mb: 0 } }}
                          >
                            <Box
                              sx={{
                                flexShrink: 0,
                                mt: '0.45rem',
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: '#FC523F',
                              }}
                            />
                            <Typography variant="body1" sx={{ color: 'var(--text-tertiary)', lineHeight: 1.65 }}>
                              {suggestion}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </motion.div>
                )}

                <Paper sx={panelSx}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
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
                          color: scanResult.isBookmarked ? '#FC523F' : 'var(--text-muted)',
                          background: scanResult.isBookmarked
                            ? 'rgba(252, 82, 63, 0.1)'
                            : 'var(--overlay-04)',
                          border: `1px solid ${scanResult.isBookmarked ? 'rgba(252, 82, 63, 0.3)' : 'var(--border)'}`,
                          borderRadius: '8px',
                          '&:hover': {
                            background: 'rgba(252, 82, 63, 0.15)',
                            borderColor: 'rgba(252, 82, 63, 0.4)',
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
                          color: '#0891B2',
                          background: 'rgba(8, 145, 178, 0.08)',
                          border: '1px solid rgba(8, 145, 178, 0.2)',
                          borderRadius: '8px',
                          '&:hover': {
                            background: 'rgba(8, 145, 178, 0.15)',
                            borderColor: 'rgba(8, 145, 178, 0.4)',
                          },
                        }}
                      >
                        {capturingScreenshot ? (
                          <CircularProgress size={24} sx={{ color: '#0891B2' }} />
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
                          color: '#DC2626',
                          background: 'rgba(220, 38, 38, 0.08)',
                          border: '1px solid rgba(220, 38, 38, 0.2)',
                          borderRadius: '8px',
                          '&:hover': {
                            background: 'rgba(220, 38, 38, 0.15)',
                            borderColor: 'rgba(220, 38, 38, 0.4)',
                          },
                        }}
                      >
                        {generatingReport ? (
                          <CircularProgress size={24} sx={{ color: '#DC2626' }} />
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
                        borderColor: 'rgba(252, 82, 63, 0.3)',
                        color: '#FC523F',
                        '&:hover': {
                          borderColor: 'rgba(252, 82, 63, 0.5)',
                          background: 'rgba(252, 82, 63, 0.1)',
                        },
                        '&:disabled': {
                          borderColor: 'rgba(252, 82, 63, 0.2)',
                          color: 'rgba(252, 82, 63, 0.5)',
                        },
                      }}
                    >
                      {generatingSuggestions ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} sx={{ color: '#FC523F' }} />
                          Generating...
                        </Box>
                      ) : (
                        'Generate AI Suggestions'
                      )}
                    </Button>
                  </Box>

                  {scanResult.screenshotUrl && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--text-muted)' }}>
                        Screenshot:
                      </Typography>
                      <Box
                        component="img"
                        src={
                          scanResult.screenshotUrl?.startsWith('http')
                            ? scanResult.screenshotUrl
                            : `${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'}${scanResult.screenshotUrl}`
                        }
                        alt="Website screenshot"
                        sx={{
                          maxWidth: '100%',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
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
                  <Box sx={{ mt: 3 }}>
                    <PanelTitle icon={<ChatBubbleOutlineIcon />}>Chat with AI Assistant</PanelTitle>
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
