'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const stats = [
  { label: 'Growth actions completed', value: 4200, suffix: '+' },
  { label: 'Sites analyzed', value: 1800, suffix: '+' },
  { label: 'Avg. Growth Score lift', value: 18, suffix: '%' },
  { label: 'Checks per scan', value: 60, suffix: '+' },
];

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Head of Growth',
    company: 'B2B SaaS',
    avatar: 'SK',
    color: '#6366F1',
    quote: 'Instead of another PDF report, we get a prioritized to-do list. The team knows exactly what to work on each week.',
  },
  {
    name: 'Marcus L.',
    role: 'SEO Lead',
    company: 'Marketing Agency',
    avatar: 'ML',
    color: '#0EA5E9',
    quote: 'Having the score and the action plan side by side means we can show clients real, measurable progress over time.',
  },
  {
    name: 'Jordan T.',
    role: 'Product Manager',
    company: 'Early-stage startup',
    avatar: 'JT',
    color: '#10B981',
    quote: 'The real-time score and alerts help us catch performance regressions before they reach users. It just runs in the background.',
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
                    height: '100%',
                    borderRadius: '16px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-strong)',
                    boxShadow: '0 16px 40px -24px rgba(15,23,42,0.22)',
                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                    '&:hover': { borderColor: 'rgba(252, 82, 63, 0.4)', boxShadow: '0 22px 50px -22px rgba(15,23,42,0.3)' },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #FC523F 0%, #E13E2C 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      mb: 0.5,
                    }}
                  >
                    {counters[index].toLocaleString()}
                    {stat.suffix}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
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
                  component={motion.div}
                  whileHover={{ y: -4 }}
                  sx={{
                    height: '100%',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '16px',
                    boxShadow: '0 16px 40px -24px rgba(15,23,42,0.22)',
                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                    '&:hover': { borderColor: 'rgba(252, 82, 63, 0.4)', boxShadow: '0 22px 50px -22px rgba(15,23,42,0.3)' },
                    p: 3,
                  }}
                >
                  <Typography variant="body1" sx={{ color: 'var(--text-secondary)', fontStyle: 'italic', mb: 2, lineHeight: 1.6 }}>
                    "{t.quote}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      alt={t.name}
                      sx={{
                        width: 48,
                        height: 48,
                        background: t.color,
                        fontSize: '1rem',
                        fontWeight: 700,
                      }}
                    >
                      {t.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {t.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
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
