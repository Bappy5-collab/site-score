'use client';

import { Box, Container, Typography, Grid, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

const productLinks = ['Features', 'Pricing', 'API', 'Changelog'];
const companyLinks = ['About', 'Contact', 'Careers'];
const legalLinks = ['Privacy', 'Terms', 'Security'];

export default function LandingFooter() {
  const router = useRouter();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        py: 6,
        background: 'rgba(10, 14, 39, 0.6)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Logo size={34} fontSize="1.25rem" sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2, maxWidth: 280 }}>
              AI Growth Operating System. Turn scan data into a prioritized action plan and grow with real-time insights.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton component={motion.button} whileHover={{ scale: 1.1 }} sx={{ color: '#94A3B8', '&:hover': { color: '#F97316' } }}>
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton component={motion.button} whileHover={{ scale: 1.1 }} sx={{ color: '#94A3B8', '&:hover': { color: '#F97316' } }}>
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton component={motion.button} whileHover={{ scale: 1.1 }} sx={{ color: '#94A3B8', '&:hover': { color: '#F97316' } }}>
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={{ color: '#F1F5F9', fontWeight: 600, mb: 2 }}>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {productLinks.map((label) => (
                <Typography
                  key={label}
                  component="button"
                  onClick={() => (label === 'Features' ? scrollTo('features') : label === 'Pricing' ? scrollTo('pricing') : router.push('/landing'))}
                  sx={{
                    color: '#94A3B8',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    '&:hover': { color: '#F97316' },
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={{ color: '#F1F5F9', fontWeight: 600, mb: 2 }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {companyLinks.map((label) => (
                <Typography
                  key={label}
                  component="a"
                  href="#"
                  sx={{ color: '#94A3B8', fontSize: '0.875rem', textDecoration: 'none', '&:hover': { color: '#F97316' } }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={{ color: '#F1F5F9', fontWeight: 600, mb: 2 }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {legalLinks.map((label) => (
                <Typography
                  key={label}
                  component="a"
                  href="#"
                  sx={{ color: '#94A3B8', fontSize: '0.875rem', textDecoration: 'none', '&:hover': { color: '#F97316' } }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            © {new Date().getFullYear()} SiteScore AI. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
