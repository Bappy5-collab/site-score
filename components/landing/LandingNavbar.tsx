'use client';

import { Box, Typography, Button, Toolbar, AppBar, useMediaQuery, useTheme } from '@mui/material';
import Logo from '@/components/Logo';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const navTabs = [
  { label: 'Features', id: 'features' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Pricing', id: 'pricing' },
  { label: 'Testimonials', id: 'testimonials' },
];

export default function LandingNavbar() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: 1100,
        background: 'rgba(248, 250, 252, 0.7)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(15, 23, 42, 0.05)',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
          py: 0.5,
          minHeight: { xs: 60, md: 72 },
        }}
      >
        <Box
          component={motion.div}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          sx={{ flexShrink: 0 }}
        >
          <Logo size={34} fontSize="1.3rem" onClick={() => router.push('/landing')} />
        </Box>

        {!isMobile && (
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              p: 0.5,
              borderRadius: '9999px',
              background: 'rgba(15, 23, 42, 0.03)',
              border: '1px solid rgba(15, 23, 42, 0.05)',
            }}
          >
            {navTabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                component={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  px: 2.5,
                  py: 1.25,
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  color: '#64748B',
                  '&:hover': { color: '#0F172A', background: 'rgba(15, 23, 42, 0.05)' },
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          {!isMobile && (
            <Button
              component={motion.button}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/demo')}
              sx={{
                color: '#FD7565',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': { color: '#0F172A', background: 'rgba(252, 82, 63, 0.12)' },
              }}
            >
              View Demo
            </Button>
          )}
          <Button
            component={motion.button}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/login')}
            sx={{
              color: '#64748B',
              fontWeight: 600,
              fontSize: '0.9rem',
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': { color: '#0F172A', background: 'rgba(15, 23, 42, 0.05)' },
            }}
          >
            Login
          </Button>
          <Button
            component={motion.button}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            variant="contained"
            onClick={() => router.push('/signup')}
            sx={{
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #FC523F 0%, #E13E2C 100%)',
              boxShadow: '0 4px 20px rgba(252, 82, 63, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #FD7565 0%, #FC523F 100%)',
                boxShadow: '0 6px 28px rgba(252, 82, 63, 0.5)',
              },
            }}
          >
            Start Free
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
