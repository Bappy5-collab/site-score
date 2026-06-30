'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
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
        <SectionHeading
          eyebrow="Developers"
          title="API & Webhooks"
          subtitle="Integrate scans and growth events into your stack. Secure keys, webhook delivery, and activity logs."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: 720, margin: '0 auto' }}
        >
          <Box
            sx={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CodeIcon sx={{ fontSize: 20, color: '#FC523F' }} />
              <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
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
                color: 'var(--text-secondary)',
                '& .token': { color: 'var(--text-muted)' },
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
                borderRadius: '10px',
                borderColor: 'rgba(252, 82, 63, 0.5)',
                color: '#FC523F',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'rgba(252, 82, 63, 0.8)',
                  background: 'rgba(252, 82, 63, 0.1)',
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
