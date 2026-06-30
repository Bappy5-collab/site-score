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
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '@/context/AuthContext';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(name, email, password);
      // New users go through onboarding first.
      try {
        localStorage.removeItem('onboardingComplete');
      } catch {
        /* ignore */
      }
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
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
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 50%, #F8FAFC 100%)',
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
              background: '#FFFFFF',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Logo size={44} fontSize="1.6rem" sx={{ justifyContent: 'center', mb: 1 }} />
              <Typography sx={{ color: '#64748B', mt: 1, fontWeight: 500 }}>
                Create your account to get started
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#B91C1C',
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
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlinedIcon sx={{ color: '#64748B', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.03)',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    color: '#0F172A',
                    '& fieldset': { border: 'none' },
                    '&:hover': {
                      background: 'rgba(15, 23, 42, 0.05)',
                      borderColor: 'rgba(252, 82, 63, 0.3)',
                    },
                    '&.Mui-focused': {
                      borderColor: 'rgba(252, 82, 63, 0.6)',
                      boxShadow: '0 0 0 3px rgba(252, 82, 63, 0.15)',
                    },
                  },
                  '& .MuiInputLabel-root': { color: '#64748B' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#FC523F' },
                }}
              />
              <TextField
                fullWidth
                required
                id="email"
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
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
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.03)',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    color: '#0F172A',
                    '& fieldset': { border: 'none' },
                    '&:hover': {
                      background: 'rgba(15, 23, 42, 0.05)',
                      borderColor: 'rgba(252, 82, 63, 0.3)',
                    },
                    '&.Mui-focused': {
                      borderColor: 'rgba(252, 82, 63, 0.6)',
                      boxShadow: '0 0 0 3px rgba(252, 82, 63, 0.15)',
                    },
                  },
                  '& .MuiInputLabel-root': { color: '#64748B' },
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
                autoComplete="new-password"
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
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.03)',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    color: '#0F172A',
                    '& fieldset': { border: 'none' },
                    '&:hover': {
                      background: 'rgba(15, 23, 42, 0.05)',
                      borderColor: 'rgba(252, 82, 63, 0.3)',
                    },
                    '&.Mui-focused': {
                      borderColor: 'rgba(252, 82, 63, 0.6)',
                      boxShadow: '0 0 0 3px rgba(252, 82, 63, 0.15)',
                    },
                  },
                  '& .MuiInputLabel-root': { color: '#64748B' },
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
                {loading ? 'Creating account...' : 'Create account'}
              </Button>

              <OAuthButtons label="or sign up with" />

              <Typography sx={{ textAlign: 'center', mt: 3 }}>
                <Link
                  href="/login"
                  style={{
                    color: '#64748B',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'color 0.2s',
                  }}
                >
                  Already have an account?{' '}
                  <Box component="span" sx={{ color: '#FC523F' }}>
                    Sign in
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

export default SignupPage;
