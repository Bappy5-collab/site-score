'use client';

import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import StaticPageLayout from '@/components/StaticPageLayout';
import BoltIcon from '@mui/icons-material/Bolt';
import WebhookIcon from '@mui/icons-material/Webhook';
import LockIcon from '@mui/icons-material/Lock';
import TerminalIcon from '@mui/icons-material/Terminal';

const capabilities = [
  { icon: BoltIcon, title: 'Trigger scans', text: 'Kick off an audit for any URL programmatically and receive structured JSON results.' },
  { icon: WebhookIcon, title: 'Webhooks', text: 'Get a POST to your endpoint the moment a scan finishes or a score changes.' },
  { icon: LockIcon, title: 'Secure keys', text: 'Scoped API keys you can rotate anytime, with per-key usage tracking.' },
  { icon: TerminalIcon, title: 'Simple REST', text: 'Predictable, RESTful endpoints with clear errors and generous rate limits.' },
];

const codeSample = `curl -X POST https://api.sitescore.ai/v1/scans \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "url": "https://example.com" }'

# → 201 Created
{
  "id": "scan_8f2a",
  "url": "https://example.com",
  "status": "queued",
  "scores": { "seo": null, "performance": null }
}`;

export default function ApiPage() {
  const router = useRouter();

  return (
    <StaticPageLayout>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', mb: 2 }}
            >
              Build on the SiteScore API
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 620, mx: 'auto' }}>
              Automate audits, stream results into your own tools, and react to changes in real time with webhooks.
            </Typography>
          </Box>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {capabilities.map((c) => {
                  const Icon = c.icon;
                  return (
                    <Grid item xs={12} sm={6} key={c.title}>
                      <Box
                        sx={{
                          p: 2.5,
                          height: '100%',
                          borderRadius: '10px',
                          background: 'rgba(15, 23, 42, 0.03)',
                          border: '1px solid rgba(15, 23, 42, 0.08)',
                        }}
                      >
                        <Box sx={{ width: 44, height: 44, borderRadius: '8px', background: 'rgba(252, 82, 63, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                          <Icon sx={{ color: '#FC523F', fontSize: 22 }} />
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F172A', mb: 0.5 }}>
                          {c.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                          {c.text}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  background: 'linear-gradient(155deg, #FFFFFF 0%, #F8FAFC 100%)',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                }}
              >
                <Box sx={{ p: 1.5, borderBottom: '1px solid rgba(15,23,42,0.05)', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: 'rgba(239, 68, 68, 0.8)' }} />
                  <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: 'rgba(245, 158, 11, 0.8)' }} />
                  <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: 'rgba(34, 197, 94, 0.8)' }} />
                  <Typography variant="caption" sx={{ color: '#64748B', ml: 1 }}>
                    Terminal
                  </Typography>
                </Box>
                <Box
                  component="pre"
                  sx={{
                    m: 0,
                    p: 2.5,
                    overflowX: 'auto',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: '0.8rem',
                    lineHeight: 1.7,
                    color: '#334155',
                    whiteSpace: 'pre',
                  }}
                >
                  {codeSample}
                </Box>
              </Box>
            </Grid>
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
              Get your API key
            </Button>
          </Box>
        </motion.div>
      </Container>
    </StaticPageLayout>
  );
}
