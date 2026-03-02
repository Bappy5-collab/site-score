'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import { getAutomations, createAutomation, updateAutomation, deleteAutomation, type Automation } from '@/services/automationService';
import { formatDistanceToNow } from 'date-fns';

const cardSx = {
  p: 3,
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': { borderColor: 'rgba(139, 92, 246, 0.25)' },
};

function formatNextRun(nextRunAt?: string): string {
  if (!nextRunAt) return '—';
  try {
    const d = new Date(nextRunAt);
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '—';
  }
}

function formatLastRun(lastRunAt?: string): string {
  if (!lastRunAt) return 'Never';
  try {
    return formatDistanceToNow(new Date(lastRunAt), { addSuffix: true });
  } catch {
    return '—';
  }
}

export default function AutomationCenterPage() {
  const [rules, setRules] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newSchedule, setNewSchedule] = useState<'daily' | 'weekly'>('daily');
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getAutomations();
      setRules(list);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (err as { message?: string })?.message || 'Failed to load automations';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const toggleStatus = async (rule: Automation) => {
    try {
      await updateAutomation(rule._id, { enabled: !rule.enabled });
      setRules((prev) => prev.map((r) => (r._id === rule._id ? { ...r, enabled: !r.enabled } : r)));
      setToast({ message: rule.enabled ? 'Automation paused' : 'Automation enabled', severity: 'success' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Update failed';
      setToast({ message: msg, severity: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAutomation(id);
      setRules((prev) => prev.filter((r) => r._id !== id));
      setToast({ message: 'Automation deleted', severity: 'success' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Delete failed';
      setToast({ message: msg, severity: 'error' });
    }
  };

  const handleCreate = async () => {
    if (!newName.trim() || !newUrl.trim()) {
      setToast({ message: 'Name and URL are required', severity: 'error' });
      return;
    }
    setCreating(true);
    try {
      const created = await createAutomation({ name: newName.trim(), url: newUrl.trim(), schedule: newSchedule });
      setRules((prev) => [created, ...prev]);
      setDialogOpen(false);
      setNewName('');
      setNewUrl('');
      setNewSchedule('daily');
      setToast({ message: 'Automation created', severity: 'success' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Create failed';
      setToast({ message: msg, severity: 'error' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 0, sm: 1 } }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ScheduleIcon sx={{ color: '#8B5CF6', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em' }}>
                    Automation Center
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.25 }}>
                    Schedule and manage automated scans
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setDialogOpen(true)}
                sx={{
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { background: 'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)' },
                }}
              >
                New automation
              </Button>
            </Box>

            {error && (
              <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#8B5CF6' }} />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {rules.length === 0 && !loading && (
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={cardSx}>
                      <Typography sx={{ color: '#94A3B8' }}>No automations yet. Create one to run scans on a schedule.</Typography>
                    </Paper>
                  </Grid>
                )}
                {rules.map((rule, i) => (
                  <Grid item xs={12} key={rule._id}>
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Paper elevation={0} sx={cardSx}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#F1F5F9', mb: 0.5 }}>
                              {rule.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>{rule.url}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                              <Chip
                                size="small"
                                label={rule.enabled ? 'Running' : 'Paused'}
                                icon={rule.enabled ? <PlayArrowIcon sx={{ fontSize: 16 }} /> : <PauseIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                  background: rule.enabled ? 'rgba(34, 197, 94, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                                  color: rule.enabled ? '#4ADE80' : '#94A3B8',
                                  border: '1px solid',
                                  borderColor: rule.enabled ? 'rgba(34, 197, 94, 0.3)' : 'rgba(148, 163, 184, 0.3)',
                                  '& .MuiChip-icon': { color: 'inherit' },
                                }}
                              />
                              <Typography variant="caption" sx={{ color: '#64748B' }}>{rule.schedule}</Typography>
                              <Typography variant="caption" sx={{ color: '#64748B' }}>Last: {formatLastRun(rule.lastRunAt)}</Typography>
                              <Typography variant="caption" sx={{ color: '#64748B' }}>Next: {formatNextRun(rule.nextRunAt)}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ color: '#94A3B8' }}>Enabled</Typography>
                            <Switch
                              checked={rule.enabled}
                              onChange={() => toggleStatus(rule)}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#8B5CF6' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'rgba(139, 92, 246, 0.5)' },
                              }}
                            />
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => handleDelete(rule._id)} sx={{ color: '#64748B', '&:hover': { color: '#F87171' } }}>
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </motion.div>
        </Box>

        <Dialog open={dialogOpen} onClose={() => !creating && setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { background: 'rgba(15, 23, 42, 0.98)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' } }}>
            <DialogTitle sx={{ color: '#F1F5F9', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              New automation
              <IconButton onClick={() => !creating && setDialogOpen(false)} sx={{ color: '#94A3B8' }}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent>
              <TextField fullWidth label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Homepage check" sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <TextField fullWidth label="URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://example.com" sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>Schedule</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant={newSchedule === 'daily' ? 'contained' : 'outlined'} size="small" onClick={() => setNewSchedule('daily')} sx={{ borderRadius: '10px', textTransform: 'none' }}>Daily</Button>
                  <Button variant={newSchedule === 'weekly' ? 'contained' : 'outlined'} size="small" onClick={() => setNewSchedule('weekly')} sx={{ borderRadius: '10px', textTransform: 'none' }}>Weekly</Button>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => !creating && setDialogOpen(false)} sx={{ color: '#94A3B8', textTransform: 'none' }}>Cancel</Button>
              <Button variant="contained" onClick={handleCreate} disabled={creating} sx={{ borderRadius: '12px', textTransform: 'none', background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)' }}>
                {creating ? 'Creating…' : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>

        <Snackbar open={!!toast} autoHideDuration={5000} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.message}</Alert> : undefined}
        </Snackbar>
      </Layout>
    </ProtectedRoute>
  );
}
