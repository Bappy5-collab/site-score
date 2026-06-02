'use client';

import { Box, Container, Typography, Grid, Card, Button } from '@mui/material';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useRouter } from 'next/navigation';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: '/month',
    scans: '5 scans',
    features: ['5 scans/month', 'Basic SEO analysis', 'AI Chat', 'PDF reports', 'Growth Score'],
    recommended: false,
  },
  {
    name: 'Pro',
    price: 29,
    period: '/month',
    scans: '100 scans',
    features: ['100 scans/month', 'Growth Brain & actions', 'Automation & weekly summary', 'API & webhooks', 'Team collaboration'],
    recommended: true,
  },
  {
    name: 'Business',
    price: 99,
    period: '/month',
    scans: 'Unlimited',
    features: ['Unlimited scans', 'Everything in Pro', 'Priority support', 'Custom reports', 'Dedicated success'],
    recommended: false,
  },
];

export default function PricingSection() {
  const router = useRouter();

  return (
    <Box id="pricing" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          subtitle="Start free. Upgrade when you need more scans and power."
        />

        <Grid container spacing={3} alignItems="stretch" justifyContent="center" sx={{ maxWidth: 1100, mx: 'auto' }}>
          {plans.map((plan, index) => (
            <Grid item xs={12} md={4} key={plan.name} sx={{ display: 'flex' }}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'visible',
                  background: plan.recommended
                    ? 'linear-gradient(180deg, rgba(249, 115, 22, 0.12) 0%, rgba(21, 25, 50, 0.98) 28%)'
                    : 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(24px)',
                  border: plan.recommended ? '1px solid rgba(249, 115, 22, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: plan.recommended ? '0 0 0 1px rgba(249, 115, 22, 0.2), 0 24px 48px -12px rgba(0,0,0,0.4)' : 'none',
                }}
              >
                {plan.recommended && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      px: 2,
                      py: 0.75,
                      borderRadius: '9999px',
                      background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#FFF',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Recommended
                  </Box>
                )}
                <Box sx={{ p: 3.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9', mb: 2 }}>
                    {plan.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1 }}>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: '2.75rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      ${plan.price}
                    </Typography>
                    <Typography component="span" sx={{ color: '#64748B', fontSize: '1rem' }}>
                      {plan.period}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
                    {plan.scans}
                  </Typography>
                  <Box sx={{ flex: 1, mb: 3 }}>
                    {plan.features.map((f, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          py: 1,
                          '&:not(:last-child)': { borderBottom: '1px solid rgba(255,255,255,0.04)' },
                        }}
                      >
                        <CheckCircleRoundedIcon sx={{ fontSize: 20, color: plan.recommended ? '#F97316' : '#64748B', flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                          {f}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    fullWidth
                    variant={plan.recommended ? 'contained' : 'outlined'}
                    onClick={() => router.push('/signup')}
                    sx={{
                      mt: 'auto',
                      py: 1.5,
                      borderRadius: '14px',
                      fontWeight: 700,
                      textTransform: 'none',
                      ...(plan.recommended
                        ? {
                            background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                            boxShadow: '0 8px 24px rgba(249, 115, 22, 0.4)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #FB923C 0%, #FB923C 100%)',
                              boxShadow: '0 12px 32px rgba(249, 115, 22, 0.5)',
                            },
                          }
                        : {
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            color: '#F1F5F9',
                            '&:hover': {
                              borderColor: 'rgba(249, 115, 22, 0.5)',
                              background: 'rgba(249, 115, 22, 0.08)',
                            },
                          }),
                    }}
                  >
                    Get started
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
