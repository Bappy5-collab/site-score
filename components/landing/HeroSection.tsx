'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { useRouter } from 'next/navigation';

// ── Real capabilities surfaced in the hero (grounded in the actual product) ──
const categories = [
  { label: 'SEO', score: 82, color: '#FC523F' },
  { label: 'Performance', score: 78, color: '#D97706' },
  { label: 'Security', score: 88, color: '#16A34A' },
  { label: 'Accessibility', score: 91, color: '#0EA5E9' },
];

const webVitals = [
  { label: 'LCP', value: '2.1s', ok: true },
  { label: 'CLS', value: '0.06', ok: true },
  { label: 'INP', value: '180ms', ok: true },
];

const actions = [
  { p: 'P1', text: 'Add a meta description to 4 pages', done: false },
  { p: 'P2', text: 'Compress hero image · −480 KB', done: false },
  { p: 'P3', text: 'Add alt text to 12 images', done: true },
];

const poweredBy = ['Google Lighthouse', 'Core Web Vitals', 'OpenAI'];

// Circular score gauge — animates the ring sweep and the number on mount
function ScoreGauge({ score }: { score: number }) {
  const size = 132;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const [progress, setProgress] = useState(0); // 0 → 1, drives both ring and number

  useEffect(() => {
    const duration = 1400; // ms
    let raf = 0;
    let start = 0;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      setProgress(easeOut(t));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    const delay = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, 200);
    return () => {
      clearTimeout(delay);
      cancelAnimationFrame(raf);
    };
  }, []);

  const offset = c * (1 - (score * progress) / 100);
  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FD7565" />
            <stop offset="100%" stopColor="#E13E2C" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--overlay-08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
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
        <Typography sx={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1, color: 'var(--text-primary)' }}>
          {Math.round(score * progress)}
        </Typography>
        <Typography sx={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Growth Score
        </Typography>
      </Box>
    </Box>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [barsIn, setBarsIn] = useState(false);

  // Fill the category score bars once, shortly after mount.
  useEffect(() => {
    const t = setTimeout(() => setBarsIn(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    router.push(trimmed ? `/analyzer?url=${encodeURIComponent(trimmed)}` : '/signup');
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 3, md: 5 }, pb: { xs: 7, md: 11 } }}>
      {/* Subtle grid + soft static wash */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.022) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 85% 70% at 50% 20%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 70% at 50% 20%, #000 40%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-8%',
          width: 560,
          height: 560,
          background: 'radial-gradient(circle, rgba(252, 82, 63, 0.14) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          {/* LEFT — copy + scan input */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.75,
                  py: 0.6,
                  mb: 3,
                  borderRadius: '9999px',
                  background: 'rgba(252, 82, 63, 0.08)',
                  border: '1px solid rgba(252, 82, 63, 0.2)',
                }}
              >
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} />
                <Typography variant="caption" sx={{ color: 'var(--text-tertiary)', fontWeight: 600, fontSize: '0.76rem' }}>
                  AI-powered website audits
                </Typography>
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.4rem', sm: '3.1rem', md: '3.35rem', lg: '3.9rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.035em',
                  color: 'var(--text-primary)',
                  mb: 2.5,
                }}
              >
                Turn a website audit into a{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #FD7565 0%, #FC523F 55%, #E13E2C 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  ranked fix-list.
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: 'var(--text-muted)',
                  fontSize: { xs: '1.02rem', md: '1.15rem' },
                  maxWidth: 520,
                  mx: { xs: 'auto', md: 0 },
                  mb: 3.5,
                  lineHeight: 1.6,
                }}
              >
                SiteScore AI scans any URL for SEO, performance, security, and Core Web Vitals—then
                turns the results into a prioritized, do-this-next action plan. Complete fixes and watch
                your Growth Score climb.
              </Typography>

              {/* URL scan form — the classic audit-tool entry point */}
              <Box
                component="form"
                onSubmit={handleScan}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 0.6,
                  maxWidth: 480,
                  mx: { xs: 'auto', md: 0 },
                  borderRadius: '12px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-strong)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  '&:focus-within': {
                    borderColor: 'rgba(252, 82, 63, 0.55)',
                    boxShadow: '0 0 0 3px rgba(252, 82, 63, 0.12)',
                  },
                }}
              >
                <Box sx={{ pl: 1.25, display: 'flex', color: 'var(--text-faint)' }}>
                  <SearchRoundedIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box
                  component="input"
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  placeholder="Enter your website URL"
                  aria-label="Website URL"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    py: 1,
                    '::placeholder': { color: 'var(--text-faint)' },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    flexShrink: 0,
                    px: 2.5,
                    py: 1.15,
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: '9px',
                    whiteSpace: 'nowrap',
                    background: 'linear-gradient(135deg, #FC523F 0%, #E13E2C 100%)',
                    boxShadow: 'none',
                    '&:hover': { background: 'linear-gradient(135deg, #FD7565 0%, #FC523F 100%)', boxShadow: 'none' },
                  }}
                >
                  Run free scan
                </Button>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: { xs: 1.5, sm: 2.5 },
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                {['Free plan, no credit card', 'Results in ~30 seconds', 'Desktop & mobile'].map((t) => (
                  <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                    <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#16A34A' }} />
                    <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{t}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Honest "powered by" strip instead of fake customer logos */}
              <Box sx={{ mt: 4.5 }}>
                <Typography
                  variant="caption"
                  sx={{ color: 'var(--text-faint)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: '0.68rem' }}
                >
                  Audits powered by
                </Typography>
                <Box
                  sx={{
                    mt: 1.25,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: { xs: 1, sm: 1.25 },
                    justifyContent: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  {poweredBy.map((name) => (
                    <Box
                      key={name}
                      sx={{
                        px: 1.5,
                        py: 0.6,
                        borderRadius: '8px',
                        background: 'var(--overlay-03)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <Typography sx={{ color: 'var(--text-tertiary)', fontWeight: 600, fontSize: '0.82rem' }}>
                        {name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT — realistic scan-result preview */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', maxWidth: 500, mx: 'auto', ml: { md: 'auto' } }}>
              <Box
                sx={{
                  position: 'relative',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 24px 60px -24px rgba(15,23,42,0.35)',
                }}
              >
                {/* window chrome */}
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'rgba(239, 68, 68, 0.75)' }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'rgba(245, 158, 11, 0.75)' }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'rgba(34, 197, 94, 0.75)' }} />
                  <Box
                    sx={{
                      ml: 1,
                      flex: 1,
                      px: 1.5,
                      py: 0.4,
                      borderRadius: '6px',
                      background: 'var(--overlay-04)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                  >
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} />
                    <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>example.com</Typography>
                  </Box>
                </Box>

                <Box sx={{ p: { xs: 2.25, md: 3 } }}>
                  {/* Score gauge + category scores */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
                    <ScoreGauge score={84} />
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.1 }}>
                      {categories.map((cat, i) => (
                        <Box key={cat.label}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                            <Typography sx={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                              {cat.label}
                            </Typography>
                            <Typography sx={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                              {cat.score}
                            </Typography>
                          </Box>
                          <Box sx={{ height: 6, borderRadius: '3px', background: 'var(--overlay-05)', overflow: 'hidden' }}>
                            <Box
                              sx={{
                                height: '100%',
                                width: barsIn ? `${cat.score}%` : 0,
                                borderRadius: '3px',
                                background: cat.color,
                                transition: 'width 1.1s cubic-bezier(0.22, 1, 0.36, 1)',
                                transitionDelay: `${i * 0.12}s`,
                              }}
                            />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Core Web Vitals */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    {webVitals.map((v) => (
                      <Box
                        key={v.label}
                        sx={{
                          flex: 1,
                          textAlign: 'center',
                          py: 1.1,
                          borderRadius: '10px',
                          background: 'rgba(22,163,74,0.06)',
                          border: '1px solid rgba(22,163,74,0.2)',
                        }}
                      >
                        <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          {v.label}
                        </Typography>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                          {v.value}
                        </Typography>
                        <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: '#16A34A' }}>Good</Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Growth Brain action plan */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.25 }}>
                    <BoltRoundedIcon sx={{ fontSize: 16, color: '#FC523F' }} />
                    <Typography sx={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Growth Brain · Next actions
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.85 }}>
                    {actions.map((a) => (
                      <Box
                        key={a.text}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.25,
                          py: 1,
                          px: 1.25,
                          borderRadius: '9px',
                          background: 'var(--overlay-03)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <Box
                          sx={{
                            flexShrink: 0,
                            px: 0.85,
                            py: 0.25,
                            borderRadius: '6px',
                            fontSize: '0.66rem',
                            fontWeight: 800,
                            color: a.done ? '#16A34A' : '#FC523F',
                            background: a.done ? 'rgba(22,163,74,0.12)' : 'rgba(252,82,63,0.12)',
                          }}
                        >
                          {a.p}
                        </Box>
                        <Typography
                          sx={{
                            flex: 1,
                            fontSize: '0.8rem',
                            color: a.done ? 'var(--text-faint)' : 'var(--text-secondary)',
                            textDecoration: a.done ? 'line-through' : 'none',
                          }}
                        >
                          {a.text}
                        </Typography>
                        {a.done && <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#16A34A' }} />}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
