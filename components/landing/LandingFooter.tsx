'use client';

import { Box, Container, Typography, Grid, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

const productLinks = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'API', href: '/api' },
  { label: 'Changelog', href: '/changelog' },
];
const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Careers', href: '/careers' },
];
const legalLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Security', href: '/security' },
];

export default function LandingFooter() {
  const router = useRouter();

  return (
    <Box
      sx={{
        borderTop: '1px solid var(--border)',
        py: 6,
        background: 'var(--bg-base)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Logo size={34} fontSize="1.25rem" sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 2, maxWidth: 280 }}>
              AI Growth Operating System. Turn scan data into a prioritized action plan and grow with real-time insights.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton component={motion.button} whileHover={{ scale: 1.1 }} sx={{ color: 'var(--text-muted)', '&:hover': { color: '#FC523F' } }}>
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton component={motion.button} whileHover={{ scale: 1.1 }} sx={{ color: 'var(--text-muted)', '&:hover': { color: '#FC523F' } }}>
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton component={motion.button} whileHover={{ scale: 1.1 }} sx={{ color: 'var(--text-muted)', '&:hover': { color: '#FC523F' } }}>
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 2 }}>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {productLinks.map(({ label, href }) => (
                <Typography
                  key={label}
                  component="button"
                  onClick={() => router.push(href)}
                  sx={{
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    '&:hover': { color: '#FC523F' },
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 2 }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {companyLinks.map(({ label, href }) => (
                <Typography
                  key={label}
                  component="a"
                  href={href}
                  sx={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', '&:hover': { color: '#FC523F' } }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 2 }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {legalLinks.map(({ label, href }) => (
                <Typography
                  key={label}
                  component="a"
                  href={href}
                  sx={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', '&:hover': { color: '#FC523F' } }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} SiteScore AI. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
