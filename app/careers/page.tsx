'use client';

import { Box, Container, Typography, Card, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';
import StaticPageLayout from '@/components/StaticPageLayout';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import GroupIcon from '@mui/icons-material/Group';

const openings = [
  { title: 'Senior Full-Stack Engineer', team: 'Engineering', location: 'Remote', description: 'Build and scale the AI Growth OS — Next.js, Node, MongoDB, and real-time features.' },
  { title: 'Product Designer', team: 'Product', location: 'Remote', description: 'Own UX for the dashboard, growth flows, and onboarding. Strong SaaS and data-viz experience.' },
  { title: 'Growth Lead', team: 'Marketing', location: 'Remote', description: 'Drive acquisition and positioning for the AI Growth OS. Content, partnerships, and campaigns.' },
];

const values = [
  { icon: CodeIcon, label: 'Ship with quality', text: 'We build for the long term and keep the bar high.' },
  { icon: GroupIcon, label: 'Work as a team', text: 'Clear communication and mutual support across roles.' },
];

export default function CareersPage() {
  return (
    <StaticPageLayout>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              mb: 2,
            }}
          >
            Careers at SiteScore AI
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.7, mb: 5 }}>
            We’re a small team building the AI Growth Operating System. If you want to help turn data into action for thousands of teams, we’d love to hear from you.
          </Typography>

          <Typography variant="h2" sx={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F172A', mb: 2 }}>
            Open roles
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 5 }}>
            {openings.map((job, i) => (
              <Card
                key={job.title}
                component={motion.div}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                sx={{
                  background: 'rgba(15, 23, 42, 0.03)',
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  borderRadius: '10px',
                  '&:hover': { borderColor: 'rgba(252, 82, 63, 0.25)' },
                }}
              >
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F172A', mb: 0.5 }}>
                        {job.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>
                        {job.team} · {job.location}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                        {job.description}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: '8px',
                        borderColor: 'rgba(252, 82, 63, 0.5)',
                        color: '#FC523F',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { borderColor: 'rgba(252, 82, 63, 0.8)', background: 'rgba(252, 82, 63, 0.1)' },
                      }}
                    >
                      Apply
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Typography variant="h2" sx={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F172A', mb: 2 }}>
            What we value
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <Box
                  key={v.label}
                  sx={{
                    p: 2.5,
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.03)',
                    border: '1px solid rgba(15, 23, 42, 0.05)',
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ width: 44, height: 44, borderRadius: '8px', background: 'rgba(252, 82, 63, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon sx={{ color: '#FC523F', fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F172A', mb: 0.5 }}>
                      {v.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                      {v.text}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Typography sx={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.7, mt: 4 }}>
            Don’t see a fit? Email us at careers@sitescore.ai with your background and what you’d like to do.
          </Typography>
        </motion.div>
      </Container>
    </StaticPageLayout>
  );
}
