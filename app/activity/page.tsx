'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ApiIcon from '@mui/icons-material/Api';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import { formatDistanceToNow } from 'date-fns';
import { getActivity, type ActivityItem } from '@/services/activityService';

const cardSx = {
  p: 3,
  borderRadius: '12px',
  background: '#111827',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': { borderColor: 'rgba(249, 115, 22, 0.25)' },
};

const iconMap: Record<string, React.ComponentType<{ sx?: object }>> = {
  scan: AssessmentIcon,
  report: PictureAsPdfIcon,
  team: PersonAddIcon,
  schedule: ScheduleIcon,
  api: ApiIcon,
  billing: CreditCardIcon,
  automation: BuildCircleIcon,
};

const colorMap: Record<string, string> = {
  scan: '#F97316',
  report: '#F97316',
  team: '#22C55E',
  schedule: '#F59E0B',
  api: '#FB923C',
  billing: '#F97316',
  automation: '#F97316',
};

export default function ActivityTimelinePage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getActivity(50)
      .then((data) => {
        if (!cancelled) setActivities(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || err.message || 'Failed to load activity');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ maxWidth: 720, mx: 'auto', px: { xs: 0, sm: 1 } }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TimelineIcon sx={{ color: '#F97316', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em' }}>
                  Activity Timeline
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.25 }}>
                  Recent actions and events
                </Typography>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#F97316' }} />
              </Box>
            ) : (
              <Paper elevation={0} sx={cardSx}>
                <Box
                  sx={{
                    position: 'relative',
                    pl: 3,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 11,
                      top: 24,
                      bottom: 24,
                      width: 2,
                      background: 'linear-gradient(180deg, rgba(249, 115, 22, 0.5), rgba(249, 115, 22, 0.3))',
                      borderRadius: 1,
                    },
                  }}
                >
                  {activities.length === 0 && !loading && (
                    <Typography sx={{ color: '#64748B' }}>No activity yet.</Typography>
                  )}
                  {activities.map((item, index) => {
                    const Icon = iconMap[item.type] || AssessmentIcon;
                    const color = colorMap[item.type] || '#F97316';
                    const time = item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : '—';
                    return (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04, duration: 0.3 }}
                        style={{ position: 'relative', marginBottom: index < activities.length - 1 ? 24 : 0 }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'flex-start',
                            '&:hover .activity-dot': { boxShadow: `0 0 0 6px ${color}20` },
                          }}
                        >
                          <Box
                            className="activity-dot"
                            sx={{
                              position: 'absolute',
                              left: -26,
                              top: 4,
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: color,
                              border: '3px solid #0A0E27',
                              flexShrink: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'box-shadow 0.2s ease',
                              zIndex: 1,
                            }}
                          >
                            <Icon sx={{ fontSize: 12, color: '#fff' }} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0, pt: 0.25 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem', mt: 0.25 }}>
                              {item.detail || '—'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>
                              {time}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    );
                  })}
                </Box>
              </Paper>
            )}
          </motion.div>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
}
