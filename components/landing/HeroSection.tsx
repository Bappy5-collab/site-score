'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useRouter } from 'next/navigation';
import AnimatedHeroBackground from './AnimatedHeroBackground';

export default function HeroSection() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    const duration = 2000;
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
    <Box sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 6, md: 10 }, pb: { xs: 8, md: 12 } }}>
      {/* AI / website themed animated background */}
      <AnimatedHeroBackground />

      {/* Gradient orbs */}
      <Box
        component={motion.div}
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.35) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />
      <Box
        component={motion.div}
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-15%',
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div style={{ opacity: heroOpacity, y: heroY }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}
            >
          
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}


              
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.25rem', sm: '3rem', md: '4rem', lg: '4.5rem' },
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 50%, #F97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 2,
                }}
              >
                Stop Reading Data.
                <br />
                Start Growing with AI.
              </Typography>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{
                color: '#94A3B8',
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                maxWidth: 560,
                margin: '0 auto 2rem',
                lineHeight: 1.6,
              }}
            >
              Get a prioritized action plan from your scans. Turn every insight into a task, track your Growth Score, and let AI tell you what to do next—in real time.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Button
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variant="contained"
                size="large"
                onClick={() => router.push('/signup')}
                sx={{
                  px: 4,
                  py: 1.75,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                  boxShadow: '0 8px 32px rgba(249, 115, 22, 0.45)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FB923C 0%, #FB923C 100%)',
                    boxShadow: '0 12px 40px rgba(249, 115, 22, 0.5)',
                  },
                }}
              >
                Start Free
              </Button>
              <Button
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variant="outlined"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={() => router.push('/demo')}
                sx={{
                  px: 4,
                  py: 1.75,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '14px',
                  borderColor: 'rgba(249, 115, 22, 0.5)',
                  color: '#FB923C',
                  '&:hover': {
                    borderColor: 'rgba(249, 115, 22, 0.8)',
                    background: 'rgba(249, 115, 22, 0.1)',
                  },
                }}
              >
                View Demo
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Box
                sx={{
                  mt: 3,
                  display: 'flex',
                  gap: { xs: 1.5, sm: 2.5 },
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  color: '#64748B',
                  fontSize: '0.85rem',
                }}
              >
                <span>✓ No credit card required</span>
                <span style={{ opacity: 0.4 }}>•</span>
                <span>✓ Free forever plan</span>
                <span style={{ opacity: 0.4 }}>•</span>
                <span>✓ 2-minute setup</span>
              </Box>
            </motion.div>
          </Box>

          {/* Dashboard mockup + Growth score */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ maxWidth: 900, margin: '0 auto' }}
          >
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.05)',
              }}
            >
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'rgba(239, 68, 68, 0.8)' }} />
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'rgba(245, 158, 11, 0.8)' }} />
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'rgba(34, 197, 94, 0.8)' }} />
                <Typography variant="caption" sx={{ color: '#64748B', ml: 1 }}>Growth Brain · SiteScore AI</Typography>
              </Box>
              <Box sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-start', justifyContent: 'center' }}>
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Box
                    sx={{
                      width: 140,
                      height: 140,
                      borderRadius: '20px',
                      background: 'linear-gradient(145deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.15) 100%)',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 32px rgba(249, 115, 22, 0.2)',
                    }}
                  >
                    <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color: '#F1F5F9', lineHeight: 1 }}>
                      {score}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Growth Score</Typography>
                  </Box>
                </motion.div>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1, minWidth: 200 }}>
                  {[
                    { label: 'SEO · 82', pct: 82 },
                    { label: 'Performance · 78', pct: 78 },
                    { label: 'Authority · 88', pct: 88 },
                    { label: 'Content · 76', pct: 76 },
                  ].map(({ label, pct }, i) => (
                    <Box
                      key={label}
                      sx={{
                        position: 'relative',
                        height: 28,
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        width: '100%',
                        maxWidth: 280,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        component={motion.div}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1.2, delay: 0.5 + i * 0.15 }}
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          borderRadius: '10px',
                          background: 'linear-gradient(90deg, rgba(249, 115, 22, 0.4), rgba(234, 88, 12, 0.3))',
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#E2E8F0', position: 'relative', zIndex: 1 }}>
                        {label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['Action completed: Add meta tags', 'Growth plan ready: 5 actions'].map((text, i) => (
                    <motion.div
                      key={text}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.2 }}
                    >
                      <Box
                        sx={{
                          py: 1.25,
                          px: 2,
                          borderRadius: '12px',
                          background: i === 0 ? 'rgba(34, 197, 94, 0.12)' : 'rgba(249, 115, 22, 0.12)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          maxWidth: 260,
                        }}
                      >
                        <Typography variant="caption" sx={{ color: '#E2E8F0' }}>{text}</Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
