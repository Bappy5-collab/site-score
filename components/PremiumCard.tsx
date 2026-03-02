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
  gradient,
}) => {
  const colorMap = {
    primary: '#8B5CF6',
    secondary: '#EC4899',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#F43F5E',
    info: '#3B82F6',
  };

  const cardGradient = gradient || `linear-gradient(135deg, ${colorMap[color]}15 0%, ${colorMap[color]}05 100%)`;
  const borderGradient = `linear-gradient(135deg, ${colorMap[color]}40 0%, ${colorMap[color]}20 100%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Card
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: cardGradient,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colorMap[color]}30`,
          borderRadius: '20px',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: borderGradient,
          },
          '&:hover': {
            borderColor: `${colorMap[color]}50`,
            boxShadow: `0 12px 40px ${colorMap[color]}20`,
          },
        }}
      >
        <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#9CA3AF',
                fontWeight: 500,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
              }}
            >
              {title}
            </Typography>
            {icon && (
              <Box
                sx={{
                  color: colorMap[color],
                  opacity: 0.8,
                }}
              >
                {icon}
              </Box>
            )}
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#E5E7EB',
              mb: 1,
              background: `linear-gradient(135deg, ${colorMap[color]} 0%, ${colorMap[color === 'primary' ? 'secondary' : 'primary']} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {value}
          </Typography>

          {subtitle && (
            <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 2 }}>
              {subtitle}
            </Typography>
          )}

          {progress !== undefined && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, ${colorMap[color]} 0%, ${colorMap[color === 'primary' ? 'secondary' : 'primary']} 100%)`,
                    borderRadius: 3,
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
