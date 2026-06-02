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
  const colorMap: Record<string, { main: string; light: string; rgb: string }> = {
    primary: { main: '#F97316', light: '#FB923C', rgb: '249, 115, 22' },
    secondary: { main: '#F97316', light: '#FB923C', rgb: '249, 115, 22' },
    success: { main: '#22C55E', light: '#4ADE80', rgb: '34, 197, 94' },
    warning: { main: '#F59E0B', light: '#FBBF24', rgb: '245, 158, 11' },
    error: { main: '#EF4444', light: '#F87171', rgb: '239, 68, 68' },
    info: { main: '#06B6D4', light: '#22D3EE', rgb: '6, 182, 212' },
  };

  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: '100%', height: '100%' }}
    >
      <Card
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(155deg, #141B2D 0%, #0E1422 100%)',
          boxShadow: 'none',
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
          // soft accent glow in the top-right corner
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -60,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${c.rgb}, 0.22) 0%, rgba(${c.rgb}, 0) 70%)`,
            pointerEvents: 'none',
          },
          // hairline top sheen
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 24,
            right: 24,
            height: '1px',
            background: `linear-gradient(90deg, transparent, rgba(${c.rgb}, 0.5), transparent)`,
          },
          '&:hover': {
            borderColor: `rgba(${c.rgb}, 0.4)`,
            boxShadow: `0 10px 30px -12px rgba(${c.rgb}, 0.45)`,
          },
        }}
      >
        <CardContent
          sx={{ position: 'relative', zIndex: 1, p: 2.75, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 2.75 } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.25 }}>
            <Typography sx={{ color: '#94A3B8', fontWeight: 500, fontSize: '0.8125rem', letterSpacing: '0.01em' }}>
              {title}
            </Typography>
            {icon && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 38,
                  height: 38,
                  borderRadius: '11px',
                  color: c.light,
                  background: `rgba(${c.rgb}, 0.12)`,
                  border: `1px solid rgba(${c.rgb}, 0.22)`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`,
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
                fontSize: '2.25rem',
                lineHeight: 1.05,
                color: '#F8FAFC',
                letterSpacing: '-0.03em',
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography sx={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 500 }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          {progress !== undefined && (
            <Box sx={{ mt: 'auto', pt: 2.75 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography sx={{ color: '#64748B', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Score
                </Typography>
                <Typography sx={{ color: c.light, fontSize: '0.7rem', fontWeight: 700 }}>
                  {Math.round(progress)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 999,
                  background: 'rgba(255, 255, 255, 0.06)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${c.main}, ${c.light})`,
                    boxShadow: `0 0 12px rgba(${c.rgb}, 0.5)`,
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
