'use client';

import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import StaticPageLayout from '@/components/StaticPageLayout';

const sections = [
  { title: 'Information we collect', body: 'We collect information you provide when you sign up (name, email, password), URLs and scan results you run, and usage data such as feature usage and session information. We do not sell your personal information.' },
  { title: 'How we use it', body: 'We use your data to provide the AI Growth OS: running scans, generating insights and action plans, calculating your Growth Score, sending notifications and weekly summaries, and powering the AI Copilot. We may use aggregated, anonymized data to improve our product.' },
  { title: 'Data storage and security', body: 'Your data is stored on secure servers. We use industry-standard practices to protect data in transit and at rest. Passwords are hashed; we do not store plain-text passwords.' },
  { title: 'Sharing', body: 'We do not share your personal information with third parties for their marketing. We may use service providers (e.g. hosting, email) that process data on our behalf under strict agreements. We may disclose information if required by law or to protect our rights and safety.' },
  { title: 'Your rights', body: 'You can access, correct, or delete your account and data from the dashboard or by contacting us. You may export your data. If you are in the EEA or UK, you have additional rights under applicable privacy laws.' },
  { title: 'Cookies and similar tech', body: 'We use cookies and similar technologies for authentication, preferences, and analytics. You can control cookies through your browser settings.' },
  { title: 'Updates', body: 'We may update this policy from time to time. We will notify you of material changes via email or a notice in the product. The “Last updated” date at the bottom reflects the latest version.' },
];

export default function PrivacyPage() {
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
            Privacy Policy
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.7, mb: 4 }}>
            SiteScore AI (“we”, “us”) is committed to protecting your privacy. This policy describes how we collect, use, and safeguard your information when you use our AI Growth Operating System and related services.
          </Typography>

          {sections.map((sec, i) => (
            <Box key={sec.title} sx={{ mb: 3 }}>
              <Typography variant="h2" sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', mb: 1 }}>
                {sec.title}
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.7 }}>
                {sec.body}
              </Typography>
            </Box>
          ))}

          <Typography sx={{ color: '#64748B', fontSize: '0.9rem', mt: 4 }}>
            Last updated: {new Date().toLocaleDateString('en-US')}. Questions? Contact us at privacy@sitescore.ai.
          </Typography>
        </motion.div>
      </Container>
    </StaticPageLayout>
  );
}
