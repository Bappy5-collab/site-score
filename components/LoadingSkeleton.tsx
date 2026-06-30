'use client';

import { Box, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';

export const CardSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          background: '#FFFFFF',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          borderRadius: '10px',
          p: 3,
        }}
      >
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton variant="rectangular" width="100%" height={8} sx={{ mt: 2, borderRadius: 1 }} />
      </Box>
    </motion.div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        background: '#FFFFFF',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        borderRadius: '10px',
        p: 2,
      }}
    >
      {[...Array(5)].map((_, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Skeleton variant="rectangular" width="30%" height={40} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width="20%" height={40} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width="20%" height={40} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width="30%" height={40} sx={{ borderRadius: 1 }} />
        </Box>
      ))}
    </Box>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        background: '#FFFFFF',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        borderRadius: '10px',
        p: 3,
        height: 400,
      }}
    >
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 1 }} />
    </Box>
  );
};
