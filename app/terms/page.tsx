'use client';

import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import StaticPageLayout from '@/components/StaticPageLayout';

const sections = [
  { title: 'Acceptance', body: 'By signing up or using SiteScore AI (“Service”), you agree to these Terms of Service. If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization.' },
  { title: 'Use of the Service', body: 'You may use the Service for lawful purposes only. You may not: (a) misuse or abuse the Service or attempt to gain unauthorized access; (b) use the Service to scan or target systems you do not own or have permission to test; (c) resell or redistribute the Service without our consent; (d) reverse engineer or attempt to extract source code or underlying data beyond normal use.' },
  { title: 'Account and security', body: 'You are responsible for keeping your account credentials secure and for all activity under your account. Notify us immediately of any unauthorized use.' },
  { title: 'Subscription and payment', body: 'Paid plans are billed according to the plan you select. Fees are non-refundable except where required by law or as stated in our refund policy. We may change pricing with reasonable notice; continued use after a change constitutes acceptance.' },
  { title: 'Intellectual property', body: 'We own the Service, including the software, design, and content we provide. You retain ownership of your data and URLs. You grant us a license to use your data to provide and improve the Service.' },
  { title: 'Disclaimer', body: 'The Service is provided “as is.” We do not warrant that it will be uninterrupted, error-free, or that insights or scores are accurate or complete. Use the Service at your own risk.' },
  { title: 'Limitation of liability', body: 'To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, or consequential damages, or for loss of data or profits, arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the twelve months before the claim.' },
  { title: 'Termination', body: 'We may suspend or terminate your access if you breach these Terms or for other operational reasons. You may cancel your account at any time. Upon termination, your right to use the Service ends.' },
  { title: 'Changes', body: 'We may update these Terms. We will notify you of material changes (e.g. by email or in-product notice). Continued use after the effective date constitutes acceptance.' },
];

export default function TermsPage() {
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
            Terms of Service
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.7, mb: 4 }}>
            These Terms of Service govern your use of the SiteScore AI website and the AI Growth Operating System. Please read them carefully.
          </Typography>

          {sections.map((sec) => (
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
            Last updated: {new Date().toLocaleDateString('en-US')}. Questions? Contact us at legal@sitescore.ai.
          </Typography>
        </motion.div>
      </Container>
    </StaticPageLayout>
  );
}
