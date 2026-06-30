'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  Skeleton,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import SettingsIcon from '@mui/icons-material/Settings';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { authService, UserProfile } from '@/services/authService';
import { format } from 'date-fns';

const ProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getMe();
        setProfile(data);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
                color: 'var(--text-primary)',
                mb: 0.5,
                letterSpacing: '-0.02em',
              }}
            >
              Profile
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 3 }}>
              View your account information
            </Typography>

            {loading ? (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '8px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                  <Skeleton variant="circular" width={88} height={88} sx={{ bgcolor: 'var(--overlay-05)' }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton width="60%" height={32} sx={{ bgcolor: 'var(--overlay-05)', mb: 1 }} />
                    <Skeleton width="40%" height={24} sx={{ bgcolor: 'var(--overlay-05)' }} />
                  </Box>
                </Box>
                <Skeleton width="100%" height={56} sx={{ bgcolor: 'var(--overlay-05)', borderRadius: 1, mb: 2 }} />
                <Skeleton width="100%" height={56} sx={{ bgcolor: 'var(--overlay-05)', borderRadius: 1 }} />
              </Paper>
            ) : profile ? (
              <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '8px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  '&:hover': {
                    borderColor: 'var(--border-strong)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3, mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 88,
                      height: 88,
                      background: '#E13E2C',
                      fontSize: '2rem',
                      fontWeight: 700,
                    }}
                  >
                    {profile.name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 0.5 }}>
                      {profile.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 1 }}>
                      {profile.email}
                    </Typography>
                    {profile.role && (
                      <Chip
                        size="small"
                        label={profile.role}
                        sx={{
                          textTransform: 'capitalize',
                          background: profile.role === 'admin'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : 'rgba(252, 82, 63, 0.2)',
                          color: profile.role === 'admin' ? '#FCA5A5' : '#C4B5FD',
                          border: '1px solid',
                          borderColor: profile.role === 'admin' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(252, 82, 63, 0.4)',
                        }}
                      />
                    )}
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<SettingsIcon />}
                    onClick={() => router.push('/settings')}
                    component={motion.button}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    sx={{
                      borderRadius: '8px',
                      borderColor: 'rgba(252, 82, 63, 0.5)',
                      color: '#FC523F',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'rgba(252, 82, 63, 0.8)',
                        background: 'rgba(252, 82, 63, 0.08)',
                      },
                    }}
                  >
                    Account settings
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    '& .profile-row': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderRadius: '10px',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                    },
                  }}
                >
                  <Box className="profile-row">
                    <PersonIcon sx={{ color: '#FC523F', fontSize: 22 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>
                        Full name
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {profile.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="profile-row">
                    <EmailIcon sx={{ color: '#FC523F', fontSize: 22 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>
                        Email address
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {profile.email}
                      </Typography>
                    </Box>
                  </Box>
                  {profile.role && (
                    <Box className="profile-row">
                      <BadgeIcon sx={{ color: '#FC523F', fontSize: 22 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>
                          Role
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 500, textTransform: 'capitalize' }}>
                          {profile.role}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  {profile.createdAt && (
                    <Box className="profile-row">
                      <CalendarTodayIcon sx={{ color: '#FC523F', fontSize: 22 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>
                          Member since
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                          {format(new Date(profile.createdAt), 'MMMM d, yyyy')}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Paper>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '8px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ color: 'var(--text-muted)' }}>Unable to load profile.</Typography>
              </Paper>
            )}
          </motion.div>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default ProfilePage;
