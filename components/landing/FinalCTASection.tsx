'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function FinalCTASection() {
  const router = useRouter();

  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(10, 14, 39, 0.5) 0%, rgba(249, 115, 22, 0.08) 50%, rgba(234, 88, 12, 0.06) 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <Box
        component={motion.div}
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(80vw, 600px)',
          height: 400,
          background: 'radial-gradient(ellipse, rgba(249, 115, 22, 0.25) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.85,
              px: 1.75,
              py: 0.6,
              mb: 2.5,
              borderRadius: '9999px',
              background: 'rgba(249, 115, 22, 0.1)',
              border: '1px solid rgba(249, 115, 22, 0.22)',
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #EA580C)' }} />
            <Typography
              variant="caption"
              sx={{ color: '#C4B5FD', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: '0.72rem' }}
            >
              Get Started
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              color: '#F1F5F9',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Ready to grow on autopilot?
          </Typography>
          <Typography
            sx={{
              color: '#94A3B8',
              fontSize: '1.15rem',
              maxWidth: 480,
              mx: 'auto',
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Join teams that turned SEO data into a clear action plan. Start free—no credit card.
          </Typography>
          <Button
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variant="contained"
            size="large"
            onClick={() => router.push('/signup')}
            sx={{
              px: 5,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              boxShadow: '0 12px 40px rgba(249, 115, 22, 0.5)',
              '&:hover': {
                background: 'linear-gradient(135deg, #FB923C 0%, #FB923C 100%)',
                boxShadow: '0 16px 48px rgba(249, 115, 22, 0.55)',
              },
            }}
          >
            Start Free — Get your Growth Plan
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
}
