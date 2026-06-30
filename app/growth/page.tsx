'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Checkbox,
  LinearProgress,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import SpeedIcon from '@mui/icons-material/Speed';
import SearchIcon from '@mui/icons-material/Search';
import ShieldIcon from '@mui/icons-material/Shield';
import ArticleIcon from '@mui/icons-material/Article';
import { growthService, type GrowthScore, type GrowthInsight, type Action } from '@/services/growthService';
import { useAuth } from '@/context/AuthContext';
import { io, Socket } from 'socket.io-client';

const cardSx = {
  p: 3,
  borderRadius: '8px',
  background: 'var(--bg-surface)',
  backdropFilter: 'blur(20px)',
  border: '1px solid var(--border)',
  transition: 'all 0.3s ease',
  '&:hover': { borderColor: 'rgba(252, 82, 63, 0.25)' },
};

const scoreLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  overall: { label: 'Overall', icon: <TrendingUpIcon />, color: '#FC523F' },
  seo: { label: 'SEO', icon: <SearchIcon />, color: '#22C55E' },
  performance: { label: 'Performance', icon: <SpeedIcon />, color: '#FD7565' },
  authority: { label: 'Authority', icon: <ShieldIcon />, color: '#F59E0B' },
  content: { label: 'Content', icon: <ArticleIcon />, color: '#FC523F' },
};

export default function GrowthOSPage() {
  const [score, setScore] = useState<GrowthScore | null>(null);
  const [insights, setInsights] = useState<GrowthInsight[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionUpdating, setActionUpdating] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();

  const fetchPlan = useCallback(async () => {
    setError(null);
    try {
      const plan = await growthService.getGrowthPlan();
      setScore(plan.score);
      setInsights(plan.insights || []);
      setActions(plan.actions || []);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (err as { message?: string })?.message || 'Failed to load growth plan';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userId = (user as { _id?: string })?._id;
    if (!userId || !token) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const socketUrl = apiUrl.replace(/\/api\/?$/, '');
    const socket = io(socketUrl, { auth: { token }, transports: ['websocket', 'polling'] });
    socketRef.current = socket;
    socket.emit('join-user', userId);
    socket.on('growth-score-updated', (payload: { score: GrowthScore }) => {
      if (payload.score) setScore(payload.score);
    });
    socket.on('action-completed', (payload: { action: Action; score: GrowthScore; actions?: Action[] }) => {
      if (payload.score) setScore(payload.score);
      if (payload.actions) setActions(payload.actions);
      if (payload.action) {
        setActions((prev) => prev.map((a) => (a._id === payload.action._id ? payload.action : a)));
      }
    });
    socket.on('growth-insight-generated', (payload: { insights?: GrowthInsight[]; actions?: Action[]; score?: GrowthScore }) => {
      if (payload.insights) setInsights(payload.insights);
      if (payload.actions) setActions(payload.actions);
      if (payload.score) setScore(payload.score);
    });
    return () => {
      socket.emit('leave-user', userId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPlan();
  };

  const handleToggleAction = async (action: Action) => {
    setActionUpdating(action._id);
    try {
      const res = await growthService.updateAction(action._id, { completed: !action.completedAt });
      setScore(res.score);
      setActions(res.actions);
    } catch {
      setError('Failed to update action');
    } finally {
      setActionUpdating(null);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 0, sm: 1 } }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(252, 82, 63, 0.2) 0%, rgba(252, 82, 63, 0.2) 100%)',
                    border: '1px solid rgba(252, 82, 63, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PsychologyIcon sx={{ color: '#FC523F', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    Growth Brain
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-muted)', mt: 0.25 }}>
                    AI-powered action plan and growth score
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                startIcon={refreshing ? <CircularProgress size={18} color="inherit" /> : <RefreshIcon />}
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{ borderRadius: '10px', borderColor: 'rgba(252, 82, 63, 0.5)', color: '#FC523F', textTransform: 'none' }}
              >
                Refresh plan
              </Button>
            </Box>

            {error && (
              <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress sx={{ color: '#FC523F' }} />
              </Box>
            ) : (
              <>
                {score && (
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4}>
                      <Paper elevation={0} sx={cardSx}>
                        <Typography variant="subtitle2" sx={{ color: 'var(--text-muted)', mb: 2 }}>
                          Growth Score
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                          <Typography variant="h3" sx={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                            {score.overall}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>/100</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={score.overall}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: 'var(--overlay-05)',
                            '& .MuiLinearProgress-bar': { bgcolor: '#FC523F', borderRadius: 5 },
                          }}
                        />
                        <Grid container spacing={1} sx={{ mt: 2 }}>
                          {(['seo', 'performance', 'authority', 'content'] as const).map((k) => (
                            <Grid item xs={6} key={k}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Box sx={{ color: scoreLabels[k]?.color }}>{scoreLabels[k]?.icon}</Box>
                                <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                                  {scoreLabels[k]?.label}: {score[k]}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Paper elevation={0} sx={cardSx}>
                        <Typography variant="subtitle2" sx={{ color: 'var(--text-muted)', mb: 2 }}>
                          Insights
                        </Typography>
                        {insights.length === 0 ? (
                          <Typography sx={{ color: 'var(--text-muted)' }}>Run a scan and click Refresh plan to generate insights.</Typography>
                        ) : (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {insights.slice(0, 6).map((i) => (
                              <Card key={i._id} elevation={0} sx={{ bgcolor: 'var(--overlay-03)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>{i.title}</Typography>
                                    <Chip size="small" label={i.category} sx={{ textTransform: 'capitalize', fontSize: '0.7rem' }} />
                                    {i.status === 'addressed' && <Chip size="small" label="Done" color="success" />}
                                  </Box>
                                  {i.description && <Typography variant="body2" sx={{ color: 'var(--text-muted)', mt: 0.5 }}>{i.description}</Typography>}
                                </CardContent>
                              </Card>
                            ))}
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                )}

                <Paper elevation={0} sx={cardSx}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)', mb: 2 }}>
                    Action plan
                  </Typography>
                  {actions.length === 0 ? (
                    <Typography sx={{ color: 'var(--text-muted)' }}>No actions yet. Refresh plan to generate tasks from your scans.</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {actions.map((a) => (
                        <Box
                          key={a._id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            py: 1.5,
                            px: 2,
                            borderRadius: '8px',
                            bgcolor: a.completedAt ? 'rgba(34, 197, 94, 0.08)' : 'var(--overlay-03)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          <Checkbox
                            checked={!!a.completedAt}
                            onChange={() => handleToggleAction(a)}
                            disabled={actionUpdating === a._id}
                            sx={{ color: '#FC523F', '&.Mui-checked': { color: '#22C55E' } }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ color: 'var(--text-primary)', textDecoration: a.completedAt ? 'line-through' : 'none' }}>
                              {a.title}
                            </Typography>
                            {a.category && <Typography variant="caption" sx={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{a.category}</Typography>}
                          </Box>
                          {actionUpdating === a._id && <CircularProgress size={20} sx={{ color: '#FC523F' }} />}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Paper>
              </>
            )}
          </motion.div>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
}
