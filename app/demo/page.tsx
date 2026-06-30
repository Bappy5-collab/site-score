'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Chip,
  TextField,
  IconButton,
  Collapse,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumCard from '@/components/PremiumCard';
import Logo from '@/components/Logo';
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
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RadarIcon from '@mui/icons-material/Radar';

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

// ── Types ────────────────────────────────────────────────────────────────────
interface DemoScan {
  id: string;
  url: string;
  title: string;
  performanceScore: number;
  seoScore: number;
  securityScore: number;
  createdAt: number;
  issues: string[];
  aiSummary: string;
}

// ── Sample data + helpers ────────────────────────────────────────────────────
const ISSUE_POOL = [
  'Missing meta description',
  'Several images missing alt tags',
  'Title length is not optimal (should be 30–60 characters)',
  'Missing Content Security Policy header',
  'Missing X-Frame-Options header',
  'Slow server response time',
  'Large page size — consider compression',
  'Missing Open Graph meta tags for social sharing',
  'Missing structured data (Schema.org markup)',
  'Multiple H1 headings found on the page',
  'Render-blocking JavaScript detected',
  'No HTTPS redirect configured',
];

const SCAN_STEPS = [
  'Fetching page…',
  'Analyzing SEO signals…',
  'Auditing performance…',
  'Checking security headers…',
  'Generating AI insights…',
];

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const summaryFor = (avg: number) => {
  if (avg >= 85)
    return 'Strong overall health. Core Web Vitals are in good shape — focus on minor SEO polish to push further.';
  if (avg >= 70)
    return 'Solid foundation with room to grow. Addressing the flagged performance and metadata issues should lift scores noticeably.';
  return 'Several high-impact issues detected. Prioritise security headers and performance fixes for the biggest gains.';
};

const initialScans: DemoScan[] = [
  { url: 'acme-store.com', title: 'Acme Store — Online Shopping', performanceScore: 91, seoScore: 88, securityScore: 82, daysAgo: 1 },
  { url: 'nova-agency.io', title: 'Nova Creative Agency', performanceScore: 84, seoScore: 95, securityScore: 90, daysAgo: 3 },
  { url: 'brightblog.dev', title: 'Bright Blog — Dev Notes', performanceScore: 78, seoScore: 81, securityScore: 74, daysAgo: 5 },
  { url: 'finflow-app.com', title: 'FinFlow — Personal Finance', performanceScore: 88, seoScore: 79, securityScore: 96, daysAgo: 8 },
  { url: 'greenleaf-cafe.com', title: 'Greenleaf Café', performanceScore: 72, seoScore: 68, securityScore: 71, daysAgo: 11 },
  { url: 'pixel-portfolio.me', title: 'Pixel — Designer Portfolio', performanceScore: 95, seoScore: 86, securityScore: 80, daysAgo: 14 },
  { url: 'travelnest.co', title: 'TravelNest — Trip Planner', performanceScore: 81, seoScore: 90, securityScore: 85, daysAgo: 18 },
  { url: 'oldsite-shop.net', title: 'Legacy Shop', performanceScore: 54, seoScore: 49, securityScore: 58, daysAgo: 22 },
].map((s, i) => {
  const avg = (s.performanceScore + s.seoScore + s.securityScore) / 3;
  return {
    id: `seed-${i}`,
    url: s.url,
    title: s.title,
    performanceScore: s.performanceScore,
    seoScore: s.seoScore,
    securityScore: s.securityScore,
    createdAt: Date.now() - s.daysAgo * 86400000,
    issues: [...ISSUE_POOL].sort(() => Math.random() - 0.5).slice(0, rnd(2, 4)),
    aiSummary: summaryFor(avg),
  };
});

const scoreColor = (v: number) => (v >= 80 ? '#22C55E' : v >= 60 ? '#F59E0B' : '#F43F5E');
// Pin locale + UTC so server and client render the same string (avoids
// React hydration mismatches from differing default locales/timezones).
const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString('en-US', { timeZone: 'UTC' });

