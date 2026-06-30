'use client';

import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const features = [
  {
    icon: PsychologyIcon,
    title: 'Growth Brain',
    description: 'AI analyzes your scan history and weak spots, then builds a prioritized action plan—no more guessing what to fix first.',
  },
  {
    icon: CheckCircleOutlineIcon,
    title: 'Smart Action System',
    description: 'Every insight becomes a task. Mark items done and watch your Growth Score update in real time.',
  },
  {
    icon: ScheduleIcon,
    title: 'Automation Engine',
    description: 'Schedule weekly scans, get AI summaries, and automate monitoring so you stay ahead of drops.',
  },
  {
    icon: NotificationsActiveIcon,
    title: 'Real-Time Alerts',
    description: 'Notifications and live updates when scans finish, actions are completed, or scores change.',
  },
  {
    icon: SmartToyIcon,
    title: 'AI Copilot',
    description: 'Context-aware chat uses your scans and plan to give personalized growth advice on demand.',
  },
];

export default function FeaturesSection() {
  return (
    <Box id="features" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Features"
          title="AI Growth OS — core features"
          subtitle="From scans to actions to growth, all in one system."
        />

        <Grid container spacing={3}>
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={item.title} sx={{ display: 'flex' }}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  sx={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'rgba(252, 82, 63, 0.35)',
                      boxShadow: '0 12px 40px rgba(252, 82, 63, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(252, 82, 63, 0.2) 0%, rgba(252, 82, 63, 0.15) 100%)',
                        border: '1px solid rgba(252, 82, 63, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <Icon sx={{ fontSize: 28, color: '#FC523F' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F172A', mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
