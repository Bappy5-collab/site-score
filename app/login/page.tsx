'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0A0E27 0%, #151932 50%, #0A0E27 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
      }}
    >
      {/* Background orbs */}
      <Box
        component={motion.div}
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />
      <Box
        component={motion.div}
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />

      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                SiteScore AI
              </Typography>
              <Typography sx={{ color: '#94A3B8', mt: 1, fontWeight: 500 }}>
                Welcome back — sign in to continue
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FCA5A5',
                  borderRadius: '12px',
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                required
                id="email"
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: '#64748B', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#F1F5F9',
                    '& fieldset': { border: 'none' },
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                    },
                    '&.Mui-focused': {
                      borderColor: 'rgba(139, 92, 246, 0.6)',
                      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.15)',
                    },
                  },
                  '& .MuiInputLabel-root': { color: '#94A3B8' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#8B5CF6' },
                }}
              />
              <TextField
                fullWidth
                required
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: '#64748B', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#F1F5F9',
                    '& fieldset': { border: 'none' },
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                    },
                    '&.Mui-focused': {
                      borderColor: 'rgba(139, 92, 246, 0.6)',
                      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.15)',
                    },
                  },
                  '& .MuiInputLabel-root': { color: '#94A3B8' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#8B5CF6' },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                component={motion.button}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                sx={{
                  py: 1.5,
                  borderRadius: '14px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)',
                    boxShadow: '0 12px 32px rgba(139, 92, 246, 0.5)',
                  },
                  '&:disabled': {
                    background: 'rgba(139, 92, 246, 0.4)',
                    color: 'rgba(255,255,255,0.7)',
                  },
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>

              <Typography sx={{ textAlign: 'center', mt: 3 }}>
                <Link
                  href="/signup"
                  style={{
                    color: '#94A3B8',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'color 0.2s',
                  }}
                >
                  Don&apos;t have an account?{' '}
                  <Box component="span" sx={{ color: '#8B5CF6' }}>
                    Sign up
                  </Box>
                </Link>
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;
