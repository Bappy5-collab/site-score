'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const stats = [
  { label: 'Growth actions completed', value: 125000, suffix: '+' },
  { label: 'Teams growing', value: 12000, suffix: '+' },
  { label: 'Avg. Growth Score lift', value: 24, suffix: '%' },
  { label: 'Scans analyzed', value: 50000, suffix: '+' },
];

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Head of Growth',
    company: 'TechCorp',
    avatar: 'SK',
    quote: 'We stopped drowning in spreadsheets. The AI tells us exactly what to fix and we just tick it off. Game changer.',
  },
  {
    name: 'Marcus L.',
    role: 'SEO Lead',
    company: 'Digital Agency',
    avatar: 'ML',
    quote: 'Growth Brain plus the action list is what we needed. Our clients see results faster and we look like heroes.',
  },
  {
    name: 'Jordan T.',
    role: 'Product Manager',
    company: 'SaaS Co',
    avatar: 'JT',
    quote: 'Real-time score and notifications mean we catch regressions before users do. Feels like having a growth ops team.',
  },
];

export default function TestimonialsStatsSection() {
  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const inc = duration / steps;
    stats.forEach((stat, index) => {
      let current = 0;
      const target = stat.value;
      const stepVal = target / steps;
      const t = setInterval(() => {
        current += stepVal;
        if (current >= target) {
          setCounters((prev) => {
            const next = [...prev];
            next[index] = target;
            return next;
          });
          clearInterval(t);
        } else {
          setCounters((prev) => {
            const next = [...prev];
            next[index] = Math.floor(current);
            return next;
          });
        }
      }, inc);
    });
  }, []);

  return (
    <Box id="testimonials" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by teams that ship"
          subtitle="Numbers and words from people using the AI Growth OS."
        />

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      mb: 0.5,
                    }}
                  >
                    {counters[index].toLocaleString()}
                    {stat.suffix}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    {stat.label}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {testimonials.map((t, index) => (
            <Grid item xs={12} md={4} key={t.name}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    p: 3,
                  }}
                >
                  <Typography variant="body1" sx={{ color: '#E2E8F0', fontStyle: 'italic', mb: 2, lineHeight: 1.6 }}>
                    "{t.quote}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                        fontSize: '1rem',
                        fontWeight: 600,
                      }}
                    >
                      {t.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
                        {t.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        {t.role} at {t.company}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