const cardSx = {
  p: { xs: 2.5, md: 3 },
  height: '100%',
  background: 'linear-gradient(155deg, #FFFFFF 0%, #F8FAFC 100%)',
  border: '1px solid rgba(15, 23, 42, 0.08)',
  borderRadius: '10px',
};

type SortKey = 'title' | 'performanceScore' | 'seoScore' | 'securityScore' | 'createdAt';
type MetricKey = 'performanceScore' | 'seoScore' | 'securityScore';

const METRICS: { key: MetricKey; label: string; color: string }[] = [
  { key: 'performanceScore', label: 'Performance', color: '#FC523F' },
  { key: 'seoScore', label: 'SEO', color: '#22C55E' },
  { key: 'securityScore', label: 'Security', color: '#F59E0B' },
];

export default function DemoDashboardPage() {
  const router = useRouter();

  const [scans, setScans] = useState<DemoScan[]>(initialScans);
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visible, setVisible] = useState<Record<MetricKey, boolean>>({
    performanceScore: true,
    seoScore: true,
    securityScore: true,
  });

  // Demo scan simulator state
  const [urlInput, setUrlInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // ── Derived data ───────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const n = scans.length || 1;
    return {
      totalScans: scans.length,
      avgPerformanceScore: Math.round(scans.reduce((s, x) => s + x.performanceScore, 0) / n),
      avgSeoScore: Math.round(scans.reduce((s, x) => s + x.seoScore, 0) / n),
      avgSecurityScore: Math.round(scans.reduce((s, x) => s + x.securityScore, 0) / n),
    };
  }, [scans]);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? scans.filter((s) => s.url.toLowerCase().includes(q) || s.title.toLowerCase().includes(q))
      : scans;
    const sorted = [...filtered].sort((a, b) => {
      let cmp: number;
      if (sortKey === 'title') cmp = a.title.localeCompare(b.title);
      else cmp = (a[sortKey] as number) - (b[sortKey] as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [scans, query, sortKey, sortDir]);

  const chronological = useMemo(() => [...scans].sort((a, b) => a.createdAt - b.createdAt), [scans]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 900, easing: 'easeOutQuart' as const },
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#0F172A',
        bodyColor: '#334155',
        borderColor: 'rgba(15, 23, 42, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        usePointStyle: true,
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
    labels: chronological.map((s) => fmtDate(s.createdAt)),
    datasets: METRICS.filter((m) => visible[m.key]).map((m) => ({
      label: m.label,
      data: chronological.map((s) => s[m.key]),
      borderColor: m.color,
      tension: 0.45,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBorderColor: '#F8FAFC',
      pointHoverBorderWidth: 2,
      borderWidth: 2.5,
      backgroundColor: (ctx: ScriptableContext<'line'>) => {
        const { chart } = ctx;
        const { ctx: canvas, chartArea } = chart;
        if (!chartArea) return `${m.color}00`;
        const g = canvas.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        g.addColorStop(0, `${m.color}59`);
        g.addColorStop(0.5, `${m.color}14`);
        g.addColorStop(1, `${m.color}00`);
        return g;
      },
    })),
  };

  const barData = {
    labels: ['Performance', 'SEO', 'Security'],
    datasets: [
      {
        label: 'Average score',
        data: [stats.avgPerformanceScore, stats.avgSeoScore, stats.avgSecurityScore],
        backgroundColor: ['rgba(252, 82, 63, 0.7)', 'rgba(34, 197, 94, 0.7)', 'rgba(245, 158, 11, 0.7)'],
        borderRadius: 6,
        borderWidth: 0,
      },
    ],
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir(key === 'title' ? 'asc' : 'desc');
    }
  };

  const runDemoScan = () => {
    if (!urlInput.trim() || scanning) return;
    setScanning(true);
    setScanStep(0);
    let i = 0;
    timerRef.current = setInterval(() => {
      i += 1;
      if (i >= SCAN_STEPS.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        finishScan();
      } else {
        setScanStep(i);
      }
    }, 750);
  };

  const finishScan = () => {
    const clean = urlInput.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    const name = clean.split('.')[0] || 'Site';
    const perf = rnd(58, 97);
    const seo = rnd(55, 98);
    const sec = rnd(52, 96);
    const newScan: DemoScan = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `scan-${Date.now()}`,
      url: clean,
      title: `${name.charAt(0).toUpperCase()}${name.slice(1)} — Demo scan`,
      performanceScore: perf,
      seoScore: seo,
      securityScore: sec,
      createdAt: Date.now(),
      issues: [...ISSUE_POOL].sort(() => Math.random() - 0.5).slice(0, rnd(2, 5)),
      aiSummary: summaryFor((perf + seo + sec) / 3),
    };
    setScans((prev) => [newScan, ...prev]);
    setUrlInput('');
    setScanning(false);
    setScanStep(0);
    setSortKey('createdAt');
    setSortDir('desc');
    setExpandedId(newScan.id);
  };

  const resetDemo = () => {
    setScans(initialScans);
    setQuery('');
    setExpandedId(null);
    setSortKey('createdAt');
    setSortDir('desc');
  };

  const SortHeader = ({ label, k, align = 'center' }: { label: string; k: SortKey; align?: string }) => (
    <Box
      onClick={() => toggleSort(k)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.4,
        cursor: 'pointer',
        justifyContent: align,
        userSelect: 'none',
        color: sortKey === k ? '#FD7565' : '#64748B',
        transition: 'color 0.15s',
        '&:hover': { color: '#FD7565' },
      }}
    >
      {label}
      {sortKey === k &&
        (sortDir === 'asc' ? (
          <ArrowUpwardIcon sx={{ fontSize: '0.85rem' }} />
        ) : (
          <ArrowDownwardIcon sx={{ fontSize: '0.85rem' }} />
        ))}
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 45%, #F8FAFC 100%)',
      }}
    >
      {/* Demo-mode banner */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          background: 'rgba(248, 250, 252, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(252, 82, 63, 0.25)',
        }}
      >
        <Container
          maxWidth="xl"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: 1.25, flexWrap: 'wrap' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Logo size={30} fontSize="1.05rem" onClick={() => router.push('/landing')} sx={{ mr: 0.5 }} />
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: '1rem !important' }} />}
              label="Interactive Demo"
              size="small"
              sx={{
                fontWeight: 700,
                color: '#F1F5F9',
                background: 'linear-gradient(135deg, #FC523F 0%, #E13E2C 100%)',
                '& .MuiChip-icon': { color: '#F1F5F9' },
              }}
            />
            <Typography variant="body2" sx={{ color: '#64748B', display: { xs: 'none', sm: 'block' } }}>
              Try everything below — sample data, no account needed.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={() => router.push('/landing')}
              sx={{
                color: '#64748B',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                '&:hover': { color: '#0F172A', background: 'rgba(15,23,42,0.05)' },
              }}
            >
              Back to site
            </Button>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => router.push('/signup')}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #FC523F 0%, #E13E2C 100%)',
                boxShadow: '0 4px 20px rgba(252, 82, 63, 0.4)',
                '&:hover': { background: 'linear-gradient(135deg, #FD7565 0%, #FC523F 100%)' },
              }}
            >
              Sign up free
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
            Run a demo scan, search, sort, and explore — the whole dashboard reacts live.
          </Typography>
        </motion.div>

        {/* ── Interactive demo scanner ───────────────────────────────────── */}
        <Paper sx={{ ...cardSx, height: 'auto', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
            <RadarIcon sx={{ color: '#FD7565' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F172A' }}>
              Run a demo scan
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Enter any website URL — e.g. mysite.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runDemoScan()}
              disabled={scanning}
              size="small"
              sx={{
                flex: 1,
                minWidth: 240,
                '& .MuiOutlinedInput-root': {
                  color: '#0F172A',
                  borderRadius: '8px',
                  background: 'rgba(15,23,42,0.03)',
                  '& fieldset': { borderColor: 'rgba(15,23,42,0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(252, 82, 63,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FC523F' },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={runDemoScan}
              disabled={scanning || !urlInput.trim()}
              startIcon={<SearchIcon />}
              sx={{
                px: 3,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #FC523F 0%, #E13E2C 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #FD7565 0%, #FC523F 100%)' },
                '&.Mui-disabled': { background: 'rgba(15,23,42,0.08)', color: '#64748B' },
              }}
            >
              {scanning ? 'Scanning…' : 'Analyze'}
            </Button>
          </Box>
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={((scanStep + 1) / SCAN_STEPS.length) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      background: 'rgba(15,23,42,0.08)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: 'linear-gradient(90deg, #FC523F, #E13E2C)',
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#FD7565', mt: 1, display: 'block' }}>
                    {SCAN_STEPS[scanStep]}
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Paper>

        {/* ── Stat cards (live) ──────────────────────────────────────────── */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <PremiumCard title="Total Scans" value={stats.totalScans} icon={<AssessmentIcon />} color="info" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <PremiumCard
              title="Avg Performance"
              value={stats.avgPerformanceScore}
              subtitle="/100"
              progress={stats.avgPerformanceScore}
              icon={<SpeedIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <PremiumCard
              title="Avg SEO Score"
              value={stats.avgSeoScore}
              subtitle="/100"
              progress={stats.avgSeoScore}
              icon={<TrendingUpIcon />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <PremiumCard
              title="Avg Security"
              value={stats.avgSecurityScore}
              subtitle="/100"
              progress={stats.avgSecurityScore}
              icon={<SecurityIcon />}
              color="warning"
            />
          </Grid>
        </Grid>

        {/* ── Charts ─────────────────────────────────────────────────────── */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={cardSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F172A' }}>
                  Score Trends
                </Typography>
                {/* metric toggles */}
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  {METRICS.map((m) => (
                    <Chip
                      key={m.key}
                      label={m.label}
                      size="small"
                      onClick={() => setVisible((v) => ({ ...v, [m.key]: !v[m.key] }))}
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 600,
                        color: visible[m.key] ? '#0A0E27' : '#64748B',
                        background: visible[m.key] ? m.color : 'rgba(15,23,42,0.04)',
                        border: `1px solid ${visible[m.key] ? m.color : 'rgba(15,23,42,0.1)'}`,
                        '&:hover': { background: visible[m.key] ? m.color : 'rgba(15,23,42,0.1)' },
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <Box sx={{ height: 300 }}>
                <Line data={lineData} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={cardSx}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#0F172A' }}>
                Category Averages
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={barData} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* ── Scans table (search + sort + expand) ───────────────────────── */}
        <Paper sx={{ ...cardSx, height: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F172A' }}>
              Scans{' '}
              <Typography component="span" sx={{ color: '#64748B', fontWeight: 500 }}>
                ({filteredSorted.length})
              </Typography>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Search scans…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                size="small"
                InputProps={{ startAdornment: <SearchIcon sx={{ color: '#64748B', mr: 1, fontSize: '1.1rem' }} /> }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#0F172A',
                    borderRadius: '8px',
                    background: 'rgba(15,23,42,0.03)',
                    '& fieldset': { borderColor: 'rgba(15,23,42,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(252, 82, 63,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#FC523F' },
                  },
                }}
              />
              <Tooltip title="Reset demo">
                <IconButton
                  onClick={resetDemo}
                  sx={{ color: '#64748B', border: '1px solid rgba(15,23,42,0.1)', borderRadius: '8px', '&:hover': { color: '#FD7565' } }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 680 }}>
              {/* header */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '2.4fr 1fr 1fr 1fr 1.1fr 36px',
                  px: 2,
                  py: 1,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                <SortHeader label="Website" k="title" align="flex-start" />
                <SortHeader label="Perf." k="performanceScore" />
                <SortHeader label="SEO" k="seoScore" />
                <SortHeader label="Security" k="securityScore" />
                <SortHeader label="Date" k="createdAt" align="flex-end" />
                <Box />
              </Box>

              {filteredSorted.length === 0 && (
                <Typography sx={{ color: '#64748B', textAlign: 'center', py: 4 }}>
                  No scans match &ldquo;{query}&rdquo;.
                </Typography>
              )}

              <AnimatePresence initial={false}>
                {filteredSorted.map((s) => {
                  const open = expandedId === s.id;
                  return (
                    <motion.div
                      key={s.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Box
                        onClick={() => setExpandedId(open ? null : s.id)}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '2.4fr 1fr 1fr 1fr 1.1fr 36px',
                          alignItems: 'center',
                          px: 2,
                          py: 1.5,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          background: open ? 'rgba(252, 82, 63,0.08)' : 'transparent',
                          '&:hover': { background: 'rgba(15,23,42,0.03)' },
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography noWrap sx={{ color: '#0F172A', fontWeight: 600, fontSize: '0.9rem' }}>
                            {s.title}
                          </Typography>
                          <Typography
                            noWrap
                            sx={{ color: '#64748B', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 0.5 }}
                          >
                            <OpenInNewIcon sx={{ fontSize: '0.85rem' }} /> {s.url}
                          </Typography>
                        </Box>
                        {[s.performanceScore, s.seoScore, s.securityScore].map((v, idx) => (
                          <Box key={idx} sx={{ textAlign: 'center' }}>
                            <Box
                              sx={{
                                display: 'inline-flex',
                                minWidth: 44,
                                justifyContent: 'center',
                                py: 0.5,
                                borderRadius: '6px',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                color: scoreColor(v),
                                background: `${scoreColor(v)}1A`,
                                border: `1px solid ${scoreColor(v)}33`,
                              }}
                            >
                              {v}
                            </Box>
                          </Box>
                        ))}
                        <Typography sx={{ color: '#64748B', fontSize: '0.82rem', textAlign: 'right' }}>
                          {fmtDate(s.createdAt)}
                        </Typography>
                        <Box sx={{ textAlign: 'right' }}>
                          <ExpandMoreIcon
                            sx={{
                              color: '#64748B',
                              transition: 'transform 0.2s',
                              transform: open ? 'rotate(180deg)' : 'none',
                            }}
                          />
                        </Box>
                      </Box>

                      {/* expanded detail */}
                      <Collapse in={open} unmountOnExit>
                        <Box
                          sx={{
                            mx: 1,
                            mb: 1,
                            p: 2.5,
                            borderRadius: '10px',
                            background: 'rgba(15,23,42,0.03)',
                            border: '1px solid rgba(15,23,42,0.07)',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AutoAwesomeIcon sx={{ fontSize: '1rem', color: '#FD7565' }} />
                            <Typography variant="subtitle2" sx={{ color: '#0F172A', fontWeight: 700 }}>
                              AI Summary
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
                            {s.aiSummary}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ color: '#0F172A', fontWeight: 700, mb: 1 }}>
                            Issues found ({s.issues.length})
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                            {s.issues.map((issue) => (
                              <Box key={issue} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ErrorOutlineIcon sx={{ fontSize: '1rem', color: '#F59E0B' }} />
                                <Typography variant="body2" sx={{ color: '#334155' }}>
                                  {issue}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Collapse>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </Box>
          </Box>
        </Paper>

        {/* Bottom CTA */}
        <Box
          sx={{
            mt: 4,
            p: { xs: 3, md: 5 },
            textAlign: 'center',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(252, 82, 63, 0.15) 0%, rgba(252, 82, 63, 0.1) 100%)',
            border: '1px solid rgba(252, 82, 63, 0.25)',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
            Like what you see? Do it with real data.
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
            Create a free account and run a real scan with AI insights in under a minute.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => router.push('/signup')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.05rem',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FC523F 0%, #E13E2C 100%)',
              boxShadow: '0 8px 32px rgba(252, 82, 63, 0.45)',
              '&:hover': { background: 'linear-gradient(135deg, #FD7565 0%, #FC523F 100%)' },
            }}
          >
            Start Free
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
