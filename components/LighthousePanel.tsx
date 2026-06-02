'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Grid,
  Tooltip,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SpeedIcon from '@mui/icons-material/Speed';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { scanService, LighthouseResult } from '@/services/scanService';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
  url: string;
  scanId: string;
  onAuditComplete?: (result: LighthouseResult) => void;
}

// ─── Threshold helpers ────────────────────────────────────────────────────────
type Rating = 'good' | 'needs-improvement' | 'poor';

function getRating(metric: string, value: number | null): Rating {
  if (value === null) return 'poor';
  switch (metric) {
    case 'lcp':        return value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
    case 'cls':        return value < 0.1  ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor';
    case 'inp':        return value < 200  ? 'good' : value < 500  ? 'needs-improvement' : 'poor';
    case 'fcp':        return value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor';
    case 'tti':        return value < 3800 ? 'good' : value < 7300 ? 'needs-improvement' : 'poor';
    case 'speedIndex': return value < 3400 ? 'good' : value < 5800 ? 'needs-improvement' : 'poor';
    case 'tbt':        return value < 200  ? 'good' : value < 600  ? 'needs-improvement' : 'poor';
    default:           return 'poor';
  }
}

const RATING_STYLES: Record<Rating, { bg: string; border: string; text: string; label: string }> = {
  'good':              { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.35)',  text: '#10B981', label: 'Good' },
  'needs-improvement': { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.35)',  text: '#F59E0B', label: 'Needs Work' },
  'poor':              { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.35)',   text: '#EF4444', label: 'Poor' },
};

function getScoreColor(score: number) {
  if (score >= 90) return '#10B981';
  if (score >= 50) return '#F59E0B';
  return '#EF4444';
}

// ─── Score Gauge ──────────────────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const R = 52;
  const circ = 2 * Math.PI * R;
  const offset = circ - (score / 100) * circ;
  const color = getScoreColor(score);

  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: 110, sm: 140 },
        height: { xs: 110, sm: 140 },
        mx: 'auto',
        flexShrink: 0,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 140 140"
        style={{ display: 'block' }}
      >
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={R}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            color,
            lineHeight: 1,
            fontSize: { xs: '1.9rem', sm: '2.4rem' },
          }}
        >
          {score}
        </Typography>
        <Typography variant="caption" sx={{ color: '#94A3B8', mt: 0.3 }}>
          / 100
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({
  label,
  displayValue,
  metricKey,
  rawValue,
  description,
}: {
  label: string;
  displayValue: string | null;
  metricKey: string;
  rawValue: number | null;
  description: string;
}) {
  const rating = getRating(metricKey, rawValue);
  const s = RATING_STYLES[rating];

  return (
    <Paper
      sx={{
        p: { xs: 1.5, sm: 2 },
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: '16px',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5, gap: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: '#94A3B8',
            fontWeight: 600,
            letterSpacing: '0.03em',
            fontSize: { xs: '0.6rem', sm: '0.7rem' },
            lineHeight: 1.3,
          }}
        >
          {label}
        </Typography>
        <Tooltip title={description} placement="top" arrow>
          <InfoOutlinedIcon sx={{ fontSize: 13, color: '#475569', cursor: 'help', flexShrink: 0, mt: '1px' }} />
        </Tooltip>
      </Box>
      <Typography
        sx={{
          fontWeight: 700,
          color: s.text,
          mb: 0.5,
          fontSize: { xs: '1.1rem', sm: '1.4rem' },
        }}
      >
        {displayValue ?? '—'}
      </Typography>
      <Chip
        label={s.label}
        size="small"
        sx={{
          background: s.border,
          color: s.text,
          fontWeight: 600,
          fontSize: '0.6rem',
          height: 18,
        }}
      />
    </Paper>
  );
}

