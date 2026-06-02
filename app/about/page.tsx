'use client';

import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import StaticPageLayout from '@/components/StaticPageLayout';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShieldIcon from '@mui/icons-material/Shield';

export default function AboutPage() {
  return (
    <StaticPageLayout>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 800,
              color: '#F1F5F9',
              letterSpacing: '-0.02em',
              mb: 2,
            }}
          >
            About SiteScore AI
          </Typography>
          <Typography sx={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.7, mb: 4 }}>
            We built SiteScore AI because we were tired of SEO and performance tools that hand you reports and leave you guessing what to do next. Our mission is simple: turn data into a clear action plan so you can grow instead of just measure.
          </Typography>

          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#F1F5F9', mb: 2, mt: 4 }}>
            What we believe
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { icon: PsychologyIcon, title: 'AI should drive action', text: 'Growth Brain analyzes your scans and gives you a prioritized list of tasks—no more drowning in dashboards.' },
              { icon: TrendingUpIcon, title: 'Growth is a system', text: 'Scores, actions, automation, and an AI copilot work together so you can improve consistently over time.' },
              { icon: ShieldIcon, title: 'Transparency and control', text: 'Your data stays yours. We use it to power your growth plan and nothing else.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Box
                  key={item.title}
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon sx={{ color: '#F97316', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#F1F5F9', mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
                      {item.text}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Typography sx={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.7, mt: 5 }}>
            We’re a small team focused on making website growth predictable and actionable. If that resonates, we’d love to hear from you—head to Contact or try the product free.
          </Typography>
        </motion.div>
      </Container>
    </StaticPageLayout>
  );
}
