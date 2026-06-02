'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { leaderboardService, LeaderboardEntry } from '@/services/leaderboardService';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await leaderboardService.getLeaderboard(50);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#F59E0B'; // Gold
    if (rank === 2) return '#94A3B8'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return '#F97316';
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: { xs: 0, sm: 1 }, overflow: 'hidden' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: 32 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LeaderboardIcon sx={{ color: '#F97316', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#F1F5F9',
                    lineHeight: 1.2,
                  }}
                >
                  Leaderboard
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.25 }}>
                  Top performers by scan count and average scores
                </Typography>
              </Box>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <Paper
              elevation={0}
              sx={{
                overflow: 'hidden',
                background: '#111827',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                '&:hover': { borderColor: 'rgba(255, 255, 255, 0.12)' },
              }}
            >
              {loading ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    Loading leaderboard...
                  </Typography>
                </Box>
              ) : leaderboard.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    No leaderboard data available yet.
                  </Typography>
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: isDesktop ? 'calc(100vh - 280px)' : undefined }}>
                  <Table stickyHeader size="medium" sx={{ minWidth: 720 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            color: '#94A3B8',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            py: 2,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            width: 100,
                          }}
                        >
                          Rank
                        </TableCell>
                        <TableCell
                          sx={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            color: '#94A3B8',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            py: 2,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                          }}
                        >
                          User
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            color: '#94A3B8',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            py: 2,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            width: 110,
                          }}
                        >
                          Scans
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            color: '#94A3B8',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            py: 2,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            width: 100,
                          }}
                        >
                          Avg
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            color: '#94A3B8',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            py: 2,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            width: 100,
                          }}
                        >
                          Perf
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            color: '#94A3B8',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            py: 2,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            width: 80,
                          }}
                        >
                          SEO
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            color: '#94A3B8',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            py: 2,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            width: 90,
                          }}
                        >
                          Sec
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaderboard.map((entry, index) => (
                        <TableRow
                          key={entry.user._id}
                          component={motion.tr}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.3) }}
                          sx={{
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.04)',
                            },
                            '& td': {
                              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                              py: 2,
                              color: '#E2E8F0',
                            },
                          }}
                        >
                          <TableCell sx={{ width: 100 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {index < 3 && (
                                <EmojiEventsIcon
                                  sx={{ color: getRankColor(index + 1), fontSize: 22 }}
                                />
                              )}
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  color: index < 3 ? getRankColor(index + 1) : '#F1F5F9',
                                  fontSize: '0.95rem',
                                }}
                              >
                                #{index + 1}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                sx={{
                                  background: '#EA580C',
                                  width: 40,
                                  height: 40,
                                  fontSize: '0.95rem',
                                  fontWeight: 600,
                                }}
                              >
                                {entry.user.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
                                  {entry.user.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: '#64748B', fontSize: '0.75rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}
                                >
                                  {entry.user.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={entry.totalScans}
                              size="small"
                              sx={{
                                background: 'rgba(249, 115, 22, 0.2)',
                                color: '#FB923C',
                                border: '1px solid rgba(249, 115, 22, 0.3)',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                background: '#EA580C',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontSize: '1rem',
                              }}
                            >
                              {entry.averageScore.toFixed(1)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                              {entry.averagePerformance.toFixed(1)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                              {entry.averageSEO.toFixed(1)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                              {entry.averageSecurity.toFixed(1)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </motion.div>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default LeaderboardPage;
