'use client';

import { Box, Container, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SectionHeading from './SectionHeading';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ChatIcon from '@mui/icons-material/Chat';
import InsightsIcon from '@mui/icons-material/Insights';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import ApiIcon from '@mui/icons-material/Api';
import CreditCardIcon from '@mui/icons-material/CreditCard';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface FeatureGroup {
  heading: string;
  color: string;
  features: Feature[];
}

const groups: FeatureGroup[] = [
  {
    heading: 'Overview',
    color: '#06B6D4',
    features: [
      { icon: DashboardIcon, title: 'Dashboard', description: 'A single command center with score cards, trend charts, and your latest scans at a glance.' },
      { icon: TimelineIcon, title: 'Activity', description: 'A live timeline of every scan, action, and score change across your workspace.' },
    ],
  },
  {
    heading: 'Analyze',
    color: '#FC523F',
    features: [
      { icon: AssessmentIcon, title: 'Analyzer', description: 'Run a deep audit of any URL—SEO, performance, accessibility, and security in one pass.' },
      { icon: HistoryIcon, title: 'My Scans', description: 'Browse, filter, and revisit every scan you have ever run with full historical detail.' },
      { icon: CompareArrowsIcon, title: 'Compare', description: 'Put two scans or two sites side by side and see exactly what changed and who wins.' },
      { icon: PictureAsPdfIcon, title: 'Reports', description: 'Export polished PDF reports to share results with clients and stakeholders.' },
    ],
  },
  {
    heading: 'Growth',
    color: '#22C55E',
    features: [
      { icon: ChatIcon, title: 'AI Chat', description: 'A context-aware assistant that answers questions using your real scan data.' },
      { icon: InsightsIcon, title: 'Growth Insights', description: 'AI surfaces the highest-impact opportunities hiding in your audits.' },
      { icon: PsychologyIcon, title: 'Growth Brain', description: 'Turns weak spots into a prioritized, ranked action plan—no more guessing.' },
      { icon: SmartToyIcon, title: 'Growth Copilot', description: 'Your always-on co-pilot that guides you step by step toward a higher score.' },
      { icon: ScheduleIcon, title: 'Automation', description: 'Schedule recurring scans and weekly AI summaries so monitoring runs itself.' },
      { icon: EmojiEventsIcon, title: 'Leaderboard', description: 'Gamified ranking that keeps your team motivated to climb the score.' },
    ],
  },
  {
    heading: 'Workspace',
    color: '#A855F7',
    features: [
      { icon: GroupIcon, title: 'Team', description: 'Invite teammates, assign roles, and collaborate on growth together.' },
      { icon: ApiIcon, title: 'API & Webhooks', description: 'Automate scans and pipe results into your own stack with a full REST API.' },
      { icon: CreditCardIcon, title: 'Billing', description: 'Manage your plan, usage, and invoices from a self-serve billing center.' },
    ],
  },
];

export default function DashboardFeaturesSection() {
  const router = useRouter();

  return (
    <Box id="dashboard-features" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Everything inside"
          title="The full dashboard, end to end"
          subtitle="Sixteen tools across Overview, Analyze, Growth, and Workspace—everything you get the moment you sign in."
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {groups.map((group) => (
            <Box key={group.heading}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: group.color, boxShadow: `0 0 12px ${group.color}` }} />
                <Typography
                  sx={{
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem',
                  }}
                >
                  {group.heading}
                </Typography>
                <Box sx={{ flex: 1, height: '1px', background: 'var(--overlay-08)' }} />
              </Box>

              <Grid container spacing={2}>
                {group.features.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Grid item xs={12} sm={6} md={4} key={item.title} sx={{ display: 'flex' }}>
                      <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{ y: -6 }}
                        onClick={() => router.push('/signup')}
                        sx={{
                          width: '100%',
                          p: 2.5,
                          cursor: 'pointer',
                          borderRadius: '10px',
                          background: 'var(--overlay-03)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid var(--border)',
                          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                          '&:hover': {
                            borderColor: `${group.color}66`,
                            boxShadow: `0 12px 32px ${group.color}1f`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 46,
                            height: 46,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1.75,
                            color: group.color,
                            background: `${group.color}1f`,
                            border: `1px solid ${group.color}33`,
                          }}
                        >
                          <Icon sx={{ fontSize: 24 }} />
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--text-primary)', mb: 0.5 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                          {item.description}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
