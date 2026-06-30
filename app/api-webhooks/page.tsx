'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import ApiIcon from '@mui/icons-material/Api';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyIcon from '@mui/icons-material/Key';
import WebhookIcon from '@mui/icons-material/Webhook';
import HistoryIcon from '@mui/icons-material/History';
import CheckIcon from '@mui/icons-material/Check';
import { getApiKeyInfo, generateApiKey, getWebhook, saveWebhook, getLogs, type WebhookLogEntry } from '@/services/apiWebhooksService';
import { formatDistanceToNow } from 'date-fns';

const cardSx = {
  p: 3,
  borderRadius: '8px',
  background: 'var(--bg-surface)',
  backdropFilter: 'blur(20px)',
  border: '1px solid var(--border)',
  transition: 'all 0.3s ease',
  '&:hover': { borderColor: 'rgba(252, 82, 63, 0.25)' },
};

export default function APIWebhooksPage() {
  const [keyPrefix, setKeyPrefix] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  const [logs, setLogs] = useState<WebhookLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingWebhook, setSavingWebhook] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState<'key' | 'webhook' | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
  const [newKeyOnce, setNewKeyOnce] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [keyInfo, webhookData, logsData] = await Promise.all([
        getApiKeyInfo(),
        getWebhook(),
        getLogs(),
      ]);
      setHasKey(keyInfo.hasKey);
      setKeyPrefix(keyInfo.keyPrefix ?? null);
      setWebhookUrl(typeof webhookData.url === 'string' ? webhookData.url : '');
      setWebhookEnabled(webhookData.enabled !== false);
      setLogs(Array.isArray(logsData) ? logsData : []);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (err as { message?: string })?.message || 'Failed to load';
      setToast({ message: msg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const copyToClipboard = (value: string, type: 'key' | 'webhook') => {
    navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    setToast({ message: 'Copied to clipboard', severity: 'success' });
  };

  const handleRegenerateKey = async () => {
    setRegenerating(true);
    try {
      const res = await generateApiKey();
      setNewKeyOnce(res.apiKey);
      setHasKey(true);
      setKeyPrefix(res.apiKey.substring(0, 12) + '...');
      copyToClipboard(res.apiKey, 'key');
      setToast({ message: res.message || 'New key generated. Copy it now; it won’t be shown again.', severity: 'success' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to generate key';
      setToast({ message: msg, severity: 'error' });
    } finally {
      setRegenerating(false);
    }
  };

  const handleSaveWebhook = async () => {
    setSavingWebhook(true);
    try {
      await saveWebhook(webhookUrl, webhookEnabled);
      setToast({ message: 'Webhook URL saved', severity: 'success' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save';
      setToast({ message: msg, severity: 'error' });
    } finally {
      setSavingWebhook(false);
    }
  };

  const displayKey = newKeyOnce ?? (keyPrefix || 'No key yet');

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 0, sm: 1 } }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
                <ApiIcon sx={{ color: '#FC523F', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  API & Webhooks
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-muted)', mt: 0.25 }}>
                  API keys, webhook URL, and activity logs
                </Typography>
              </Box>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#FC523F' }} />
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={{ width: '100%', height: '100%' }}>
                    <Paper elevation={0} sx={{ ...cardSx, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <KeyIcon sx={{ color: '#FC523F' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          API Key
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 1 }}>
                        Use this key in the X-API-Key header for API requests.
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1.5,
                          borderRadius: '8px',
                          background: 'var(--bg-base)',
                          border: '1px solid var(--border-subtle)',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          overflow: 'auto',
                        }}
                      >
                        <Box component="span" sx={{ flex: 1, wordBreak: 'break-all' }}>{displayKey}</Box>
                        {(newKeyOnce || hasKey) && (
                          <Tooltip title={copied === 'key' ? 'Copied!' : 'Copy'}>
                            <IconButton size="small" onClick={() => copyToClipboard(newKeyOnce || displayKey, 'key')} sx={{ color: copied === 'key' ? '#22C55E' : 'var(--text-muted)' }}>
                              {copied === 'key' ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                      <Button size="small" sx={{ mt: 2, color: '#FC523F', textTransform: 'none' }} onClick={handleRegenerateKey} disabled={regenerating}>
                        {regenerating ? 'Generating…' : 'Regenerate key'}
                      </Button>
                    </Paper>
                  </motion.div>
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ width: '100%', height: '100%' }}>
                    <Paper elevation={0} sx={{ ...cardSx, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <WebhookIcon sx={{ color: '#FC523F' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          Webhook URL
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 1 }}>
                        We send scan completion events to this URL.
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://api.yoursite.com/webhooks/sitescore"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            bgcolor: 'var(--bg-base)',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            color: 'var(--text-primary)',
                            '& fieldset': { borderColor: 'var(--border-subtle)' },
                          },
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Button variant="outlined" size="small" onClick={handleSaveWebhook} disabled={savingWebhook} sx={{ borderRadius: '8px', borderColor: 'rgba(252, 82, 63, 0.5)', color: '#FC523F' }}>
                          {savingWebhook ? 'Saving…' : 'Save URL'}
                        </Button>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
                <Grid item xs={12}>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <Paper elevation={0} sx={{ ...cardSx, overflow: 'hidden' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <HistoryIcon sx={{ color: '#FC523F' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          Activity logs
                        </Typography>
                      </Box>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, borderColor: 'var(--border-subtle)' }}>Method</TableCell>
                              <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, borderColor: 'var(--border-subtle)' }}>Endpoint</TableCell>
                              <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, borderColor: 'var(--border-subtle)' }}>Status</TableCell>
                              <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, borderColor: 'var(--border-subtle)' }}>Time</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {logs.length === 0 && (
                              <TableRow><TableCell colSpan={4} sx={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>No webhook activity yet</TableCell></TableRow>
                            )}
                            {logs.map((row) => (
                              <TableRow key={row._id} sx={{ '& td': { borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' } }}>
                                <TableCell><Box component="span" sx={{ fontFamily: 'monospace', color: row.method === 'POST' ? '#FC523F' : '#22C55E' }}>{row.method}</Box></TableCell>
                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{row.endpoint || '—'}</TableCell>
                                <TableCell><Box component="span" sx={{ color: row.status && row.status >= 200 && row.status < 300 ? '#22C55E' : '#F59E0B' }}>{row.status ?? row.error ?? '—'}</Box></TableCell>
                                <TableCell sx={{ color: 'var(--text-muted)' }}>{row.createdAt ? formatDistanceToNow(new Date(row.createdAt), { addSuffix: true }) : '—'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>
            )}
          </motion.div>
        </Box>

        <Snackbar open={!!toast} autoHideDuration={5000} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.message}</Alert> : undefined}
        </Snackbar>
      </Layout>
    </ProtectedRoute>
  );
}
