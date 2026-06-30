'use client';

import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';

interface ScoreCardProps {
  title: string;
  score: number;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, color = 'primary' }) => {
  const getColorValue = () => {
    switch (color) {
      case 'primary':
        return '#FC523F';
      case 'secondary':
        return '#FC523F';
      case 'success':
        return '#22C55E';
      case 'error':
        return '#F43F5E';
      case 'warning':
        return '#F59E0B';
      case 'info':
        return '#FD7565';
      default:
        return '#FC523F';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          minWidth: 200,
          height: '100%',
          background: `linear-gradient(135deg, ${getColorValue()}15 0%, ${getColorValue()}05 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${getColorValue()}30`,
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${getColorValue()} 0%, ${getColorValue()}80 100%)`,
          },
          '&:hover': {
            borderColor: `${getColorValue()}50`,
            boxShadow: `0 12px 40px ${getColorValue()}20`,
          },
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#0F172A' }}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography
              variant="h3"
              sx={{
                color: getColorValue(),
                fontWeight: 700,
                background: `linear-gradient(135deg, ${getColorValue()} 0%, ${getColorValue()}80 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {score}
            </Typography>
            <Typography variant="h6" sx={{ ml: 1, color: '#64748B', fontWeight: 500 }}>
              /100
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={score}
            sx={{
              height: 8,
              borderRadius: 4,
              background: 'rgba(15, 23, 42, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${getColorValue()} 0%, ${getColorValue()}80 100%)`,
                borderRadius: 4,
              },
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScoreCard;
