'use client';

import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const steps = [
  {
    icon: SearchIcon,
    title: 'Scan',
    description: 'Run a scan on any URL. We measure performance, SEO, security, and content signals.',
  },
  {
    icon: AutoAwesomeIcon,
    title: 'AI Analysis',
    description: 'Growth Brain turns your history into insights and a prioritized action plan.',
  },
  {
    icon: TrendingUpIcon,
    title: 'Action → Growth',
    description: 'Complete tasks, track your Growth Score, and get real-time updates and alerts.',
  },
];

export default function HowItWorksSection() {
  return (
    <Box id="how-it-works" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontWeight: 800,
              color: '#F1F5F9',
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            How it works
          </Typography>
          <Typography sx={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: 520, mx: 'auto' }}>
            Three steps from data to growth.
          </Typography>
        </motion.div>

        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Grid item xs={12} md={4} key={step.title} sx={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  style={{ width: '100%', maxWidth: 320 }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      p: 3,
                      borderRadius: '24px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      textAlign: 'center',
                      position: 'relative',
                      '&:hover': { borderColor: 'rgba(139, 92, 246, 0.25)' },
                    }}
                  >
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(236, 72, 153, 0.2) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <Icon sx={{ fontSize: 36, color: '#8B5CF6' }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9', mb: 1.5 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
                      {step.description}
                    </Typography>
                    {index < steps.length - 1 && (
                      <Box
                        sx={{
                          display: { xs: 'none', md: 'block' },
                          position: 'absolute',
                          right: -32,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'rgba(139, 92, 246, 0.5)',
                        }}
                      >
                        <ArrowForwardIcon sx={{ fontSize: 28 }} />
                      </Box>
                    )}
                  </Box>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
