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
  'good':              { bg: 'rgba(22,163,74,0.08)',  border: 'rgba(22,163,74,0.25)',  text: '#16A34A', label: 'Good' },
  'needs-improvement': { bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.25)',  text: '#D97706', label: 'Needs Work' },
  'poor':              { bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.25)',  text: '#DC2626', label: 'Poor' },
};

function getScoreColor(score: number) {
  if (score >= 90) return '#16A34A';
  if (score >= 50) return '#D97706';
  return '#DC2626';
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
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth="10" />
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
        <Typography variant="caption" sx={{ color: 'var(--text-muted)', mt: 0.3 }}>
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
        borderRadius: '8px',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5, gap: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'var(--text-muted)',
            fontWeight: 600,
            letterSpacing: '0.03em',
            fontSize: { xs: '0.6rem', sm: '0.7rem' },
            lineHeight: 1.3,
          }}
        >
          {label}
        </Typography>
        <Tooltip title={description} placement="top" arrow>
          <InfoOutlinedIcon sx={{ fontSize: 13, color: 'var(--text-tertiary)', cursor: 'help', flexShrink: 0, mt: '1px' }} />
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
        background: active ? '#FC523F' : 'var(--bg-surface)',
        border: `1px solid ${active ? '#FC523F' : 'var(--border)'}`,
        color: active ? '#FFFFFF' : 'var(--text-muted)',
        fontWeight: 600,
        borderRadius: '8px',
        fontSize: { xs: '0.75rem', sm: '0.8rem' },
        px: { xs: 1, sm: 1.5 },
        minWidth: 0,
        boxShadow: 'none',
        '&:hover': {
          background: active ? '#E13E2C' : 'var(--overlay-03)',
          borderColor: active ? '#E13E2C' : 'var(--border-strong)',
        },
        '&.Mui-disabled': {
          opacity: 0.5,
          color: active ? '#FFFFFF' : 'var(--text-muted)',
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
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        boxShadow: 'var(--shadow-sm)',
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
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'rgba(252, 82, 63, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <SpeedIcon sx={{ fontSize: 19, color: '#FC523F' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '1.0625rem', color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              Lighthouse Audit
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
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
              background: '#FC523F',
              boxShadow: '0 1px 2px rgba(252, 82, 63, 0.3)',
              fontWeight: 600,
              fontSize: { xs: '0.85rem', sm: '0.875rem' },
              px: { xs: 2, sm: 2.5 },
              py: { xs: 1, sm: 0.9 },
              borderRadius: '8px',
              whiteSpace: 'nowrap',
              '&:hover': {
                background: '#E13E2C',
                boxShadow: 'none',
              },
              '&.Mui-disabled': {
                background: 'rgba(252,82,63,0.4)',
                color: '#FFFFFF',
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
                background: 'rgba(252,82,63,0.07)',
                border: '1px solid rgba(252,82,63,0.2)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
              }}
            >
              <CircularProgress size={18} sx={{ color: '#FC523F', flexShrink: 0, mt: '2px' }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ color: '#FC523F', fontWeight: 600 }}>
                  Running {device} audit — this takes 20–40 seconds
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'var(--text-muted)',
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
                background: 'rgba(220,38,38,0.08)',
                border: '1px solid rgba(220,38,38,0.2)',
                borderRadius: '8px',
              }}
            >
              <Typography variant="body2" sx={{ color: '#B91C1C' }}>
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
            border: '1px dashed var(--border)',
            borderRadius: '8px',
          }}
        >
          <SpeedIcon sx={{ fontSize: { xs: 38, sm: 48 }, color: 'var(--text-secondary)', mb: 1.5 }} />
          <Typography variant="body1" sx={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>
            Run an audit to see Core Web Vitals
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
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
                  <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
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
                      background: 'rgba(252, 82, 63,0.1)',
                      border: '1px solid rgba(252, 82, 63,0.25)',
                      color: '#FC523F',
                      fontWeight: 600,
                      height: 22,
                      borderRadius: '6px',
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 0.75 }}>
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

            <Divider sx={{ borderColor: 'var(--border-subtle)', mb: 3 }} />

            {/* Core Web Vitals */}
            <Typography
              variant="subtitle2"
              sx={{ color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em', mb: 1.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
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
              sx={{ color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em', mb: 1.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
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
                <Divider sx={{ borderColor: 'var(--border-subtle)', mb: 2 }} />
                <Typography
                  variant="subtitle2"
                  sx={{ color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em', mb: 1.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  ISSUES DETECTED
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {result.lighthouseIssues.map((issue, i) => (
                    <Chip
                      key={i}
                      label={issue}
                      sx={{
                        background: 'rgba(220,38,38,0.08)',
                        border: '1px solid rgba(220,38,38,0.2)',
                        color: '#B91C1C',
                        fontSize: { xs: '0.68rem', sm: '0.75rem' },
                        height: 'auto',
                        borderRadius: '6px',
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
