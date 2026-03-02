'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { growthChatService, type GrowthChatMessage } from '@/services/growthService';

const cardSx = {
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  overflow: 'hidden',
};

export default function GrowthCopilotPage() {
  const [messages, setMessages] = useState<GrowthChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChat = async () => {
    setError(null);
    try {
      const chat = await growthChatService.getChat();
      setMessages(chat.messages || []);
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setSending(true);
    setError(null);
    const userMsg: GrowthChatMessage = { role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    try {
      const chat = await growthChatService.sendMessage(text);
      setMessages(chat.messages || []);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to send');
      setMessages((prev) => prev.filter((m) => m !== userMsg));
    } finally {
      setSending(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ maxWidth: 800, mx: 'auto', height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column', px: { xs: 0, sm: 1 } }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
                <SmartToyIcon sx={{ color: '#8B5CF6', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9' }}>
                  AI Growth Copilot
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Context-aware advice from your scans and growth plan
                </Typography>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Paper elevation={0} sx={{ ...cardSx, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                  <CircularProgress sx={{ color: '#8B5CF6' }} />
                </Box>
              ) : (
                <>
                  <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    {messages.length === 0 && (
                      <Typography sx={{ color: '#64748B', textAlign: 'center', py: 4 }}>
                        Ask anything about your growth plan, scores, or next steps. I have context from your scans and actions.
                      </Typography>
                    )}
                    {messages.map((m, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          mb: 2,
                          flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: m.role === 'user' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(236, 72, 153, 0.3)',
                          }}
                        >
                          {m.role === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                        </Avatar>
                        <Paper
                          elevation={0}
                          sx={{
                            maxWidth: '85%',
                            p: 2,
                            borderRadius: '16px',
                            bgcolor: m.role === 'user' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <Typography variant="body1" sx={{ color: '#F1F5F9', whiteSpace: 'pre-wrap' }}>
                            {m.content}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}
                    {sending && (
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(236, 72, 153, 0.3)' }}>
                          <SmartToyIcon fontSize="small" />
                        </Avatar>
                        <CircularProgress size={24} sx={{ color: '#8B5CF6' }} />
                      </Box>
                    )}
                    <div ref={messagesEndRef} />
                  </Box>
                  <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Ask about your growth plan, scores, or next steps..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        disabled={sending}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '14px',
                            bgcolor: 'rgba(15, 23, 42, 0.6)',
                            color: '#F1F5F9',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                          },
                        }}
                      />
                      <IconButton
                        onClick={handleSend}
                        disabled={sending || !input.trim()}
                        sx={{
                          bgcolor: 'rgba(139, 92, 246, 0.3)',
                          color: '#8B5CF6',
                          '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.5)' },
                          '&:disabled': { color: '#64748B' },
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </>
              )}
            </Paper>
          </motion.div>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
}
