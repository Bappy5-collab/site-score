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
import Logo from '@/components/Logo';
import OAuthButtons from '@/components/OAuthButtons';
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
        background: 'var(--bg-base)',
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
          background: 'radial-gradient(circle, rgba(252, 82, 63, 0.35) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, rgba(252, 82, 63, 0.3) 0%, transparent 70%)',
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
              borderRadius: '10px',
              background: 'var(--bg-surface)',
              backdropFilter: 'blur(24px)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Logo size={44} fontSize="1.6rem" sx={{ justifyContent: 'center', mb: 1 }} />
              <Typography sx={{ color: 'var(--text-muted)', mt: 1, fontWeight: 500 }}>
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
                  borderRadius: '8px',
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
                      <EmailOutlinedIcon sx={{ color: 'var(--text-muted)', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    background: 'var(--overlay-03)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    '& fieldset': { border: 'none' },
                    '&:hover': {
                      background: 'var(--overlay-05)',
                      borderColor: 'rgba(252, 82, 63, 0.3)',
                    },
                    '&.Mui-focused': {
                      borderColor: 'rgba(252, 82, 63, 0.6)',
                      boxShadow: '0 0 0 3px rgba(252, 82, 63, 0.15)',
                    },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--text-muted)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#FC523F' },
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
                      <LockOutlinedIcon sx={{ color: 'var(--text-muted)', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    background: 'var(--overlay-03)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    '& fieldset': { border: 'none' },
                    '&:hover': {
                      background: 'var(--overlay-05)',
                      borderColor: 'rgba(252, 82, 63, 0.3)',
                    },
                    '&.Mui-focused': {
                      borderColor: 'rgba(252, 82, 63, 0.6)',
                      boxShadow: '0 0 0 3px rgba(252, 82, 63, 0.15)',
                    },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--text-muted)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#FC523F' },
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
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  background: '#E13E2C',
                  boxShadow: 'none',
                  '&:hover': {
                    background: '#C9341F',
                    boxShadow: 'none',
                  },
                  '&:disabled': {
                    background: 'rgba(252, 82, 63, 0.4)',
                    color: 'rgba(255,255,255,0.7)',
                  },
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>

              <OAuthButtons label="or sign in with" />

              <Typography sx={{ textAlign: 'center', mt: 3 }}>
                <Link
                  href="/signup"
                  style={{
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'color 0.2s',
                  }}
                >
                  Don&apos;t have an account?{' '}
                  <Box component="span" sx={{ color: '#FC523F' }}>
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
