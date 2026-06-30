'use client';

import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import StaticPageLayout from '@/components/StaticPageLayout';
import LockIcon from '@mui/icons-material/Lock';
import StorageIcon from '@mui/icons-material/Storage';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SecurityIcon from '@mui/icons-material/Security';

const practices = [
  { icon: LockIcon, title: 'Authentication', text: 'Passwords are hashed with bcrypt. We support secure session management and JWT-based API authentication. API keys are hashed and never stored in plain text.' },
  { icon: StorageIcon, title: 'Data in transit and at rest', text: 'All traffic is encrypted with TLS. Data at rest is stored in secure, access-controlled environments. We use industry-standard cloud providers with strong security postures.' },
  { icon: VpnKeyIcon, title: 'Access control', text: 'Access to production systems and customer data is restricted to authorized personnel on a need-to-know basis. We use role-based access and audit logging where applicable.' },
  { icon: SecurityIcon, title: 'Application security', text: 'We follow secure development practices, validate inputs, and protect against common vulnerabilities. Scans and AI features are designed to avoid exposing sensitive data outside your account.' },
];

export default function SecurityPage() {
  return (
    <StaticPageLayout>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              mb: 2,
            }}
          >
            Security
          </Typography>
          <Typography sx={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7, mb: 5 }}>
            We take the security of your data seriously. This page summarizes how we protect your information and our security practices for the AI Growth Operating System.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {practices.map((p) => {
              const Icon = p.icon;
              return (
                <Box
                  key={p.title}
                  sx={{
                    p: 3,
                    borderRadius: '10px',
                    background: 'var(--overlay-03)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ width: 48, height: 48, borderRadius: '8px', background: 'rgba(34, 197, 94, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon sx={{ color: '#22C55E', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)', mb: 0.5 }}>
                      {p.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {p.text}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Typography sx={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, mt: 4 }}>
            If you discover a security vulnerability, please report it responsibly to security@sitescore.ai. We appreciate coordinated disclosure and will work with you to address issues.
          </Typography>

          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.9rem', mt: 4 }}>
            Last updated: {new Date().toLocaleDateString('en-US')}.
          </Typography>
        </motion.div>
      </Container>
    </StaticPageLayout>
  );
}
