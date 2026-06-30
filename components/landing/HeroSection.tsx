'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BoltIcon from '@mui/icons-material/Bolt';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import { useRouter } from 'next/navigation';
import AnimatedHeroBackground from './AnimatedHeroBackground';

// ---- Animated SVG area chart used inside the hero preview card ----
const chartPoints = [54, 58, 56, 64, 62, 70, 68, 76, 84];

function AnimatedAreaChart() {
  const W = 520;
  const H = 150;
  const pad = 10;
  const max = 100;
  const n = chartPoints.length;
  const stepX = (W - pad * 2) / (n - 1);
  const coords = chartPoints.map((v, i) => {
    const x = pad + i * stepX;
    const y = H - pad - (v / max) * (H - pad * 2);
    return [x, y] as const;
  });
  const linePath = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${coords[n - 1][0].toFixed(1)} ${H} L ${coords[0][0].toFixed(1)} ${H} Z`;
  const last = coords[n - 1];

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FC523F" stopOpacity="0.38" />
            <stop offset="60%" stopColor="#FC523F" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FC523F" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FD7565" />
            <stop offset="100%" stopColor="#FC523F" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={pad}
            x2={W - pad}
            y1={pad + g * (H - pad * 2)}
            y2={pad + g * (H - pad * 2)}
            stroke="rgba(15,23,42,0.04)"
            strokeWidth={1}
          />
        ))}

        <motion.path d={areaPath} fill="url(#heroArea)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} />

        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#heroLine)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, delay: 0.5, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 4px 10px rgba(252,82,63,0.45))' }}
        />

        {coords.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={i === n - 1 ? 5 : 3}
            fill={i === n - 1 ? '#0F172A' : '#FD7565'}
            stroke="#F8FAFC"
            strokeWidth={2}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 + i * 0.08 }}
          />
        ))}

        <motion.circle
          cx={last[0]}
          cy={last[1]}
          r={5}
          fill="none"
          stroke="#FD7565"
          strokeWidth={2}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 2 }}
        />
      </svg>
    </Box>
  );
}

const avatars = [
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/75.jpg',
  'https://randomuser.me/api/portraits/women/12.jpg',
];

const trustLogos = ['Vertex', 'Lumen', 'Northwind', 'Cobalt', 'Quanta', 'Nimbus'];

export default function HeroSection() {
  const router = useRouter();
  const [score, setScore] = useState(0);

  useEffect(() => {
    const duration = 1800;
    const steps = 60;
    const step = 84 / steps;
    let current = 0;
    const t = setInterval(() => {
      current += step;
      if (current >= 84) {
        setScore(84);
        clearInterval(t);
      } else setScore(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(t);
  }, []);

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 6, md: 9 }, pb: { xs: 7, md: 10 } }}>
      <AnimatedHeroBackground />

      {/* Subtle grid overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.022) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, #000 40%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Gradient orbs (restrained, tasteful) */}
      <Box
        component={motion.div}
        animate={{ scale: [1, 1.15, 1], opacity: [0.14, 0.22, 0.14] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          top: '-25%',
          right: '-6%',
          width: 620,
          height: 620,
          background: 'radial-gradient(circle, rgba(252, 82, 63, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(90px)',
        }}
      />
      <Box
        component={motion.div}
        animate={{ scale: [1, 1.25, 1], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        sx={{
          position: 'absolute',
          bottom: '-25%',
          left: '-10%',
          width: 520,
          height: 520,
          background: 'radial-gradient(circle, rgba(252, 82, 63, 0.26) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(90px)',
        }}
      />

      <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Grid container spacing={{ xs: 5, md: 6 }} alignItems="center">
          {/* LEFT — copy */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              {/* Badge pill */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ display: 'inline-block', marginBottom: 26 }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 0.75,
                    borderRadius: '9999px',
                    background: 'rgba(252, 82, 63, 0.08)',
                    border: '1px solid rgba(252, 82, 63, 0.22)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 16, color: '#FD7565' }} />
                  <Typography variant="caption" sx={{ color: '#FDA294', fontWeight: 700, letterSpacing: '0.04em', fontSize: '0.78rem' }}>
                    AI-Powered Growth OS
                  </Typography>
                  <Box sx={{ width: '1px', height: 14, background: 'rgba(252,82,63,0.3)' }} />
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.74rem' }}>
                    Now with Growth Brain
                  </Typography>
                  <Box component={motion.span} animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }} sx={{ display: 'inline-flex' }}>
                    <ArrowForwardIcon sx={{ fontSize: 14, color: '#FD7565' }} />
                  </Box>
                </Box>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.3rem', md: '3.5rem', lg: '4.25rem' },
                    fontWeight: 800,
                    lineHeight: 1.08,
                    letterSpacing: '-0.035em',
                    mb: 2.5,
                  }}
                >
                  <Box component="span" sx={{ color: '#0F172A' }}>
                    Turn website data into
                  </Box>{' '}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #FD7565 0%, #FC523F 55%, #E13E2C 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    real growth.
                  </Box>
                </Typography>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                style={{
                  color: '#64748B',
                  fontSize: 'clamp(1.02rem, 1.5vw, 1.2rem)',
                  maxWidth: 540,
                  margin: '0 0 2rem',
                  lineHeight: 1.65,
                }}
              >
                SiteScore AI scans your site, then hands you a prioritized action plan—not just another report. Track your Growth Score, complete AI-suggested fixes, and watch your rankings climb in real time.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'inherit' }}
              >
                <Button
                  component={motion.button}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  variant="contained"
                  size="large"
                  onClick={() => router.push('/signup')}
                  sx={{
                    px: 4,
                    py: 1.6,
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #FC523F 0%, #E13E2C 100%)',
                    boxShadow: '0 8px 32px rgba(252, 82, 63, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FD7565 0%, #FC523F 100%)',
                      boxShadow: '0 12px 40px rgba(252, 82, 63, 0.5)',
                    },
                  }}
                >
                  Start Free
                </Button>
                <Button
                  component={motion.button}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => router.push('/demo')}
                  sx={{
                    px: 4,
                    py: 1.6,
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '10px',
                    borderColor: 'rgba(15, 23, 42, 0.18)',
                    color: '#0F172A',
                    '&:hover': {
                      borderColor: 'rgba(252, 82, 63, 0.6)',
                      background: 'rgba(252, 82, 63, 0.08)',
                    },
                  }}
                >
                  View Demo
                </Button>
              </motion.div>

              {/* Social proof — avatars + rating */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
                <Box
                  sx={{
                    mt: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Box sx={{ display: 'flex' }}>
                    {avatars.map((src, i) => (
                      <Box
                        key={i}
                        component="img"
                        src={src}
                        alt="Customer"
                        loading="lazy"
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #F8FAFC',
                          background: '#F1F5F9',
                          ml: i === 0 ? 0 : '-10px',
                        }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                      {[...Array(5)].map((_, i) => (
                        <StarRoundedIcon key={i} sx={{ fontSize: 18, color: '#FBBF24' }} />
                      ))}
                      <Typography component="span" sx={{ ml: 0.75, color: '#0F172A', fontWeight: 700, fontSize: '0.85rem' }}>
                        4.9/5
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#64748B', fontSize: '0.8rem' }}>
                      Loved by 2,000+ growth teams
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Grid>

          {/* RIGHT — preview card */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', maxWidth: 540, mx: { xs: 'auto', md: 0 }, ml: { md: 'auto' } }}>
              {/* Floating trust chip */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                sx={{
                  position: 'absolute',
                  top: -16,
                  left: { xs: 12, md: -18 },
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.92)',
                  border: '1px solid rgba(15,23,42,0.1)',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <VerifiedUserRoundedIcon sx={{ fontSize: 16, color: '#4ADE80' }} />
                <Typography variant="caption" sx={{ color: '#334155', fontWeight: 600, fontSize: '0.72rem' }}>
                  SOC 2 · GDPR ready
                </Typography>
              </Box>

              <motion.div initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.25 }}>
                <Box
                  sx={{
                    position: 'relative',
                    background: 'rgba(15, 23, 42, 0.03)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15,23,42,0.04)',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: '15%',
                      right: '15%',
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(252,82,63,0.7), transparent)',
                    }}
                  />

                  {/* window chrome */}
                  <Box sx={{ p: 1.75, borderBottom: '1px solid rgba(15,23,42,0.05)', display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: 'rgba(239, 68, 68, 0.8)' }} />
                    <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: 'rgba(245, 158, 11, 0.8)' }} />
                    <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: 'rgba(34, 197, 94, 0.8)' }} />
                    <Typography variant="caption" sx={{ color: '#64748B', ml: 0.5 }}>
                      Growth Brain · SiteScore AI
                    </Typography>
                  </Box>

                  <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                    {/* Score + trend header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          Growth Score
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography sx={{ fontSize: '2.6rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{score}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                            <TrendingUpIcon sx={{ fontSize: 16, color: '#22C55E' }} />
                            <Typography sx={{ fontSize: '0.78rem', color: '#22C55E', fontWeight: 700 }}>+18%</Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1.25,
                          py: 0.5,
                          borderRadius: '6px',
                          background: 'rgba(34, 197, 94, 0.12)',
                          border: '1px solid rgba(34,197,94,0.25)',
                        }}
                      >
                        <BoltIcon sx={{ fontSize: 14, color: '#4ADE80' }} />
                        <Typography variant="caption" sx={{ color: '#4ADE80', fontWeight: 700, fontSize: '0.7rem' }}>
                          Live
                        </Typography>
                      </Box>
                    </Box>

                    {/* Graph */}
                    <Box
                      sx={{
                        borderRadius: '10px',
                        background: 'rgba(15,23,42,0.02)',
                        border: '1px solid rgba(15,23,42,0.05)',
                        p: 1.5,
                        mb: 2,
                      }}
                    >
                      <Box sx={{ height: 130, display: 'flex', alignItems: 'flex-end' }}>
                        <AnimatedAreaChart />
                      </Box>
                    </Box>

                    {/* Category bars */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                      {[
                        { label: 'SEO · 82', pct: 82 },
                        { label: 'Performance · 78', pct: 78 },
                        { label: 'Authority · 88', pct: 88 },
                      ].map(({ label, pct }, i) => (
                        <Box
                          key={label}
                          sx={{
                            position: 'relative',
                            height: 26,
                            borderRadius: '9px',
                            background: 'rgba(15,23,42,0.04)',
                            border: '1px solid rgba(15,23,42,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            px: 1.5,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            component={motion.div}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1.2, delay: 0.6 + i * 0.15 }}
                            sx={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              borderRadius: '9px',
                              background: 'linear-gradient(90deg, rgba(252, 82, 63, 0.45), rgba(252, 82, 63, 0.3))',
                            }}
                          />
                          <Typography variant="caption" sx={{ color: '#334155', position: 'relative', zIndex: 1, fontSize: '0.72rem' }}>
                            {label}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Action chips */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.85 }}>
                      {['✓ Action completed: Add meta tags', '◆ Growth plan ready: 5 actions'].map((text, i) => (
                        <motion.div key={text} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 + i * 0.2 }}>
                          <Box
                            sx={{
                              py: 1,
                              px: 1.5,
                              borderRadius: '8px',
                              background: i === 0 ? 'rgba(34, 197, 94, 0.12)' : 'rgba(252, 82, 63, 0.12)',
                              border: '1px solid rgba(15,23,42,0.05)',
                            }}
                          >
                            <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.72rem' }}>
                              {text}
                            </Typography>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Grid>
        </Grid>

        {/* Trust logo strip */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}>
          <Box sx={{ mt: { xs: 7, md: 9 }, textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{ color: '#64748B', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: '0.72rem' }}
            >
              Trusted by teams building the web&apos;s best sites
            </Typography>
            <Box
              sx={{
                mt: 2.5,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: 3, sm: 5, md: 7 },
              }}
            >
              {trustLogos.map((logo) => (
                <Typography
                  key={logo}
                  sx={{
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: { xs: '1.05rem', md: '1.25rem' },
                    letterSpacing: '-0.01em',
                    transition: 'color 0.2s ease',
                    cursor: 'default',
                    '&:hover': { color: '#64748B' },
                  }}
                >
                  {logo}
                </Typography>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
