'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';

const inputSx = {
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
};

const SettingsPage = () => {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileSaving(true);
    try {
      await authService.updateProfile({ name: name.trim(), email: email.trim() });
      await refreshUser();
      setProfileSuccess('Profile updated successfully.');
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    setPasswordSaving(true);
    try {
      await authService.updatePassword(currentPassword, newPassword);
      setPasswordSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#0F172A',
                mb: 0.5,
                letterSpacing: '-0.02em',
              }}
            >
              Account settings
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
              Manage your profile and security
            </Typography>

            {/* Profile section */}
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              elevation={0}
              sx={{
                p: 4,
                borderRadius: '8px',
                background: '#FFFFFF',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F172A', mb: 2 }}>
                Profile
              </Typography>
              {profileSuccess && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 2,
                    background: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#15803D',
                    borderRadius: '8px',
                  }}
                >
                  {profileSuccess}
                </Alert>
              )}
              {profileError && (
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
                  {profileError}
                </Alert>
              )}
              <Box component="form" onSubmit={handleProfileSubmit}>
                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{ mb: 2, ...inputSx }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon sx={{ color: '#64748B', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ mb: 3, ...inputSx }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: '#64748B', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={profileSaving}
                  component={motion.button}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    borderRadius: '10px',
                    py: 1.25,
                    px: 3,
                    fontWeight: 700,
                    textTransform: 'none',
                    background: '#E13E2C',
                    boxShadow: 'none',
                    '&:hover': {
                      background: '#C9341F',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {profileSaving ? 'Saving...' : 'Save profile'}
                </Button>
              </Box>
            </Paper>

            {/* Password section */}
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              elevation={0}
              sx={{
                p: 4,
                borderRadius: '8px',
                background: '#FFFFFF',
                border: '1px solid rgba(15, 23, 42, 0.08)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F172A', mb: 2 }}>
                Change password
              </Typography>
              {passwordSuccess && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 2,
                    background: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#15803D',
                    borderRadius: '8px',
                  }}
                >
                  {passwordSuccess}
                </Alert>
              )}
              {passwordError && (
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
                  {passwordError}
                </Alert>
              )}
              <Box component="form" onSubmit={handlePasswordSubmit}>
                <TextField
                  fullWidth
                  label="Current password"
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  sx={{ mb: 2, ...inputSx }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: '#64748B', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          size="small"
                          onClick={() => setShowCurrent((s) => !s)}
                          sx={{ minWidth: 0, color: '#64748B' }}
                        >
                          {showCurrent ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="New password"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  sx={{ mb: 2, ...inputSx }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: '#64748B', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          size="small"
                          onClick={() => setShowNew((s) => !s)}
                          sx={{ minWidth: 0, color: '#64748B' }}
                        >
                          {showNew ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirm new password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  sx={{ mb: 3, ...inputSx }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: '#64748B', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="outlined"
                  disabled={passwordSaving}
                  component={motion.button}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    borderRadius: '10px',
                    py: 1.25,
                    px: 3,
                    fontWeight: 700,
                    textTransform: 'none',
                    borderColor: 'rgba(252, 82, 63, 0.5)',
                    color: '#FC523F',
                    '&:hover': {
                      borderColor: 'rgba(252, 82, 63, 0.8)',
                      background: 'rgba(252, 82, 63, 0.08)',
                    },
                  }}
                >
                  {passwordSaving ? 'Updating...' : 'Update password'}
                </Button>
              </Box>
            </Paper>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="text"
                onClick={() => router.push('/profile')}
                sx={{
                  color: '#64748B',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { color: '#FC523F', background: 'transparent' },
                }}
              >
                ← Back to profile
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default SettingsPage;
