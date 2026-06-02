'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  marginBottom?: number;
}

// Shared, consistent section header used across the landing page:
// a small uppercase eyebrow pill, a gradient headline, and a subtitle.
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  marginBottom = 48,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{ textAlign: 'center', marginBottom }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.85,
          px: 1.75,
          py: 0.6,
          mb: 2,
          borderRadius: '9999px',
          background: 'rgba(249, 115, 22, 0.1)',
          border: '1px solid rgba(249, 115, 22, 0.22)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F97316, #EA580C)',
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: '#C4B5FD',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontSize: '0.72rem',
          }}
        >
          {eyebrow}
        </Typography>
      </Box>

      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.85rem', md: '2.6rem' },
          fontWeight: 800,
          letterSpacing: '-0.025em',
          lineHeight: 1.15,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #C4B5FD 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          mb: subtitle ? 1.5 : 0,
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          sx={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
        >
          {subtitle}
        </Typography>
      )}
    </motion.div>
  );
}
