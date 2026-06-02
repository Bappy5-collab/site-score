'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const sampleNotifications = [
  { id: 1, text: 'Action completed: Add meta descriptions', type: 'success' },
  { id: 2, text: 'Growth plan ready: 8 actions to complete', type: 'info' },
  { id: 3, text: 'Weekly summary: Performance +5% vs last week', type: 'success' },
  { id: 4, text: 'Scan completed: example.com — Score 82/100', type: 'info' },
];

export default function RealTimeSection() {
  const [score, setScore] = useState(72);
  const [activeNotif, setActiveNotif] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setScore((s) => (s >= 88 ? 72 : s + 2));
    }, 1200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveNotif((n) => (n + 1) % sampleNotifications.length);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Live"
          title="Real-time & automation"
          subtitle="Live notifications and score updates. No refresh needed."
        />

        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 380,
                  p: 2.5,
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <NotificationsActiveIcon sx={{ color: '#F97316', fontSize: 24 }} />
                  <Typography variant="subtitle2" sx={{ color: '#94A3B8' }}>
                    Notifications
                  </Typography>
                </Box>
                {sampleNotifications.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0.5, scale: 0.98 }}
                    animate={{
                      opacity: i === activeNotif ? 1 : 0.5,
                      scale: i === activeNotif ? 1 : 0.98,
                      borderColor: i === activeNotif ? 'rgba(249, 115, 22, 0.3)' : 'rgba(255,255,255,0.06)',
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ marginBottom: 8 }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '14px',
                        background: i === activeNotif ? 'rgba(249, 115, 22, 0.1)' : 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#E2E8F0' }}>
                        {n.text}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: '24px',
                  background: 'linear-gradient(145deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.15) 100%)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 16px 48px rgba(249, 115, 22, 0.2)',
                }}
              >
                <motion.div
                  key={score}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <Typography sx={{ fontSize: '4rem', fontWeight: 800, color: '#F1F5F9', lineHeight: 1 }}>
                    {score}
                  </Typography>
                </motion.div>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <TrendingUpIcon sx={{ fontSize: 20, color: '#22C55E' }} />
                  <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                    Growth Score
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
