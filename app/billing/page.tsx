'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getSubscription, updateSubscription, type Subscription } from '@/services/subscriptionService';

const cardSx = {
  p: 3,
  height: '100%',
  borderRadius: '8px',
  background: 'var(--bg-surface)',
  backdropFilter: 'blur(20px)',
  border: '1px solid var(--border)',
  transition: 'all 0.3s ease',
  '&:hover': { borderColor: 'rgba(252, 82, 63, 0.25)' },
};

const PLANS = [
  { name: 'Free' as const, price: 0, scans: 5, features: ['5 scans/month', 'Basic SEO', 'PDF reports'] },
  { name: 'Pro' as const, price: 29, scans: 100, features: ['100 scans/month', 'AI insights', 'Team collaboration', 'API access'] },
  { name: 'Business' as const, price: 99, scans: 99999, features: ['Unlimited scans', 'Everything in Pro', 'Priority support', 'Custom reports'] },
];

function formatPeriod(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return '—';
  }
}

export default function BillingPage() {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const fetchSub = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSubscription();
      setSub(data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (err as { message?: string })?.message || 'Failed to load subscription';
      setToast({ message: msg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSub();
  }, [fetchSub]);

  const usagePercent = sub ? (sub.scansLimit > 0 ? Math.min(100, (sub.scansUsed / sub.scansLimit) * 100) : 0) : 0;

  const handleSelectPlan = async (plan: 'Free' | 'Pro' | 'Business') => {
    if (sub?.plan === plan) return;
    setUpgrading(plan);
    try {
      await updateSubscription(plan);
      await fetchSub();
      setPricingOpen(false);
      setToast({ message: `Plan updated to ${plan}`, severity: 'success' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Update failed';
      setToast({ message: msg, severity: 'error' });
    } finally {
      setUpgrading(null);
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
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(252, 82, 63, 0.2) 0%, rgba(252, 82, 63, 0.2) 100%)',
                    border: '1px solid rgba(252, 82, 63, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CreditCardIcon sx={{ color: '#FC523F', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    Billing & Subscription
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-muted)', mt: 0.25 }}>
                    Manage your plan and usage
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<UpgradeIcon />}
                onClick={() => setPricingOpen(true)}
                sx={{
                  borderRadius: '10px',
                  background: '#E13E2C',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { background: '#C9341F' },
                }}
              >
                Change plan
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#FC523F' }} />
              </Box>
            ) : sub ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={{ width: '100%' }}>
                    <Paper elevation={0} sx={cardSx}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)', mb: 2 }}>
                        Current plan
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <CheckCircleIcon sx={{ color: '#22C55E', fontSize: 28 }} />
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>{sub.plan}</Typography>
                          <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>Billing period: {formatPeriod(sub.periodStartsAt)}</Typography>
                        </Box>
                      </Box>
                      <Button variant="outlined" size="small" onClick={() => setPricingOpen(true)} sx={{ borderRadius: '8px', borderColor: 'rgba(252, 82, 63, 0.5)', color: '#FC523F' }}>
                        Change plan
                      </Button>
                    </Paper>
                  </motion.div>
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ width: '100%' }}>
                    <Paper elevation={0} sx={cardSx}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)', mb: 2 }}>
                        Usage this period
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>Scans</Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {sub.scansUsed} / {sub.scansLimit === 99999 ? 'Unlimited' : sub.scansLimit}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={usagePercent}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: 'var(--overlay-05)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: usagePercent > 90 ? '#F59E0B' : '#FC523F',
                            borderRadius: 5,
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)', mt: 1, display: 'block' }}>
                        {sub.scansLimit === 99999 ? 'Unlimited' : `${sub.remaining} scans remaining`}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>
            ) : null}
          </motion.div>
        </Box>

        <Dialog open={pricingOpen} onClose={() => setPricingOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { background: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border)' } }}>
          <DialogTitle sx={{ color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Choose a plan
            <IconButton onClick={() => setPricingOpen(false)} sx={{ color: 'var(--text-muted)' }}><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {PLANS.map((plan) => {
                const current = sub?.plan === plan.name;
                return (
                  <Grid item xs={12} key={plan.name}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '10px',
                        border: current ? '2px solid rgba(252, 82, 63, 0.5)' : '1px solid var(--border)',
                        background: current ? 'rgba(252, 82, 63, 0.08)' : 'var(--overlay-03)',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                        <Box>
                          <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>{plan.name}</Typography>
                          <Typography variant="h4" sx={{ color: '#FC523F', fontWeight: 800 }}>${plan.price}<Typography component="span" variant="body2" sx={{ color: 'var(--text-muted)', fontWeight: 400 }}>/mo</Typography></Typography>
                          <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{plan.scans >= 99999 ? 'Unlimited' : plan.scans + ' scans/mo'}</Typography>
                        </Box>
                        <Button
                          variant={current ? 'outlined' : 'contained'}
                          size="small"
                          disabled={current || upgrading === plan.name}
                          onClick={() => handleSelectPlan(plan.name)}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            ...(current ? { borderColor: 'rgba(252, 82, 63, 0.5)', color: '#FC523F' } : { background: '#E13E2C' }),
                          }}
                        >
                          {current ? 'Current' : upgrading === plan.name ? 'Updating…' : 'Select'}
                        </Button>
                      </Box>
                      <Box component="ul" sx={{ m: 0, mt: 1.5, pl: 2, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {plan.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setPricingOpen(false)} sx={{ color: 'var(--text-muted)', textTransform: 'none' }}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={!!toast} autoHideDuration={5000} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.message}</Alert> : undefined}
        </Snackbar>
      </Layout>
    </ProtectedRoute>
  );
}
