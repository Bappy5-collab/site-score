'use client';

import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import StaticPageLayout from '@/components/StaticPageLayout';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PsychologyIcon from '@mui/icons-material/Psychology';
import InsightsIcon from '@mui/icons-material/Insights';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import GroupIcon from '@mui/icons-material/Group';
import ApiIcon from '@mui/icons-material/Api';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ChatIcon from '@mui/icons-material/Chat';

const features = [
  { icon: AssessmentIcon, title: 'Deep Site Analyzer', text: 'Audit any URL for SEO, performance, accessibility, and security in a single scan.' },
  { icon: PsychologyIcon, title: 'Growth Brain', text: 'AI turns your weak spots into a prioritized, ranked action plan automatically.' },
  { icon: InsightsIcon, title: 'Growth Insights', text: 'Surface the highest-impact opportunities hidden inside your scan data.' },
  { icon: SmartToyIcon, title: 'AI Copilot', text: 'A context-aware assistant that guides you step by step toward a higher score.' },
  { icon: ChatIcon, title: 'AI Chat', text: 'Ask questions about your sites and get answers grounded in real scan results.' },
  { icon: ScheduleIcon, title: 'Automation Engine', text: 'Schedule recurring scans and weekly AI summaries so monitoring runs itself.' },
  { icon: CompareArrowsIcon, title: 'Compare', text: 'Put two scans or two sites side by side and see exactly what changed.' },
  { icon: PictureAsPdfIcon, title: 'PDF Reports', text: 'Export polished, shareable reports for clients and stakeholders.' },
  { icon: NotificationsActiveIcon, title: 'Real-Time Alerts', text: 'Live notifications when scans finish, scores change, or actions complete.' },
  { icon: EmojiEventsIcon, title: 'Leaderboard', text: 'Gamified ranking that keeps your team motivated to climb the score.' },
  { icon: GroupIcon, title: 'Team Collaboration', text: 'Invite teammates, assign roles, and grow together in one workspace.' },
  { icon: ApiIcon, title: 'API & Webhooks', text: 'Automate scans and pipe results into your own stack with a full REST API.' },
];

export default function FeaturesPage() {
  const router = useRouter();

  return (
    <StaticPageLayout>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', mb: 2 }}
            >
              Everything you need to grow
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 640, mx: 'auto' }}>
              SiteScore AI is a full growth operating system—from deep audits to AI-driven action plans, automation, and reporting.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {features.map((item, i) => {
              const Icon = item.icon;
              return (
                <Grid item xs={12} sm={6} md={4} key={item.title} sx={{ display: 'flex' }}>
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                    whileHover={{ y: -6 }}
                    sx={{
                      width: '100%',
                      p: 3,
                      borderRadius: '12px',
                      background: 'var(--overlay-03)',
                      border: '1px solid var(--border)',
                      transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                      '&:hover': { borderColor: 'rgba(252, 82, 63, 0.35)', boxShadow: '0 12px 32px rgba(252, 82, 63, 0.15)' },
                    }}
                  >
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(252, 82, 63, 0.2) 0%, rgba(252, 82, 63, 0.15) 100%)',
                        border: '1px solid rgba(252, 82, 63, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <Icon sx={{ fontSize: 26, color: '#FC523F' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)', mb: 0.75 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {item.text}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/signup')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '10px',
                fontWeight: 700,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #FC523F 0%, #E13E2C 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #FD7565 0%, #FC523F 100%)' },
              }}
            >
              Start free
            </Button>
          </Box>
        </motion.div>
      </Container>
    </StaticPageLayout>
  );
}
