'use client';

import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PremiumCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  progress?: number;
  gradient?: string;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  progress,
}) => {
  const colorMap: Record<string, { main: string; rgb: string }> = {
    primary: { main: '#FC523F', rgb: '252, 82, 63' },
    secondary: { main: '#FC523F', rgb: '252, 82, 63' },
    success: { main: '#16A34A', rgb: '22, 163, 74' },
    warning: { main: '#D97706', rgb: '217, 119, 6' },
    error: { main: '#DC2626', rgb: '220, 38, 38' },
    info: { main: '#0891B2', rgb: '8, 145, 178' },
  };

  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: '100%', height: '100%' }}
    >
      <Card
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '10px',
          border: '1px solid #E5E9F0',
          background: '#FFFFFF',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            borderColor: '#D8DEE9',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
          },
        }}
      >
        <CardContent
          sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 2.5 } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ color: '#64748B', fontWeight: 500, fontSize: '0.8125rem' }}>
              {title}
            </Typography>
            {icon && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  color: c.main,
                  background: `rgba(${c.rgb}, 0.1)`,
                  '& svg': { fontSize: 20 },
                }}
              >
                {icon}
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '2rem',
                lineHeight: 1.1,
                color: '#0F172A',
                letterSpacing: '-0.025em',
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography sx={{ color: '#94A3B8', fontSize: '0.875rem', fontWeight: 500 }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          {progress !== undefined && (
            <Box sx={{ mt: 'auto', pt: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Score
                </Typography>
                <Typography sx={{ color: c.main, fontSize: '0.75rem', fontWeight: 700 }}>
                  {Math.round(progress)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 999,
                  background: 'rgba(15, 23, 42, 0.06)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 999,
                    background: c.main,
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PremiumCard;