// ─── Device Toggle Button ─────────────────────────────────────────────────────
function DeviceButton({
  label,
  icon,
  active,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="small"
      startIcon={icon}
      sx={{
        flex: 1,
        background: active ? 'rgba(249, 115, 22,0.85)' : 'transparent',
        border: `1px solid ${active ? 'rgba(249, 115, 22,0.7)' : 'rgba(249, 115, 22,0.35)'}`,
        color: active ? '#fff' : '#94A3B8',
        fontWeight: 600,
        borderRadius: '10px',
        fontSize: { xs: '0.75rem', sm: '0.8rem' },
        px: { xs: 1, sm: 1.5 },
        minWidth: 0,
        '&:hover': {
          background: 'rgba(249, 115, 22,0.5)',
          borderColor: 'rgba(249, 115, 22,0.6)',
        },
        '&.Mui-disabled': {
          opacity: 0.45,
          color: active ? '#fff' : '#64748B',
        },
      }}
    >
      {label}
    </Button>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export default function LighthousePanel({ url, scanId, onAuditComplete }: Props) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<LighthouseResult | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const handleRunAudit = async () => {
    setError('');
    setLoading(true);
    setResult(null);
    setElapsed(0);

    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);

    try {
      const data = await scanService.runLighthouseAudit(url, device, scanId);
      setResult(data);
      onAuditComplete?.(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Lighthouse audit failed. The site may be blocking headless browsers.'
      );
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 2, sm: 2 },
          mb: 3,
        }}
      >
        {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <SpeedIcon sx={{ fontSize: 20, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', lineHeight: 1.2 }}>
              Lighthouse Audit
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Powered by Google Core Web Vitals
            </Typography>
          </Box>
        </Box>

        {/* Controls — device toggle + run button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            // On mobile: stack toggle and button vertically for breathing room
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          {/* Device toggle */}
          <Box
            sx={{
              display: 'flex',
              gap: 0.75,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <DeviceButton
              label="Desktop"
              icon={<DesktopWindowsIcon sx={{ fontSize: 15 }} />}
              active={device === 'desktop'}
              disabled={loading}
              onClick={() => setDevice('desktop')}
            />
            <DeviceButton
              label="Mobile"
              icon={<PhoneAndroidIcon sx={{ fontSize: 15 }} />}
              active={device === 'mobile'}
              disabled={loading}
              onClick={() => setDevice('mobile')}
            />
          </Box>

          {/* Run / Re-run button */}
          <Button
            variant="contained"
            onClick={handleRunAudit}
            disabled={loading}
            fullWidth={false}
            startIcon={
              loading ? (
                <CircularProgress size={15} sx={{ color: '#fff' }} />
              ) : (
                <RefreshIcon sx={{ fontSize: 17 }} />
              )
            }
            sx={{
              width: { xs: '100%', sm: 'auto' },
              background: loading
                ? 'rgba(249,115,22,0.3)'
                : 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
              boxShadow: loading ? 'none' : '0 5px 18px rgba(249,115,22,0.35)',
              fontWeight: 600,
              fontSize: { xs: '0.85rem', sm: '0.875rem' },
              px: { xs: 2, sm: 2.5 },
              py: { xs: 1, sm: 0.9 },
              borderRadius: '10px',
              whiteSpace: 'nowrap',
              '&:hover': {
                background: 'linear-gradient(135deg, #FB923C 0%, #F87171 100%)',
                boxShadow: '0 8px 24px rgba(249,115,22,0.45)',
                transform: 'translateY(-1px)',
              },
              '&.Mui-disabled': {
                background: 'rgba(249,115,22,0.25)',
                color: 'rgba(255,255,255,0.45)',
              },
            }}
          >
            {loading ? `Running… ${elapsed}s` : result ? 'Re-run Audit' : 'Run Audit'}
          </Button>
        </Box>
      </Box>

      {/* ── Loading banner ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loading-hint"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Box
              sx={{
                mb: 3,
                p: { xs: 1.5, sm: 2 },
                background: 'rgba(249,115,22,0.07)',
                border: '1px solid rgba(249,115,22,0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
              }}
            >
              <CircularProgress size={18} sx={{ color: '#F97316', flexShrink: 0, mt: '2px' }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ color: '#F97316', fontWeight: 600 }}>
                  Running {device} audit — this takes 20–40 seconds
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#78716C',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Loading {url}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {error && !loading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Box
              sx={{
                mb: 3,
                p: { xs: 1.5, sm: 2 },
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '12px',
              }}
            >
              <Typography variant="body2" sx={{ color: '#EF4444' }}>
                {error}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty state ─────────────────────────────────────────────────────── */}
      {!loading && !result && !error && (
        <Box
          sx={{
            py: { xs: 4, sm: 5 },
            textAlign: 'center',
            border: '1px dashed rgba(255,255,255,0.08)',
            borderRadius: '16px',
          }}
        >
          <SpeedIcon sx={{ fontSize: { xs: 38, sm: 48 }, color: '#334155', mb: 1.5 }} />
          <Typography variant="body1" sx={{ color: '#475569', fontWeight: 500 }}>
            Run an audit to see Core Web Vitals
          </Typography>
          <Typography variant="caption" sx={{ color: '#334155' }}>
            Choose Desktop or Mobile above, then click Run Audit
          </Typography>
        </Box>
      )}

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {/* Score gauge row */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'center' },
                gap: { xs: 2, sm: 3 },
                mb: 3,
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              <ScoreGauge score={result.lighthouseScore} />

              <Box sx={{ minWidth: 0 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 0.5,
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 700 }}>
                    Performance Score
                  </Typography>
                  <Chip
                    icon={
                      result.deviceType === 'mobile' ? (
                        <PhoneAndroidIcon sx={{ fontSize: 13 }} />
                      ) : (
                        <DesktopWindowsIcon sx={{ fontSize: 13 }} />
                      )
                    }
                    label={result.deviceType === 'mobile' ? 'Mobile' : 'Desktop'}
                    size="small"
                    sx={{
                      background: 'rgba(249, 115, 22,0.15)',
                      border: '1px solid rgba(249, 115, 22,0.3)',
                      color: '#FB923C',
                      fontWeight: 600,
                      height: 22,
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: '#64748B', mb: 0.75 }}>
                  Audited at {new Date(result.auditedAt).toLocaleTimeString()}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color:
                      result.lighthouseScore >= 90
                        ? '#10B981'
                        : result.lighthouseScore >= 50
                        ? '#F59E0B'
                        : '#EF4444',
                  }}
                >
                  {result.lighthouseScore >= 90
                    ? 'Excellent — great performance'
                    : result.lighthouseScore >= 50
                    ? 'Needs improvement — some issues found'
                    : 'Poor — significant performance problems'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }} />

            {/* Core Web Vitals */}
            <Typography
              variant="subtitle2"
              sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.08em', mb: 1.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            >
              CORE WEB VITALS
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <MetricCard
                  label="LCP — Largest Contentful Paint"
                  displayValue={result.displayValues.lcp}
                  metricKey="lcp"
                  rawValue={result.coreWebVitals.lcp}
                  description="Time until the largest visible element loads. Good: < 2.5 s"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MetricCard
                  label="CLS — Cumulative Layout Shift"
                  displayValue={result.displayValues.cls}
                  metricKey="cls"
                  rawValue={result.coreWebVitals.cls}
                  description="Measures visual stability — unexpected layout shifts. Good: < 0.1"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MetricCard
                  label="INP — Interaction to Next Paint"
                  displayValue={result.displayValues.inp}
                  metricKey="inp"
                  rawValue={result.coreWebVitals.inp}
                  description="Responsiveness to user interactions. Good: < 200 ms"
                />
              </Grid>
            </Grid>

            {/* Additional metrics */}
            <Typography
              variant="subtitle2"
              sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.08em', mb: 1.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            >
              ADDITIONAL METRICS
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: result.lighthouseIssues?.length ? 3 : 0 }}>
              <Grid item xs={6} sm={3}>
                <MetricCard
                  label="FCP — First Contentful Paint"
                  displayValue={result.displayValues.fcp}
                  metricKey="fcp"
                  rawValue={result.metrics.fcp}
                  description="Time until the browser renders the first piece of content. Good: < 1.8 s"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MetricCard
                  label="TTI — Time to Interactive"
                  displayValue={result.displayValues.tti}
                  metricKey="tti"
                  rawValue={result.metrics.tti}
                  description="Time until the page is fully interactive. Good: < 3.8 s"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MetricCard
                  label="Speed Index"
                  displayValue={result.displayValues.speedIndex}
                  metricKey="speedIndex"
                  rawValue={result.metrics.speedIndex}
                  description="How quickly content is visually populated. Good: < 3.4 s"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MetricCard
                  label="TBT — Total Blocking Time"
                  displayValue={result.displayValues.tbt}
                  metricKey="tbt"
                  rawValue={result.metrics.tbt}
                  description="Total time main thread was blocked, preventing interactivity. Good: < 200 ms"
                />
              </Grid>
            </Grid>

            {/* Issues */}
            {result.lighthouseIssues && result.lighthouseIssues.length > 0 && (
              <>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.08em', mb: 1.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  ISSUES DETECTED
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {result.lighthouseIssues.map((issue, i) => (
                    <Chip
                      key={i}
                      label={issue}
                      sx={{
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        color: '#F87171',
                        fontSize: { xs: '0.68rem', sm: '0.75rem' },
                        height: 'auto',
                        '& .MuiChip-label': { whiteSpace: 'normal', py: 0.5 },
                      }}
                    />
                  ))}
                </Box>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Paper>
  );
}
