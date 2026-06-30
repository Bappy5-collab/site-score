'use client';

import { Box, Typography, Button, Toolbar, AppBar, Container, Grid, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Careers', href: '/careers' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Security', href: '/security' },
];

const footerLinks = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'API', href: '/api' },
    { label: 'Changelog', href: '/changelog' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Security', href: '/security' },
  ],
};

interface StaticPageLayoutProps {
  children: React.ReactNode;
}

export default function StaticPageLayout({ children }: StaticPageLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'var(--bg-base)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', justifyContent: 'space-between', px: { xs: 2, sm: 3 }, py: 0.5, minHeight: 64 }}>
          <Link href="/landing" passHref style={{ textDecoration: 'none' }}>
            <Logo size={32} fontSize="1.2rem" sx={{ cursor: 'pointer' }} />
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} passHref style={{ textDecoration: 'none' }}>
                <Button
                  size="small"
                  sx={{
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    '&:hover': { color: 'var(--text-primary)', background: 'var(--overlay-05)' },
                  }}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ThemeToggle size="small" />
              <Button size="small" component={Link} href="/login" sx={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'none' }}>
                Login
              </Button>
              <Button
                size="small"
                variant="contained"
                component={Link}
                href="/signup"
                sx={{
                  background: 'linear-gradient(135deg, #FC523F 0%, #E13E2C 100%)',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { background: 'linear-gradient(135deg, #FD7565 0%, #FC523F 100%)' },
                }}
              >
                Start Free
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, py: { xs: 4, md: 6 } }}>
        {children}
      </Box>

      <Box sx={{ borderTop: '1px solid var(--border)', py: 4, mt: 'auto', background: 'var(--bg-base)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Logo size={32} fontSize="1.2rem" sx={{ mb: 2 }} />
              <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 2 }}>
                AI Growth Operating System.
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton size="small" sx={{ color: 'var(--text-muted)', '&:hover': { color: '#FC523F' } }}>
                  <TwitterIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: 'var(--text-muted)', '&:hover': { color: '#FC523F' } }}>
                  <LinkedInIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: 'var(--text-muted)', '&:hover': { color: '#FC523F' } }}>
                  <GitHubIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={4} md={2}>
              <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 1.5 }}>
                Product
              </Typography>
              {footerLinks.Product.map((l) => (
                <Link key={l.href} href={l.href} style={{ display: 'block', marginBottom: 6, color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>
                  {l.label}
                </Link>
              ))}
            </Grid>
            <Grid item xs={4} md={2}>
              <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 1.5 }}>
                Company
              </Typography>
              {footerLinks.Company.map((l) => (
                <Link key={l.href} href={l.href} style={{ display: 'block', marginBottom: 6, color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>
                  {l.label}
                </Link>
              ))}
            </Grid>
            <Grid item xs={4} md={2}>
              <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 1.5 }}>
                Legal
              </Typography>
              {footerLinks.Legal.map((l) => (
                <Link key={l.href} href={l.href} style={{ display: 'block', marginBottom: 6, color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>
                  {l.label}
                </Link>
              ))}
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} SiteScore AI. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
