'use client';

import { Box, Container, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import StaticPageLayout from '@/components/StaticPageLayout';

interface Entry {
  version: string;
  date: string;
  tag: 'New' | 'Improved' | 'Fixed';
  title: string;
  points: string[];
}

const tagColor: Record<Entry['tag'], string> = {
  New: '#22C55E',
  Improved: '#FC523F',
  Fixed: '#06B6D4',
};

const entries: Entry[] = [
  {
    version: 'v2.4',
    date: 'May 2026',
    tag: 'New',
    title: 'Live analytics on the landing & dashboard',
    points: [
      'Interactive score-trend, category, and competitor charts.',
      'New site-health doughnut and radar visualizations.',
      'Range toggles (3M / 6M / 8M) on trend charts.',
    ],
  },
  {
    version: 'v2.3',
    date: 'Apr 2026',
    tag: 'New',
    title: 'Growth Copilot',
    points: [
      'An always-on AI co-pilot that guides you action by action.',
      'Context pulled directly from your latest scans and plan.',
    ],
  },
  {
    version: 'v2.2',
    date: 'Mar 2026',
    tag: 'Improved',
    title: 'Automation engine upgrade',
    points: [
      'Weekly AI summaries delivered to your inbox.',
      'More reliable scheduled scans with retry handling.',
    ],
  },
  {
    version: 'v2.1',
    date: 'Feb 2026',
    tag: 'New',
    title: 'API & webhooks',
    points: [
      'Public REST API to trigger scans programmatically.',
      'Webhooks for scan-complete and score-change events.',
    ],
  },
  {
    version: 'v2.0',
    date: 'Jan 2026',
    tag: 'Improved',
    title: 'Redesigned dashboard',
    points: [
      'New score cards, trend charts, and recent-scan feed.',
      'Faster load times and a refreshed dark theme.',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <StaticPageLayout>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', mb: 1 }}
          >
            Changelog
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '1.1rem', mb: 5 }}>
            Everything new in SiteScore AI. We ship improvements every week.
          </Typography>

          <Box sx={{ position: 'relative', pl: { xs: 2.5, sm: 3 } }}>
            {/* timeline rail */}
            <Box
              sx={{
                position: 'absolute',
                left: { xs: 6, sm: 7 },
                top: 6,
                bottom: 6,
                width: '2px',
                background: 'linear-gradient(180deg, rgba(252, 82, 63, 0.5), rgba(15,23,42,0.04))',
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {entries.map((entry, i) => (
                <Box
                  key={entry.version}
                  component={motion.div}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  sx={{ position: 'relative' }}
                >
                  {/* dot */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: { xs: -22, sm: -25 },
                      top: 22,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: tagColor[entry.tag],
                      border: '2px solid #F8FAFC',
                      boxShadow: `0 0 10px ${tagColor[entry.tag]}`,
                    }}
                  />
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: '10px',
                      background: 'rgba(15, 23, 42, 0.03)',
                      border: '1px solid rgba(15, 23, 42, 0.08)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1.5 }}>
                      <Chip
                        label={entry.tag}
                        size="small"
                        sx={{ background: `${tagColor[entry.tag]}22`, color: tagColor[entry.tag], fontWeight: 700, borderRadius: '6px' }}
                      />
                      <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 700 }}>
                        {entry.version}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        {entry.date}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F172A', mb: 1 }}>
                      {entry.title}
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {entry.points.map((p) => (
                        <Typography key={p} component="li" variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                          {p}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </StaticPageLayout>
  );
}
