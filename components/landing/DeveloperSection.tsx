'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import CodeIcon from '@mui/icons-material/Code';
import { useRouter } from 'next/navigation';

const codeSnippet = `# Trigger a scan via API
curl -X POST https://api.sitescore.ai/api/scan \\
  -H "Authorization: Bearer YOUR_JWT" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://yoursite.com"}'

# Webhooks: we POST to your URL on scan complete
# Payload: { "event": "scan.completed", "scanId", "url", "scores" }`;

export default function DeveloperSection() {
  const router = useRouter();

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontWeight: 800,
              color: '#F1F5F9',
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            API & Webhooks
          </Typography>
          <Typography sx={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: 560, mx: 'auto' }}>
            Integrate scans and growth events into your stack. Secure keys, webhook delivery, and activity logs.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: 720, margin: '0 auto' }}
        >
          <Box
            sx={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.4)',
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CodeIcon sx={{ fontSize: 20, color: '#8B5CF6' }} />
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Example: scan + webhooks
              </Typography>
            </Box>
            <Box
              component="pre"
              sx={{
                p: 3,
                m: 0,
                overflow: 'auto',
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.85rem',
                lineHeight: 1.7,
                color: '#E2E8F0',
                '& .token': { color: '#94A3B8' },
              }}
            >
              {codeSnippet}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              variant="outlined"
              onClick={() => router.push('/signup')}
              sx={{
                borderRadius: '14px',
                borderColor: 'rgba(139, 92, 246, 0.5)',
                color: '#8B5CF6',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'rgba(139, 92, 246, 0.8)',
                  background: 'rgba(139, 92, 246, 0.1)',
                },
              }}
            >
              Get API access
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
