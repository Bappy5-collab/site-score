'use client';

import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
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
        <SectionHeading
          eyebrow="Process"
          title="How it works"
          subtitle="Three steps from data to growth."
          marginBottom={56}
        />

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
                      borderRadius: '12px',
                      background: 'var(--overlay-03)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--border)',
                      textAlign: 'center',
                      position: 'relative',
                      '&:hover': { borderColor: 'rgba(252, 82, 63, 0.25)' },
                    }}
                  >
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(252, 82, 63, 0.25) 0%, rgba(252, 82, 63, 0.2) 100%)',
                        border: '1px solid rgba(252, 82, 63, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <Icon sx={{ fontSize: 36, color: '#FC523F' }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 1.5 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
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
                          color: 'rgba(252, 82, 63, 0.5)',
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
