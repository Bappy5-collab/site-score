'use client';

import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';
import StaticPageLayout from '@/components/StaticPageLayout';
import EmailIcon from '@mui/icons-material/Email';
import SupportIcon from '@mui/icons-material/Support';

export default function ContactPage() {
  return (
    <StaticPageLayout>
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            Contact us
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '1rem', mb: 4 }}>
            Have a question, feedback, or want to talk sales? Send us a message.
          </Typography>

          <Box
            sx={{
              p: 3,
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.03)',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              mb: 4,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <EmailIcon sx={{ color: '#FC523F' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F172A' }}>
                Email
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
              support@sitescore.ai — we typically respond within 24 hours.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <SupportIcon sx={{ color: '#FC523F' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F172A' }}>
                In-app help
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Log in and use the Help option in the dashboard or check our documentation.
            </Typography>
          </Box>

          <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#0F172A', mb: 2 }}>
            Send a message
          </Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  bgcolor: 'rgba(15,23,42,0.03)',
                  color: '#0F172A',
                  '& fieldset': { borderColor: 'rgba(15,23,42,0.08)' },
                },
                '& .MuiInputLabel-root': { color: '#64748B' },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  bgcolor: 'rgba(15,23,42,0.03)',
                  color: '#0F172A',
                  '& fieldset': { borderColor: 'rgba(15,23,42,0.08)' },
                },
                '& .MuiInputLabel-root': { color: '#64748B' },
              }}
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  bgcolor: 'rgba(15,23,42,0.03)',
                  color: '#0F172A',
                  '& fieldset': { borderColor: 'rgba(15,23,42,0.08)' },
                },
                '& .MuiInputLabel-root': { color: '#64748B' },
              }}
            />
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: '8px',
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #FC523F 0%, #E13E2C 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #FD7565 0%, #FC523F 100%)' },
              }}
            >
              Send message
            </Button>
          </Box>
        </motion.div>
      </Container>
    </StaticPageLayout>
  );
}
