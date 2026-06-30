'use client';

import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import StaticPageLayout from '@/components/StaticPageLayout';
import PricingSection from '@/components/landing/PricingSection';

const faqs = [
  { q: 'Is there really a free plan?', a: 'Yes. The Free plan gives you 5 scans a month, AI Chat, PDF reports, and your Growth Score—no credit card required.' },
  { q: 'Can I change plans later?', a: 'Absolutely. Upgrade or downgrade anytime from the in-app Billing center; changes are prorated automatically.' },
  { q: 'What counts as a scan?', a: 'A scan is one full audit of a URL across SEO, performance, accessibility, and security. Re-running a site uses one scan.' },
  { q: 'Do you offer team plans?', a: 'Pro and Business include team collaboration. For larger orgs with custom needs, reach out via Contact for a tailored plan.' },
];

export default function PricingPage() {
  return (
    <StaticPageLayout>
      <PricingSection />

      <Container maxWidth="md" sx={{ pb: 4 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '1.85rem' }, fontWeight: 800, color: '#0F172A', textAlign: 'center', mb: 4 }}>
          Frequently asked questions
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {faqs.map((item, i) => (
            <Box
              key={item.q}
              component={motion.div}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              sx={{
                p: 3,
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.03)',
                border: '1px solid rgba(15, 23, 42, 0.08)',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F172A', mb: 0.75 }}>
                {item.q}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.7 }}>
                {item.a}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </StaticPageLayout>
  );
}
